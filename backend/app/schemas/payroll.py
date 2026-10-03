"""Payroll schemas."""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class SalaryStructureCreate(BaseModel):
    employee_id: int
    basic_salary: Decimal = Field(gt=0)
    hra_percentage: Decimal = Field(default=Decimal("40.00"), ge=0, le=100)
    da_percentage: Decimal = Field(default=Decimal("0.00"), ge=0, le=100)
    special_allowance: Decimal = Field(default=Decimal("0.00"), ge=0)
    travel_allowance: Decimal = Field(default=Decimal("0.00"), ge=0)
    medical_allowance: Decimal = Field(default=Decimal("0.00"), ge=0)
    pf_applicable: bool = True
    esi_applicable: bool = True
    professional_tax_applicable: bool = True
    tds_regime: str = Field(default="new", pattern=r"^(old|new)$")
    effective_from: date
    ctc: Decimal = Field(gt=0)


class SalaryStructureOut(BaseModel):
    id: int
    employee_id: int
    basic_salary: Decimal
    hra_percentage: Decimal
    da_percentage: Decimal
    special_allowance: Decimal
    travel_allowance: Decimal
    medical_allowance: Decimal
    pf_applicable: bool
    esi_applicable: bool
    professional_tax_applicable: bool
    tds_regime: str
    effective_from: date
    effective_until: date | None = None
    ctc: Decimal

    model_config = {"from_attributes": True}


class PayrollRunCreate(BaseModel):
    pay_period_start: date
    pay_period_end: date
    notes: str | None = None


class PayrollRunOut(BaseModel):
    id: int
    pay_period_start: date
    pay_period_end: date
    run_date: datetime
    status: str
    total_gross: Decimal
    total_deductions: Decimal
    total_net: Decimal
    total_employer_contributions: Decimal
    employee_count: int
    approved_by: int | None = None
    approved_at: datetime | None = None
    notes: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class PayslipOut(BaseModel):
    id: int
    payroll_run_id: int
    employee_id: int
    pay_period_start: date
    pay_period_end: date
    days_worked: int
    days_in_period: int
    basic: Decimal
    hra: Decimal
    da: Decimal
    special_allowance: Decimal
    travel_allowance: Decimal
    medical_allowance: Decimal
    gross_salary: Decimal
    pf_employee: Decimal
    pf_employer: Decimal
    esi_employee: Decimal
    esi_employer: Decimal
    professional_tax: Decimal
    tds: Decimal
    other_deductions: Decimal
    total_deductions: Decimal
    net_salary: Decimal
    total_employer_cost: Decimal
    pdf_path: str | None = None

    model_config = {"from_attributes": True}


class PayrollSummary(BaseModel):
    total_gross: Decimal
    total_deductions: Decimal
    total_net: Decimal
    total_employer_contributions: Decimal
    employee_count: int
