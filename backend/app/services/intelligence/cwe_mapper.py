"""
CWE Mapper Module — Checkpoint 3.2
Maps scanner finding alerts, vulnerability titles, or raw scanner strings to CWE IDs.

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_cwe_mapper.py
🔴 CEO: Verifies CWE mappings align with FINAL_CONTEXT.md §4.5
"""

from __future__ import annotations

import re

# Comprehensive alert keyword → CWE ID fallback dictionary (50+ mappings)
ALERT_TO_CWE_MAP: dict[str, str] = {
    # Injection Vulnerabilities
    "sql injection": "CWE-89",
    "sqli": "CWE-89",
    "blind sql injection": "CWE-89",
    "command injection": "CWE-78",
    "os command injection": "CWE-78",
    "code injection": "CWE-94",
    "xml injection": "CWE-91",
    "xpath injection": "CWE-643",
    "ldap injection": "CWE-90",
    # Broken Authentication & Session Management
    "missing authentication": "CWE-306",
    "broken authentication": "CWE-287",
    "hardcoded credentials": "CWE-798",
    "weak password": "CWE-521",
    "session fixation": "CWE-384",
    "insecure cookie": "CWE-614",
    "cookie without samesite": "CWE-1275",
    "cookie without httponly": "CWE-1004",
    "cookie without secure": "CWE-614",
    # Cross-Site Scripting (XSS)
    "cross-site scripting": "CWE-79",
    "xss": "CWE-79",
    "reflected xss": "CWE-79",
    "stored xss": "CWE-79",
    "dom xss": "CWE-79",
    # Sensitive Data Exposure & Headers
    "content-security-policy": "CWE-693",
    "missing csp": "CWE-693",
    "strict-transport-security": "CWE-319",
    "missing hsts": "CWE-319",
    "x-frame-options": "CWE-1021",
    "clickjacking": "CWE-1021",
    "x-content-type-options": "CWE-430",
    "mime sniffing": "CWE-430",
    "referrer-policy": "CWE-200",
    "permissions-policy": "CWE-250",
    "information disclosure": "CWE-200",
    "directory listing": "CWE-548",
    # SSL/TLS & Cryptography
    "ssl": "CWE-295",
    "tls": "CWE-326",
    "weak tls": "CWE-326",
    "expired certificate": "CWE-298",
    "certificate expired": "CWE-298",
    "self-signed certificate": "CWE-295",
    "invalid certificate": "CWE-295",
    # Access Control & CSRF
    "cross-site request forgery": "CWE-352",
    "csrf": "CWE-352",
    "insecure direct object reference": "CWE-639",
    "idor": "CWE-639",
    "path traversal": "CWE-22",
    "directory traversal": "CWE-22",
    # Vulnerable Components & Deserialization
    "outdated component": "CWE-1104",
    "vulnerable library": "CWE-1104",
    "insecure deserialization": "CWE-502",
    "open redirect": "CWE-601",
    "ssrf": "CWE-918",
    "server-side request forgery": "CWE-918",
}


def map_finding_to_cwe(alert_name: str, provided_cwe: str | None = None) -> str:
    """
    Map a finding's alert name or scanner string to a canonical CWE ID.

    Priority:
    1. If scanner explicitly provided a valid CWE string (e.g. "CWE-79" or "79"), format and return it.
    2. Exact/substring match against fallback keyword dictionary.
    3. Default fallback: "CWE-200" (Exposure of Sensitive Information).
    """
    # 1. Handle explicit provided CWE string
    if provided_cwe and provided_cwe.strip():
        clean_cwe = provided_cwe.strip().upper()
        if clean_cwe.startswith("CWE-") and clean_cwe != "CWE-0" and clean_cwe != "CWE-UNKNOWN":
            return clean_cwe
        match = re.search(r"\b(\d+)\b", clean_cwe)
        if match and match.group(1) != "0":
            return f"CWE-{match.group(1)}"

    # 2. Keyword search in alert name
    clean_alert = alert_name.lower().strip()
    for keyword, cwe_id in ALERT_TO_CWE_MAP.items():
        if keyword in clean_alert:
            return cwe_id

    # 3. Generic fallback
    return "CWE-200"
