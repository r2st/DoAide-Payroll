"""Employee model."""
from __future__ import annotations

from datetime import date
from enum import Enum

from sqlalchemy import Date, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, SoftDeleteMixin, TimestampMixin


class EmploymentStatus(str, Enum):
    ACTIVE = "active"
    ON_NOTICE = "on_notice"
    TERMINATED = "terminated"
    RESIGNED = "resigned"


class Employee(Base, TimestampMixin, SoftDeleteMixin, BusinessScopedMixin):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(primary_key=True)
    employee_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), default=None)
    phone: Mapped[str | None] = mapped_column(String(20), default=None)
    date_of_birth: Mapped[date | None] = mapped_column(Date, default=None)
    date_of_joining: Mapped[date] = mapped_column(Date, nullable=False)
    date_of_exit: Mapped[date | None] = mapped_column(Date, default=None)
    department: Mapped[str | None] = mapped_column(String(100), default=None)
    designation: Mapped[str | None] = mapped_column(String(100), default=None)
    employment_status: Mapped[EmploymentStatus] = mapped_column(default=EmploymentStatus.ACTIVE)
    pan: Mapped[str | None] = mapped_column(String(10), default=None)
    aadhaar_encrypted: Mapped[str | None] = mapped_column(Text, default=None)
    uan: Mapped[str | None] = mapped_column(String(12), default=None)
    esi_number: Mapped[str | None] = mapped_column(String(17), default=None)
    bank_name: Mapped[str | None] = mapped_column(String(100), default=None)
    bank_account_number: Mapped[str | None] = mapped_column(String(20), default=None)
    bank_ifsc: Mapped[str | None] = mapped_column(String(11), default=None)
    is_active: Mapped[bool] = mapped_column(default=True)
