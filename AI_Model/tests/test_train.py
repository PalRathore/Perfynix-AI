"""Unit tests for train module."""

import numpy as np
import pandas as pd

from AI_Model.src.config import TRAINING_FEATURES
from AI_Model.src.train import train_models


def test_train_models_mock():
    """Test 6-model training logic with mock dataset."""
    np.random.seed(42)
    n_samples = 100
    mock_X = pd.DataFrame(np.random.randn(n_samples, 15), columns=TRAINING_FEATURES)
    mock_y = pd.Series(np.random.choice([0, 1, 2, 3], size=n_samples))

    models = train_models(mock_X, mock_y)

    assert isinstance(models, dict)
    assert len(models) == 6
    assert "naive_bayes" in models
    assert "logistic_regression" in models
    assert "decision_tree" in models
    assert "random_forest" in models
    assert "xgboost" in models
    assert "lightgbm" in models

    sample_pred_lgbm = models["lightgbm"].predict(mock_X.iloc[:5])
    assert len(sample_pred_lgbm) == 5
    assert set(sample_pred_lgbm).issubset({0, 1, 2, 3})
