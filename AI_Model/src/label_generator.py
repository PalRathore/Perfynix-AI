"""Multi-indicator target label generation using Data-Driven Continuous Risk Score Index (CRSI)."""

import logging

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

from .config import PROCESSED_DIR, TARGET_COLUMN, TRAINING_FEATURES

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def generate_labels(df: pd.DataFrame) -> pd.Series:
    """Derive ground-truth priority labels purely from real dataset continuous signals.

    Continuous Risk Score Index (CRSI) Formula:
        crsi = 0.40 * (cvss/10) + 0.35 * epss + 0.25 * kev + 0.05 * published_factor

    Calibrated Cutoffs:
        CRITICAL (3): crsi >= 0.45 OR kev_status == 1 OR cvss_score >= 9.0
        HIGH     (2): 0.33 <= crsi < 0.45
        MEDIUM   (1): 0.22 <= crsi < 0.33
        LOW      (0): crsi < 0.22

    Args:
        df: DataFrame containing cvss_score, epss_score, kev_status.

    Returns:
        Series of integer labels (0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL).
    """
    cvss_norm = df["cvss_score"] / 10.0
    epss = df["epss_score"]
    kev = df["kev_status"]

    if "days_since_published" in df.columns:
        published_factor = np.clip(
            1.0 - (df["days_since_published"] / 3650.0), 0.0, 1.0
        )
    else:
        published_factor = 0.5

    crsi = 0.40 * cvss_norm + 0.35 * epss + 0.25 * kev + 0.05 * published_factor

    is_critical = (crsi >= 0.45) | (kev == 1) | (df["cvss_score"] >= 9.0)
    is_high = (~is_critical) & (crsi >= 0.33)
    is_medium = (~is_critical) & (~is_high) & (crsi >= 0.22)
    is_low = (~is_critical) & (~is_high) & (~is_medium)

    conditions = [is_critical, is_high, is_medium, is_low]
    choices = [3, 2, 1, 0]  # CRITICAL, HIGH, MEDIUM, LOW

    labels = np.select(conditions, choices, default=1)
    return pd.Series(labels, name=TARGET_COLUMN, index=df.index).astype(int)


def process_and_split_labels(
    df: pd.DataFrame | None = None,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """Generate target labels and split dataset into 80/20 train/test sets.

    Args:
        df: Optional input DataFrame. If None, loads from final_features.csv.

    Returns:
        Tuple of (X_train, X_test, y_train, y_test).
    """
    if df is None:
        features_path = PROCESSED_DIR / "final_features.csv"
        logger.info("Loading final features from: %s", features_path)
        df = pd.read_csv(features_path)

    logger.info(
        "Generating target labels using Data-Driven CRSI for %d records...", len(df)
    )
    df[TARGET_COLUMN] = generate_labels(df)

    label_counts = df[TARGET_COLUMN].value_counts().sort_index()
    logger.info("Target label distribution:")
    label_names = {0: "LOW", 1: "MEDIUM", 2: "HIGH", 3: "CRITICAL"}
    for code, count in label_counts.items():
        logger.info(
            "  Class %d (%s): %d (%.2f%%)",
            code,
            label_names.get(code, "UNKNOWN"),
            count,
            count / len(df) * 100,
        )

    # Save complete dataset with labels
    df.to_csv(PROCESSED_DIR / "final_features_with_labels.csv", index=False)

    # Perform 80/20 Stratified Train/Test Split
    X = df[TRAINING_FEATURES]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    logger.info("Stratified 80/20 train/test split completed:")
    logger.info("  X_train: %s, y_train: %s", X_train.shape, y_train.shape)
    logger.info("  X_test:  %s, y_test:  %s", X_test.shape, y_test.shape)

    # Save split datasets
    X_train.to_csv(PROCESSED_DIR / "X_train.csv", index=False)
    X_test.to_csv(PROCESSED_DIR / "X_test.csv", index=False)
    y_train.to_csv(PROCESSED_DIR / "y_train.csv", index=False)
    y_test.to_csv(PROCESSED_DIR / "y_test.csv", index=False)

    logger.info("Saved X_train, X_test, y_train, y_test to %s", PROCESSED_DIR)
    return X_train, X_test, y_train, y_test


if __name__ == "__main__":
    process_and_split_labels()
