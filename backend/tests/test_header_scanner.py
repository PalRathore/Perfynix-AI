"""
Unit tests for header_scanner.py — Checkpoint 2.3a
🟡 SUPERVISOR runs these tests after CODER writes header_scanner.py
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

from backend.app.services.assessment.header_scanner import (
    HEADER_CWE_MAP,
    HeaderScanResult,
    scan_headers,
)


def _make_mock_response(headers: dict[str, str], status_code: int = 200) -> MagicMock:
    """Create a mock httpx Response with the given headers dict."""
    resp = MagicMock()
    resp.status_code = status_code
    # httpx lowercases header names; we do .title() inside scan_headers
    resp.headers = {k.lower(): v for k, v in headers.items()}
    return resp


ALL_SECURITY_HEADERS = {
    "Content-Security-Policy": "default-src 'self'",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "geolocation=(), microphone=()",
}


class TestHeaderScannerPresent:
    def test_all_headers_present_gives_100_score(self):
        """When all security headers are present, score should be 100."""
        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.return_value = _make_mock_response(ALL_SECURITY_HEADERS)
            result = scan_headers("https://secure.example.com")

        assert result.error is None
        assert result.score == 100
        assert len(result.missing) == 0
        assert len(result.present) == len(HEADER_CWE_MAP)

    def test_all_headers_present_no_findings(self):
        """No missing headers → no findings in the findings list."""
        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.return_value = _make_mock_response(ALL_SECURITY_HEADERS)
            result = scan_headers("https://secure.example.com")

        assert result.findings == []
        assert result.cwe_ids == []


class TestHeaderScannerMissing:
    def test_no_security_headers_gives_low_score(self):
        """When no security headers are present, score should be 0 (floor)."""
        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.return_value = _make_mock_response(
                {"Content-Type": "text/html"}
            )
            result = scan_headers("https://insecure.example.com")

        assert result.error is None
        assert result.score == 0
        assert len(result.missing) == len(HEADER_CWE_MAP)

    def test_missing_csp_maps_to_cwe_693(self):
        """Missing CSP header must produce a finding with CWE-693."""
        headers_without_csp = {k: v for k, v in ALL_SECURITY_HEADERS.items() if k != "Content-Security-Policy"}
        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.return_value = _make_mock_response(headers_without_csp)
            result = scan_headers("https://example.com")

        assert "Content-Security-Policy" in result.missing
        assert "CWE-693" in result.cwe_ids
        csp_finding = next(
            (f for f in result.findings if f["header"] == "Content-Security-Policy"),
            None,
        )
        assert csp_finding is not None
        assert csp_finding["cwe_id"] == "CWE-693"
        assert csp_finding["risk"] == "High"

    def test_missing_hsts_maps_to_cwe_319(self):
        """Missing HSTS header must produce a finding with CWE-319."""
        headers_without_hsts = {k: v for k, v in ALL_SECURITY_HEADERS.items() if k != "Strict-Transport-Security"}
        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.return_value = _make_mock_response(headers_without_hsts)
            result = scan_headers("https://example.com")

        assert "Strict-Transport-Security" in result.missing
        assert "CWE-319" in result.cwe_ids

    def test_missing_xframe_maps_to_cwe_1021(self):
        """Missing X-Frame-Options → CWE-1021."""
        headers_without = {k: v for k, v in ALL_SECURITY_HEADERS.items() if k != "X-Frame-Options"}
        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.return_value = _make_mock_response(headers_without)
            result = scan_headers("https://example.com")

        assert "CWE-1021" in result.cwe_ids

    def test_score_is_between_0_and_100(self):
        """Score must always stay in [0, 100] range."""
        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.return_value = _make_mock_response({})
            result = scan_headers("https://example.com")

        assert 0 <= result.score <= 100


class TestHeaderScannerErrors:
    def test_timeout_returns_error_result(self):
        """Timeout → error field set, score not set."""
        import httpx

        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.side_effect = httpx.TimeoutException("timeout")
            result = scan_headers("https://unreachable.example.com")

        assert result.error is not None

    def test_connect_error_returns_error_result(self):
        """ConnectError → error field set."""
        import httpx

        with patch("httpx.Client") as mock_client:
            mock_client.return_value.__enter__.return_value.get.side_effect = httpx.ConnectError("connection refused")
            result = scan_headers("https://bad.example.com")

        assert result.error is not None


class TestHeaderScanResultDataclass:
    def test_to_dict_returns_all_keys(self):
        result = HeaderScanResult(present={"CSP": "val"}, score=75)
        d = result.to_dict()
        assert "present" in d
        assert "missing" in d
        assert "findings" in d
        assert "cwe_ids" in d
        assert "score" in d
        assert "error" in d
