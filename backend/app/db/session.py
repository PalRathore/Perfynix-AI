"""
PostgreSQL Session & Engine Setup — Checkpoint 3.1
SQLAlchemy engine and session factory connected to PostgreSQL 17.

🔵 CODER: Written
🟡 SUPERVISOR: Validates session creation in test_config_and_health.py
🔴 CEO: Ensures port 5434 and credentials match project spec
"""

from __future__ import annotations

import logging

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from backend.app.core.config import settings

logger = logging.getLogger(__name__)


def ensure_database_exists() -> None:
    """Ensure the target database exists in PostgreSQL, creating it if necessary."""
    try:
        conn = psycopg2.connect(
            host=settings.POSTGRES_HOST,
            port=settings.POSTGRES_PORT,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            dbname="postgres",
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s;", (settings.POSTGRES_DB,))
        exists = cur.fetchone()
        if not exists:
            logger.info(f"Database '{settings.POSTGRES_DB}' does not exist. Creating...")
            cur.execute(f'CREATE DATABASE "{settings.POSTGRES_DB}";')
            logger.info(f"Database '{settings.POSTGRES_DB}' created successfully.")
        cur.close()
        conn.close()
    except Exception as exc:  # noqa: BLE001
        logger.warning(f"Failed to auto-create database '{settings.POSTGRES_DB}': {exc}")


# Ensure DB exists before SQLAlchemy connects
ensure_database_exists()

# SQLAlchemy Engine & Session Factory
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def create_tables() -> None:
    """Create all ORM tables in PostgreSQL database."""
    from backend.app.db import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


# Auto-create tables on startup
create_tables()


def get_db():
    """Dependency generator for FastAPI routes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
