"""
Scan Endpoints — Checkpoint 3.6
Orchestrates the entire Assessment + AI Intelligence + Remediation pipeline.

Endpoints:
  POST /api/v1/scan/website — Execute website scan (Tier 1 instant + Tier 2 passive)
  GET  /api/v1/scan/{scan_id} — Retrieve scan results & AI recommendations from DB

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_scan_api.py
🔴 CEO: Ensures 2-Module Architecture pipeline executes end-to-end cleanly
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.db.models import RemediationModel, ScanFindingModel, ScanModel
from backend.app.db.session import get_db
from backend.app.services.assessment.header_scanner import scan_headers
from backend.app.services.assessment.input_validator import validate_url
from backend.app.services.assessment.lighthouse_wrapper import run_lighthouse
from backend.app.services.assessment.ssl_checker import check_ssl
from backend.app.services.intelligence.ml_inference import ml_service
from backend.app.services.intelligence.rule_engine import evaluate_non_cve_finding
from backend.app.services.llm.gemini_service import gemini_service

router = APIRouter(prefix="/scan", tags=["Scan & Assessment"])


class WebsiteScanRequest(BaseModel):
    """Scan request body."""

    url: str


@router.post("/website", response_model=dict[str, Any])
def scan_website(request: WebsiteScanRequest, db: Session = Depends(get_db)):  # noqa: B008
    """
    Run full end-to-end website assessment:
    1. Tier 1 Validation & Assessment (Validator, Headers, SSL, Lighthouse)
    2. Tier 2 Threat Intelligence Enrichment (CWE Bridge + LightGBM ML Model + Rule Engine)
    3. LLM Remediation Generation (Gemini LLM / Fallback Engine)
    4. Database Persistence (PostgreSQL 17)
    """
    raw_url = str(request.url).strip()

    # Step 1: Input Validation
    val_res = validate_url(raw_url)
    if not val_res.is_valid:
        raise HTTPException(
            status_code=400,
            detail=val_res.error or "Invalid or unreachable target URL.",
        )

    scan_id = str(uuid.uuid4())

    # Create initial Scan record in DB
    scan_record = ScanModel(
        id=scan_id,
        target_url=raw_url,
        status="RUNNING",
        scan_mode="website",
        created_at=datetime.now(timezone.utc),
    )
    db.add(scan_record)
    db.commit()

    # Step 2: Assessment Layer Scans
    header_res = scan_headers(raw_url, timeout=4.0)
    hostname = raw_url.replace("https://", "").replace("http://", "").split("/")[0]
    ssl_res = check_ssl(hostname, timeout=4.0) if val_res.uses_https else None
    lh_res = run_lighthouse(raw_url, timeout=5)

    # Calculate Overall Digital Trust Score (0-100) combining Headers, SSL/TLS, and Performance
    perf_score = (lh_res.performance_score or 50.0) if lh_res else 50.0
    hdr_score = header_res.score if header_res else 50

    if val_res.uses_https and ssl_res and ssl_res.is_valid:
        if ssl_res.days_to_expiry is not None and ssl_res.days_to_expiry <= 30:
            ssl_score = 75
        elif ssl_res.tls_version in ("TLSv1.3", "TLSv1.2"):
            ssl_score = 100
        else:
            ssl_score = 60
    elif val_res.uses_https:
        ssl_score = 30  # Invalid certificate
    else:
        ssl_score = 15  # Plain HTTP

    # Calibrated Trust Score: 40% Security Headers + 35% Transport Security + 25% Performance
    trust_score = round(0.40 * hdr_score + 0.35 * ssl_score + 0.25 * perf_score)

    # Step 3: Intelligence & Remediation Processing
    findings_to_db = []
    remediations_to_db = []

    # Process Security Header Findings
    if header_res and header_res.findings:
        for f in header_res.findings:
            cwe_id = f.get("cwe_id", "CWE-693")
            rule_eval = evaluate_non_cve_finding(f)
            ml_eval = ml_service.predict_cwe_priority(cwe_id)

            # High priority wins
            if rule_eval.priority_code >= ml_eval.priority_code:
                priority_label = rule_eval.priority_label
            else:
                priority_label = ml_eval.priority_label

            priority_code = max(rule_eval.priority_code, ml_eval.priority_code)

            # Store finding
            finding_db = ScanFindingModel(
                scan_id=scan_id,
                finding_title=f"Missing Security Header: {f.get('header', '')}",
                cwe_id=cwe_id,
                priority_label=priority_label,
                priority_code=priority_code,
                confidence_score=ml_eval.confidence_score,
                category="security_header",
                description=f.get("description", ""),
            )
            findings_to_db.append(finding_db)

            # Store remediation
            rem_res = gemini_service.generate_remediation(
                finding_title=finding_db.finding_title,
                cwe_id=cwe_id,
                priority_label=priority_label,
                explanation=finding_db.description,
            )
            rem_db = RemediationModel(
                scan_id=scan_id,
                cwe_id=cwe_id,
                finding_title=finding_db.finding_title,
                priority_label=priority_label,
                summary=rem_res.summary,
                impact=rem_res.impact,
                remediation_steps=rem_res.remediation_steps,
                code_example=rem_res.code_example,
                source=rem_res.source,
            )
            remediations_to_db.append(rem_db)

    # Process SSL Findings
    if ssl_res and ssl_res.findings:
        for f in ssl_res.findings:
            cwe_id = f.get("cwe_id", "CWE-295")
            rule_eval = evaluate_non_cve_finding(f)

            finding_db = ScanFindingModel(
                scan_id=scan_id,
                finding_title=f.get("type", "SSL Finding"),
                cwe_id=cwe_id,
                priority_label=rule_eval.priority_label,
                priority_code=rule_eval.priority_code,
                confidence_score=1.0,
                category="ssl",
                description=f.get("description", ""),
            )
            findings_to_db.append(finding_db)

            rem_res = gemini_service.generate_remediation(
                finding_title=finding_db.finding_title,
                cwe_id=cwe_id,
                priority_label=rule_eval.priority_label,
                explanation=finding_db.description,
            )
            rem_db = RemediationModel(
                scan_id=scan_id,
                cwe_id=cwe_id,
                finding_title=finding_db.finding_title,
                priority_label=rule_eval.priority_label,
                summary=rem_res.summary,
                impact=rem_res.impact,
                remediation_steps=rem_res.remediation_steps,
                code_example=rem_res.code_example,
                source=rem_res.source,
            )
            remediations_to_db.append(rem_db)

    # Step 4: Save to Database
    db.add_all(findings_to_db)
    db.add_all(remediations_to_db)

    scan_record.status = "COMPLETED"
    scan_record.overall_trust_score = trust_score
    scan_record.completed_at = datetime.now(timezone.utc)
    db.commit()

    return {
        "scan_id": scan_id,
        "status": "COMPLETED",
        "target_url": raw_url,
        "overall_trust_score": trust_score,
        "assessment": {
            "validation": val_res,
            "headers": header_res.to_dict() if header_res else None,
            "ssl": ssl_res.to_dict() if ssl_res else None,
            "lighthouse": lh_res.to_dict() if lh_res else None,
        },
        "findings_count": len(findings_to_db),
        "findings": [f.finding_title for f in findings_to_db],
        "remediations": [r.to_dict() for r in remediations_to_db],
    }


@router.get("/{scan_id}", response_model=dict[str, Any])
def get_scan_report(scan_id: str, db: Session = Depends(get_db)):  # noqa: B008
    """Retrieve existing scan report by scan_id."""
    scan = db.query(ScanModel).filter(ScanModel.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found.")

    findings = db.query(ScanFindingModel).filter(ScanFindingModel.scan_id == scan_id).all()
    remediations = db.query(RemediationModel).filter(RemediationModel.scan_id == scan_id).all()

    return {
        "scan_id": scan.id,
        "target_url": scan.target_url,
        "status": scan.status,
        "overall_trust_score": scan.overall_trust_score,
        "created_at": scan.created_at,
        "completed_at": scan.completed_at,
        "findings": [
            {
                "id": f.id,
                "title": f.finding_title,
                "cwe_id": f.cwe_id,
                "priority": f.priority_label,
                "category": f.category,
                "description": f.description,
            }
            for f in findings
        ],
        "remediations": [
            {
                "cwe_id": r.cwe_id,
                "title": r.finding_title,
                "priority": r.priority_label,
                "summary": r.summary,
                "remediation_steps": r.remediation_steps,
                "code_example": r.code_example,
                "source": r.source,
            }
            for r in remediations
        ],
    }
