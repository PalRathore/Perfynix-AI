"""Unit tests for preprocess module."""

import pandas as pd

from AI_Model.src.config import TRAINING_FEATURES
from AI_Model.src.preprocess import preprocess_data


def test_preprocess_data_mock():
    """Test preprocessing and 5 temporal feature generation with mock data."""
    mock_df = pd.DataFrame(
        [
            {
                "cve_id": "CVE-2021-44228",
                "cwe_id": "CWE-502",
                "cvss_score": 10.0,
                "attack_vector": "NETWORK",
                "attack_complexity": "LOW",
                "privileges_required": "NONE",
                "user_interaction": "NONE",
                "confidentiality_impact": "HIGH",
                "integrity_impact": "HIGH",
                "availability_impact": "HIGH",
                "epss_score": 0.9750,
                "kev_status": 1,
                "kev_vendor": "Apache",
                "published_date": "2021-12-10T10:15:00.000",
                "modified_date": "2021-12-14T20:15:00.000",
            },
            {
                "cve_id": "CVE-2023-34362",
                "cwe_id": "CWE-89",
                "cvss_score": 9.8,
                "attack_vector": "NETWORK",
                "attack_complexity": "LOW",
                "privileges_required": "NONE",
                "user_interaction": "NONE",
                "confidentiality_impact": "HIGH",
                "integrity_impact": "HIGH",
                "availability_impact": "HIGH",
                "epss_score": 0.9420,
                "kev_status": 1,
                "kev_vendor": "Progress",
                "published_date": "2023-06-02T10:15:00.000",
                "modified_date": "2023-06-05T20:15:00.000",
            },
        ]
    )

    processed = preprocess_data(mock_df)

    assert len(processed) == 2
    for feat in TRAINING_FEATURES:
        assert feat in processed.columns, f"Feature {feat} missing from output"

    # Verify 5 temporal/contextual features (Flaw 1 Fix)
    assert (processed["days_since_published"] > 0).all()
    assert (processed["days_since_modified"] > 0).all()
    assert (processed["cwe_category_frequency"] >= 1).all()
    assert (processed["vendor_cve_count"] >= 1).all()
    assert "cvss_epss_divergence" in processed.columns

    # Verify ordinal encoding
    assert processed.loc[processed["cve_id"] == "CVE-2021-44228", "attack_vector"].values[0] == 3
    assert processed.loc[processed["cve_id"] == "CVE-2021-44228", "attack_complexity"].values[0] == 1
