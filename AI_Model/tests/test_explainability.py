"""Unit tests for explainability module."""

from pathlib import Path

import numpy as np
import pandas as pd

from AI_Model.src.config import TRAINING_FEATURES
from AI_Model.src.explainability import generate_shap_analysis


def test_generate_shap_analysis_mock():
    """Test generating SHAP feature importance plots with sample test data."""
    np.random.seed(42)
    n_samples = 50
    mock_X = pd.DataFrame(np.random.randn(n_samples, 15), columns=TRAINING_FEATURES)

    files = generate_shap_analysis(sample_size=20, X_test=mock_X)
    assert len(files) == 2
    for f in files:
        p = Path(f)
        assert p.exists()
        assert p.stat().st_size > 0
