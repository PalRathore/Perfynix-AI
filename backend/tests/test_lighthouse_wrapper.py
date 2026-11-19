"""
Unit tests for lighthouse_wrapper.py — Checkpoint 2.2
Uses mocked subprocess to test JSON parsing without requiring a live Chrome instance.
🟡 SUPERVISOR runs these tests after CODER writes lighthouse_wrapper.py
"""

from __future__ import annotations

import json
import subprocess
from unittest.mock import MagicMock, patch

from backend.app.services.assessment.lighthouse_wrapper import (
    LighthouseResult,
    _parse_lighthouse_json,
    run_lighthouse,
)

# ---------------------------------------------------------------------------
# Synthetic Lighthouse JSON fixture
# ---------------------------------------------------------------------------


def _make_lighthouse_report(
    lcp: float = 2400.0,
    fcp: float = 900.0,
    cls: float = 0.05,
    tbt: float = 200.0,
    tti: float = 3800.0,
    si: float = 2100.0,
    bytes_: int = 512000,
    dom: int = 350,
    perf_score: float = 0.82,
) -> dict:
    """Create a minimal synthetic Lighthouse JSON report."""
    return {
        "categories": {"performance": {"score": perf_score}},
        "audits": {
            "largest-contentful-paint": {"numericValue": lcp},
            "first-contentful-paint": {"numericValue": fcp},
            "cumulative-layout-shift": {"numericValue": cls},
            "total-blocking-time": {"numericValue": tbt},
            "interactive": {"numericValue": tti},
            "speed-index": {"numericValue": si},
            "total-byte-weight": {"numericValue": bytes_},
            "dom-size": {"numericValue": dom},
        },
    }


class TestParseLighthouseJson:
    def test_all_kpis_extracted(self):
        """All 8 KPIs + performance score must be extracted correctly."""
        report = _make_lighthouse_report()
        result = _parse_lighthouse_json(report, "https://example.com")

        assert result.lcp_ms == 2400.0
        assert result.fcp_ms == 900.0
        assert result.cls_score == 0.05
        assert result.tbt_ms == 200.0
        assert result.ttfb_ms == 3800.0  # mapped from 'interactive' (TTI)
        assert result.speed_index_ms == 2100.0
        assert result.total_byte_weight == 512000
        assert result.dom_size == 350
        assert result.performance_score == 82.0  # 0.82 * 100
        assert result.error is None

    def test_missing_audit_returns_none(self):
        """If an audit key is absent, the corresponding field should be None (no crash)."""
        report = {"categories": {"performance": {"score": 0.5}}, "audits": {}}
        result = _parse_lighthouse_json(report, "https://example.com")

        assert result.lcp_ms is None
        assert result.fcp_ms is None
        assert result.performance_score == 50.0

    def test_missing_performance_category_returns_none(self):
        """Missing categories section → performance_score is None."""
        report = {"categories": {}, "audits": {}}
        result = _parse_lighthouse_json(report, "https://example.com")
        assert result.performance_score is None

    def test_url_preserved(self):
        """raw_url field must match the input URL."""
        report = _make_lighthouse_report()
        result = _parse_lighthouse_json(report, "https://mysite.example.com/page")
        assert result.raw_url == "https://mysite.example.com/page"

    def test_performance_score_rounded(self):
        """Performance score must be rounded to 1 decimal place."""
        report = _make_lighthouse_report(perf_score=0.8333)
        result = _parse_lighthouse_json(report, "https://example.com")
        assert result.performance_score == 83.3


class TestRunLighthouse:
    def test_successful_run_returns_result(self, tmp_path):
        """Mocked subprocess writes JSON → run_lighthouse returns populated result."""
        report = _make_lighthouse_report(lcp=1500.0, perf_score=0.95)
        report_json = json.dumps(report)

        def fake_run(cmd, **kwargs):
            # cmd is now a string (shell=True on Windows); parse --output-path=<path>
            import re

            m = re.search(r'--output-path="?([^"\s]+)"?', cmd)
            if m:
                out_path = m.group(1)
                with open(out_path, "w", encoding="utf-8") as f:
                    f.write(report_json)
            proc = MagicMock()
            proc.returncode = 0
            proc.stderr = ""
            return proc

        with patch("subprocess.run", side_effect=fake_run):
            result = run_lighthouse("https://example.com")

        assert result.error is None
        assert result.lcp_ms == 1500.0
        assert result.performance_score == 95.0

    def test_timeout_returns_error(self):
        """subprocess.TimeoutExpired → result.error contains timeout message."""
        with patch("subprocess.run", side_effect=subprocess.TimeoutExpired(cmd=[], timeout=120)):
            result = run_lighthouse("https://slow.example.com", timeout=120)

        assert result.error is not None
        assert "timed out" in result.error.lower()

    def test_lighthouse_not_found_returns_error(self):
        """FileNotFoundError (npx not on PATH) → descriptive error message."""
        with patch("subprocess.run", side_effect=FileNotFoundError):
            result = run_lighthouse("https://example.com")

        assert result.error is not None
        assert "lighthouse" in result.error.lower() or "node" in result.error.lower()

    def test_empty_output_file_returns_error(self, tmp_path):
        """Lighthouse produces an empty file → error is reported."""

        def fake_run_empty(cmd, **kwargs):
            for arg in cmd:
                if arg.startswith("--output-path="):
                    out_path = arg.split("=", 1)[1]
                    # Write empty file
                    open(out_path, "w").close()
                    break
            proc = MagicMock()
            proc.returncode = 1
            proc.stderr = "crash"
            return proc

        with patch("subprocess.run", side_effect=fake_run_empty):
            result = run_lighthouse("https://example.com")

        assert result.error is not None


class TestLighthouseResultDataclass:
    def test_to_dict_returns_correct_keys(self):
        result = LighthouseResult(
            lcp_ms=2500.0,
            performance_score=75.0,
            raw_url="https://example.com",
        )
        d = result.to_dict()
        assert "lcp_ms" in d
        assert "performance_score" in d
        assert "error" in d

    def test_to_dict_is_json_serializable(self):
        import json

        result = LighthouseResult(lcp_ms=2500.0, performance_score=75.0)
        json_str = json.dumps(result.to_dict(), default=str)
        assert "lcp_ms" in json_str
