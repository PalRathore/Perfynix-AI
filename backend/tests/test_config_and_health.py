"""
Unit tests for Checkpoint 3.1 — Config, DB Session, and FastAPI Health Endpoints.
🟡 SUPERVISOR runs these tests to validate Checkpoint 3.1.
"""

from __future__ import annotations

from fastapi.testclient import TestClient
from sqlalchemy import text

from backend.app.core.config import settings
from backend.app.db.session import SessionLocal
from backend.app.main import app

client = TestClient(app)


def test_settings_loaded_correctly():
    """Verify settings loads values from backend/.env."""
    assert settings.PROJECT_NAME == "AI Security & Performance Assessment Platform"
    assert settings.POSTGRES_PORT == 5434
    assert settings.POSTGRES_PASSWORD == "postgres123"
    assert settings.ZAP_API_KEY == "capstone-zap-key"


def test_health_check_endpoint():
    """Test root /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["postgres_port"] == 5434


def test_api_v1_health_endpoint():
    """Test /api/v1/health endpoint."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["api_version"] == "v1"


def test_db_session_connection():
    """Test SQLAlchemy DB session creation and raw query against PostgreSQL 17."""
    db = SessionLocal()
    try:
        res = db.execute(text("SELECT 1;")).scalar()
        assert res == 1
    finally:
        db.close()
