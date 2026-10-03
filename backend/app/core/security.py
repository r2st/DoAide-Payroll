"""Authentication primitives: password hashing and JWT access tokens."""
from __future__ import annotations

import secrets
import threading
from datetime import UTC, datetime, timedelta
from typing import Any

import bcrypt
from jose import JWTError, jwt

from app.core.config import settings

_BCRYPT_MAX_BYTES = 72
_absent_hash: str | None = None
_absent_hash_lock = threading.Lock()


def _prepare(password: str) -> bytes:
    return password.encode("utf-8")[:_BCRYPT_MAX_BYTES]


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=settings.bcrypt_rounds)
    return bcrypt.hashpw(_prepare(password), salt).decode("utf-8")


def _absent_account_hash() -> str:
    global _absent_hash
    if _absent_hash is None:
        with _absent_hash_lock:
            if _absent_hash is None:
                _absent_hash = hash_password(secrets.token_urlsafe(32))
    return _absent_hash


def verify_password(plain: str, hashed: str | None) -> bool:
    if hashed is None:
        hashed = _absent_account_hash()
    try:
        return bcrypt.checkpw(_prepare(plain), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def create_access_token(subject: str | int, expires_minutes: int | None = None) -> str:
    expire = datetime.now(UTC) + timedelta(
        minutes=expires_minutes or settings.access_token_expire_minutes
    )
    payload: dict[str, Any] = {"sub": str(subject), "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None
    if payload.get("type") != "access":
        return None
    return payload.get("sub")
