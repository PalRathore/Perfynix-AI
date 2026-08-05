"""Unit tests for build_threat_index module."""

import pandas as pd

from AI_Model.src.build_threat_index import build_cwe_threat_index


def test_build_cwe_threat_index_mock():
    """Test CWE threat index computation with mock data."""
    mock_df = pd.DataFrame(
        [
            {"cwe_id": "CWE-89", "cvss_score": 9.8, "epss_score": 0.90, "kev_status": 1},
            {"cwe_id": "CWE-89", "cvss_score": 8.1, "epss_score": 0.38, "kev_status": 0},
            {"cwe_id": "CWE-79", "cvss_score": 6.1, "epss_score": 0.12, "kev_status": 0},
        ]
    )

    index = build_cwe_threat_index(mock_df)

    assert "CWE-89" in index
    assert "CWE-79" in index
    assert index["CWE-89"]["cve_count"] == 2
    assert index["CWE-89"]["kev_count"] == 1
    assert index["CWE-89"]["kev_rate"] == 0.5
    assert index["CWE-89"]["avg_cvss"] == 8.95
    assert 0.0 <= index["CWE-89"]["composite_risk_weight"] <= 1.0
