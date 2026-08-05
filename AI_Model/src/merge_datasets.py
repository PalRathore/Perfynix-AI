"""Merge NVD, EPSS, and CISA KEV datasets on cve_id."""

import logging

import pandas as pd

from .config import MERGED_DIR
from .data_loader import load_all_nvd, load_epss, load_kev

logger = logging.getLogger(__name__)


def merge_all_datasets() -> pd.DataFrame:
    """Merge NVD + EPSS + KEV into a single pandas DataFrame and save to disk.

    Returns:
        DataFrame containing merged dataset records.
    """
    logger.info("Starting dataset merge pipeline...")
    nvd_df = load_all_nvd()
    epss_df = load_epss()
    kev_df = load_kev()

    # Step 1: Deduplicate NVD records by cve_id, keeping the latest modified record
    logger.info("Deduplicating NVD dataset (%d rows initial)...", len(nvd_df))
    nvd_df = nvd_df.sort_values(by="modified_date", ascending=False)
    nvd_df = nvd_df.drop_duplicates(subset="cve_id", keep="first")
    logger.info("NVD dataset after deduplication: %d rows", len(nvd_df))

    # Step 2: Left join NVD with EPSS on cve_id
    merged = nvd_df.merge(epss_df, on="cve_id", how="left")
    logger.info("Merged with EPSS (%d rows)", len(merged))

    # Step 3: Left join with KEV on cve_id
    merged = merged.merge(kev_df[["cve_id", "kev_status", "kev_vendor"]], on="cve_id", how="left")
    logger.info("Merged with CISA KEV (%d rows)", len(merged))

    # Step 4: Handle missing values
    merged["epss_score"] = merged["epss_score"].fillna(0.0001)
    merged["epss_percentile"] = merged["epss_percentile"].fillna(0.0)
    merged["kev_status"] = merged["kev_status"].fillna(0).astype(int)
    merged["kev_vendor"] = merged["kev_vendor"].fillna("Unknown")

    logger.info("Final merged dataset: %d rows, %d columns", len(merged), len(merged.columns))

    # Save to disk
    MERGED_DIR.mkdir(parents=True, exist_ok=True)
    output_path = MERGED_DIR / "merged_dataset.csv"
    merged.to_csv(output_path, index=False)
    logger.info(
        "Successfully saved merged dataset to: %s (%.1f MB)",
        output_path,
        output_path.stat().st_size / 1e6,
    )
    return merged


if __name__ == "__main__":
    merge_all_datasets()
