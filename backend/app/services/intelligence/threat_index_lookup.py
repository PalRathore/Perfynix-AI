"""
Threat Intelligence Index Lookup Service — Checkpoint 3.2
Loads offline cwe_threat_index.json and returns enriched threat vectors.

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_cwe_mapper.py
🔴 CEO: Verifies 15-D feature shape alignment with training dataset
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path

from backend.app.core.config import settings

logger = logging.getLogger(__name__)

# Default realistic baseline threat metrics for unindexed CWEs
DEFAULT_THREAT_METRICS: dict[str, float] = {
    "avg_cvss": 5.0,
    "avg_epss": 0.05,
    "kev_rate": 0.0,
    "cwe_category_frequency": 10.0,
    "vendor_cve_count": 5.0,
    "days_since_published": 730.0,  # ~2 years
    "days_since_modified": 180.0,  # ~6 months
}


@dataclass
class ThreatIntelMetrics:
    """Enriched 15-D feature defaults for a given CWE ID."""

    cwe_id: str
    cvss_score: float
    attack_vector: int  # 3=NETWORK, 2=ADJACENT, 1=LOCAL, 0=PHYSICAL
    attack_complexity: int  # 1=LOW, 0=HIGH
    privileges_required: int  # 2=NONE, 1=LOW, 0=HIGH
    user_interaction: int  # 1=NONE, 0=REQUIRED
    confidentiality_impact: int  # 2=HIGH, 1=LOW, 0=NONE
    integrity_impact: int  # 2=HIGH, 1=LOW, 0=NONE
    availability_impact: int  # 2=HIGH, 1=LOW, 0=NONE
    epss_score: float
    kev_status: int  # 1=Known Exploited, 0=Not in KEV
    days_since_published: float
    days_since_modified: float
    cwe_category_frequency: float
    vendor_cve_count: float
    cvss_epss_divergence: float

    def to_list(self) -> list[float]:
        """Return 15-D feature vector matching training feature order exactly."""
        return [
            self.cvss_score,
            float(self.attack_vector),
            float(self.attack_complexity),
            float(self.privileges_required),
            float(self.user_interaction),
            float(self.confidentiality_impact),
            float(self.integrity_impact),
            float(self.availability_impact),
            self.epss_score,
            float(self.kev_status),
            self.days_since_published,
            self.days_since_modified,
            self.cwe_category_frequency,
            self.vendor_cve_count,
            self.cvss_epss_divergence,
        ]


class ThreatIndexLookup:
    """Loads cwe_threat_index.json and provides enriched 15-D feature vectors."""

    def __init__(self, index_path: str | None = None) -> None:
        self.index_path = Path(index_path or settings.CWE_INDEX_PATH)
        self.index: dict = {}
        self._load_index()

    def _load_index(self) -> None:
        """Load the precomputed threat index JSON from disk."""
        if self.index_path.exists():
            try:
                with open(self.index_path, encoding="utf-8") as f:
                    self.index = json.load(f)
                logger.info(f"Loaded CWE Threat Index from {self.index_path}")
            except Exception as exc:  # noqa: BLE001
                logger.warning(f"Failed to parse {self.index_path}: {exc}")
        else:
            logger.warning(f"CWE Threat Index file not found at {self.index_path}")

    def lookup(self, cwe_id: str) -> ThreatIntelMetrics:
        """
        Lookup a CWE ID in the index and return enriched 15-D threat metrics.
        If CWE ID is missing, compute realistic baseline defaults.
        """
        cwe_data = self.index.get(cwe_id, {})

        cvss = float(cwe_data.get("avg_cvss", DEFAULT_THREAT_METRICS["avg_cvss"]))
        epss = float(cwe_data.get("avg_epss", DEFAULT_THREAT_METRICS["avg_epss"]))
        kev_rate = float(cwe_data.get("kev_rate", DEFAULT_THREAT_METRICS["kev_rate"]))
        kev_status = 1 if kev_rate > 0.1 else 0

        # Divergence formula: (CVSS / 10) - EPSS
        divergence = round((cvss / 10.0) - epss, 4)

        # High-risk CWE profiles (SQLi, Code Inj, etc.) get higher impact vector defaults
        is_high_risk_cwe = cwe_id in {
            "CWE-89",
            "CWE-78",
            "CWE-94",
            "CWE-502",
            "CWE-918",
        }

        pub_days = float(cwe_data.get("days_since_published", DEFAULT_THREAT_METRICS["days_since_published"]))
        mod_days = float(cwe_data.get("days_since_modified", DEFAULT_THREAT_METRICS["days_since_modified"]))
        cwe_freq = float(cwe_data.get("cve_count", DEFAULT_THREAT_METRICS["cwe_category_frequency"]))
        vendor_cnt = float(cwe_data.get("vendor_cve_count", DEFAULT_THREAT_METRICS["vendor_cve_count"]))

        return ThreatIntelMetrics(
            cwe_id=cwe_id,
            cvss_score=cvss,
            attack_vector=3,  # NETWORK
            attack_complexity=1,  # LOW
            privileges_required=0 if is_high_risk_cwe else 2,  # HIGH or NONE
            user_interaction=1,  # NONE
            confidentiality_impact=2 if is_high_risk_cwe else 1,  # HIGH or LOW
            integrity_impact=2 if is_high_risk_cwe else 1,
            availability_impact=2 if is_high_risk_cwe else 1,
            epss_score=epss,
            kev_status=kev_status,
            days_since_published=pub_days,
            days_since_modified=mod_days,
            cwe_category_frequency=cwe_freq,
            vendor_cve_count=vendor_cnt,
            cvss_epss_divergence=divergence,
        )


threat_lookup = ThreatIndexLookup()
