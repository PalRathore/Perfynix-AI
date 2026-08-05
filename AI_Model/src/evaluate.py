"""Model evaluation module for Random Forest and XGBoost classifiers.

Generates 4x4 multi-class confusion matrices, ROC curves, and metrics comparison tables.
"""

import logging

import joblib
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    auc,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_curve,
)
from sklearn.preprocessing import label_binarize

from .config import MODELS_DIR, PROCESSED_DIR, RESULTS_DIR

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Set plot style
sns.set_theme(style="whitegrid")
plt.rcParams.update({"font.family": "sans-serif", "font.size": 10})


def evaluate_models(
    X_test: pd.DataFrame | None = None,
    y_test: pd.Series | None = None,
) -> pd.DataFrame:
    """Evaluate Random Forest and XGBoost models on holdout test set (27,957 samples).

    Args:
        X_test: Test features. If None, loads from X_test.csv.
        y_test: Test labels. If None, loads from y_test.csv.

    Returns:
        DataFrame containing metrics comparison table.
    """
    if X_test is None or y_test is None:
        x_path = PROCESSED_DIR / "X_test.csv"
        y_path = PROCESSED_DIR / "y_test.csv"
        logger.info("Loading test datasets from: %s and %s", x_path, y_path)
        X_test = pd.read_csv(x_path)
        y_test = pd.read_csv(y_path).squeeze("columns")

    # Load serialized models
    rf_path = MODELS_DIR / "random_forest_v1.pkl"
    xgb_path = MODELS_DIR / "xgboost_v1.pkl"
    logger.info("Loading trained models...")
    rf_model = joblib.load(rf_path)
    xgb_model = joblib.load(xgb_path)

    class_names = ["LOW (0)", "MEDIUM (1)", "HIGH (2)", "CRITICAL (3)"]
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    metrics_list = []

    for name, model in [("Random Forest", rf_model), ("XGBoost", xgb_model)]:
        y_pred = model.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
        rec = recall_score(y_test, y_pred, average="macro", zero_division=0)
        f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)

        report = classification_report(y_test, y_pred, target_names=class_names, zero_division=0)
        logger.info("=== %s Test Results ===", name)
        logger.info("  Accuracy:  %.4f", acc)
        logger.info("  Precision: %.4f", prec)
        logger.info("  Recall:    %.4f", rec)
        logger.info("  F1-Score:  %.4f", f1)
        logger.info("\nClassification Report:\n%s", report)

        metrics_list.append(
            {
                "model": name,
                "accuracy": round(acc, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "f1_score": round(f1, 4),
            }
        )

        # Generate 4x4 Confusion Matrix Heatmap
        cm = confusion_matrix(y_test, y_pred)
        fig, ax = plt.subplots(figsize=(7, 6))
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=class_names, yticklabels=class_names, ax=ax)
        ax.set_title(f"{name} — 4x4 Multi-Class Confusion Matrix", fontsize=12, fontweight="bold")
        ax.set_xlabel("Predicted Priority Class")
        ax.set_ylabel("Actual Priority Class")
        plt.tight_layout()

        filename = "confusion_matrix_rf.png" if name == "Random Forest" else "confusion_matrix_xgb.png"
        fig.savefig(RESULTS_DIR / filename, dpi=300)
        plt.close(fig)

    # Save metrics comparison table
    metrics_df = pd.DataFrame(metrics_list)
    metrics_csv = RESULTS_DIR / "metrics_comparison.csv"
    metrics_df.to_csv(metrics_csv, index=False)
    logger.info("Saved metrics comparison table to: %s", metrics_csv)

    # Multi-class ROC Curve Plot for Random Forest
    y_test_bin = label_binarize(y_test, classes=[0, 1, 2, 3])
    y_score_rf = rf_model.predict_proba(X_test)

    fig, ax = plt.subplots(figsize=(8, 6))
    colors = ["green", "blue", "orange", "red"]
    for i, color in zip(range(4), colors):
        fpr, tpr, _ = roc_curve(y_test_bin[:, i], y_score_rf[:, i])
        roc_auc = auc(fpr, tpr)
        ax.plot(fpr, tpr, color=color, lw=2, label=f"Class {class_names[i]} (AUC = {roc_auc:.3f})")

    ax.plot([0, 1], [0, 1], "k--", lw=1.5)
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.set_title("Multi-Class ROC Curves (Random Forest)", fontsize=12, fontweight="bold")
    ax.legend(loc="lower right")
    plt.tight_layout()
    fig.savefig(RESULTS_DIR / "roc_curves.png", dpi=300)
    plt.close(fig)

    return metrics_df


if __name__ == "__main__":
    evaluate_models()
