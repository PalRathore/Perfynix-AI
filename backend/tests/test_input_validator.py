"""
Unit tests for input_validator.py — Checkpoint 2.1
🟡 SUPERVISOR runs these tests after CODER writes input_validator.py
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import httpx

from backend.app.services.assessment.input_validator import ValidationResult, validate_url

# ---------------------------------------------------------------------------
# Tier 1 — Syntax validation tests
# ---------------------------------------------------------------------------


class TestTier1Syntax:
    def test_valid_https_url_passes_syntax(self):
        """A well-formed https:// URL must pass Tier 1."""
        with patch("httpx.Client") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_client.return_value.__enter__.return_value.head.return_value = mock_resp
            result = validate_url("https://example.com")
        assert result.is_valid is True

    def test_valid_http_url_passes_syntax(self):
        """A well-formed http:// URL passes Tier 1 but should warn about HTTPS."""
        with patch("httpx.Client") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_client.return_value.__enter__.return_value.head.return_value = mock_resp
            result = validate_url("http://example.com")
        assert result.is_valid is True
        assert result.uses_https is False
        assert result.warning is not None
        assert "HTTPS" in result.warning

    def test_no_scheme_fails(self):
        """URL without scheme must be rejected at Tier 1."""
        result = validate_url("example.com")
        assert result.is_valid is False
        assert result.error is not None
        assert "Invalid URL syntax" in result.error

    def test_ftp_scheme_fails(self):
        """Non-http/https scheme must be rejected."""
        result = validate_url("ftp://files.example.com")
        assert result.is_valid is False

    def test_empty_string_fails(self):
        """Empty string must be rejected immediately."""
        result = validate_url("")
        assert result.is_valid is False
        assert result.error is not None

    def test_url_with_whitespace_fails(self):
        """URLs with embedded spaces must be rejected."""
        result = validate_url("https://exam ple.com")
        assert result.is_valid is False

    def test_url_with_path_is_valid(self):
        """HTTPS URL with path and query string must pass Tier 1."""
        with patch("httpx.Client") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_client.return_value.__enter__.return_value.head.return_value = mock_resp
            result = validate_url("https://example.com/api/v1/data?key=value")
        assert result.is_valid is True


# ---------------------------------------------------------------------------
# Tier 2 — Reachability tests
# ---------------------------------------------------------------------------


class TestTier2Reachability:
    def test_reachable_200_returns_valid(self):
        """HTTP 200 response → is_valid=True, reachable=True."""
        with patch("httpx.Client") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_client.return_value.__enter__.return_value.head.return_value = mock_resp
            result = validate_url("https://example.com")
        assert result.is_valid is True
        assert result.reachable is True
        assert result.status_code == 200

    def test_reachable_301_redirect_returns_valid(self):
        """HTTP 301 (redirect) → still valid (redirect followed)."""
        with patch("httpx.Client") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 301
            mock_client.return_value.__enter__.return_value.head.return_value = mock_resp
            result = validate_url("https://example.com")
        assert result.is_valid is True

    def test_server_error_500_returns_invalid(self):
        """HTTP 500 → server is unreachable/broken → is_valid=False."""
        with patch("httpx.Client") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 500
            mock_client.return_value.__enter__.return_value.head.return_value = mock_resp
            result = validate_url("https://broken.example.com")
        assert result.is_valid is False
        assert result.reachable is False

    def test_connection_timeout_returns_invalid(self):
        """ConnectTimeout → is_valid=False, error message mentions timeout."""
        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.head.side_effect = httpx.ConnectTimeout("timed out")
            result = validate_url("https://unreachable.example.com", timeout=1.0)
        assert result.is_valid is False
        assert result.reachable is False
        assert "timed out" in result.error.lower() or "timeout" in result.error.lower()

    def test_connect_error_returns_invalid(self):
        """ConnectError → is_valid=False, descriptive error message."""
        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.head.side_effect = httpx.ConnectError(
                "name resolution failed"
            )
            result = validate_url("https://nonexistent.invalid")
        assert result.is_valid is False
        assert result.error is not None


# ---------------------------------------------------------------------------
# Tier 3 — HTTPS warning
# ---------------------------------------------------------------------------


class TestTier3HTTPSWarning:
    def test_https_url_has_no_warning(self):
        with patch("httpx.Client") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_client.return_value.__enter__.return_value.head.return_value = mock_resp
            result = validate_url("https://secure.example.com")
        assert result.uses_https is True
        assert result.warning is None

    def test_http_url_has_https_warning(self):
        with patch("httpx.Client") as mock_client:
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_client.return_value.__enter__.return_value.head.return_value = mock_resp
            result = validate_url("http://insecure.example.com")
        assert result.uses_https is False
        assert result.warning is not None
        assert "HTTPS" in result.warning


# ---------------------------------------------------------------------------
# ValidationResult dataclass sanity
# ---------------------------------------------------------------------------


class TestValidationResultDataclass:
    def test_default_error_is_none(self):
        r = ValidationResult(is_valid=True, url="https://example.com")
        assert r.error is None
        assert r.warning is None

    def test_invalid_result_carries_error_message(self):
        r = ValidationResult(is_valid=False, url="bad", error="Something went wrong")
        assert r.error == "Something went wrong"
