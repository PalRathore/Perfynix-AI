"""
Input Validator Module — Checkpoint 2.1
Three-tier URL validation before any scanning starts.

Tier 1: Syntax check (regex — must be http:// or https://)
Tier 2: Reachability check (HTTP HEAD request, 10s timeout)
Tier 3: HTTPS check (warn if plain http://)

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_input_validator.py
🔴 CEO: Check against FINAL_CONTEXT.md §4.4 Phase 1 Input & Validation
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from urllib.parse import urlparse

import httpx

# ---------------------------------------------------------------------------
# URL syntax regex: accepts http and https, no whitespace allowed
# ---------------------------------------------------------------------------
_URL_REGEX = re.compile(
    r"^https?://"  # scheme
    r"(?:[A-Za-z0-9\-._~:@!$&'()*+,;=%]+"  # host / userinfo
    r"|localhost)"
    r"(?::\d{1,5})?"  # optional port
    r"(?:/[^\s]*)?"  # optional path
    r"$",
    re.IGNORECASE,
)


@dataclass
class ValidationResult:
    """Result of the three-tier URL validation."""

    is_valid: bool
    url: str
    uses_https: bool = False
    reachable: bool = False
    status_code: int | None = None
    error: str | None = None
    warning: str | None = None


def validate_url(url: str, timeout: float = 10.0) -> ValidationResult:
    """
    Validate a URL through three sequential tiers.

    Args:
        url:     The raw URL string provided by the user.
        timeout: Seconds before the reachability HEAD request times out.

    Returns:
        ValidationResult with is_valid=True only if Tier 1 and Tier 2 pass.
        Tier 3 (HTTPS) generates a warning but does NOT set is_valid=False.
    """
    url = url.strip()

    # ------------------------------------------------------------------
    # Tier 1 — Syntax validation
    # ------------------------------------------------------------------
    if not _URL_REGEX.match(url):
        return ValidationResult(
            is_valid=False,
            url=url,
            error=(
                "Invalid URL syntax. URL must start with http:// or https:// "
                "and contain no spaces. Example: https://example.com"
            ),
        )

    parsed = urlparse(url)
    uses_https = parsed.scheme.lower() == "https"

    # ------------------------------------------------------------------
    # Tier 3 — HTTPS warning (evaluated here, reported with Tier 2 result)
    # ------------------------------------------------------------------
    https_warning: str | None = None
    if not uses_https:
        https_warning = (
            "Target uses plain HTTP (not HTTPS). "
            "Security scan results may be incomplete — SSL/TLS checks will be skipped. "
            "Consider redirecting to HTTPS before production deployment."
        )

    # ------------------------------------------------------------------
    # Tier 2 — Reachability check
    # ------------------------------------------------------------------
    try:
        with httpx.Client(
            follow_redirects=True,
            timeout=timeout,
            verify=False,  # allow self-signed certs at validation stage
        ) as client:
            resp = client.head(url)
            reachable = resp.status_code < 500

            # Some servers reject HEAD — fall back to GET with no body read
            if resp.status_code == 405:
                resp = client.get(url, headers={"Range": "bytes=0-0"})
                reachable = resp.status_code < 500

        return ValidationResult(
            is_valid=reachable,
            url=url,
            uses_https=uses_https,
            reachable=reachable,
            status_code=resp.status_code,
            error=None if reachable else f"Server returned HTTP {resp.status_code}.",
            warning=https_warning,
        )

    except httpx.ConnectTimeout:
        return ValidationResult(
            is_valid=False,
            url=url,
            uses_https=uses_https,
            reachable=False,
            error=f"Connection timed out after {timeout:.0f}s. Check the URL and try again.",
            warning=https_warning,
        )
    except httpx.ConnectError:
        return ValidationResult(
            is_valid=False,
            url=url,
            uses_https=uses_https,
            reachable=False,
            error="Cannot reach the target host. Verify the URL is correct and the server is online.",
            warning=https_warning,
        )
    except Exception as exc:  # noqa: BLE001
        return ValidationResult(
            is_valid=False,
            url=url,
            uses_https=uses_https,
            reachable=False,
            error=f"Unexpected error during reachability check: {exc}",
            warning=https_warning,
        )
