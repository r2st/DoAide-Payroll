"""Employee management router."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_business, get_current_user, require_writer
from app.models.business import Business
from app.models.employee import Employee
from app.models.salary_structure import SalaryStructure
from app.models.user import User
from app.schemas.employee import EmployeeCreate, EmployeeList, EmployeeOut, EmployeeUpdate
from app.schemas.payroll import SalaryStructureCreate, SalaryStructureOut

router = APIRouter()


@router.get("/employees")
def list_employees(
    search: str | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    q = db.query(Employee).filter(
        Employee.business_id == business.id,
        Employee.deleted_at.is_(None),
    )
    if search:
        pattern = f"%{search}%"
        q = q.filter(
            Employee.full_name.ilike(pattern)
            | Employee.employee_code.ilike(pattern)
            | Employee.department.ilike(pattern)
        )
    total = q.count()
    employees = q.offset(skip).limit(limit).all()
    return {
        "data": EmployeeList(
            employees=[EmployeeOut.model_validate(e) for e in employees],
            total=total,
        )
    }


@router.post("/employees", status_code=status.HTTP_201_CREATED)
def create_employee(
    body: EmployeeCreate,
    _writer: User = Depends(require_writer),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    existing = (
        db.query(Employee)
        .filter(Employee.business_id == business.id, Employee.employee_code == body.employee_code)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee code already exists.")
    emp = Employee(business_id=business.id, **body.model_dump())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return {"data": EmployeeOut.model_validate(emp)}


@router.get("/employees/{employee_id}")
def get_employee(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    emp = _find_employee(db, employee_id, business.id)
    return {"data": EmployeeOut.model_validate(emp)}


@router.put("/employees/{employee_id}")
def update_employee(
    employee_id: int,
    body: EmployeeUpdate,
    _writer: User = Depends(require_writer),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    emp = _find_employee(db, employee_id, business.id)
    updates = body.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(emp, key, value)
    db.commit()
    db.refresh(emp)
    return {"data": EmployeeOut.model_validate(emp)}


@router.delete("/employees/{employee_id}", status_code=status.HTTP_200_OK)
def delete_employee(
    employee_id: int,
    _writer: User = Depends(require_writer),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    emp = _find_employee(db, employee_id, business.id)
    emp.soft_delete()
    emp.is_active = False
    db.commit()
    return {"data": {"id": employee_id, "deleted": True}}


@router.get("/employees/{employee_id}/salary")
def get_salary(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    _find_employee(db, employee_id, business.id)
    salary = (
        db.query(SalaryStructure)
        .filter(SalaryStructure.employee_id == employee_id, SalaryStructure.effective_until.is_(None))
        .first()
    )
    if not salary:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active salary structure.")
    return {"data": SalaryStructureOut.model_validate(salary)}


@router.post("/employees/{employee_id}/salary", status_code=status.HTTP_201_CREATED)
def set_salary(
    employee_id: int,
    body: SalaryStructureCreate,
    _writer: User = Depends(require_writer),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
):
    _find_employee(db, employee_id, business.id)
    existing = (
        db.query(SalaryStructure)
        .filter(SalaryStructure.employee_id == employee_id, SalaryStructure.effective_until.is_(None))
        .first()
    )
    if existing:
        existing.effective_until = body.effective_from
    salary = SalaryStructure(
        business_id=business.id,
        employee_id=employee_id,
        **body.model_dump(exclude={"employee_id"}),
    )
    db.add(salary)
    db.commit()
    db.refresh(salary)
    return {"data": SalaryStructureOut.model_validate(salary)}


def _find_employee(db: Session, employee_id: int, business_id: int) -> Employee:
    emp = (
        db.query(Employee)
        .filter(Employee.id == employee_id, Employee.business_id == business_id, Employee.deleted_at.is_(None))
        .first()
    )
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")
    return emp
