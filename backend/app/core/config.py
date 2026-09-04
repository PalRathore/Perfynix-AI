"""
Application Configuration Loader — Checkpoint 3.1
Loads environment variables from backend/.env using pydantic-settings.

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_config_and_health.py
🔴 CEO: Verifies config fields match FINAL_CONTEXT.md requirements
"""

from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Root directory of the project
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent


class Settings(BaseSettings):
    """Application settings loaded from environment or .env file."""

    # Project Information
    PROJECT_NAME: str = "AI Security & Performance Assessment Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Google Gemini LLM API
    GEMINI_API_KEY: str = ""

    # PostgreSQL 17 Connection Details
    DATABASE_URL: str = "postgresql://postgres:postgres123@localhost:5434/capstone_security_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5434
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres123"
    POSTGRES_DB: str = "capstone_security_db"

    # OWASP ZAP Configuration
    ZAP_API_KEY: str = "capstone-zap-key"
    ZAP_BASE_URL: str = "http://localhost:8080"
    ZAP_EXE_PATH: str = r"C:\Program Files\ZAP\Zed Attack Proxy\ZAP.exe"

    # Google Lighthouse Timeout
    LIGHTHOUSE_TIMEOUT: int = 120

    # Model & Asset Paths
    MODEL_PATH: str = "AI_Model/models/best_model.pkl"
    CWE_INDEX_PATH: str = "AI_Model/models/cwe_threat_index.json"

    model_config = SettingsConfigDict(
        env_file=str(ROOT_DIR / "backend" / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
