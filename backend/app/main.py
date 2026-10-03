"""DoAide Payroll — application factory."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware

from app.core.config import get_settings, validate_startup_config
from app.core.database import check_database
from app.core.errors import register_exception_handlers
from app.core.logging import configure_logging
from app.core.middleware import (
    AccessLogMiddleware,
    CorrelationIdMiddleware,
    RequestSizeLimitMiddleware,
    SecurityHeadersMiddleware,
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def _lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    s = get_settings()
    configure_logging(s.log_level, s.log_format)
    logger.info("Starting %s v%s [%s]", s.app_name, s.app_version, s.environment)
    for line in (s.startup_report() or {}).items():
        logger.info("  %s = %s", *line)

    ok, err = check_database()
    if ok:
        logger.info("Database connection OK")
    else:
        logger.error("Database connection FAILED: %s", err)

    for warning in validate_startup_config(s):
        logger.warning("Config: %s", warning)

    yield
    logger.info("Shutting down %s", s.app_name)


def create_app() -> FastAPI:
    s = get_settings()
    app = FastAPI(
        title=s.app_name,
        version=s.app_version,
        docs_url="/docs" if s.docs_enabled else None,
        redoc_url="/redoc" if s.docs_enabled else None,
        openapi_url="/openapi.json" if s.docs_enabled else None,
        lifespan=_lifespan,
    )

    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(AccessLogMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestSizeLimitMiddleware, max_bytes=s.max_request_bytes)
    app.add_middleware(CorrelationIdMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=s.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    from app.routers import auth, employees, health, leaves, payroll, reports

    app.include_router(health.router, prefix=s.api_v1_prefix, tags=["health"])
    app.include_router(auth.router, prefix=s.api_v1_prefix, tags=["auth"])
    app.include_router(employees.router, prefix=s.api_v1_prefix, tags=["employees"])
    app.include_router(payroll.router, prefix=s.api_v1_prefix, tags=["payroll"])
    app.include_router(leaves.router, prefix=s.api_v1_prefix, tags=["leaves"])
    app.include_router(reports.router, prefix=s.api_v1_prefix, tags=["reports"])

    @app.get("/")
    async def _root():
        return {"app": s.app_name, "version": s.app_version, "status": "ok"}

    return app


app = create_app()
