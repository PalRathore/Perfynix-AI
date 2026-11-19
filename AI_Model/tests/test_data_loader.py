"""Unit tests for data_loader module."""

from pathlib import Path

from AI_Model.src.data_loader import (
    extract_nvd_record,
    get_epss_file,
    get_nvd_files,
    load_epss,
    load_kev,
)


def test_get_nvd_files_exist():
    """Verify NVD files are located in dataset directory."""
    files = get_nvd_files()
    assert len(files) >= 1
    for f in files:
        assert isinstance(f, Path)
        assert f.exists()


def test_get_epss_file_exists():
    """Verify EPSS file exists."""
    epss_file = get_epss_file()
    assert isinstance(epss_file, Path)
    assert epss_file.exists()


def test_extract_nvd_record_valid():
    """Test extracting features from a mock valid NVD item."""
    mock_item = {
        "cve": {
            "id": "CVE-2021-44228",
            "published": "2021-12-10T10:15:00.000",
            "lastModified": "2021-12-14T20:15:00.000",
            "weaknesses": [{"description": [{"lang": "en", "value": "CWE-502"}]}],
            "metrics": {
                "cvssMetricV31": [
                    {
                        "cvssData": {
                            "baseScore": 10.0,
                            "attackVector": "NETWORK",
                            "attackComplexity": "LOW",
                            "privilegesRequired": "NONE",
                            "userInteraction": "NONE",
                            "confidentialityImpact": "HIGH",
                            "integrityImpact": "HIGH",
                            "availabilityImpact": "HIGH",
                        }
                    }
                ]
            },
        }
    }
    record = extract_nvd_record(mock_item)
    assert record is not None
    assert record["cve_id"] == "CVE-2021-44228"
    assert record["cvss_score"] == 10.0
    assert record["cwe_id"] == "CWE-502"
    assert record["attack_vector"] == "NETWORK"


def test_extract_nvd_record_no_cvss():
    """Test that records without CVSS v3 return None."""
    mock_item = {
        "cve": {
            "id": "CVE-2020-0001",
            "metrics": {},
        }
    }
    record = extract_nvd_record(mock_item)
    assert record is None


def test_load_epss_sample():
    """Test loading EPSS returns correct columns and types."""
    df = load_epss()
    assert "cve_id" in df.columns
    assert "epss_score" in df.columns
    assert "epss_percentile" in df.columns
    assert len(df) > 1000


def test_load_kev_sample():
    """Test loading CISA KEV returns correct columns."""
    df = load_kev()
    assert "cve_id" in df.columns
    assert "kev_status" in df.columns
    assert set(df["kev_status"].unique()) == {1}
    assert len(df) > 100
