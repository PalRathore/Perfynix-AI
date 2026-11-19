"""Model evaluation module for 6 multi-class classifiers.

Generates 4x4 multi-class confusion matrices, ROC curves, accuracy comparison bar plots, and metrics summary tables.
"""

import logging
from pathlib import Path

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
    output_dir: Path | None = None,
) -> pd.DataFrame:
    """Evaluate 6 models on holdout test set (27,957 samples).

    Args:
        X_test: Test features. If None, loads from X_test.csv.
        y_test: Test labels. If None, loads from y_test.csv.
        output_dir: Optional custom output directory (e.g. for mock unit tests). Default is RESULTS_DIR.

    Returns:
        DataFrame containing metrics comparison table.
    """
    if output_dir is None:
        target_dir = RESULTS_DIR
    else:
        target_dir = Path(output_dir)

    target_dir.mkdir(parents=True, exist_ok=True)

    if X_test is None or y_test is None:
        x_path = PROCESSED_DIR / "X_test.csv"
        y_path = PROCESSED_DIR / "y_test.csv"
        logger.info("Loading test datasets from: %s and %s", x_path, y_path)
        X_test = pd.read_csv(x_path)
        y_test = pd.read_csv(y_test_path if (y_test_path := y_path).exists() else y_path).squeeze("columns")

    models_info = [
        ("Naive Bayes", MODELS_DIR / "naive_bayes_v1.pkl"),
        ("Logistic Regression", MODELS_DIR / "logistic_regression_v1.pkl"),
        ("Decision Tree", MODELS_DIR / "decision_tree_v1.pkl"),
        ("Random Forest", MODELS_DIR / "random_forest_v1.pkl"),
        ("XGBoost", MODELS_DIR / "xgboost_v1.pkl"),
        ("LightGBM", MODELS_DIR / "lightgbm_v1.pkl"),
    ]

    class_names = ["LOW (0)", "MEDIUM (1)", "HIGH (2)", "CRITICAL (3)"]
    metrics_list = []
    loaded_models = {}

    for name, pkl_path in models_info:
        if not pkl_path.exists():
            logger.warning("Model file %s not found, skipping evaluation for %s.", pkl_path, name)
            continue

        model = joblib.load(pkl_path)
        loaded_models[name] = model
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

        # Generate Confusion Matrix Heatmap
        cm = confusion_matrix(y_test, y_pred)
        fig, ax = plt.subplots(figsize=(7, 6))
        sns.heatmap(
            cm,
            annot=True,
            fmt="d",
            cmap="Blues",
            xticklabels=class_names,
            yticklabels=class_names,
            ax=ax,
        )
        ax.set_title(f"{name} — 4x4 Multi-Class Confusion Matrix", fontsize=12, fontweight="bold")
        ax.set_xlabel("Predicted Priority Class")
        ax.set_ylabel("Actual Priority Class")
        plt.tight_layout()

        filename = f"confusion_matrix_{name.lower().replace(' ', '_')}.png"
        fig.savefig(target_dir / filename, dpi=300)
        plt.close(fig)

    # Save metrics comparison table
    metrics_df = pd.DataFrame(metrics_list)
    metrics_csv = target_dir / "metrics_summary.csv"
    metrics_df.to_csv(metrics_csv, index=False)
    try:
        metrics_df.to_csv(target_dir / "metrics_comparison.csv", index=False)
    except PermissionError:
        logger.warning("metrics_comparison.csv is locked by another process; saved to metrics_summary.csv")

    logger.info("Saved metrics comparison table to: %s", metrics_csv)

    # Generate 6-Model Accuracy Comparison Bar Plot
    if not metrics_df.empty:
        fig, ax = plt.subplots(figsize=(10, 6))
        colors = ["#7f7f7f", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]
        bars = ax.bar(metrics_df["model"], metrics_df["accuracy"], color=colors[: len(metrics_df)])
        ax.set_ylim([0.0, 1.08])
        ax.set_ylabel("Accuracy", fontsize=12, fontweight="bold")
        ax.set_title("CVE Priority Classification — 6-Model Accuracy Comparison", fontsize=14, fontweight="bold")
        plt.xticks(rotation=15, ha="right")

        for bar in bars:
            height = bar.get_height()
            ax.annotate(
                f"{height:.4f}",
                xy=(bar.get_x() + bar.get_width() / 2, height),
                xytext=(0, 3),
                textcoords="offset points",
                ha="center",
                va="bottom",
                fontweight="bold",
            )

        plt.tight_layout()
        fig.savefig(target_dir / "model_accuracy_comparison.png", dpi=300)
        plt.close(fig)
        logger.info("Saved comparative bar chart to: model_accuracy_comparison.png")

    # Multi-class ROC Curve Plot for Random Forest (if available)
    if "Random Forest" in loaded_models:
        rf_model = loaded_models["Random Forest"]
        y_test_bin = label_binarize(y_test, classes=[0, 1, 2, 3])
        y_score_rf = rf_model.predict_proba(X_test)

        fig, ax = plt.subplots(figsize=(8, 6))
        colors = ["green", "blue", "orange", "red"]
        for i, color in zip(range(4), colors):
            fpr, tpr, _ = roc_curve(y_test_bin[:, i], y_score_rf[:, i])
            roc_auc = auc(fpr, tpr)
            ax.plot(
                fpr,
                tpr,
                color=color,
                lw=2,
                label=f"Class {class_names[i]} (AUC = {roc_auc:.3f})",
            )

        ax.plot([0, 1], [0, 1], "k--", lw=1.5)
        ax.set_xlim([0.0, 1.0])
        ax.set_ylim([0.0, 1.05])
        ax.set_xlabel("False Positive Rate")
        ax.set_ylabel("True Positive Rate")
        ax.set_title("Multi-Class ROC Curves (Random Forest)", fontsize=12, fontweight="bold")
        ax.legend(loc="lower right")
        plt.tight_layout()
        fig.savefig(target_dir / "roc_curves.png", dpi=300)
        plt.close(fig)

    return metrics_df


if __name__ == "__main__":
    evaluate_models()
