"""Attendance model."""
from __future__ import annotations

from datetime import date, time
from decimal import Decimal
from enum import Enum

from sqlalchemy import Date, ForeignKey, Numeric, Text, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, TimestampMixin


class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    HALF_DAY = "half_day"
    ON_LEAVE = "on_leave"
    HOLIDAY = "holiday"
    WEEKEND = "weekend"


class Attendance(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "attendance"
    __table_args__ = (UniqueConstraint("employee_id", "date", name="uq_attendance_employee_date"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[AttendanceStatus] = mapped_column(default=AttendanceStatus.PRESENT)
    check_in: Mapped[time | None] = mapped_column(Time, default=None)
    check_out: Mapped[time | None] = mapped_column(Time, default=None)
    hours_worked: Mapped[Decimal | None] = mapped_column(Numeric(4, 2), default=None)
    notes: Mapped[str | None] = mapped_column(Text, default=None)
