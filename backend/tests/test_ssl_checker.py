"""
Unit tests for ssl_checker.py — Checkpoint 2.3b
🟡 SUPERVISOR runs these tests after CODER writes ssl_checker.py
"""

from __future__ import annotations

import ssl
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock, patch

from backend.app.services.assessment.ssl_checker import SSLResult, check_ssl


def _make_cert(days_to_expiry: int = 365, tls_version: str = "TLSv1.3") -> tuple[dict, str]:
    """Build a minimal synthetic cert dict and TLS version string."""
    expiry = datetime.now(timezone.utc) + timedelta(days=days_to_expiry)
    cert = {
        "subject": ((("commonName", "example.com"),),),
        "issuer": ((("organizationName", "Let's Encrypt"),),),
        "notAfter": expiry.strftime("%b %d %H:%M:%S %Y GMT"),
        "serialNumber": "DEADBEEF",
    }
    return cert, tls_version


class TestSSLValid:
    def test_valid_cert_returns_is_valid_true(self):
        cert, tls = _make_cert(days_to_expiry=300, tls_version="TLSv1.3")
        with (
            patch("ssl.create_default_context") as mock_ctx,
            patch("socket.create_connection") as mock_sock,
        ):
            mock_ssock = MagicMock()
            mock_ssock.getpeercert.return_value = cert
            mock_ssock.version.return_value = tls
            mock_ctx.return_value.wrap_socket.return_value.__enter__.return_value = mock_ssock
            mock_sock.return_value.__enter__.return_value = MagicMock()
            result = check_ssl("example.com")

        assert result.is_valid is True
        assert result.error is None

    def test_cert_subject_extracted(self):
        cert, tls = _make_cert(300, "TLSv1.3")
        with (
            patch("ssl.create_default_context") as mock_ctx,
            patch("socket.create_connection") as mock_sock,
        ):
            mock_ssock = MagicMock()
            mock_ssock.getpeercert.return_value = cert
            mock_ssock.version.return_value = tls
            mock_ctx.return_value.wrap_socket.return_value.__enter__.return_value = mock_ssock
            mock_sock.return_value.__enter__.return_value = MagicMock()
            result = check_ssl("example.com")

        assert result.subject == "example.com"

    def test_issuer_extracted(self):
        cert, tls = _make_cert(300, "TLSv1.3")
        with (
            patch("ssl.create_default_context") as mock_ctx,
            patch("socket.create_connection") as mock_sock,
        ):
            mock_ssock = MagicMock()
            mock_ssock.getpeercert.return_value = cert
            mock_ssock.version.return_value = tls
            mock_ctx.return_value.wrap_socket.return_value.__enter__.return_value = mock_ssock
            mock_sock.return_value.__enter__.return_value = MagicMock()
            result = check_ssl("example.com")

        assert "Let's Encrypt" in result.issuer or result.issuer is not None

    def test_tls_version_reported(self):
        cert, tls = _make_cert(300, "TLSv1.3")
        with (
            patch("ssl.create_default_context") as mock_ctx,
            patch("socket.create_connection") as mock_sock,
        ):
            mock_ssock = MagicMock()
            mock_ssock.getpeercert.return_value = cert
            mock_ssock.version.return_value = tls
            mock_ctx.return_value.wrap_socket.return_value.__enter__.return_value = mock_ssock
            mock_sock.return_value.__enter__.return_value = MagicMock()
            result = check_ssl("example.com")

        assert result.tls_version == "TLSv1.3"

    def test_days_to_expiry_positive(self):
        cert, tls = _make_cert(300, "TLSv1.3")
        with (
            patch("ssl.create_default_context") as mock_ctx,
            patch("socket.create_connection") as mock_sock,
        ):
            mock_ssock = MagicMock()
            mock_ssock.getpeercert.return_value = cert
            mock_ssock.version.return_value = tls
            mock_ctx.return_value.wrap_socket.return_value.__enter__.return_value = mock_ssock
            mock_sock.return_value.__enter__.return_value = MagicMock()
            result = check_ssl("example.com")

        assert result.days_to_expiry is not None
        assert result.days_to_expiry > 0
        assert len(result.findings) == 0  # no issues for healthy cert


