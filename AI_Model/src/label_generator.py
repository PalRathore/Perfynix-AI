"""Multi-indicator target label generation and train/test dataset splitting module."""

import logging

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

from .config import PROCESSED_DIR, TARGET_COLUMN, TRAINING_FEATURES

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def generate_labels(df: pd.DataFrame) -> pd.Series:
    """Apply multi-indicator rule matrix to synthesize ground-truth priority labels.

    Rule Criteria:
        CRITICAL (3): KEV==1 OR CVSS>=9.0 OR (CVSS>=8.0 AND EPSS>=0.70)
        HIGH     (2): (7.0<=CVSS<9.0) AND EPSS>=0.30 AND KEV==0
        MEDIUM   (1): (4.0<=CVSS<7.0) AND EPSS<0.30 AND KEV==0
        LOW      (0): CVSS<4.0 AND EPSS<0.10 AND KEV==0

    Args:
        df: DataFrame containing cvss_score, epss_score, kev_status.

    Returns:
        Series of integer labels (0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL).
    """
    conditions = [
        (df["kev_status"] == 1) | (df["cvss_score"] >= 9.0) | ((df["cvss_score"] >= 8.0) & (df["epss_score"] >= 0.70)),
        (df["cvss_score"] >= 7.0) & (df["cvss_score"] < 9.0) & (df["epss_score"] >= 0.30) & (df["kev_status"] == 0),
        (df["cvss_score"] >= 4.0) & (df["cvss_score"] < 7.0) & (df["epss_score"] < 0.30) & (df["kev_status"] == 0),
        (df["cvss_score"] < 4.0) & (df["epss_score"] < 0.10) & (df["kev_status"] == 0),
    ]
    choices = [3, 2, 1, 0]  # CRITICAL, HIGH, MEDIUM, LOW

    # Default to 1 (MEDIUM) for any edge cases not matching explicit rules
    labels = np.select(conditions, choices, default=1)
    return pd.Series(labels, name=TARGET_COLUMN, index=df.index).astype(int)


def process_and_split_labels(df: pd.DataFrame | None = None) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
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

    logger.info("Generating target labels for %d records...", len(df))
    df[TARGET_COLUMN] = generate_labels(df)

    label_counts = df[TARGET_COLUMN].value_counts().sort_index()
    logger.info("Target label distribution:")
    label_names = {0: "LOW", 1: "MEDIUM", 2: "HIGH", 3: "CRITICAL"}
    for code, count in label_counts.items():
        logger.info(
            "  Class %d (%s): %d (%.2f%%)", code, label_names.get(code, "UNKNOWN"), count, count / len(df) * 100
        )

    # Save complete dataset with labels
    df.to_csv(PROCESSED_DIR / "final_features_with_labels.csv", index=False)

    # Perform 80/20 Stratified Train/Test Split
    X = df[TRAINING_FEATURES]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)

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
