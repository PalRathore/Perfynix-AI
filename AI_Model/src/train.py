"""Machine Learning model training module for Random Forest and XGBoost classifiers."""

import logging

import joblib
import pandas as pd
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier

from .config import MODELS_DIR, PROCESSED_DIR

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def train_models(
    X_train: pd.DataFrame | None = None,
    y_train: pd.Series | None = None,
) -> tuple[RandomForestClassifier, xgb.XGBClassifier]:
    """Train Random Forest and XGBoost models on preprocessed training features.

    Args:
        X_train: Training feature matrix. If None, loads from X_train.csv.
        y_train: Training target labels. If None, loads from y_train.csv.

    Returns:
        Tuple of (trained_rf_model, trained_xgb_model).
    """
    if X_train is None or y_train is None:
        x_path = PROCESSED_DIR / "X_train.csv"
        y_path = PROCESSED_DIR / "y_train.csv"
        logger.info("Loading training datasets from: %s and %s", x_path, y_path)
        X_train = pd.read_csv(x_path)
        y_train = pd.read_csv(y_path).squeeze("columns")

    logger.info(
        "Starting model training on %d samples with %d features...",
        len(X_train),
        X_train.shape[1],
    )

    # 1. Train Random Forest Classifier (Primary Model)
    logger.info(
        "Training Random Forest Classifier (n_estimators=200, max_depth=15, n_jobs=-1)..."
    )
    rf_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1,
        class_weight="balanced_subsample",
    )
    rf_model.fit(X_train, y_train)
    logger.info("Random Forest training completed.")

    # 2. Train XGBoost Classifier (Comparison Model)
    logger.info("Training XGBoost Classifier (tree_method='hist')...")
    xgb_model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=8,
        learning_rate=0.1,
        tree_method="hist",
        random_state=42,
        eval_metric="mlogloss",
    )
    xgb_model.fit(X_train, y_train)
    logger.info("XGBoost training completed.")

    # Save model artifacts
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    rf_path = MODELS_DIR / "random_forest_v1.pkl"
    xgb_path = MODELS_DIR / "xgboost_v1.pkl"

    joblib.dump(rf_model, rf_path)
    joblib.dump(xgb_model, xgb_path)

    logger.info(
        "Saved Random Forest model to: %s (%.1f MB)",
        rf_path.name,
        rf_path.stat().st_size / 1e6,
    )
    logger.info(
        "Saved XGBoost model to: %s (%.1f MB)",
        xgb_path.name,
        xgb_path.stat().st_size / 1e6,
    )

    return rf_model, xgb_model


if __name__ == "__main__":
    train_models()
