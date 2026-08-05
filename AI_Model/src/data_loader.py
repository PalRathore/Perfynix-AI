"""Load and parse raw NVD, EPSS, and CISA KEV datasets into pandas DataFrames."""

import json
import logging
from pathlib import Path

import pandas as pd

from .config import KEV_FILE, RAW_DIR

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def get_nvd_files() -> list[Path]:
    """Find all unique NVD JSON files in the raw dataset directory."""
    files = list(RAW_DIR.rglob("nvdcve-2.0-*.json"))
    # Filter out directories and keep unique absolute file paths
    unique_files = sorted({f.resolve() for f in files if f.is_file()})
    logger.info("Found %d NVD feed files", len(unique_files))
    return unique_files


def get_epss_file() -> Path:
    """Find EPSS CSV file."""
    epss_files = list(RAW_DIR.rglob("epss_scores-*.csv"))
    if not epss_files:
        raise FileNotFoundError("EPSS CSV file not found in dataset directory")
    return min({f.resolve() for f in epss_files if f.is_file()})


def extract_nvd_record(item: dict) -> dict | None:
    """Extract a single CVE record with CVSS v3.x metrics and metadata.

    Args:
        item: Single CVE dictionary item from NVD JSON.

    Returns:
        Extracted feature dictionary or None if record lacks CVSS v3 metrics.
    """
    try:
        cve = item.get("cve", {})
        cve_id = cve.get("id", "")
        if not cve_id:
            return None

        published = cve.get("published", "")
        modified = cve.get("lastModified", "")
        metrics = cve.get("metrics", {})

        # Extract CWE ID
        weaknesses = cve.get("weaknesses", [])
        cwe_id = "NVD-CWE-Other"
        for w in weaknesses:
            for desc in w.get("description", []):
                val = desc.get("value", "")
                if val.startswith("CWE-"):
                    cwe_id = val
                    break

        # Extract CVSS v3.1 or v3.0 metrics
        cvss_data = None
        if "cvssMetricV31" in metrics:
            cvss_data = metrics["cvssMetricV31"][0]["cvssData"]
        elif "cvssMetricV30" in metrics:
            cvss_data = metrics["cvssMetricV30"][0]["cvssData"]

        if cvss_data is None:
            return None  # Exclude CVEs without CVSS v3 metrics

        return {
            "cve_id": cve_id,
            "cvss_score": float(cvss_data.get("baseScore", 0.0)),
            "attack_vector": str(cvss_data.get("attackVector", "NETWORK")).upper(),
            "attack_complexity": str(cvss_data.get("attackComplexity", "LOW")).upper(),
            "privileges_required": str(
                cvss_data.get("privilegesRequired", "NONE")
            ).upper(),
            "user_interaction": str(cvss_data.get("userInteraction", "NONE")).upper(),
            "confidentiality_impact": str(
                cvss_data.get("confidentialityImpact", "NONE")
            ).upper(),
            "integrity_impact": str(cvss_data.get("integrityImpact", "NONE")).upper(),
            "availability_impact": str(
                cvss_data.get("availabilityImpact", "NONE")
            ).upper(),
            "cwe_id": cwe_id,
            "published_date": published,
            "modified_date": modified,
        }
    except (KeyError, IndexError, TypeError, ValueError) as e:
        logger.debug(
            "Skipping malformed CVE record (%s): %s", item.get("cve", {}).get("id"), e
        )
        return None


def load_all_nvd() -> pd.DataFrame:
    """Load all NVD JSON files and compile into a pandas DataFrame.

    Returns:
        DataFrame containing all extracted NVD records.
    """
    nvd_files = get_nvd_files()
    all_records = []
    for file_path in nvd_files:
        logger.info(
            "Parsing NVD file: %s (%.1f MB)",
            file_path.name,
            file_path.stat().st_size / 1e6,
        )
        with open(file_path, encoding="utf-8") as f:
            data = json.load(f)

        vulnerabilities = data.get("vulnerabilities", [])
        parsed_count = 0
        for item in vulnerabilities:
            record = extract_nvd_record(item)
            if record is not None:
                all_records.append(record)
                parsed_count += 1
        logger.info(
            "Extracted %d valid CVSS v3 records from %s", parsed_count, file_path.name
        )

    df = pd.DataFrame(all_records)
    logger.info("Total loaded NVD records across all files: %d", len(df))
    return df


def load_epss() -> pd.DataFrame:
    """Load EPSS CSV dataset and extract cve_id, epss_score, percentile.

    Returns:
        DataFrame with columns: cve_id, epss_score, epss_percentile.
    """
    epss_path = get_epss_file()
    logger.info("Loading EPSS file: %s", epss_path.name)
    df = pd.read_csv(epss_path, comment="#")
    df = df.rename(
        columns={"cve": "cve_id", "epss": "epss_score", "percentile": "epss_percentile"}
    )
    df["epss_score"] = pd.to_numeric(df["epss_score"], errors="coerce").fillna(0.0001)
    df = df[["cve_id", "epss_score", "epss_percentile"]]
    logger.info("Loaded %d EPSS records", len(df))
    return df


def load_kev() -> pd.DataFrame:
    """Load CISA Known Exploited Vulnerabilities catalog.

    Returns:
        DataFrame with columns: cve_id, kev_status, kev_vendor.
    """
    logger.info("Loading CISA KEV file: %s", KEV_FILE.name)
    df = pd.read_csv(KEV_FILE)
    cve_col = next(c for c in df.columns if "cve" in c.lower())
    df = df.rename(columns={cve_col: "cve_id"})
    df["kev_status"] = 1

    vendor_col = [c for c in df.columns if "vendor" in c.lower()]
    if vendor_col:
        df = df.rename(columns={vendor_col[0]: "kev_vendor"})
        df = df[["cve_id", "kev_status", "kev_vendor"]]
    else:
        df["kev_vendor"] = "Unknown"
        df = df[["cve_id", "kev_status", "kev_vendor"]]

    logger.info("Loaded %d CISA KEV records", len(df))
    return df
