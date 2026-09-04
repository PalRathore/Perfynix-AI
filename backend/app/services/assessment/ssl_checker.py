"""
SSL/TLS Certificate Inspector — Checkpoint 2.3b
Inspects the SSL certificate and TLS configuration of a target host.

Checks performed:
  1. Certificate validity (is it trusted by the system CA store?)
  2. Issuer organization and subject CN
  3. Expiry date and days remaining
  4. TLS protocol version (flags TLS < 1.2 as a vulnerability)

CWE mappings:
  Expired certificate    → CWE-298 (Improper Validation of Certificate Expiration)
  Expiring within 30 days → CWE-298 (warning severity)
  TLS < 1.2             → CWE-326 (Inadequate Encryption Strength)
  Invalid / self-signed  → CWE-295 (Improper Certificate Validation)

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_ssl_checker.py
🔴 CEO: Check against IMPLEMENTATION_PHASES §2.3 — must report TLS version + cert expiry
"""

from __future__ import annotations

import socket
import ssl
from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class SSLResult:
    """Structured result of the SSL/TLS certificate inspection."""

    is_valid: bool = False
    issuer: str | None = None
    subject: str | None = None
    expiry_date: str | None = None  # ISO 8601 string for JSON serialization
    days_to_expiry: int | None = None
    tls_version: str | None = None
    serial_number: str | None = None
    findings: list[dict] = field(default_factory=list)
    cwe_ids: list[str] = field(default_factory=list)
    error: str | None = None

    def to_dict(self) -> dict:
        return {
            "is_valid": self.is_valid,
            "issuer": self.issuer,
            "subject": self.subject,
            "expiry_date": self.expiry_date,
            "days_to_expiry": self.days_to_expiry,
            "tls_version": self.tls_version,
            "serial_number": self.serial_number,
            "findings": self.findings,
            "cwe_ids": self.cwe_ids,
            "error": self.error,
        }


def _extract_cn(rdns: tuple) -> str:
    """Extract Common Name (CN) from an RDN tuple returned by ssl.getpeercert()."""
    for rdn in rdns:
        for attr in rdn:
            if attr[0] == "commonName":
                return attr[1]
    # fallback: concatenate all fields
    return ", ".join(f"{k}={v}" for rdn in rdns for k, v in rdn)


def _extract_org(rdns: tuple) -> str:
    """Extract Organization (O) from an RDN tuple."""
    for rdn in rdns:
        for attr in rdn:
            if attr[0] == "organizationName":
                return attr[1]
    return _extract_cn(rdns)


def check_ssl(hostname: str, port: int = 443, timeout: float = 10.0) -> SSLResult:
    """
    Connect to the host over TLS and inspect the certificate.

    Args:
        hostname: Domain name (e.g. 'example.com'). Strip any scheme before calling.
        port:     TCP port (default 443).
        timeout:  Socket connection timeout in seconds.

    Returns:
        SSLResult with all certificate metadata and any findings.
    """
    # Strip scheme if accidentally included
    hostname = hostname.replace("https://", "").replace("http://", "").split("/")[0]

    findings: list[dict] = []
    cwe_ids: list[str] = []

    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=timeout) as sock:
            with ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                tls_version = ssock.version()  # e.g. "TLSv1.3", "TLSv1.2"

        # ------------------------------------------------------------------
        # Parse certificate fields
        # ------------------------------------------------------------------
        subject = cert.get("subject", ())
        issuer = cert.get("issuer", ())
        not_after_str = cert.get("notAfter", "")
        serial = cert.get("serialNumber", None)

        subject_cn = _extract_cn(subject)
        issuer_org = _extract_org(issuer)

        # Parse expiry date — format: "Sep  4 23:59:59 2026 GMT"
        try:
            expiry_dt = datetime.strptime(not_after_str, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
            now_utc = datetime.now(timezone.utc)
            days_left = (expiry_dt - now_utc).days
            expiry_iso = expiry_dt.isoformat()
        except ValueError:
            expiry_dt = None
            days_left = None
            expiry_iso = not_after_str

        # ------------------------------------------------------------------
        # TLS version check — flag anything below TLS 1.2
        # ------------------------------------------------------------------
        weak_tls_versions = {"TLSv1", "TLSv1.0", "TLSv1.1", "SSLv3", "SSLv2"}
        if tls_version in weak_tls_versions:
            cwe_ids.append("CWE-326")
            findings.append(
                {
                    "type": "weak_tls_version",
                    "tls_version": tls_version,
                    "cwe_id": "CWE-326",
                    "cwe_name": "Inadequate Encryption Strength",
                    "risk": "High",
                    "description": (
                        f"Server negotiated {tls_version}, which is deprecated and vulnerable "
                        "to POODLE, BEAST, and other protocol-level attacks."
                    ),
                    "remediation": "Configure the server to accept TLS 1.2 and TLS 1.3 only.",
                }
            )

        # ------------------------------------------------------------------
        # Expiry checks
        # ------------------------------------------------------------------
        if days_left is not None:
            if days_left < 0:
                cwe_ids.append("CWE-298")
                findings.append(
                    {
                        "type": "certificate_expired",
                        "days_to_expiry": days_left,
                        "cwe_id": "CWE-298",
                        "cwe_name": "Improper Validation of Certificate Expiration",
                        "risk": "Critical",
                        "description": f"SSL certificate expired {abs(days_left)} days ago.",
                        "remediation": "Renew the SSL certificate immediately.",
                    }
                )
            elif days_left <= 30:
                cwe_ids.append("CWE-298")
                findings.append(
                    {
                        "type": "certificate_expiring_soon",
                        "days_to_expiry": days_left,
                        "cwe_id": "CWE-298",
                        "cwe_name": "Improper Validation of Certificate Expiration",
                        "risk": "Medium",
                        "description": f"SSL certificate will expire in {days_left} days.",
                        "remediation": "Renew the SSL certificate before it expires.",
                    }
                )

        return SSLResult(
            is_valid=True,
            issuer=issuer_org,
            subject=subject_cn,
            expiry_date=expiry_iso,
            days_to_expiry=days_left,
            tls_version=tls_version,
            serial_number=str(serial) if serial else None,
            findings=findings,
            cwe_ids=list(set(cwe_ids)),
            error=None,
        )

    except ssl.SSLCertVerificationError as exc:
        return SSLResult(
            is_valid=False,
            findings=[
                {
                    "type": "invalid_certificate",
                    "cwe_id": "CWE-295",
                    "cwe_name": "Improper Certificate Validation",
                    "risk": "High",
                    "description": str(exc),
                    "remediation": "Install a valid certificate from a trusted CA.",
                }
            ],
            cwe_ids=["CWE-295"],
            error=f"Certificate validation failed: {exc}",
        )
    except (socket.timeout, TimeoutError):
        return SSLResult(
            is_valid=False,
            error=f"SSL connection timed out after {timeout:.0f}s.",
        )
    except ConnectionRefusedError:
        return SSLResult(
            is_valid=False,
            error=f"Connection refused on port {port}. Host may not serve HTTPS.",
        )
    except Exception as exc:  # noqa: BLE001
        return SSLResult(
            is_valid=False,
            error=f"SSL inspection failed: {exc}",
        )
