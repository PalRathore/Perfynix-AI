"""
Machine Learning Inference Engine — Checkpoint 3.3
Loads serialized LightGBM model (best_model.pkl) and performs priority class inference.

Target Label Mapping:
  0 → LOW
  1 → MEDIUM
  2 → HIGH
  3 → CRITICAL

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_ml_inference.py
🔴 CEO: Verifies model feature order and output priority classes
"""

from __future__ import annotations

import logging
from dataclasses import asdict, dataclass
from pathlib import Path

import joblib

from backend.app.core.config import settings
from backend.app.services.intelligence.threat_index_lookup import threat_lookup

logger = logging.getLogger(__name__)

LABEL_MAP: dict[int, str] = {0: "LOW", 1: "MEDIUM", 2: "HIGH", 3: "CRITICAL"}


@dataclass
class MLInferenceResult:
    """Result of machine learning model priority prediction."""

    cwe_id: str
    priority_label: str  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    priority_code: int  # 3, 2, 1, 0
    confidence_score: float  # 0.0 to 1.0 probability of predicted class
    class_probabilities: dict[str, float]  # Class → Probability
    feature_vector: list[float]  # 15-D numerical feature vector
    error: str | None = None

    def to_dict(self) -> dict:
        return asdict(self)


class MLInferenceService:
    """Loads best_model.pkl and executes 15-D priority classification."""

    def __init__(self, model_path: str | None = None) -> None:
        self.model_path = Path(model_path or settings.MODEL_PATH)
        self.model = None
        self._load_model()

    def _load_model(self) -> None:
        """Load trained model from pickle file."""
        if self.model_path.exists():
            try:
                self.model = joblib.load(self.model_path)
                logger.info(f"Successfully loaded ML model from {self.model_path}")
            except Exception as exc:  # noqa: BLE001
                logger.error(f"Failed to load ML model: {exc}")
        else:
            logger.error(f"ML Model file not found at {self.model_path}")

    def predict_cwe_priority(self, cwe_id: str) -> MLInferenceResult:
        """
        Enrich CWE ID with 15-D threat intel vector and predict remediation priority.

        Args:
            cwe_id: Standard CWE ID (e.g. "CWE-89").

        Returns:
            MLInferenceResult with predicted label, probabilities, and feature vector.
        """
        # Fetch 15-D feature vector from Threat Index Lookup
        threat_metrics = threat_lookup.lookup(cwe_id)
        vector_15d = threat_metrics.to_list()

        if self.model is None:
            # Fallback heuristic if model file is unreadable
            return self._heuristic_fallback(cwe_id, vector_15d, "ML model not loaded")

        try:
            import pandas as pd

            # Training feature names list
            feature_names = [
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
                "days_since_published",
                "days_since_modified",
                "cwe_category_frequency",
                "vendor_cve_count",
                "cvss_epss_divergence",
            ]
            x_input = pd.DataFrame([vector_15d], columns=feature_names)

            # Perform prediction
            pred_code = int(self.model.predict(x_input)[0])
            pred_label = LABEL_MAP.get(pred_code, "MEDIUM")

            # Extract class probabilities if supported
            probs = {}
            confidence = 1.0
            if hasattr(self.model, "predict_proba"):
                raw_probs = self.model.predict_proba(x_input)[0]
                probs = {LABEL_MAP.get(i, f"CLASS_{i}"): round(float(p), 4) for i, p in enumerate(raw_probs)}
                confidence = round(float(raw_probs[pred_code]), 4)

            return MLInferenceResult(
                cwe_id=cwe_id,
                priority_label=pred_label,
                priority_code=pred_code,
                confidence_score=confidence,
                class_probabilities=probs,
                feature_vector=vector_15d,
                error=None,
            )

        except Exception as exc:  # noqa: BLE001
            logger.error(f"Inference error for {cwe_id}: {exc}")
            return self._heuristic_fallback(cwe_id, vector_15d, str(exc))

    def _heuristic_fallback(self, cwe_id: str, vector_15d: list[float], error_msg: str) -> MLInferenceResult:
        """Rule-based priority fallback if model execution fails."""
        cvss = vector_15d[0]
        if cvss >= 9.0:
            code, label = 3, "CRITICAL"
        elif cvss >= 7.0:
            code, label = 2, "HIGH"
        elif cvss >= 4.0:
            code, label = 1, "MEDIUM"
        else:
            code, label = 0, "LOW"

        return MLInferenceResult(
            cwe_id=cwe_id,
            priority_label=label,
            priority_code=code,
            confidence_score=0.8,
            class_probabilities={label: 0.8},
            feature_vector=vector_15d,
            error=error_msg,
        )


ml_service = MLInferenceService()
