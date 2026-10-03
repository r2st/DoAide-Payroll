"""Payroll router: runs, compute, approve, payslips."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import RequireRole, get_current_business, get_current_user, require_writer
from app.models.business import Business
from app.models.employee import Employee
from app.models.payroll_run import PayrollRun, PayrollRunStatus
from app.models.payslip import Payslip
from app.models.user import User, UserRole
from app.schemas.payroll import PayrollRunCreate, PayrollRunOut, PayslipOut
from app.services.payroll_processor import approve_payroll_run, process_payroll_run
from app.services.payslip_pdf import generate_payslip_pdf

router = APIRouter()
require_owner = RequireRole(UserRole.OWNER)


@router.get("/payroll/runs")
def list_runs(
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    runs = (
        db.query(PayrollRun)
        .filter(PayrollRun.business_id == business.id)
        .order_by(PayrollRun.created_at.desc())
        .all()
    )
    return {"data": [PayrollRunOut.model_validate(r) for r in runs]}


@router.post("/payroll/runs", status_code=status.HTTP_201_CREATED)
def create_run(
    body: PayrollRunCreate,
    _writer: User = Depends(require_writer),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    run = PayrollRun(business_id=business.id, **body.model_dump())
    db.add(run)
    db.commit()
    db.refresh(run)
    return {"data": PayrollRunOut.model_validate(run)}


@router.get("/payroll/runs/{run_id}")
def get_run(
    run_id: int,
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    run = _find_run(db, run_id, business.id)
    payslips = db.query(Payslip).filter(Payslip.payroll_run_id == run.id).all()
    return {
        "data": {
            "run": PayrollRunOut.model_validate(run),
            "payslips": [PayslipOut.model_validate(p) for p in payslips],
        }
    }


@router.post("/payroll/runs/{run_id}/compute")
def compute_run(
    run_id: int,
    _writer: User = Depends(require_writer),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    run = _find_run(db, run_id, business.id)
    if run.status != PayrollRunStatus.DRAFT:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Run must be in DRAFT status to compute.")
    run = process_payroll_run(db, run, business)
    return {"data": PayrollRunOut.model_validate(run)}


@router.post("/payroll/runs/{run_id}/approve")
def approve_run(
    run_id: int,
    owner: User = Depends(require_owner),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    run = _find_run(db, run_id, business.id)
    if run.status != PayrollRunStatus.COMPUTED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Run must be COMPUTED to approve.")
    run = approve_payroll_run(db, run, owner.id)
    return {"data": PayrollRunOut.model_validate(run)}


@router.get("/payroll/payslips/{payslip_id}")
def get_payslip(
    payslip_id: int,
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    payslip = db.query(Payslip).filter(Payslip.id == payslip_id, Payslip.business_id == business.id).first()
    if not payslip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payslip not found.")
    return {"data": PayslipOut.model_validate(payslip)}


@router.get("/payroll/payslips/{payslip_id}/pdf")
def download_payslip_pdf(
    payslip_id: int,
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    payslip = db.query(Payslip).filter(Payslip.id == payslip_id, Payslip.business_id == business.id).first()
    if not payslip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payslip not found.")
    employee = db.get(Employee, payslip.employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")
    if not payslip.pdf_path:
        path = generate_payslip_pdf(payslip, employee, business)
        payslip.pdf_path = path
        db.commit()
    return FileResponse(
        payslip.pdf_path,
        media_type="application/pdf",
        filename=f"payslip_{employee.employee_code}_{payslip.pay_period_start}.pdf",
    )


def _find_run(db: Session, run_id: int, business_id: int) -> PayrollRun:
    run = db.query(PayrollRun).filter(PayrollRun.id == run_id, PayrollRun.business_id == business_id).first()
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll run not found.")
    return run
