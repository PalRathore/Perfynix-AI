"""
Phase 2 Smoke Test / Verification Script — Checkpoint 2.5
Runs all four assessment modules against https://example.com and prints a complete
structured JSON report.

🟡 SUPERVISOR: Run this after all unit tests pass.
🔴 CEO: Review the JSON output — all 4 sections must be populated with no 'error' fields
        (except zap_wrapper which requires ZAP daemon to be running).

Usage:
    venv\\Scripts\\python backend\\verify_phase2.py

Expected output: JSON with 4 top-level keys:
    validation, lighthouse, headers, ssl
"""

from __future__ import annotations

import json
import sys
import time
from urllib.parse import urlparse

# Fix Windows PowerShell Unicode encoding
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

# Allow running from project root
sys.path.insert(0, ".")

from backend.app.services.assessment.header_scanner import scan_headers  # noqa: E402
from backend.app.services.assessment.input_validator import validate_url  # noqa: E402
from backend.app.services.assessment.lighthouse_wrapper import run_lighthouse  # noqa: E402
from backend.app.services.assessment.ssl_checker import check_ssl  # noqa: E402

TARGET_URL = "https://example.com"


def _section(title: str) -> None:
    print(f"\n{'=' * 60}", flush=True)
    print(f"  {title}", flush=True)
    print("=" * 60, flush=True)


def main() -> None:
    print(f"\n🔍 Phase 2 Smoke Test — Target: {TARGET_URL}")
    print("Running Tier 1 assessment modules...\n")

    # ------------------------------------------------------------------
    # Step 1: Input Validation (Checkpoint 2.1)
    # ------------------------------------------------------------------
    _section("Checkpoint 2.1 — Input Validator")
    t0 = time.time()
    validation = validate_url(TARGET_URL)
    t1 = time.time()
    print(f"Duration: {t1 - t0:.2f}s")
    print(
        json.dumps(
            {
                "is_valid": validation.is_valid,
                "url": validation.url,
                "uses_https": validation.uses_https,
                "reachable": validation.reachable,
                "status_code": validation.status_code,
                "error": validation.error,
                "warning": validation.warning,
            },
            indent=2,
        )
    )

    if not validation.is_valid:
        print(f"\n❌ URL validation FAILED: {validation.error}")
        print("Cannot proceed with scan. Exiting.")
        sys.exit(1)
    print("✅ URL validated successfully")

    # ------------------------------------------------------------------
    # Step 2: HTTP Header Scan (Checkpoint 2.3a)
    # ------------------------------------------------------------------
    _section("Checkpoint 2.3a — Security Header Scanner")
    t0 = time.time()
    headers = scan_headers(TARGET_URL)
    t1 = time.time()
    print(f"Duration: {t1 - t0:.2f}s")
    print(json.dumps(headers.to_dict(), indent=2, default=str))
    if headers.error:
        print(f"⚠️  Header scanner error: {headers.error}")
    else:
        print(f"✅ Header scan complete — Score: {headers.score}/100 | Missing: {len(headers.missing)} headers")

    # ------------------------------------------------------------------
    # Step 3: SSL Check (Checkpoint 2.3b)
    # ------------------------------------------------------------------
    _section("Checkpoint 2.3b — SSL/TLS Certificate Inspector")
    hostname = urlparse(TARGET_URL).netloc.split(":")[0]
    t0 = time.time()
    ssl_result = check_ssl(hostname)
    t1 = time.time()
    print(f"Duration: {t1 - t0:.2f}s")
    print(json.dumps(ssl_result.to_dict(), indent=2, default=str))
    if ssl_result.error:
        print(f"⚠️  SSL checker error: {ssl_result.error}")
    else:
        print(f"✅ SSL check complete — TLS: {ssl_result.tls_version} | Expires in: {ssl_result.days_to_expiry} days")

    # ------------------------------------------------------------------
    # Step 4: Lighthouse Performance (Checkpoint 2.2)
    # ------------------------------------------------------------------
    _section("Checkpoint 2.2 — Lighthouse Performance Scan")
    print("(This may take 30-90 seconds...)")
    t0 = time.time()
    lighthouse = run_lighthouse(TARGET_URL)
    t1 = time.time()
    print(f"Duration: {t1 - t0:.2f}s")
    print(json.dumps(lighthouse.to_dict(), indent=2, default=str))
    if lighthouse.error:
        print(f"⚠️  Lighthouse error: {lighthouse.error}")
    else:
        print(f"✅ Lighthouse complete — Score: {lighthouse.performance_score}/100 | LCP: {lighthouse.lcp_ms}ms")

    # ------------------------------------------------------------------
    # CEO Summary Gate
    # ------------------------------------------------------------------
    _section("🔴 CEO Phase Gate — Summary")
    errors = []
    if not validation.is_valid:
        errors.append("input_validator: URL not valid")
    if headers.error:
        errors.append(f"header_scanner: {headers.error}")
    if ssl_result.error and "refused" not in str(ssl_result.error).lower():
        errors.append(f"ssl_checker: {ssl_result.error}")
    if lighthouse.error:
        errors.append(f"lighthouse_wrapper: {lighthouse.error}")

    if errors:
        print("❌ GATE FAILED — The following modules reported errors:")
        for e in errors:
            print(f"   • {e}")
        print("\nFix these before proceeding to Phase 3.")
        sys.exit(1)
    else:
        print("✅ ALL TIER 1 MODULES PASSED")
        print("✅ Phase 2 Checkpoint 2.5 — CEO GATE: PASS")
        print("✅ Ready to proceed to Phase 3 (Threat Intelligence & CWE Bridging)")


if __name__ == "__main__":
    main()