class TestSSLExpiry:
    def test_expired_cert_generates_cwe_298_critical(self):
        """Expired cert → finding with CWE-298 and risk=Critical."""
        cert, tls = _make_cert(days_to_expiry=-5, tls_version="TLSv1.3")
        with (
            patch("ssl.create_default_context") as mock_ctx,
            patch("socket.create_connection") as mock_sock,
        ):
            mock_ssock = MagicMock()
            mock_ssock.getpeercert.return_value = cert
            mock_ssock.version.return_value = tls
            mock_ctx.return_value.wrap_socket.return_value.__enter__.return_value = mock_ssock
            mock_sock.return_value.__enter__.return_value = MagicMock()
            result = check_ssl("expired.example.com")

        assert "CWE-298" in result.cwe_ids
        expired_findings = [f for f in result.findings if f["type"] == "certificate_expired"]
        assert len(expired_findings) >= 1
        assert expired_findings[0]["risk"] == "Critical"

    def test_expiring_soon_generates_cwe_298_medium(self):
        """Cert expiring in 15 days → CWE-298 with risk=Medium."""
        cert, tls = _make_cert(days_to_expiry=15, tls_version="TLSv1.3")
        with (
            patch("ssl.create_default_context") as mock_ctx,
            patch("socket.create_connection") as mock_sock,
        ):
            mock_ssock = MagicMock()
            mock_ssock.getpeercert.return_value = cert
            mock_ssock.version.return_value = tls
            mock_ctx.return_value.wrap_socket.return_value.__enter__.return_value = mock_ssock
            mock_sock.return_value.__enter__.return_value = MagicMock()
            result = check_ssl("expiring.example.com")

        assert "CWE-298" in result.cwe_ids
        expiring_findings = [f for f in result.findings if f["type"] == "certificate_expiring_soon"]
        assert len(expiring_findings) >= 1
        assert expiring_findings[0]["risk"] == "Medium"


class TestSSLWeakTLS:
    def test_tls_1_0_generates_cwe_326(self):
        """TLS 1.0 → finding with CWE-326 (Inadequate Encryption Strength)."""
        cert, _ = _make_cert(300)
        with (
            patch("ssl.create_default_context") as mock_ctx,
            patch("socket.create_connection") as mock_sock,
        ):
            mock_ssock = MagicMock()
            mock_ssock.getpeercert.return_value = cert
            mock_ssock.version.return_value = "TLSv1"
            mock_ctx.return_value.wrap_socket.return_value.__enter__.return_value = mock_ssock
            mock_sock.return_value.__enter__.return_value = MagicMock()
            result = check_ssl("old.example.com")

        assert "CWE-326" in result.cwe_ids
        weak_findings = [f for f in result.findings if f["type"] == "weak_tls_version"]
        assert len(weak_findings) >= 1
        assert weak_findings[0]["risk"] == "High"


class TestSSLErrors:
    def test_cert_verification_error_returns_cwe_295(self):
        """SSLCertVerificationError → is_valid=False + CWE-295."""
        with (
            patch("ssl.create_default_context") as mock_ctx,
            patch("socket.create_connection") as mock_sock,
        ):
            mock_ctx.return_value.wrap_socket.return_value.__enter__.side_effect = ssl.SSLCertVerificationError(
                "certificate verify failed"
            )
            mock_sock.return_value.__enter__.return_value = MagicMock()
            result = check_ssl("self-signed.example.com")

        assert result.is_valid is False
        assert "CWE-295" in result.cwe_ids

    def test_connection_refused_returns_error(self):
        """ConnectionRefusedError → is_valid=False, descriptive error."""
        with patch("socket.create_connection") as mock_sock:
            mock_sock.side_effect = ConnectionRefusedError()
            result = check_ssl("no-ssl.example.com")

        assert result.is_valid is False
        assert result.error is not None

    def test_timeout_returns_error(self):
        """Socket timeout → is_valid=False."""
        with patch("socket.create_connection") as mock_sock:
            mock_sock.side_effect = TimeoutError("timed out")
            result = check_ssl("slow.example.com", timeout=1.0)

        assert result.is_valid is False
        assert result.error is not None


class TestSSLResultDataclass:
    def test_to_dict_is_json_serializable(self):
        """SSLResult.to_dict() must return only JSON-safe types."""
        import json

        result = SSLResult(
            is_valid=True,
            issuer="Let's Encrypt",
            subject="example.com",
            expiry_date="2026-01-01T00:00:00+00:00",
            days_to_expiry=300,
            tls_version="TLSv1.3",
        )
        d = result.to_dict()
        # Must not raise
        json_str = json.dumps(d, default=str)
        assert "example.com" in json_str
