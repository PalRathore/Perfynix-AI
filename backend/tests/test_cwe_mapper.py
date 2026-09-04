"""
Unit tests for Checkpoint 3.2 — CWE Mapper & Threat Index Lookup.
🟡 SUPERVISOR validates Checkpoint 3.2 with these tests.
"""

from __future__ import annotations

from backend.app.services.intelligence.cwe_mapper import map_finding_to_cwe
from backend.app.services.intelligence.threat_index_lookup import ThreatIntelMetrics, threat_lookup


def test_map_finding_with_provided_cwe():
    """Explicit scanner CWE strings should be formatted cleanly."""
    assert map_finding_to_cwe("Some Alert", "CWE-89") == "CWE-89"
    assert map_finding_to_cwe("Some Alert", "79") == "CWE-79"
    assert map_finding_to_cwe("Some Alert", "cwe-319") == "CWE-319"


def test_map_finding_by_alert_keyword():
    """Keyword mapping should match common alert strings."""
    assert map_finding_to_cwe("SQL Injection Alert") == "CWE-89"
    assert map_finding_to_cwe("Missing Content-Security-Policy header") == "CWE-693"
    assert map_finding_to_cwe("Strict-Transport-Security Header Not Set") == "CWE-319"
    assert map_finding_to_cwe("Clickjacking vulnerability") == "CWE-1021"
    assert map_finding_to_cwe("Weak TLS Version negotiated") == "CWE-326"


def test_map_finding_fallback():
    """Unknown alert without CWE defaults to CWE-200."""
    assert map_finding_to_cwe("Unknown Weird Alert Name") == "CWE-200"


def test_threat_lookup_known_cwe():
    """Lookup known CWE-89 returns enriched threat vector."""
    metrics = threat_lookup.lookup("CWE-89")
    assert isinstance(metrics, ThreatIntelMetrics)
    assert metrics.cwe_id == "CWE-89"
    assert metrics.cvss_score >= 7.0
    vec = metrics.to_list()
    assert len(vec) == 15  # Exactly 15-D vector required by LightGBM model


def test_threat_lookup_unindexed_cwe():
    """Lookup unindexed CWE returns valid baseline defaults without error."""
    metrics = threat_lookup.lookup("CWE-9999")
    assert metrics.cwe_id == "CWE-9999"
    assert metrics.cvss_score == 5.0
    vec = metrics.to_list()
    assert len(vec) == 15
