"""Pre-compute Threat Intelligence Index lookup table grouped by CWE ID."""

import json
import logging

import pandas as pd

from .config import MERGED_DIR, MODELS_DIR

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def build_cwe_threat_index(df: pd.DataFrame | None = None) -> dict[str, dict]:
    """Build pre-computed CWE Threat Intelligence Index from merged dataset.

    Args:
        df: Optional input DataFrame. If None, loads from merged_dataset.csv.

    Returns:
        Dictionary mapping cwe_id to threat metrics.
    """
    if df is None:
        merged_path = MERGED_DIR / "merged_dataset.csv"
        logger.info("Loading merged dataset from: %s", merged_path)
        df = pd.read_csv(merged_path)

    logger.info("Building Threat Intelligence Index for %d total CVE records...", len(df))

    index_dict = {}
    grouped = df.groupby("cwe_id")

    for cwe_id, group in grouped:
        if not cwe_id or not isinstance(cwe_id, str):
            continue

        cve_count = len(group)
        avg_cvss = float(group["cvss_score"].mean())
        avg_epss = float(group["epss_score"].mean())
        kev_count = int(group["kev_status"].sum())
        kev_rate = float(kev_count / cve_count) if cve_count > 0 else 0.0

        # Normalize CVSS to 0.0-1.0 scale
        cvss_norm = avg_cvss / 10.0

        # Composite Risk Weight formula (0.0 to 1.0)
        composite_risk_weight = float(0.40 * cvss_norm + 0.35 * avg_epss + 0.25 * kev_rate)

        index_dict[cwe_id] = {
            "cwe_id": cwe_id,
            "cve_count": cve_count,
            "avg_cvss": round(avg_cvss, 2),
            "avg_epss": round(avg_epss, 4),
            "kev_count": kev_count,
            "kev_rate": round(kev_rate, 4),
            "composite_risk_weight": round(composite_risk_weight, 4),
        }

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    output_path = MODELS_DIR / "cwe_threat_index.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(index_dict, f, indent=2)

    logger.info("Successfully built Threat Intelligence Index with %d CWE categories: %s", len(index_dict), output_path)
    return index_dict


if __name__ == "__main__":
    build_cwe_threat_index()
