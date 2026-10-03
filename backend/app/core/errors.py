"""Unified error handling for the whole API."""
from __future__ import annotations

import logging
from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, OperationalError, SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings

logger = logging.getLogger(__name__)

_CODES = {
    400: "bad_request",
    401: "unauthorized",
    403: "forbidden",
    404: "not_found",
    409: "conflict",
    413: "payload_too_large",
    422: "validation_error",
    429: "rate_limited",
    500: "internal_error",
    503: "service_unavailable",
}


def error_code(status_code: int) -> str:
    return _CODES.get(status_code, "error" if status_code < 500 else "internal_error")


def error_body(status_code: int, detail: Any, *, code: str | None = None) -> dict[str, Any]:
    return {
        "detail": detail,
        "error": {
            "code": code or error_code(status_code),
            "status": status_code,
            "message": detail if isinstance(detail, str) else str(detail),
        },
    }


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def _validation(request: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=error_body(422, jsonable_encoder(exc.errors()), code="validation_error"),
        )

    @app.exception_handler(StarletteHTTPException)
    async def _http(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=error_body(exc.status_code, exc.detail),
            headers=getattr(exc, "headers", None),
        )

    @app.exception_handler(IntegrityError)
    async def _integrity(request: Request, exc: IntegrityError) -> JSONResponse:
        logger.warning("Database constraint violated", exc_info=exc)
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content=error_body(409, "That record conflicts with one that already exists."),
        )

    @app.exception_handler(OperationalError)
    async def _operational(request: Request, exc: OperationalError) -> JSONResponse:
        logger.error("Database unavailable", exc_info=exc)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=error_body(503, "The database is temporarily unavailable."),
            headers={"Retry-After": "5"},
        )

    @app.exception_handler(SQLAlchemyError)
    async def _sqlalchemy(request: Request, exc: SQLAlchemyError) -> JSONResponse:
        logger.exception("Unhandled database error", exc_info=exc)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_body(500, _opaque_message()),
        )

    @app.exception_handler(Exception)
    async def _unhandled(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled exception")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_body(500, _opaque_message()),
        )


def _opaque_message() -> str:
    if settings.debug:
        return "Internal server error."
    return "Something went wrong on our side."
