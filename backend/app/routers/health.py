"""Health check router."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import check_database, get_db

router = APIRouter()


@router.get("/health")
def health(db: Session = Depends(get_db)):
    db_ok, db_err = check_database(db)
    return {
        "data": {
            "status": "healthy" if db_ok else "degraded",
            "app": settings.app_name,
            "version": settings.app_version,
            "database": "ok" if db_ok else db_err,
        }
    }
