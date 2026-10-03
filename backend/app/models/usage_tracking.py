"""Usage tracking model."""
from __future__ import annotations

from datetime import date

from sqlalchemy import Date, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, TimestampMixin


class UsageTracking(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "usage_tracking"
    __table_args__ = (UniqueConstraint("business_id", "month", name="uq_usage_business_month"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    month: Mapped[date] = mapped_column(Date, nullable=False)
    employees_processed: Mapped[int] = mapped_column(Integer, default=0)
    payslips_generated: Mapped[int] = mapped_column(Integer, default=0)
    ai_queries: Mapped[int] = mapped_column(Integer, default=0)
