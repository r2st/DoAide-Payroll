"""Salary structure model."""
from __future__ import annotations

from datetime import date
from decimal import Decimal

from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, Money, TimestampMixin


class SalaryStructure(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "salary_structures"

    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    basic_salary: Mapped[Decimal] = mapped_column(Money, nullable=False)
    hra_percentage: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("40.00"))
    da_percentage: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("0.00"))
    special_allowance: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    travel_allowance: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    medical_allowance: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    pf_applicable: Mapped[bool] = mapped_column(default=True)
    esi_applicable: Mapped[bool] = mapped_column(default=True)
    professional_tax_applicable: Mapped[bool] = mapped_column(default=True)
    tds_regime: Mapped[str] = mapped_column(String(10), default="new")
    effective_from: Mapped[date] = mapped_column(Date, nullable=False)
    effective_until: Mapped[date | None] = mapped_column(Date, default=None)
    ctc: Mapped[Decimal] = mapped_column(Money, nullable=False)
