"""
HTTP Security Header Scanner — Checkpoint 2.3a
Audits HTTP response headers for missing or misconfigured security headers.
Maps each missing header to its corresponding CWE ID for the CWE bridge in Phase 3.

Security headers checked:
  1. Content-Security-Policy   → CWE-693 (Protection Mechanism Failure)
  2. Strict-Transport-Security → CWE-319 (Cleartext Transmission of Sensitive Information)
  3. X-Frame-Options           → CWE-1021 (UI Redressing / Clickjacking)
  4. X-Content-Type-Options    → CWE-430 (Deployment of Wrong Handler)
  5. Referrer-Policy           → CWE-200 (Exposure of Sensitive Information)
  6. Permissions-Policy        → CWE-250 (Execution with Unnecessary Privileges)

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_header_scanner.py
🔴 CEO: Check against FINAL_CONTEXT.md §4.5 CWE Bridging Strategy
"""

from __future__ import annotations

from dataclasses import dataclass, field

import httpx

# ---------------------------------------------------------------------------
# Mapping: header name → CWE ID + description of the risk
# ---------------------------------------------------------------------------
HEADER_CWE_MAP: dict[str, dict[str, str]] = {
    "Content-Security-Policy": {
        "cwe_id": "CWE-693",
        "cwe_name": "Protection Mechanism Failure",
        "risk": "High",
        "description": (
            "Missing CSP allows attackers to inject malicious scripts (XSS) "
            "and load external resources. Browsers have no policy to enforce."
        ),
    },
    "Strict-Transport-Security": {
        "cwe_id": "CWE-319",
        "cwe_name": "Cleartext Transmission of Sensitive Information",
        "risk": "High",
        "description": (
            "Missing HSTS allows downgrade attacks (SSL stripping). "
            "Browsers may connect over plain HTTP exposing credentials."
        ),
    },
    "X-Frame-Options": {
        "cwe_id": "CWE-1021",
        "cwe_name": "Improper Restriction of Rendered UI Layers (Clickjacking)",
        "risk": "Medium",
        "description": (
            "Missing X-Frame-Options allows the page to be embedded in iframes, " "enabling clickjacking attacks."
        ),
    },
    "X-Content-Type-Options": {
        "cwe_id": "CWE-430",
        "cwe_name": "Deployment of Wrong Handler",
        "risk": "Medium",
        "description": (
            "Missing X-Content-Type-Options allows MIME sniffing. "
            "Browsers may misinterpret response content as executable code."
        ),
    },
    "Referrer-Policy": {
        "cwe_id": "CWE-200",
        "cwe_name": "Exposure of Sensitive Information to an Unauthorized Actor",
        "risk": "Low",
        "description": (
            "Missing Referrer-Policy may leak sensitive URL parameters "
            "(tokens, IDs) to external sites via the Referer header."
        ),
    },
    "Permissions-Policy": {
        "cwe_id": "CWE-250",
        "cwe_name": "Execution with Unnecessary Privileges",
        "risk": "Low",
        "description": (
            "Missing Permissions-Policy allows unrestricted use of browser APIs "
            "(camera, microphone, geolocation) by the page and embedded iframes."
        ),
    },
}

# Risk level → numeric score penalty per missing header
_RISK_PENALTY: dict[str, int] = {"High": 30, "Medium": 15, "Low": 5}


@dataclass
class HeaderScanResult:
    """Structured result of the HTTP security header audit."""

    present: dict[str, str] = field(default_factory=dict)  # header → value
    missing: list[str] = field(default_factory=list)  # missing header names
    findings: list[dict] = field(default_factory=list)  # structured findings (CWE, risk)
    cwe_ids: list[str] = field(default_factory=list)  # unique CWE IDs found
    score: int = 100  # 0-100 security score
    error: str | None = None

    def to_dict(self) -> dict:
        return {
            "present": self.present,
            "missing": self.missing,
            "findings": self.findings,
            "cwe_ids": self.cwe_ids,
            "score": self.score,
            "error": self.error,
        }


def scan_headers(url: str, timeout: float = 15.0) -> HeaderScanResult:
    """
    Fetch the URL and inspect its security response headers.

    Args:
        url:     Target URL (must be reachable).
        timeout: HTTP request timeout in seconds.

    Returns:
        HeaderScanResult with present/missing headers, CWE mappings, and a 0-100 score.
    """
    default_headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    try:
        with httpx.Client(
            follow_redirects=True,
            timeout=timeout,
            verify=False,
            headers=default_headers,
        ) as client:
            resp = client.get(url)
            headers = {k.title(): v for k, v in resp.headers.items()}

    except httpx.TimeoutException:
        return HeaderScanResult(error=f"Request timed out after {timeout:.0f}s.")
    except httpx.ConnectError:
        return HeaderScanResult(error="Cannot connect to target host.")
    except Exception as exc:  # noqa: BLE001
        return HeaderScanResult(error=f"Unexpected error fetching headers: {exc}")

    # ------------------------------------------------------------------
    # Classify each security header as present or missing
    # ------------------------------------------------------------------
    present: dict[str, str] = {}
    missing: list[str] = []
    findings: list[dict] = []
    cwe_ids: list[str] = []
    score = 100

    for header, meta in HEADER_CWE_MAP.items():
        value = headers.get(header)
        if value:
            present[header] = value
        else:
            missing.append(header)
            cwe_ids.append(meta["cwe_id"])
            score -= _RISK_PENALTY.get(meta["risk"], 5)
            findings.append(
                {
                    "type": "missing_security_header",
                    "header": header,
                    "cwe_id": meta["cwe_id"],
                    "cwe_name": meta["cwe_name"],
                    "risk": meta["risk"],
                    "description": meta["description"],
                    "remediation": f"Add the '{header}' header to all HTTP responses.",
                }
            )

    return HeaderScanResult(
        present=present,
        missing=missing,
        findings=findings,
        cwe_ids=list(set(cwe_ids)),
        score=max(0, score),
    )
