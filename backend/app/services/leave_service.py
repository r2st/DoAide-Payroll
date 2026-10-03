"""Leave management service."""
from __future__ import annotations

from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.employee import Employee, EmploymentStatus
from app.models.leave import Leave, LeaveBalance, LeaveStatus, LeaveType
from app.models.mixins import utcnow

_DEFAULT_ALLOCATIONS: dict[LeaveType, Decimal] = {
    LeaveType.CASUAL: Decimal("12.0"),
    LeaveType.SICK: Decimal("12.0"),
    LeaveType.EARNED: Decimal("15.0"),
}


def initialize_leave_balances(db: Session, business_id: int, year: int) -> int:
    employees = (
        db.query(Employee)
        .filter(
            Employee.business_id == business_id,
            Employee.employment_status == EmploymentStatus.ACTIVE,
            Employee.is_active.is_(True),
        )
        .all()
    )
    created = 0
    for emp in employees:
        for leave_type, allocated in _DEFAULT_ALLOCATIONS.items():
            existing = (
                db.query(LeaveBalance)
                .filter(
                    LeaveBalance.employee_id == emp.id,
                    LeaveBalance.leave_type == leave_type,
                    LeaveBalance.year == year,
                )
                .first()
            )
            if existing:
                continue
            balance = LeaveBalance(
                business_id=business_id,
                employee_id=emp.id,
                leave_type=leave_type,
                year=year,
                allocated=allocated,
            )
            db.add(balance)
            created += 1
    db.commit()
    return created


def process_leave_request(db: Session, leave: Leave, approve: bool, user_id: int) -> Leave:
    if approve:
        balance = (
            db.query(LeaveBalance)
            .filter(
                LeaveBalance.employee_id == leave.employee_id,
                LeaveBalance.leave_type == leave.leave_type,
                LeaveBalance.year == leave.start_date.year,
            )
            .first()
        )
        if balance and leave.leave_type != LeaveType.UNPAID:
            remaining = balance.allocated + balance.carried_forward - balance.used
            if leave.days > remaining:
                leave.status = LeaveStatus.REJECTED
                db.commit()
                return leave
            balance.used += leave.days
        leave.status = LeaveStatus.APPROVED
    else:
        leave.status = LeaveStatus.REJECTED
    leave.approved_by = user_id
    leave.approved_at = utcnow()
    db.commit()
    return leave
