"""Unit tests for evaluate module."""

import numpy as np
import pandas as pd

from AI_Model.src.config import TRAINING_FEATURES
from AI_Model.src.evaluate import evaluate_models


def test_evaluate_models_mock():
    """Test model evaluation function with mock test data."""
    np.random.seed(42)
    n_samples = 50
    mock_X = pd.DataFrame(np.random.randn(n_samples, 15), columns=TRAINING_FEATURES)
    mock_y = pd.Series(np.random.choice([0, 1, 2, 3], size=n_samples))

    metrics_df = evaluate_models(mock_X, mock_y)

    assert isinstance(metrics_df, pd.DataFrame)
    assert len(metrics_df) == 2
    assert "model" in metrics_df.columns
    assert "accuracy" in metrics_df.columns
    assert "f1_score" in metrics_df.columns
    assert set(metrics_df["model"].values) == {"Random Forest", "XGBoost"}
