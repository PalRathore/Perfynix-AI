"""SHAP (SHapley Additive exPlanations) Feature Importance and Explainability module."""

import logging

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import shap

from .config import MODELS_DIR, PROCESSED_DIR, RESULTS_DIR, TRAINING_FEATURES

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def generate_shap_analysis(
    sample_size: int = 1000,
    X_test: pd.DataFrame | None = None,
) -> list[str]:
    """Calculate SHAP feature importance for Random Forest and save publication plots.

    Args:
        sample_size: Number of test samples to use for SHAP calculation (default 1000).
        X_test: Test features. If None, loads from X_test.csv.

    Returns:
        List of generated figure file paths.
    """
    if X_test is None:
        x_path = PROCESSED_DIR / "X_test.csv"
        logger.info("Loading test features from: %s", x_path)
        X_test = pd.read_csv(x_path)

    rf_path = MODELS_DIR / "random_forest_v1.pkl"
    logger.info("Loading trained Random Forest model from: %s", rf_path)
    rf_model = joblib.load(rf_path)

    # Sample a subset for SHAP tree explainer speed
    if len(X_test) > sample_size:
        X_sample = X_test.sample(n=sample_size, random_state=42)
    else:
        X_sample = X_test

    logger.info("Computing SHAP values for %d test samples...", len(X_sample))
    explainer = shap.TreeExplainer(rf_model)
    shap_values = explainer.shap_values(X_sample)

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    generated_files = []

    # 1. SHAP Feature Importance Summary Bar Plot
    fig, ax = plt.subplots(figsize=(10, 7))
    if isinstance(shap_values, list):
        shap.summary_plot(
            shap_values,
            X_sample,
            feature_names=TRAINING_FEATURES,
            plot_type="bar",
            show=False,
            class_names=["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        )
    else:
        shap.summary_plot(shap_values, X_sample, feature_names=TRAINING_FEATURES, plot_type="bar", show=False)

    plt.title("SHAP Global Feature Importance (Random Forest)", fontsize=12, fontweight="bold", pad=15)
    plt.tight_layout()
    p1 = str(RESULTS_DIR / "shap_feature_importance.png")
    plt.savefig(p1, dpi=300, bbox_inches="tight")
    plt.close("all")
    generated_files.append(p1)

    # 2. SHAP Beeswarm Summary Plot for Critical Class (Class 3)
    fig, ax = plt.subplots(figsize=(10, 7))
    if isinstance(shap_values, list):
        shap_vals_class = shap_values[3]  # Class 3 (CRITICAL)
    elif len(np.shape(shap_values)) == 3:
        shap_vals_class = shap_values[:, :, 3]
    else:
        shap_vals_class = shap_values

    shap.summary_plot(shap_vals_class, X_sample, feature_names=TRAINING_FEATURES, show=False)
    plt.title("SHAP Feature Impact Summary — CRITICAL Priority Class", fontsize=12, fontweight="bold", pad=15)
    plt.tight_layout()
    p2 = str(RESULTS_DIR / "shap_beeswarm.png")
    plt.savefig(p2, dpi=300, bbox_inches="tight")
    plt.close("all")
    generated_files.append(p2)

    logger.info("Successfully saved SHAP plots to: %s", RESULTS_DIR)
    return generated_files


if __name__ == "__main__":
    generate_shap_analysis()
