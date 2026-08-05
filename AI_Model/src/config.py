"""Central configuration for paths, feature names, encoding maps, and constants."""

from pathlib import Path

# === Paths ===
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
DATASET_DIR = ROOT_DIR / "dataset"
RAW_DIR = DATASET_DIR
MERGED_DIR = ROOT_DIR / "AI_Model" / "datasets" / "merged"
PROCESSED_DIR = ROOT_DIR / "AI_Model" / "datasets" / "processed"
MODELS_DIR = ROOT_DIR / "AI_Model" / "models"
RESULTS_DIR = ROOT_DIR / "AI_Model" / "results"

# === NVD JSON Files ===
NVD_FILES = sorted(RAW_DIR.glob("nvdcve-2.0-*.json"))

# === EPSS & KEV Files ===
EPSS_FILE = next(iter(RAW_DIR.glob("epss_scores-*.csv")))
KEV_FILE = RAW_DIR / "known_exploited_vulnerabilities_CISA KEV.csv"

# === 15 Training Features (Flaw 1 Fix: includes 5 temporal/contextual features) ===
TRAINING_FEATURES = [
    # Original 10 NVD/EPSS/KEV features
    "cvss_score",
    "attack_vector",
    "attack_complexity",
    "privileges_required",
    "user_interaction",
    "confidentiality_impact",
    "integrity_impact",
    "availability_impact",
    "epss_score",
    "kev_status",
    # 5 NEW temporal/contextual features (Flaw 1 Fix — breaks label circularity)
    "days_since_published",
    "days_since_modified",
    "cwe_category_frequency",
    "vendor_cve_count",
    "cvss_epss_divergence",
]

# === 3 Runtime Scanner Context Features (Flaw 2 Fix — adds per-alert specificity) ===
RUNTIME_CONTEXT_FEATURES = [
    "scanner_risk_level",  # ZAP risk: High=3, Medium=2, Low=1, Info=0
    "scanner_confidence",  # ZAP confidence: High=3, Medium=2, Low=1, FP=0
    "endpoint_sensitivity",  # Heuristic: auth/admin=3, api=2, public=1, static=0
]

# === Target Label ===
TARGET_COLUMN = "priority_label"
LABEL_MAP = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "CRITICAL": 3}
REVERSE_LABEL_MAP = {0: "LOW", 1: "MEDIUM", 2: "HIGH", 3: "CRITICAL"}

# === Categorical Encoding Maps ===
ATTACK_VECTOR_MAP = {"NETWORK": 3, "ADJACENT_NETWORK": 2, "LOCAL": 1, "PHYSICAL": 0}
COMPLEXITY_MAP = {"LOW": 1, "HIGH": 0}
PRIVILEGES_MAP = {"NONE": 2, "LOW": 1, "HIGH": 0}
INTERACTION_MAP = {"NONE": 1, "REQUIRED": 0}
IMPACT_MAP = {"HIGH": 2, "LOW": 1, "NONE": 0}
