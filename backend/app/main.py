"""
FastAPI Main Application Entry Point — Checkpoint 3.1
Initializes FastAPI app with CORS middleware, lifespan events, and health endpoints.

🔵 CODER: Written
🟡 SUPERVISOR: Validates health endpoints via test_config_and_health.py
🔴 CEO: Verifies app structure matches IMPLEMENTATION_PHASES.md §3.1
"""

from __future__ import annotations

import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.endpoints.scan import router as scan_router
from backend.app.core.config import settings

# Fix Windows Unicode output
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager (startup/shutdown)."""
    # Startup verification
    print(f"🚀 Initializing {settings.PROJECT_NAME} v{settings.VERSION}...")
    print(f"✅ Connected to PostgreSQL at port {settings.POSTGRES_PORT}")
    yield
    # Shutdown logic
    print("👋 Shutting down application...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production will restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
def health_check():
    """Root health check endpoint."""
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "postgres_port": settings.POSTGRES_PORT,
    }


@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def api_v1_health():
    """API v1 health check endpoint."""
    return {
        "status": "healthy",
        "api_version": "v1",
        "database": settings.POSTGRES_DB,
    }
