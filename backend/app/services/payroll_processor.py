"""Payroll processing service."""
from __future__ import annotations

from decimal import Decimal

from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.models.attendance import Attendance, AttendanceStatus
from app.models.business import Business
from app.models.employee import Employee, EmploymentStatus
from app.models.mixins import ZERO, utcnow
from app.models.payroll_run import PayrollRun, PayrollRunStatus
from app.models.payslip import Payslip
from app.models.salary_structure import SalaryStructure
from app.services.salary_calculator import (
    compute_esi,
    compute_monthly_salary,
    compute_pf,
    compute_professional_tax,
    compute_tds,
)


def _count_working_days(db: Session, employee_id: int, start, end) -> tuple[int, int]:
    total_days = (end - start).days + 1
    attendance_records = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee_id,
            Attendance.date >= start,
            Attendance.date <= end,
        )
        .all()
    )
    if not attendance_records:
        return total_days, total_days

    absent = sum(
        1 for a in attendance_records
        if a.status in (AttendanceStatus.ABSENT, AttendanceStatus.ON_LEAVE)
    )
    half_days = sum(1 for a in attendance_records if a.status == AttendanceStatus.HALF_DAY)
    days_worked = total_days - absent - (half_days // 2)
    return days_worked, total_days


def process_payroll_run(db: Session, payroll_run: PayrollRun, business: Business) -> PayrollRun:
    payroll_run.status = PayrollRunStatus.PROCESSING
    db.flush()

    employees = (
        db.query(Employee)
        .filter(
            Employee.business_id == business.id,
            Employee.employment_status == EmploymentStatus.ACTIVE,
            Employee.is_active.is_(True),
        )
        .all()
    )

    total_gross = ZERO
    total_deductions = ZERO
    total_net = ZERO
    total_employer = ZERO

    for emp in employees:
        salary = (
            db.query(SalaryStructure)
            .filter(
                SalaryStructure.employee_id == emp.id,
                SalaryStructure.effective_from <= payroll_run.pay_period_end,
                and_(
                    SalaryStructure.effective_until.is_(None)
                    | (SalaryStructure.effective_until >= payroll_run.pay_period_start)
                ),
            )
            .order_by(SalaryStructure.effective_from.desc())
            .first()
        )
        if not salary:
            continue

        days_worked, days_in_period = _count_working_days(
            db, emp.id, payroll_run.pay_period_start, payroll_run.pay_period_end
        )

        earnings = compute_monthly_salary(
            basic_salary=salary.basic_salary,
            hra_percentage=salary.hra_percentage,
            da_percentage=salary.da_percentage,
            special_allowance=salary.special_allowance,
            travel_allowance=salary.travel_allowance,
            medical_allowance=salary.medical_allowance,
            days_worked=days_worked,
            days_in_period=days_in_period,
        )

        pf_emp, pf_er = compute_pf(earnings["basic"], salary.pf_applicable)
        esi_emp, esi_er = compute_esi(earnings["gross_salary"], salary.esi_applicable)
        pt = compute_professional_tax(earnings["gross_salary"], salary.professional_tax_applicable)
        annual_gross = earnings["gross_salary"] * Decimal("12")
        tds = compute_tds(annual_gross, salary.tds_regime)

        deductions = pf_emp + esi_emp + pt + tds
        net = earnings["gross_salary"] - deductions
        employer_cost = earnings["gross_salary"] + pf_er + esi_er

        payslip = Payslip(
            business_id=business.id,
            payroll_run_id=payroll_run.id,
            employee_id=emp.id,
            pay_period_start=payroll_run.pay_period_start,
            pay_period_end=payroll_run.pay_period_end,
            days_worked=days_worked,
            days_in_period=days_in_period,
            basic=earnings["basic"],
            hra=earnings["hra"],
            da=earnings["da"],
            special_allowance=earnings["special_allowance"],
            travel_allowance=earnings["travel_allowance"],
            medical_allowance=earnings["medical_allowance"],
            gross_salary=earnings["gross_salary"],
            pf_employee=pf_emp,
            pf_employer=pf_er,
            esi_employee=esi_emp,
            esi_employer=esi_er,
            professional_tax=pt,
            tds=tds,
            total_deductions=deductions,
            net_salary=net,
            total_employer_cost=employer_cost,
        )
        db.add(payslip)

        total_gross += earnings["gross_salary"]
        total_deductions += deductions
        total_net += net
        total_employer += pf_er + esi_er

    payroll_run.total_gross = total_gross
    payroll_run.total_deductions = total_deductions
    payroll_run.total_net = total_net
    payroll_run.total_employer_contributions = total_employer
    payroll_run.employee_count = len(employees)
    payroll_run.status = PayrollRunStatus.COMPUTED
    db.commit()
    return payroll_run


def approve_payroll_run(db: Session, payroll_run: PayrollRun, user_id: int) -> PayrollRun:
    payroll_run.status = PayrollRunStatus.APPROVED
    payroll_run.approved_by = user_id
    payroll_run.approved_at = utcnow()
    db.commit()
    return payroll_run
