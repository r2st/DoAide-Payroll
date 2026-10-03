"""Reports router."""
from __future__ import annotations

from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_business, get_current_user
from app.models.business import Business
from app.models.mixins import ZERO
from app.models.payslip import Payslip
from app.models.statutory_filing import StatutoryFiling
from app.models.user import User
from app.schemas.reports import ComplianceReport, MonthlyReport

router = APIRouter()


@router.get("/reports/monthly")
def monthly_report(
    year: int = Query(default=None),
    month: int = Query(default=None, ge=1, le=12),
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    target_year = year or date.today().year
    target_month = month or date.today().month
    payslips = (
        db.query(Payslip)
        .filter(
            Payslip.business_id == business.id,
            extract("year", Payslip.pay_period_start) == target_year,
            extract("month", Payslip.pay_period_start) == target_month,
        )
        .all()
    )
    total_gross = sum((p.gross_salary for p in payslips), ZERO)
    total_deductions = sum((p.total_deductions for p in payslips), ZERO)
    total_net = sum((p.net_salary for p in payslips), ZERO)
    total_employer = sum((p.total_employer_cost for p in payslips), ZERO)
    return {
        "data": MonthlyReport(
            month=f"{target_year}-{target_month:02d}",
            total_gross=total_gross,
            total_deductions=total_deductions,
            total_net=total_net,
            total_employer_cost=total_employer,
            employee_count=len(payslips),
            department_breakdown=[],
        )
    }


@router.get("/reports/compliance")
def compliance_report(
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    payslips = db.query(Payslip).filter(Payslip.business_id == business.id).all()
    pf_total = sum((p.pf_employee + p.pf_employer for p in payslips), ZERO)
    esi_total = sum((p.esi_employee + p.esi_employer for p in payslips), ZERO)
    tds_total = sum((p.tds for p in payslips), ZERO)
    pt_total = sum((p.professional_tax for p in payslips), ZERO)

    filings = (
        db.query(StatutoryFiling)
        .filter(StatutoryFiling.business_id == business.id)
        .order_by(StatutoryFiling.due_date.desc())
        .limit(20)
        .all()
    )
    filings_data = [
        {
            "id": f.id,
            "type": f.filing_type.value,
            "period": f"{f.period_start} to {f.period_end}",
            "due_date": str(f.due_date),
            "status": f.status.value,
            "amount": str(f.amount),
        }
        for f in filings
    ]
    return {
        "data": ComplianceReport(
            pf_total=pf_total,
            esi_total=esi_total,
            tds_total=tds_total,
            pt_total=pt_total,
            filings=filings_data,
        )
    }
