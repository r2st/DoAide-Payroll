"""Business model."""
from __future__ import annotations

from enum import Enum

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TimestampMixin


class BusinessPlan(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"


class Business(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "businesses"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    trade_name: Mapped[str | None] = mapped_column(String(255), default=None)
    pan: Mapped[str | None] = mapped_column(String(10), unique=True, default=None)
    gstin: Mapped[str | None] = mapped_column(String(15), default=None)
    address: Mapped[str | None] = mapped_column(String(500), default=None)
    city: Mapped[str | None] = mapped_column(String(100), default=None)
    state: Mapped[str | None] = mapped_column(String(100), default=None)
    pincode: Mapped[str | None] = mapped_column(String(6), default=None)
    is_active: Mapped[bool] = mapped_column(default=True)
    plan: Mapped[BusinessPlan] = mapped_column(default=BusinessPlan.FREE)

    @property
    def is_reachable(self) -> bool:
        return self.is_active and not self.is_deleted
