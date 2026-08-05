"""Unit tests for label_generator module."""

import pandas as pd

from AI_Model.src.label_generator import generate_labels


def test_generate_labels_critical_kev():
    """Test that KEV==1 vulnerability maps to CRITICAL (3)."""
    df = pd.DataFrame(
        [
            {
                "cvss_score": 7.5,
                "epss_score": 0.20,
                "kev_status": 1,
                "days_since_published": 100,
            }
        ]
    )
    labels = generate_labels(df)
    assert labels.iloc[0] == 3


def test_generate_labels_critical_cvss9():
    """Test that CVSS>=9.0 vulnerability maps to CRITICAL (3)."""
    df = pd.DataFrame(
        [
            {
                "cvss_score": 9.8,
                "epss_score": 0.10,
                "kev_status": 0,
                "days_since_published": 100,
            }
        ]
    )
    labels = generate_labels(df)
    assert labels.iloc[0] == 3


def test_generate_labels_high():
    """Test High priority CRSI logic (0.33 <= crsi < 0.45)."""
    df = pd.DataFrame(
        [
            {
                "cvss_score": 7.5,
                "epss_score": 0.10,
                "kev_status": 0,
                "days_since_published": 1000,
            }
        ]
    )
    labels = generate_labels(df)
    assert labels.iloc[0] == 2


def test_generate_labels_medium():
    """Test Medium priority CRSI logic (0.22 <= crsi < 0.33)."""
    df = pd.DataFrame(
        [
            {
                "cvss_score": 5.5,
                "epss_score": 0.05,
                "kev_status": 0,
                "days_since_published": 1000,
            }
        ]
    )
    labels = generate_labels(df)
    assert labels.iloc[0] == 1


def test_generate_labels_low():
    """Test Low priority CRSI logic (crsi < 0.22)."""
    df = pd.DataFrame(
        [
            {
                "cvss_score": 3.0,
                "epss_score": 0.001,
                "kev_status": 0,
                "days_since_published": 2000,
            }
        ]
    )
    labels = generate_labels(df)
    assert labels.iloc[0] == 0
