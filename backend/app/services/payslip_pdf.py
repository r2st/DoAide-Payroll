"""Payslip PDF generation using fpdf2."""
from __future__ import annotations

import os
from decimal import Decimal
from typing import TYPE_CHECKING

from fpdf import FPDF

if TYPE_CHECKING:
    from app.models.business import Business
    from app.models.employee import Employee
    from app.models.payslip import Payslip


def _fmt(v: Decimal) -> str:
    return f"₹{v:,.2f}"


def generate_payslip_pdf(payslip: Payslip, employee: Employee, business: Business) -> str:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, business.company_name or "Company", ln=True, align="C")
    pdf.set_font("Helvetica", "", 9)
    parts = [p for p in [business.address, business.city, business.state, business.pincode] if p]
    if parts:
        pdf.cell(0, 5, ", ".join(parts), ln=True, align="C")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "PAYSLIP", ln=True, align="C")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, f"Period: {payslip.pay_period_start} to {payslip.pay_period_end}", ln=True, align="C")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(95, 7, "Employee Details", border="B")
    pdf.cell(95, 7, "", border="B", ln=True)
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(30, 6, "Name:")
    pdf.cell(65, 6, employee.full_name)
    pdf.cell(30, 6, "Code:")
    pdf.cell(65, 6, employee.employee_code, ln=True)
    pdf.cell(30, 6, "Department:")
    pdf.cell(65, 6, employee.department or "-")
    pdf.cell(30, 6, "Designation:")
    pdf.cell(65, 6, employee.designation or "-", ln=True)
    pdf.cell(30, 6, "Days Worked:")
    pdf.cell(65, 6, f"{payslip.days_worked} / {payslip.days_in_period}")
    pdf.cell(30, 6, "PAN:")
    pdf.cell(65, 6, employee.pan or "-", ln=True)
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(95, 7, "Earnings", border="B")
    pdf.cell(95, 7, "Deductions", border="B", ln=True)
    pdf.set_font("Helvetica", "", 9)

    earnings = [
        ("Basic Salary", payslip.basic),
        ("HRA", payslip.hra),
        ("DA", payslip.da),
        ("Special Allowance", payslip.special_allowance),
        ("Travel Allowance", payslip.travel_allowance),
        ("Medical Allowance", payslip.medical_allowance),
    ]
    deductions = [
        ("PF (Employee)", payslip.pf_employee),
        ("ESI (Employee)", payslip.esi_employee),
        ("Professional Tax", payslip.professional_tax),
        ("TDS", payslip.tds),
        ("Other Deductions", payslip.other_deductions),
    ]

    max_rows = max(len(earnings), len(deductions))
    for i in range(max_rows):
        if i < len(earnings):
            pdf.cell(60, 6, earnings[i][0])
            pdf.cell(35, 6, _fmt(earnings[i][1]), align="R")
        else:
            pdf.cell(95, 6, "")
        if i < len(deductions):
            pdf.cell(60, 6, deductions[i][0])
            pdf.cell(35, 6, _fmt(deductions[i][1]), align="R")
        else:
            pdf.cell(95, 6, "")
        pdf.ln()

    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(60, 7, "Gross Salary")
    pdf.cell(35, 7, _fmt(payslip.gross_salary), align="R")
    pdf.cell(60, 7, "Total Deductions")
    pdf.cell(35, 7, _fmt(payslip.total_deductions), align="R")
    pdf.ln()

    pdf.ln(5)
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(95, 7, "Employer Contributions", border="B")
    pdf.cell(95, 7, "", border="B", ln=True)
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(60, 6, "PF (Employer)")
    pdf.cell(35, 6, _fmt(payslip.pf_employer), align="R")
    pdf.cell(95, 6, "", ln=True)
    pdf.cell(60, 6, "ESI (Employer)")
    pdf.cell(35, 6, _fmt(payslip.esi_employer), align="R")
    pdf.ln()

    pdf.ln(5)
    pdf.set_draw_color(0, 0, 0)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(95, 10, "NET PAY", border="TB")
    pdf.cell(95, 10, _fmt(payslip.net_salary), border="TB", align="R", ln=True)

    pdf.ln(10)
    pdf.set_font("Helvetica", "", 8)
    pdf.cell(0, 5, "This is a computer-generated payslip and does not require a signature.", ln=True, align="C")

    out_dir = os.path.join("data", "payslips", str(payslip.business_id), str(payslip.payroll_run_id))
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{payslip.employee_id}.pdf")
    pdf.output(path)
    return path
