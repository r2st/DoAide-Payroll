"""Payslip model."""
from __future__ import annotations

from datetime import date
from decimal import Decimal

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, Money, TimestampMixin


class Payslip(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "payslips"

    id: Mapped[int] = mapped_column(primary_key=True)
    payroll_run_id: Mapped[int] = mapped_column(ForeignKey("payroll_runs.id"), nullable=False, index=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    pay_period_start: Mapped[date] = mapped_column(Date, nullable=False)
    pay_period_end: Mapped[date] = mapped_column(Date, nullable=False)
    days_worked: Mapped[int] = mapped_column(Integer, nullable=False)
    days_in_period: Mapped[int] = mapped_column(Integer, nullable=False)
    basic: Mapped[Decimal] = mapped_column(Money, nullable=False)
    hra: Mapped[Decimal] = mapped_column(Money, nullable=False)
    da: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    special_allowance: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    travel_allowance: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    medical_allowance: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    gross_salary: Mapped[Decimal] = mapped_column(Money, nullable=False)
    pf_employee: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    pf_employer: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    esi_employee: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    esi_employer: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    professional_tax: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    tds: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    other_deductions: Mapped[Decimal] = mapped_column(Money, default=Decimal("0.00"))
    total_deductions: Mapped[Decimal] = mapped_column(Money, nullable=False)
    net_salary: Mapped[Decimal] = mapped_column(Money, nullable=False)
    total_employer_cost: Mapped[Decimal] = mapped_column(Money, nullable=False)
    pdf_path: Mapped[str | None] = mapped_column(String(500), default=None)
