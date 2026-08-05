"""Data preprocessing and feature engineering module.

Implements FLAW 1 FIX: Adds 5 temporal/contextual features to break label circularity.
"""

import logging

import pandas as pd

from .config import (
    ATTACK_VECTOR_MAP,
    COMPLEXITY_MAP,
    IMPACT_MAP,
    INTERACTION_MAP,
    MERGED_DIR,
    PRIVILEGES_MAP,
    PROCESSED_DIR,
    TRAINING_FEATURES,
)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Fixed reference date for temporal features
REFERENCE_DATE = pd.Timestamp("2026-08-01")


def preprocess_data(df: pd.DataFrame | None = None) -> pd.DataFrame:
    """Preprocess merged dataset and extract 15 training features.

    Args:
        df: Optional input DataFrame. If None, loads from merged_dataset.csv.

    Returns:
        Processed DataFrame with 15 numerical training features + cve_id + cwe_id.
    """
    if df is None:
        merged_path = MERGED_DIR / "merged_dataset.csv"
        logger.info("Loading merged dataset from: %s", merged_path)
        df = pd.read_csv(merged_path)

    logger.info("Starting feature engineering for %d records...", len(df))
    df = df.copy()

    # Step 1: Ordinal Encoding for Categorical Metrics
    df["attack_vector"] = df["attack_vector"].map(ATTACK_VECTOR_MAP).fillna(3).astype(int)
    df["attack_complexity"] = df["attack_complexity"].map(COMPLEXITY_MAP).fillna(1).astype(int)
    df["privileges_required"] = df["privileges_required"].map(PRIVILEGES_MAP).fillna(2).astype(int)
    df["user_interaction"] = df["user_interaction"].map(INTERACTION_MAP).fillna(1).astype(int)
    df["confidentiality_impact"] = df["confidentiality_impact"].map(IMPACT_MAP).fillna(0).astype(int)
    df["integrity_impact"] = df["integrity_impact"].map(IMPACT_MAP).fillna(0).astype(int)
    df["availability_impact"] = df["availability_impact"].map(IMPACT_MAP).fillna(0).astype(int)

    # Step 2: Compute 5 NEW Temporal/Contextual Features (FLAW 1 FIX)
    logger.info("Computing 5 temporal & contextual features (Flaw 1 Fix)...")

    # Feature 1: Days since published
    published_dt = pd.to_datetime(df["published_date"], errors="coerce", utc=True).dt.tz_localize(None)
    df["days_since_published"] = (REFERENCE_DATE - published_dt).dt.days.fillna(365).clip(lower=0).astype(int)

    # Feature 2: Days since last modified
    modified_dt = pd.to_datetime(df["modified_date"], errors="coerce", utc=True).dt.tz_localize(None)
    df["days_since_modified"] = (REFERENCE_DATE - modified_dt).dt.days.fillna(30).clip(lower=0).astype(int)

    # Feature 3: CWE category frequency
    df["cwe_category_frequency"] = df.groupby("cwe_id")["cve_id"].transform("count").fillna(1).astype(int)

    # Feature 4: Vendor CVE count in KEV
    df["vendor_cve_count"] = df.groupby("kev_vendor")["cve_id"].transform("count").fillna(0).astype(int)

    # Feature 5: CVSS - EPSS divergence (cvss_score - epss_score * 10)
    df["cvss_epss_divergence"] = (df["cvss_score"] - (df["epss_score"] * 10.0)).round(4)

    # Validate all 15 features are present
    missing_cols = [col for col in TRAINING_FEATURES if col not in df.columns]
    if missing_cols:
        raise KeyError(f"Missing required feature columns: {missing_cols}")

    output_cols = ["cve_id", "cwe_id"] + TRAINING_FEATURES
    final_df = df[output_cols].copy()

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    output_path = PROCESSED_DIR / "final_features.csv"
    final_df.to_csv(output_path, index=False)
    logger.info(
        "Successfully saved processed features (%d rows, %d features) to %s (%.1f MB)",
        len(final_df),
        len(TRAINING_FEATURES),
        output_path.name,
        output_path.stat().st_size / 1e6,
    )
    return final_df


if __name__ == "__main__":
    preprocess_data()
