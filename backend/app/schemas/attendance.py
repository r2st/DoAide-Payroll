"""Attendance schemas."""
from __future__ import annotations

from datetime import date, datetime, time
from decimal import Decimal

from pydantic import BaseModel


class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str = "present"
    check_in: time | None = None
    check_out: time | None = None
    notes: str | None = None


class AttendanceBulkCreate(BaseModel):
    records: list[AttendanceCreate]


class AttendanceOut(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str
    check_in: time | None = None
    check_out: time | None = None
    hours_worked: Decimal | None = None
    notes: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
