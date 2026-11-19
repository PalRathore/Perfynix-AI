"""Unit tests for generate_eda_plots module."""

from pathlib import Path

import pandas as pd

from AI_Model.src.generate_eda_plots import generate_eda_figures


def test_generate_eda_figures_mock():
    """Test generating EDA figures with mock DataFrame."""
    mock_df = pd.DataFrame(
        [
            {
                "cvss_score": 9.8,
                "epss_score": 0.90,
                "priority_label": 3,
                "attack_vector": 3,
                "attack_complexity": 1,
                "privileges_required": 2,
                "user_interaction": 1,
                "confidentiality_impact": 2,
                "integrity_impact": 2,
                "availability_impact": 2,
                "kev_status": 1,
                "days_since_published": 1000,
                "days_since_modified": 500,
                "cwe_category_frequency": 5000,
                "vendor_cve_count": 50,
                "cvss_epss_divergence": 0.8,
            },
            {
                "cvss_score": 6.1,
                "epss_score": 0.12,
                "priority_label": 1,
                "attack_vector": 3,
                "attack_complexity": 1,
                "privileges_required": 2,
                "user_interaction": 0,
                "confidentiality_impact": 1,
                "integrity_impact": 1,
                "availability_impact": 0,
                "kev_status": 0,
                "days_since_published": 800,
                "days_since_modified": 400,
                "cwe_category_frequency": 12000,
                "vendor_cve_count": 10,
                "cvss_epss_divergence": 4.9,
            },
        ]
    )

    files = generate_eda_figures(mock_df)
    assert len(files) == 4
    for f in files:
        p = Path(f)
        assert p.exists()
        assert p.stat().st_size > 0
