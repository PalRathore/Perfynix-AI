"""Exploratory Data Analysis (EDA) module.

Generates publication-quality charts and figures for the IEEE/Springer conference paper.
"""

import logging

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

from .config import PROCESSED_DIR, RESULTS_DIR, TARGET_COLUMN, TRAINING_FEATURES

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Set publication style
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams.update({"font.family": "sans-serif", "font.size": 10})


def generate_eda_figures(df: pd.DataFrame | None = None) -> list[str]:
    """Generate and save publication-ready EDA plots to AI_Model/results/.

    Args:
        df: Optional input DataFrame. If None, loads from final_features_with_labels.csv.

    Returns:
        List of generated figure file paths.
    """
    if df is None:
        data_path = PROCESSED_DIR / "final_features_with_labels.csv"
        logger.info("Loading labeled dataset from: %s", data_path)
        df = pd.read_csv(data_path)

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    generated_files = []

    # Figure 1: CVSS Score Distribution
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.histplot(df["cvss_score"], kde=True, bins=20, color="#1f77b4", ax=ax)
    ax.set_title("Distribution of CVSS Base Scores (NVD 2023-2026)", fontsize=12, fontweight="bold")
    ax.set_xlabel("CVSS v3 Base Score (0.0 - 10.0)")
    ax.set_ylabel("Vulnerability Count")
    plt.tight_layout()
    p1 = str(RESULTS_DIR / "cvss_distribution.png")
    fig.savefig(p1, dpi=300)
    plt.close(fig)
    generated_files.append(p1)

    # Figure 2: EPSS Exploit Probability Distribution
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.histplot(df["epss_score"], kde=True, bins=30, color="#ff7f0e", log_scale=(False, True), ax=ax)
    ax.set_title("Distribution of EPSS Exploit Probabilities (Log Scale)", fontsize=12, fontweight="bold")
    ax.set_xlabel("EPSS Score (0.0 - 1.0)")
    ax.set_ylabel("Vulnerability Count (Log Scale)")
    plt.tight_layout()
    p2 = str(RESULTS_DIR / "epss_distribution.png")
    fig.savefig(p2, dpi=300)
    plt.close(fig)
    generated_files.append(p2)

    # Figure 3: Class Balance Bar Plot
    fig, ax = plt.subplots(figsize=(8, 5))
    label_map = {0: "LOW (0)", 1: "MEDIUM (1)", 2: "HIGH (2)", 3: "CRITICAL (3)"}
    class_counts = df[TARGET_COLUMN].value_counts().rename(index=label_map).sort_index()
    palette = ["#2ca02c", "#1f77b4", "#ff7f0e", "#d62728"]

    bars = ax.bar(class_counts.index, class_counts.values, color=palette, edgecolor="black", linewidth=0.8)
    ax.set_title("Target Label Distribution (Remediation Priority)", fontsize=12, fontweight="bold")
    ax.set_xlabel("Priority Class")
    ax.set_ylabel("Count")

    # Add count annotations on bars
    for bar in bars:
        height = bar.get_height()
        ax.annotate(
            f"{height:,} ({height / len(df) * 100:.1f}%)",
            xy=(bar.get_x() + bar.get_width() / 2, height),
            xytext=(0, 3),
            textcoords="offset points",
            ha="center",
            va="bottom",
            fontsize=9,
            fontweight="bold",
        )

    plt.tight_layout()
    p3 = str(RESULTS_DIR / "class_balance.png")
    fig.savefig(p3, dpi=300)
    plt.close(fig)
    generated_files.append(p3)

    # Figure 4: 15-Feature Correlation Heatmap
    fig, ax = plt.subplots(figsize=(12, 10))
    corr = df[TRAINING_FEATURES].corr()
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", cbar=True, ax=ax, linewidths=0.5, annot_kws={"size": 8})
    ax.set_title("15-Feature Correlation Matrix (Flaw 1 Fix)", fontsize=12, fontweight="bold")
    plt.tight_layout()
    p4 = str(RESULTS_DIR / "correlation_heatmap.png")
    fig.savefig(p4, dpi=300)
    plt.close(fig)
    generated_files.append(p4)

    logger.info("Successfully generated %d publication figures in: %s", len(generated_files), RESULTS_DIR)
    return generated_files


if __name__ == "__main__":
    generate_eda_figures()
