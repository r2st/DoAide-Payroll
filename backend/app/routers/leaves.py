"""Leave management router."""
from __future__ import annotations

from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_business, get_current_user, require_writer
from app.models.business import Business
from app.models.leave import Leave, LeaveBalance
from app.models.user import User
from app.schemas.leave import LeaveAction, LeaveBalanceOut, LeaveCreate, LeaveOut
from app.services.leave_service import initialize_leave_balances, process_leave_request

router = APIRouter()


@router.get("/leaves")
def list_leaves(
    employee_id: int | None = Query(default=None),
    leave_status: str | None = Query(default=None, alias="status"),
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    q = db.query(Leave).filter(Leave.business_id == business.id)
    if employee_id:
        q = q.filter(Leave.employee_id == employee_id)
    if leave_status:
        q = q.filter(Leave.status == leave_status)
    leaves = q.order_by(Leave.created_at.desc()).all()
    return {"data": [LeaveOut.model_validate(lv) for lv in leaves]}


@router.post("/leaves", status_code=status.HTTP_201_CREATED)
def create_leave(
    body: LeaveCreate,
    _writer: User = Depends(require_writer),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    days = Decimal(str((body.end_date - body.start_date).days + 1))
    leave = Leave(
        business_id=business.id,
        employee_id=body.employee_id,
        leave_type=body.leave_type,
        start_date=body.start_date,
        end_date=body.end_date,
        days=days,
        reason=body.reason,
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return {"data": LeaveOut.model_validate(leave)}


@router.put("/leaves/{leave_id}/action")
def leave_action(
    leave_id: int,
    body: LeaveAction,
    writer: User = Depends(require_writer),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    leave = db.query(Leave).filter(Leave.id == leave_id, Leave.business_id == business.id).first()
    if not leave:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leave not found.")
    if leave.status.value != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only pending leaves can be actioned.")
    approve = body.status == "approved"
    leave = process_leave_request(db, leave, approve, writer.id)
    return {"data": LeaveOut.model_validate(leave)}


@router.get("/leaves/balances")
def list_balances(
    year: int = Query(default=None),
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    target_year = year or date.today().year
    balances = (
        db.query(LeaveBalance)
        .filter(LeaveBalance.business_id == business.id, LeaveBalance.year == target_year)
        .all()
    )
    return {"data": [LeaveBalanceOut.model_validate(b) for b in balances]}


@router.post("/leaves/balances/initialize")
def init_balances(
    year: int = Query(default=None),
    _writer: User = Depends(require_writer),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    target_year = year or date.today().year
    count = initialize_leave_balances(db, business.id, target_year)
    return {"data": {"year": target_year, "balances_created": count}}
