"""User model."""
from __future__ import annotations

from enum import Enum

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TimestampMixin


class UserRole(str, Enum):
    OWNER = "owner"
    ACCOUNTANT = "accountant"
    VIEWER = "viewer"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20), default=None)
    role: Mapped[UserRole] = mapped_column(default=UserRole.OWNER)
    is_active: Mapped[bool] = mapped_column(default=True)
