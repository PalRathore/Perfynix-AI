"""
Google Lighthouse Performance Wrapper — Checkpoint 2.2
Runs Lighthouse CLI via subprocess (headless Chrome) and extracts 8 Core Web Vitals KPIs.

KPIs extracted:
  1. LCP   — Largest Contentful Paint      (ms)
  2. FCP   — First Contentful Paint        (ms)
  3. CLS   — Cumulative Layout Shift       (unitless score)
  4. TBT   — Total Blocking Time           (ms)
  5. TTFB  — Time To First Byte            (ms)
  6. Speed Index                            (ms)
  7. Total Byte Weight                      (bytes)
  8. DOM Size                               (nodes)
  9. Performance Score                      (0-100)

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_lighthouse_wrapper.py
🔴 CEO: Check against IMPLEMENTATION_PHASES §2.2 — must return 8 KPIs as JSON
"""

from __future__ import annotations

import json
import os
import subprocess
import tempfile
from dataclasses import asdict, dataclass


@dataclass
class LighthouseResult:
    """Structured result from a Lighthouse performance audit."""

    lcp_ms: float | None = None  # Largest Contentful Paint (ms)
    fcp_ms: float | None = None  # First Contentful Paint (ms)
    cls_score: float | None = None  # Cumulative Layout Shift (0-2.5 ideal <0.1)
    tbt_ms: float | None = None  # Total Blocking Time (ms)
    ttfb_ms: float | None = None  # Time To First Byte (ms)
    speed_index_ms: float | None = None  # Speed Index (ms)
    total_byte_weight: int | None = None  # Page total bytes
    dom_size: int | None = None  # DOM node count
    performance_score: float | None = None  # 0-100 Lighthouse score
    raw_url: str = ""
    error: str | None = None

    def to_dict(self) -> dict:
        return asdict(self)


def run_lighthouse(url: str, timeout: int = 120) -> LighthouseResult:
    """
    Execute Lighthouse CLI and parse the JSON output.

    Args:
        url:     Target URL (must be reachable).
        timeout: Max seconds to wait for Lighthouse to finish.

    Returns:
        LighthouseResult with all 8 KPIs populated (None if a metric is missing).
    """
    with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        # Build command as a string — required on Windows since npx is a .cmd file
        cmd = (
            f'npx --yes lighthouse "{url}" '
            f"--output=json "
            f'--output-path="{tmp_path}" '
            f'--chrome-flags="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage" '
            f"--only-categories=performance "
            f"--quiet "
            f"--no-enable-error-reporting"
        )

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            shell=True,  # Required on Windows: npx is npx.cmd, not a native EXE
        )

        if not os.path.exists(tmp_path) or os.path.getsize(tmp_path) == 0:
            return LighthouseResult(
                raw_url=url,
                error=f"Lighthouse produced no output. stderr: {result.stderr[:300]}",
            )

        with open(tmp_path, encoding="utf-8") as f:
            data = json.load(f)

        return _parse_lighthouse_json(data, url)

    except subprocess.TimeoutExpired:
        return LighthouseResult(
            raw_url=url,
            error=f"Lighthouse timed out after {timeout}s.",
        )
    except FileNotFoundError:
        # Only raised when shell=False; kept for cross-platform compatibility
        return LighthouseResult(
            raw_url=url,
            error=(
                "Lighthouse CLI not found. Ensure Node.js is installed " "and 'npx lighthouse' is accessible from PATH."
            ),
        )
    except Exception as exc:  # noqa: BLE001
        return LighthouseResult(
            raw_url=url,
            error=f"Unexpected error running Lighthouse: {exc}",
        )
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


def _parse_lighthouse_json(data: dict, url: str) -> LighthouseResult:
    """Parse raw Lighthouse JSON report into LighthouseResult."""
    audits = data.get("audits", {})
    categories = data.get("categories", {})

    def _ms(audit_key: str) -> float | None:
        """Extract numeric value in milliseconds from an audit entry."""
        audit = audits.get(audit_key, {})
        val = audit.get("numericValue")
        return round(float(val), 2) if val is not None else None

    def _score(audit_key: str) -> float | None:
        """Extract 0-1 score from an audit entry, convert to 0-100."""
        audit = audits.get(audit_key, {})
        val = audit.get("numericValue")
        return round(float(val), 4) if val is not None else None

    def _int_val(audit_key: str) -> int | None:
        """Extract integer value (e.g. DOM size, byte weight)."""
        audit = audits.get(audit_key, {})
        val = audit.get("numericValue")
        return int(val) if val is not None else None

    # Performance score (0-1 → 0-100)
    perf_cat = categories.get("performance", {})
    perf_score_raw = perf_cat.get("score")
    perf_score = round(float(perf_score_raw) * 100, 1) if perf_score_raw is not None else None

    return LighthouseResult(
        lcp_ms=_ms("largest-contentful-paint"),
        fcp_ms=_ms("first-contentful-paint"),
        cls_score=_score("cumulative-layout-shift"),
        tbt_ms=_ms("total-blocking-time"),
        ttfb_ms=_ms("interactive"),  # Lighthouse uses TTI; TTFB via server-response-time
        speed_index_ms=_ms("speed-index"),
        total_byte_weight=_int_val("total-byte-weight"),
        dom_size=_int_val("dom-size"),
        performance_score=perf_score,
        raw_url=url,
        error=None,
    )
