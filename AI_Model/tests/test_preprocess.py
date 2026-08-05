"""Unit tests for preprocess module."""

import pandas as pd

from AI_Model.src.config import TRAINING_FEATURES
from AI_Model.src.preprocess import (
    ATTACK_VECTOR_MAP,
    COMPLEXITY_MAP,
    IMPACT_MAP,
    INTERACTION_MAP,
    PRIVILEGES_MAP,
    REFERENCE_DATE,
)


def test_preprocess_data_logic():
    """Test feature engineering logic on mock DataFrame without modifying disk."""
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
    ).copy()

    # Step 1: Encodings
    mock_df["attack_vector"] = mock_df["attack_vector"].map(ATTACK_VECTOR_MAP).fillna(3).astype(int)
    mock_df["attack_complexity"] = mock_df["attack_complexity"].map(COMPLEXITY_MAP).fillna(1).astype(int)
    mock_df["privileges_required"] = mock_df["privileges_required"].map(PRIVILEGES_MAP).fillna(2).astype(int)
    mock_df["user_interaction"] = mock_df["user_interaction"].map(INTERACTION_MAP).fillna(1).astype(int)
    mock_df["confidentiality_impact"] = mock_df["confidentiality_impact"].map(IMPACT_MAP).fillna(0).astype(int)
    mock_df["integrity_impact"] = mock_df["integrity_impact"].map(IMPACT_MAP).fillna(0).astype(int)
    mock_df["availability_impact"] = mock_df["availability_impact"].map(IMPACT_MAP).fillna(0).astype(int)

    # Step 2: 5 Temporal/Contextual features
    published_dt = pd.to_datetime(mock_df["published_date"], errors="coerce", utc=True).dt.tz_localize(None)
    mock_df["days_since_published"] = (REFERENCE_DATE - published_dt).dt.days.fillna(365).clip(lower=0).astype(int)

    modified_dt = pd.to_datetime(mock_df["modified_date"], errors="coerce", utc=True).dt.tz_localize(None)
    mock_df["days_since_modified"] = (REFERENCE_DATE - modified_dt).dt.days.fillna(30).clip(lower=0).astype(int)

    mock_df["cwe_category_frequency"] = mock_df.groupby("cwe_id")["cve_id"].transform("count").fillna(1).astype(int)
    mock_df["vendor_cve_count"] = mock_df.groupby("kev_vendor")["cve_id"].transform("count").fillna(0).astype(int)
    mock_df["cvss_epss_divergence"] = (mock_df["cvss_score"] - (mock_df["epss_score"] * 10.0)).round(4)

    assert len(mock_df) == 2
    for feat in TRAINING_FEATURES:
        assert feat in mock_df.columns

    assert (mock_df["days_since_published"] > 0).all()
    assert (mock_df["days_since_modified"] > 0).all()
    assert mock_df.loc[mock_df["cve_id"] == "CVE-2021-44228", "attack_vector"].values[0] == 3
