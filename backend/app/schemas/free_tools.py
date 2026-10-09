"""Schemas for free (no-auth) tools: payslip generator, CTC breakdown, professional tax."""
from __future__ import annotations

from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


class TemplateType(str, Enum):
    STANDARD = "standard"
    CORPORATE = "corporate"
    MODERN = "modern"


class FreeEarnings(BaseModel):
    basic_salary: Decimal = Field(gt=0)
    hra: Decimal = Field(default=Decimal("0"), ge=0)
    da: Decimal = Field(default=Decimal("0"), ge=0)
    conveyance: Decimal = Field(default=Decimal("0"), ge=0)
    medical: Decimal = Field(default=Decimal("0"), ge=0)
    special_allowance: Decimal = Field(default=Decimal("0"), ge=0)
    other_allowance: Decimal = Field(default=Decimal("0"), ge=0)


class FreeDeductions(BaseModel):
    provident_fund: Decimal = Field(default=Decimal("0"), ge=0)
    esi: Decimal = Field(default=Decimal("0"), ge=0)
    professional_tax: Decimal = Field(default=Decimal("0"), ge=0)
    tds: Decimal = Field(default=Decimal("0"), ge=0)
    other_deductions: Decimal = Field(default=Decimal("0"), ge=0)


class FreePayslipRequest(BaseModel):
    company_name: str = Field(min_length=1, max_length=200)
    company_address: str = Field(default="", max_length=500)
    employee_name: str = Field(min_length=1, max_length=200)
    employee_id: str = Field(default="", max_length=50)
    designation: str = Field(min_length=1, max_length=200)
    department: str = Field(default="", max_length=200)
    pan: str = Field(default="", max_length=10)
    bank_account: str = Field(default="", max_length=30)
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2000, le=2100)
    earnings: FreeEarnings
    deductions: FreeDeductions
    template: TemplateType = TemplateType.STANDARD


class BatchPayslipRequest(BaseModel):
    company_name: str = Field(min_length=1, max_length=200)
    company_address: str = Field(default="", max_length=500)
    employee_name: str = Field(min_length=1, max_length=200)
    employee_id: str = Field(default="", max_length=50)
    designation: str = Field(min_length=1, max_length=200)
    department: str = Field(default="", max_length=200)
    pan: str = Field(default="", max_length=10)
    bank_account: str = Field(default="", max_length=30)
    months: list[dict] = Field(min_length=1, max_length=12)
    earnings: FreeEarnings
    deductions: FreeDeductions
    template: TemplateType = TemplateType.STANDARD


class CTCBreakdownRequest(BaseModel):
    annual_ctc: Decimal = Field(gt=0)
    metro: bool = Field(default=False)
    include_esi: bool = Field(default=False)
