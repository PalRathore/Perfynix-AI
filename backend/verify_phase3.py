"""
Phase 3 CEO Gate Smoke Test Script — Checkpoint 3.7
Executes end-to-end Phase 3 pipeline verification:
1. Pydantic settings & DB connection
2. CWE mapper & threat lookup
3. LightGBM ML model inference
4. Non-CVE rule engine
5. Gemini LLM & fallback remediation engine
6. Full website scan endpoint execution against https://example.com

🔴 CEO Phase Gate verification.
"""

from __future__ import annotations

import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
sys.path.insert(0, ".")

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import text  # noqa: E402

from backend.app.core.config import settings  # noqa: E402
from backend.app.db.session import SessionLocal  # noqa: E402
from backend.app.main import app  # noqa: E402
from backend.app.services.intelligence.cwe_mapper import map_finding_to_cwe  # noqa: E402
from backend.app.services.intelligence.ml_inference import ml_service  # noqa: E402
from backend.app.services.intelligence.rule_engine import evaluate_non_cve_finding  # noqa: E402
from backend.app.services.intelligence.threat_index_lookup import threat_lookup  # noqa: E402
from backend.app.services.llm.gemini_service import gemini_service  # noqa: E402

client = TestClient(app)


def _section(title: str) -> None:
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print(f"{'=' * 60}")


def main() -> None:
    print("\n🚀 Phase 3 CEO Smoke Test & Gate Verification")

    # 1. Config & DB
    _section("Checkpoint 3.1 — Config & DB Session")
    assert settings.POSTGRES_PORT == 5434
    db = SessionLocal()
    db.execute(text("SELECT 1;")).scalar()
    db.close()
    print("✅ PostgreSQL 17 Session & Config verified")

    # 2. CWE Mapper & Threat Lookup
    _section("Checkpoint 3.2 — CWE Mapper & Threat Index Lookup")
    cwe_id = map_finding_to_cwe("SQL Injection Alert")
    assert cwe_id == "CWE-89"
    metrics = threat_lookup.lookup(cwe_id)
    assert len(metrics.to_list()) == 15
    print(f"✅ Mapped alert to {cwe_id} with 15-D vector shape ({len(metrics.to_list())}-D)")

    # 3. ML Inference Engine
    _section("Checkpoint 3.3 — LightGBM Model Inference")
    ml_res = ml_service.predict_cwe_priority("CWE-89")
    print(f"✅ Predicted Priority for CWE-89: {ml_res.priority_label} (Confidence: {ml_res.confidence_score})")

    # 4. Rule Engine
    _section("Checkpoint 3.4 — Static Rule Engine")
    rule_res = evaluate_non_cve_finding(
        {
            "type": "missing_security_header",
            "header": "Content-Security-Policy",
            "cwe_id": "CWE-693",
        }
    )
    print(f"✅ Rule Evaluated: {rule_res.finding_title} -> {rule_res.priority_label}")

    # 5. Gemini LLM Remediation
    _section("Checkpoint 3.5 — LLM & Fallback Remediation Engine")
    rem_res = gemini_service.generate_remediation("Missing CSP Header", "CWE-693", "HIGH")
    print(f"✅ Remediation Generated via [{rem_res.source}]: {rem_res.summary[:60]}...")

    # 6. REST API & Full Pipeline
    _section("Checkpoint 3.6 — Full REST API Scan Endpoint Execution")
    print("Executing POST /api/v1/scan/website against https://example.com...")
    t0 = time.time()
    response = client.post("/api/v1/scan/website", json={"url": "https://example.com"})
    t1 = time.time()

    assert response.status_code == 200, f"API returned status {response.status_code}: {response.text}"
    data = response.json()
    print(f"Duration: {t1 - t0:.2f}s")
    print(f"Scan ID: {data['scan_id']}")
    print(f"Overall Digital Trust Score: {data['overall_trust_score']}/100")
    print(f"Findings Count: {data['findings_count']}")

    _section("🔴 CEO Phase Gate — Summary")
    print("✅ All Checkpoints 3.1 - 3.6 PASSED")
    print("✅ Phase 3 CEO GATE: PASS")
    print("✅ Ready to proceed to Phase 4 (Frontend React Dashboard & Visualizations)")


if __name__ == "__main__":
    main()
