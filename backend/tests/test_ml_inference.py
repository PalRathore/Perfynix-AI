"""
Unit tests for Checkpoint 3.3 — Machine Learning Inference Engine.
🟡 SUPERVISOR validates Checkpoint 3.3 with these tests.
"""

from __future__ import annotations

from backend.app.services.intelligence.ml_inference import MLInferenceResult, ml_service


def test_ml_service_model_loaded():
    """Verify ML service successfully loaded best_model.pkl."""
    assert ml_service.model is not None


def test_predict_cwe_89_critical_or_high():
    """Predict priority for SQL Injection (CWE-89) should return HIGH or CRITICAL."""
    result = ml_service.predict_cwe_priority("CWE-89")
    assert isinstance(result, MLInferenceResult)
    assert result.cwe_id == "CWE-89"
    assert result.priority_label in {"HIGH", "CRITICAL"}
    assert result.priority_code in {2, 3}
    assert result.confidence_score > 0.5
    assert len(result.feature_vector) == 15
    assert result.error is None


def test_predict_cwe_79_xss():
    """Predict priority for XSS (CWE-79)."""
    result = ml_service.predict_cwe_priority("CWE-79")
    assert isinstance(result, MLInferenceResult)
    assert result.cwe_id == "CWE-79"
    assert result.priority_label in {"MEDIUM", "HIGH", "CRITICAL"}
    assert len(result.feature_vector) == 15


def test_predict_unindexed_cwe_fallback():
    """Predict priority for unindexed CWE gracefully succeeds."""
    result = ml_service.predict_cwe_priority("CWE-9999")
    assert isinstance(result, MLInferenceResult)
    assert result.cwe_id == "CWE-9999"
    assert result.priority_label in {"LOW", "MEDIUM", "HIGH", "CRITICAL"}
    assert len(result.feature_vector) == 15
