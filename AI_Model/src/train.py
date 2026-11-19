"""Machine Learning model training module for 6 multi-class classifiers."""

import logging
import shutil

import joblib
import pandas as pd
import xgboost as xgb
from lightgbm import LGBMClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier

from .config import MODELS_DIR, PROCESSED_DIR

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def train_models(
    X_train: pd.DataFrame | None = None,
    y_train: pd.Series | None = None,
) -> dict[str, object]:
    """Train 6 models on preprocessed training features.

    Args:
        X_train: Training feature matrix. If None, loads from X_train.csv.
        y_train: Training target labels. If None, loads from y_train.csv.

    Returns:
        Dictionary mapping model names to trained model instances.
    """
    if X_train is None or y_train is None:
        x_path = PROCESSED_DIR / "X_train.csv"
        y_path = PROCESSED_DIR / "y_train.csv"
        logger.info("Loading training datasets from: %s and %s", x_path, y_path)
        X_train = pd.read_csv(x_path)
        y_train = pd.read_csv(y_path).squeeze("columns")

    logger.info(
        "Starting 6-model training on %d samples with %d features...",
        len(X_train),
        X_train.shape[1],
    )

    models = {}

    # 1. Naive Bayes (Weak Probabilistic Baseline)
    logger.info("Training Naive Bayes (GaussianNB)...")
    nb_model = GaussianNB()
    nb_model.fit(X_train, y_train)
    models["naive_bayes"] = nb_model
    logger.info("Naive Bayes training completed.")

    # 2. Logistic Regression (Linear Boundary Baseline)
    logger.info("Training Logistic Regression (max_iter=1000)...")
    lr_model = LogisticRegression(max_iter=1000, random_state=42, n_jobs=-1)
    lr_model.fit(X_train, y_train)
    models["logistic_regression"] = lr_model
    logger.info("Logistic Regression training completed.")

    # 3. Decision Tree (Single Non-Linear Tree Baseline)
    logger.info("Training Decision Tree (max_depth=10)...")
    dt_model = DecisionTreeClassifier(max_depth=10, random_state=42)
    dt_model.fit(X_train, y_train)
    models["decision_tree"] = dt_model
    logger.info("Decision Tree training completed.")

    # 4. Random Forest Classifier (Ensemble Bagging)
    logger.info("Training Random Forest Classifier (n_estimators=200, max_depth=15)...")
    rf_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1,
        class_weight="balanced_subsample",
    )
    rf_model.fit(X_train, y_train)
    models["random_forest"] = rf_model
    logger.info("Random Forest training completed.")

    # 5. XGBoost Classifier (Ensemble Boosting)
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
    models["xgboost"] = xgb_model
    logger.info("XGBoost training completed.")

    # 6. LightGBM Classifier (Leaf-Wise Boosting Winner)
    logger.info("Training LightGBM Classifier (n_estimators=200)...")
    lgbm_model = LGBMClassifier(
        n_estimators=200,
        max_depth=8,
        learning_rate=0.1,
        random_state=42,
        n_jobs=-1,
        verbose=-1,
    )
    lgbm_model.fit(X_train, y_train)
    models["lightgbm"] = lgbm_model
    logger.info("LightGBM training completed.")

    # Save model artifacts
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    filename_map = {
        "naive_bayes": "naive_bayes_v1.pkl",
        "logistic_regression": "logistic_regression_v1.pkl",
        "decision_tree": "decision_tree_v1.pkl",
        "random_forest": "random_forest_v1.pkl",
        "xgboost": "xgboost_v1.pkl",
        "lightgbm": "lightgbm_v1.pkl",
    }

    for name, model_obj in models.items():
        path = MODELS_DIR / filename_map[name]
        joblib.dump(model_obj, path)
        logger.info("Saved %s to %s (%.1f MB)", name, path.name, path.stat().st_size / 1e6)

    # Save LightGBM as best_model.pkl for deployment
    best_path = MODELS_DIR / "best_model.pkl"
    shutil.copy(MODELS_DIR / "lightgbm_v1.pkl", best_path)
    logger.info(
        "Copied lightgbm_v1.pkl -> best_model.pkl for deployment (%.1f MB)",
        best_path.stat().st_size / 1e6,
    )

    return models


if __name__ == "__main__":
    train_models()
