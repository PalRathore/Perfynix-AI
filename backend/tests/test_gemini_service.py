"""
Unit tests for Checkpoint 3.5 — Gemini LLM Service & Fallback Engine.
🟡 SUPERVISOR validates Checkpoint 3.5 with these tests.
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

from backend.app.services.llm.gemini_service import LLMRemediationResult, gemini_service


def test_fallback_remediation_cwe_89():
    """Verify fallback engine generates remediation for SQL Injection (CWE-89)."""
    with patch.object(gemini_service, "model", None):
        res = gemini_service.generate_remediation(
            finding_title="SQL Injection Detected",
            cwe_id="CWE-89",
            priority_label="CRITICAL",
        )
    assert isinstance(res, LLMRemediationResult)
    assert res.cwe_id == "CWE-89"
    assert res.priority_label == "CRITICAL"
    assert "SQL Injection" in res.summary
    assert "Parameterized Queries" in res.remediation_steps
    assert res.source == "template-fallback"


def test_fallback_remediation_cwe_693():
    """Verify fallback engine generates remediation for Missing CSP (CWE-693)."""
    with patch.object(gemini_service, "model", None):
        res = gemini_service.generate_remediation(
            finding_title="Missing Content-Security-Policy",
            cwe_id="CWE-693",
            priority_label="HIGH",
        )
    assert res.cwe_id == "CWE-693"
    assert "Content-Security-Policy" in res.summary
    assert "Nginx Config" in res.code_example


def test_fallback_remediation_generic():
    """Verify fallback engine handles unlisted CWE gracefully."""
    with patch.object(gemini_service, "model", None):
        res = gemini_service.generate_remediation(
            finding_title="Unlisted Vulnerability",
            cwe_id="CWE-9999",
            priority_label="MEDIUM",
        )
    assert res.cwe_id == "CWE-9999"
    assert res.summary is not None
    assert res.remediation_steps is not None


def test_gemini_llm_api_call_mocked():
    """Verify Gemini LLM path when model returns valid response."""
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "1. Executive Summary: Test\n2. Impact: High\n3. Remediation: Fix code"
    mock_model.generate_content.return_value = mock_response

    with patch.object(gemini_service, "model", mock_model):
        res = gemini_service.generate_remediation(
            finding_title="Mocked Test Finding",
            cwe_id="CWE-89",
            priority_label="HIGH",
        )
    assert res.source == "gemini-llm"
    assert "Executive Summary" in res.remediation_steps
