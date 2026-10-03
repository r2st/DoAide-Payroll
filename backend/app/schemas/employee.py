"""Employee schemas."""
from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field


class EmployeeCreate(BaseModel):
    employee_code: str = Field(min_length=1, max_length=50)
    full_name: str = Field(min_length=1, max_length=255)
    email: EmailStr | None = None
    phone: str | None = None
    date_of_birth: date | None = None
    date_of_joining: date
    department: str | None = None
    designation: str | None = None
    pan: str | None = Field(default=None, pattern=r"^[A-Z]{5}[0-9]{4}[A-Z]$")
    uan: str | None = None
    esi_number: str | None = None
    bank_name: str | None = None
    bank_account_number: str | None = None
    bank_ifsc: str | None = None


class EmployeeUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    date_of_birth: date | None = None
    department: str | None = None
    designation: str | None = None
    pan: str | None = None
    uan: str | None = None
    esi_number: str | None = None
    bank_name: str | None = None
    bank_account_number: str | None = None
    bank_ifsc: str | None = None
    date_of_exit: date | None = None
    employment_status: str | None = None


class EmployeeOut(BaseModel):
    id: int
    employee_code: str
    full_name: str
    email: str | None = None
    phone: str | None = None
    date_of_birth: date | None = None
    date_of_joining: date
    date_of_exit: date | None = None
    department: str | None = None
    designation: str | None = None
    employment_status: str
    pan: str | None = None
    uan: str | None = None
    esi_number: str | None = None
    bank_name: str | None = None
    bank_ifsc: str | None = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class EmployeeList(BaseModel):
    employees: list[EmployeeOut]
    total: int
