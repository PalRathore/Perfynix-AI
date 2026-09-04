"""
SQLAlchemy Database Models — Checkpoint 3.6
ORM models matching the PostgreSQL database schema for scans, findings, and remediations.

🔵 CODER: Written
🟡 SUPERVISOR: Validates ORM operations in test_scan_api.py
🔴 CEO: Ensures database persistence supports full report generation
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from backend.app.db.session import Base


class ScanModel(Base):
    """Scan record ORM model."""

    __tablename__ = "scans"

    id = Column(String(64), primary_key=True, index=True)
    target_url = Column(String(2048), nullable=False)
    status = Column(String(32), nullable=False, default="PENDING")
    scan_mode = Column(String(32), nullable=False, default="website")
    overall_trust_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime(timezone=True), nullable=True)

    findings = relationship("ScanFindingModel", back_populates="scan", cascade="all, delete-orphan")
    remediations = relationship("RemediationModel", back_populates="scan", cascade="all, delete-orphan")


class ScanFindingModel(Base):
    """Scan finding ORM model."""

    __tablename__ = "scan_findings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    scan_id = Column(String(64), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    finding_title = Column(String(512), nullable=False)
    cwe_id = Column(String(32), nullable=False)
    priority_label = Column(String(32), nullable=False)
    priority_code = Column(Integer, nullable=False)
    confidence_score = Column(Float, default=1.0)
    category = Column(String(64), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    scan = relationship("ScanModel", back_populates="findings")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "finding_title": self.finding_title,
            "cwe_id": self.cwe_id,
            "priority_label": self.priority_label,
            "priority_code": self.priority_code,
            "confidence_score": self.confidence_score,
            "category": self.category,
            "description": self.description,
        }


class RemediationModel(Base):
    """Remediation ORM model."""

    __tablename__ = "remediations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    scan_id = Column(String(64), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    cwe_id = Column(String(32), nullable=False)
    finding_title = Column(String(512), nullable=False)
    priority_label = Column(String(32), nullable=False)
    summary = Column(Text, nullable=True)
    impact = Column(Text, nullable=True)
    remediation_steps = Column(Text, nullable=True)
    code_example = Column(Text, nullable=True)
    source = Column(String(32), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    scan = relationship("ScanModel", back_populates="remediations")

    def to_dict(self) -> dict:
        return {
            "cwe_id": self.cwe_id,
            "finding_title": self.finding_title,
            "priority_label": self.priority_label,
            "summary": self.summary,
            "impact": self.impact,
            "remediation_steps": self.remediation_steps,
            "code_example": self.code_example,
            "source": self.source,
        }
