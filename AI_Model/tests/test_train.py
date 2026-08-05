"""Unit tests for train module."""

import numpy as np
import pandas as pd

from AI_Model.src.config import TRAINING_FEATURES
from AI_Model.src.train import train_models


def test_train_models_mock():
    """Test model training logic with mock dataset."""
    np.random.seed(42)
    n_samples = 100
    mock_X = pd.DataFrame(np.random.randn(n_samples, 15), columns=TRAINING_FEATURES)
    mock_y = pd.Series(np.random.choice([0, 1, 2, 3], size=n_samples))

    rf_model, xgb_model = train_models(mock_X, mock_y)

    assert rf_model is not None
    assert xgb_model is not None

    sample_pred_rf = rf_model.predict(mock_X.iloc[:5])
    sample_pred_xgb = xgb_model.predict(mock_X.iloc[:5])

    assert len(sample_pred_rf) == 5
    assert len(sample_pred_xgb) == 5
    assert set(sample_pred_rf).issubset({0, 1, 2, 3})
    assert set(sample_pred_xgb).issubset({0, 1, 2, 3})
