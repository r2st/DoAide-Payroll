"""Leave schemas."""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class LeaveCreate(BaseModel):
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: str | None = None


class LeaveOut(BaseModel):
    id: int
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    days: Decimal
    reason: str | None = None
    status: str
    approved_by: int | None = None
    approved_at: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class LeaveAction(BaseModel):
    status: str = Field(pattern=r"^(approved|rejected)$")


class LeaveBalanceOut(BaseModel):
    id: int
    employee_id: int
    leave_type: str
    year: int
    allocated: Decimal
    used: Decimal
    carried_forward: Decimal

    @property
    def remaining(self) -> Decimal:
        return self.allocated + self.carried_forward - self.used

    model_config = {"from_attributes": True}
