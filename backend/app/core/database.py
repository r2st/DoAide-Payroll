"""SQLAlchemy engine, session factory, and declarative base."""
from __future__ import annotations

import logging
from collections.abc import Generator

from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings

logger = logging.getLogger(__name__)


class Base(DeclarativeBase):
    pass


def _engine_kwargs(url: str) -> dict:
    common: dict = {"pool_pre_ping": True, "future": True, "echo": settings.db_echo}
    if url.startswith("sqlite"):
        sqlite_args = {"check_same_thread": False}
        if ":memory:" in url or "mode=memory" in url:
            return {**common, "connect_args": sqlite_args, "poolclass": StaticPool}
        return {**common, "connect_args": sqlite_args}
    connect_args: dict = {
        "connect_timeout": 10,
        "application_name": f"{settings.app_name.lower()}-{settings.environment}",
    }
    if settings.db_statement_timeout_seconds:
        connect_args["options"] = f"-c statement_timeout={settings.db_statement_timeout_seconds * 1000}"
    return {
        **common,
        "pool_size": settings.db_pool_size,
        "max_overflow": settings.db_max_overflow,
        "pool_timeout": settings.db_pool_timeout,
        "pool_recycle": settings.db_pool_recycle,
        "connect_args": connect_args,
    }


def _make_engine(url: str) -> Engine:
    new_engine = create_engine(url, **_engine_kwargs(url))
    if url.startswith("sqlite"):
        @event.listens_for(new_engine, "connect")
        def _sqlite_pragmas(dbapi_connection, _record):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()
    return new_engine


engine = _make_engine(settings.database_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def check_database(session: Session | None = None) -> tuple[bool, str | None]:
    try:
        if session is not None:
            session.execute(text("SELECT 1"))
        else:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
        return True, None
    except Exception as exc:
        logger.warning("Database health check failed: %s", exc)
        return False, type(exc).__name__
