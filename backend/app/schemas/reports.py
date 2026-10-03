"""Report schemas."""
from __future__ import annotations

from decimal import Decimal
from typing import Any

from pydantic import BaseModel


class MonthlyReport(BaseModel):
    month: str
    total_gross: Decimal
    total_deductions: Decimal
    total_net: Decimal
    total_employer_cost: Decimal
    employee_count: int
    department_breakdown: list[dict[str, Any]]


class ComplianceReport(BaseModel):
    pf_total: Decimal
    esi_total: Decimal
    tds_total: Decimal
    pt_total: Decimal
    filings: list[dict[str, Any]]
