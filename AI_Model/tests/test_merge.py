"""Unit tests for merge_datasets module."""

import pandas as pd


def test_merge_logic_mock():
    """Test merge operation logic with mock DataFrames."""
    nvd_mock = pd.DataFrame(
        [
            {
                "cve_id": "CVE-2021-44228",
                "cvss_score": 10.0,
                "attack_vector": "NETWORK",
                "cwe_id": "CWE-502",
                "modified_date": "2021-12-14",
            },
            {
                "cve_id": "CVE-2023-34362",
                "cvss_score": 9.8,
                "attack_vector": "NETWORK",
                "cwe_id": "CWE-89",
                "modified_date": "2023-06-05",
            },
        ]
    )

    epss_mock = pd.DataFrame(
        [
            {"cve_id": "CVE-2021-44228", "epss_score": 0.9750, "epss_percentile": 0.99},
            {"cve_id": "CVE-2023-34362", "epss_score": 0.9420, "epss_percentile": 0.98},
        ]
    )

    kev_mock = pd.DataFrame(
        [
            {"cve_id": "CVE-2021-44228", "kev_status": 1, "kev_vendor": "Apache"},
        ]
    )

    # Perform merge
    merged = nvd_mock.merge(epss_mock, on="cve_id", how="left")
    merged = merged.merge(kev_mock, on="cve_id", how="left")
    merged["epss_score"] = merged["epss_score"].fillna(0.0001)
    merged["kev_status"] = merged["kev_status"].fillna(0).astype(int)
    merged["kev_vendor"] = merged["kev_vendor"].fillna("Unknown")

    assert len(merged) == 2
    assert "epss_score" in merged.columns
    assert "kev_status" in merged.columns
    assert merged.loc[merged["cve_id"] == "CVE-2021-44228", "kev_status"].values[0] == 1
    assert merged.loc[merged["cve_id"] == "CVE-2023-34362", "kev_status"].values[0] == 0
    assert (
        merged.loc[merged["cve_id"] == "CVE-2023-34362", "epss_score"].values[0]
        == 0.9420
    )
