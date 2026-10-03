"""Leave and leave balance models."""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, TimestampMixin


class LeaveType(str, Enum):
    CASUAL = "casual"
    SICK = "sick"
    EARNED = "earned"
    MATERNITY = "maternity"
    PATERNITY = "paternity"
    COMPENSATORY = "compensatory"
    UNPAID = "unpaid"


class LeaveStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class Leave(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "leaves"

    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    leave_type: Mapped[LeaveType] = mapped_column(nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    days: Mapped[Decimal] = mapped_column(Numeric(4, 1), nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, default=None)
    status: Mapped[LeaveStatus] = mapped_column(default=LeaveStatus.PENDING)
    approved_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), default=None)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime, default=None)


class LeaveBalance(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "leave_balances"
    __table_args__ = (
        UniqueConstraint("employee_id", "leave_type", "year", name="uq_leave_balance_emp_type_year"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    leave_type: Mapped[LeaveType] = mapped_column(nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    allocated: Mapped[Decimal] = mapped_column(Numeric(5, 1), nullable=False)
    used: Mapped[Decimal] = mapped_column(Numeric(5, 1), default=Decimal("0.0"))
    carried_forward: Mapped[Decimal] = mapped_column(Numeric(5, 1), default=Decimal("0.0"))
