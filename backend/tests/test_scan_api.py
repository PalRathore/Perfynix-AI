"""
Unit tests for Checkpoint 3.6 — Scan REST API & Pipeline Integration.
🟡 SUPERVISOR validates Checkpoint 3.6 with these tests.
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_scan_invalid_url_returns_400():
    """POST /api/v1/scan/website with invalid URL returns 400 Bad Request."""
    response = client.post("/api/v1/scan/website", json={"url": "not-a-valid-url"})
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_scan_website_pipeline_success():
    """POST /api/v1/scan/website with valid URL runs pipeline and persists to DB."""
    # Mock Lighthouse and Gemini LLM to make integration test fast and deterministic
    with patch("backend.app.api.v1.endpoints.scan.run_lighthouse") as mock_lh, patch(
        "backend.app.services.llm.gemini_service.gemini_service.model", None
    ):
        mock_lh_result = MagicMock()
        mock_lh_result.performance_score = 90.0
        mock_lh_result.lcp_ms = 1200.0
        mock_lh_result.to_dict.return_value = {"performance_score": 90.0}
        mock_lh.return_value = mock_lh_result

        response = client.post("/api/v1/scan/website", json={"url": "https://example.com"})

    assert response.status_code == 200
    data = response.json()
    assert "scan_id" in data
    assert data["status"] == "COMPLETED"
    assert data["target_url"] == "https://example.com"
    assert "overall_trust_score" in data
    assert len(data["findings"]) >= 1

    # Verify GET /api/v1/scan/{scan_id} retrieves persisted report from PostgreSQL 17
    scan_id = data["scan_id"]
    get_response = client.get(f"/api/v1/scan/{scan_id}")
    assert get_response.status_code == 200
    get_data = get_response.json()
    assert get_data["scan_id"] == scan_id
    assert get_data["target_url"] == "https://example.com"
    assert len(get_data["findings"]) >= 1
    assert len(get_data["remediations"]) >= 1
