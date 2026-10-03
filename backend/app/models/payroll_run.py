"""Payroll run model."""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, Money, TimestampMixin, utcnow


class PayrollRunStatus(str, Enum):
    DRAFT = "draft"
    PROCESSING = "processing"
    COMPUTED = "computed"
    APPROVED = "approved"
    PAID = "paid"
    CANCELLED = "cancelled"


class PayrollRun(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "payroll_runs"

    id: Mapped[int] = mapped_column(primary_key=True)
    pay_period_start: Mapped[date] = mapped_column(Date, nullable=False)
    pay_period_end: Mapped[date] = mapped_column(Date, nullable=False)
    run_date: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    status: Mapped[PayrollRunStatus] = mapped_column(default=PayrollRunStatus.DRAFT)
    total_gross: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    total_deductions: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    total_net: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    total_employer_contributions: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    employee_count: Mapped[int] = mapped_column(Integer, default=0)
    approved_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), default=None)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime, default=None)
    notes: Mapped[str | None] = mapped_column(Text, default=None)
