"""
Unit tests for Checkpoint 3.4 — Static Rule Engine for Non-CVE Findings.
🟡 SUPERVISOR validates Checkpoint 3.4 with these tests.
"""

from __future__ import annotations

from backend.app.services.intelligence.rule_engine import (
    RuleEvaluationResult,
    evaluate_non_cve_finding,
)


def test_missing_csp_rule():
    """Missing CSP header evaluates to HIGH priority."""
    finding = {
        "type": "missing_security_header",
        "header": "Content-Security-Policy",
        "cwe_id": "CWE-693",
        "risk": "High",
    }
    res = evaluate_non_cve_finding(finding)
    assert isinstance(res, RuleEvaluationResult)
    assert res.priority_label == "HIGH"
    assert res.priority_code == 2
    assert res.rule_category == "security_header"


def test_missing_referrer_policy_rule():
    """Missing Referrer-Policy evaluates to LOW priority."""
    finding = {
        "type": "missing_security_header",
        "header": "Referrer-Policy",
        "cwe_id": "CWE-200",
        "risk": "Low",
    }
    res = evaluate_non_cve_finding(finding)
    assert res.priority_label == "LOW"
    assert res.priority_code == 0


def test_expired_ssl_cert_rule():
    """Expired SSL certificate evaluates to CRITICAL priority."""
    finding = {
        "type": "certificate_expired",
        "cwe_id": "CWE-298",
        "risk": "Critical",
    }
    res = evaluate_non_cve_finding(finding)
    assert res.priority_label == "CRITICAL"
    assert res.priority_code == 3
    assert res.rule_category == "ssl"


def test_poor_lcp_performance_rule():
    """LCP > 4000ms evaluates to HIGH priority performance finding."""
    finding = {
        "type": "performance_kpi",
        "kpi": "lcp_ms",
        "value": 4500.0,
    }
    res = evaluate_non_cve_finding(finding)
    assert res.priority_label == "HIGH"
    assert res.priority_code == 2
    assert res.rule_category == "performance"
