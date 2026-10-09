"""Free payslip PDF generation with multiple templates using fpdf2."""
from __future__ import annotations

import calendar
from decimal import Decimal

from fpdf import FPDF

from app.schemas.free_tools import FreePayslipRequest


def _fmt(v: Decimal) -> str:
    if v == int(v):
        return f"Rs.{int(v):,}"
    return f"Rs.{v:,.2f}"


def _month_year(month: int, year: int) -> str:
    return f"{calendar.month_name[month]} {year}"


def _total_earnings(req: FreePayslipRequest) -> Decimal:
    e = req.earnings
    return e.basic_salary + e.hra + e.da + e.conveyance + e.medical + e.special_allowance + e.other_allowance


def _total_deductions(req: FreePayslipRequest) -> Decimal:
    d = req.deductions
    return d.provident_fund + d.esi + d.professional_tax + d.tds + d.other_deductions


def _net_pay(req: FreePayslipRequest) -> Decimal:
    return _total_earnings(req) - _total_deductions(req)


def _number_to_words(num: int) -> str:
    if num <= 0:
        return "Zero"
    ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
            "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
            "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
    tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
            "Sixty", "Seventy", "Eighty", "Ninety"]

    def _convert(n: int) -> str:
        if n < 20:
            return ones[n]
        if n < 100:
            return tens[n // 10] + (" " + ones[n % 10] if n % 10 else "")
        if n < 1000:
            return ones[n // 100] + " Hundred" + (" and " + _convert(n % 100) if n % 100 else "")
        if n < 100000:
            return _convert(n // 1000) + " Thousand" + (" " + _convert(n % 1000) if n % 1000 else "")
        if n < 10000000:
            return _convert(n // 100000) + " Lakh" + (" " + _convert(n % 100000) if n % 100000 else "")
        return _convert(n // 10000000) + " Crore" + (" " + _convert(n % 10000000) if n % 10000000 else "")

    return _convert(num) + " Rupees Only"


def _earnings_list(req: FreePayslipRequest) -> list[tuple[str, Decimal]]:
    e = req.earnings
    items = [
        ("Basic Salary", e.basic_salary),
        ("House Rent Allowance", e.hra),
        ("Dearness Allowance", e.da),
        ("Conveyance Allowance", e.conveyance),
        ("Medical Allowance", e.medical),
        ("Special Allowance", e.special_allowance),
        ("Other Allowance", e.other_allowance),
    ]
    return [(name, val) for name, val in items if val > 0]


def _deductions_list(req: FreePayslipRequest) -> list[tuple[str, Decimal]]:
    d = req.deductions
    items = [
        ("Provident Fund", d.provident_fund),
        ("ESI", d.esi),
        ("Professional Tax", d.professional_tax),
        ("TDS", d.tds),
        ("Other Deductions", d.other_deductions),
    ]
    return [(name, val) for name, val in items if val > 0]


def generate_standard(req: FreePayslipRequest) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Header
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(26, 54, 93)
    pdf.cell(0, 10, req.company_name.upper(), ln=True, align="C")
    if req.company_address:
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(128, 128, 128)
        pdf.cell(0, 5, req.company_address, ln=True, align="C")
    pdf.ln(3)

    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(43, 108, 176)
    pdf.cell(0, 8, f"PAYSLIP FOR {_month_year(req.month, req.year).upper()}", ln=True, align="C")
    pdf.ln(3)

    # Employee info
    pdf.set_draw_color(226, 232, 240)
    pdf.set_fill_color(247, 250, 252)
    pdf.set_text_color(45, 55, 72)
    pdf.set_font("Helvetica", "", 9)

    info_rows = [
        (("Employee Name", req.employee_name), ("Employee ID", req.employee_id or "N/A")),
        (("Designation", req.designation), ("Department", req.department or "N/A")),
        (("PAN", req.pan or "N/A"), ("Bank A/C", req.bank_account or "N/A")),
    ]
    for (l1, v1), (l2, v2) in info_rows:
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(30, 7, f"{l1}:", border=1, fill=True)
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(65, 7, v1, border=1)
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(30, 7, f"{l2}:", border=1, fill=True)
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(65, 7, v2, border=1, ln=True)
    pdf.ln(5)

    # Earnings/Deductions table
    earnings = _earnings_list(req)
    deductions = _deductions_list(req)
    max_rows = max(len(earnings), len(deductions))

    pdf.set_fill_color(43, 108, 176)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(60, 7, "Earnings", border=1, fill=True)
    pdf.cell(35, 7, "Amount", border=1, fill=True, align="R")
    pdf.cell(60, 7, "Deductions", border=1, fill=True)
    pdf.cell(35, 7, "Amount", border=1, fill=True, align="R", ln=True)

    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", "", 9)
    for i in range(max_rows):
        if i < len(earnings):
            pdf.cell(60, 6, earnings[i][0], border="LR")
            pdf.cell(35, 6, _fmt(earnings[i][1]), border="LR", align="R")
        else:
            pdf.cell(95, 6, "", border="LR")
        if i < len(deductions):
            pdf.cell(60, 6, deductions[i][0], border="LR")
            pdf.cell(35, 6, _fmt(deductions[i][1]), border="LR", align="R")
        else:
            pdf.cell(95, 6, "", border="LR")
        pdf.ln()

    # Totals row
    pdf.set_fill_color(235, 248, 255)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(60, 7, "Total Earnings", border=1, fill=True)
    pdf.cell(35, 7, _fmt(_total_earnings(req)), border=1, fill=True, align="R")
    pdf.cell(60, 7, "Total Deductions", border=1, fill=True)
    pdf.cell(35, 7, _fmt(_total_deductions(req)), border=1, fill=True, align="R", ln=True)
    pdf.ln(5)

    # Net pay
    net = _net_pay(req)
    pdf.set_fill_color(235, 248, 255)
    pdf.set_draw_color(43, 108, 176)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(26, 54, 93)
    pdf.cell(0, 10, f"NET PAY: {_fmt(net)}", border=1, fill=True, ln=True)
    pdf.ln(3)

    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(128, 128, 128)
    pdf.cell(0, 5, f"Amount in words: {_number_to_words(int(net))}", ln=True, align="C")
    pdf.ln(8)
    pdf.cell(0, 5, "This is a computer-generated payslip and does not require a signature.", ln=True, align="C")

    return pdf.output()


def generate_corporate(req: FreePayslipRequest) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Dark header bar
    pdf.set_fill_color(26, 32, 44)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(0, 14, f"  {req.company_name.upper()}", fill=True, ln=True)

    # Gold accent line
    pdf.set_fill_color(214, 158, 46)
    pdf.cell(0, 1.5, "", fill=True, ln=True)

    if req.company_address:
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(128, 128, 128)
        pdf.cell(0, 6, req.company_address, ln=True, align="C")
    pdf.ln(2)

    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(45, 55, 72)
    pdf.cell(0, 8, f"Salary Statement - {_month_year(req.month, req.year)}", ln=True, align="C")
    pdf.ln(4)

    # Employee info in 4-column grid
    pdf.set_text_color(0, 0, 0)
    info = [
        ("Employee Name", req.employee_name),
        ("Employee ID", req.employee_id or "N/A"),
        ("Designation", req.designation),
        ("Department", req.department or "N/A"),
        ("PAN", req.pan or "N/A"),
        ("Bank Account", req.bank_account or "N/A"),
    ]
    pdf.set_draw_color(203, 213, 224)
    for i in range(0, len(info), 2):
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_fill_color(247, 250, 252)
        pdf.cell(35, 7, f"{info[i][0]}:", border=1, fill=True)
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(60, 7, info[i][1], border=1)
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(35, 7, f"{info[i+1][0]}:", border=1, fill=True)
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(60, 7, info[i+1][1], border=1, ln=True)
    pdf.ln(5)

    # Earnings/Deductions
    earnings = _earnings_list(req)
    deductions = _deductions_list(req)
    max_rows = max(len(earnings), len(deductions))

    pdf.set_fill_color(45, 55, 72)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(55, 7, "EARNINGS", border=1, fill=True)
    pdf.cell(40, 7, "AMOUNT", border=1, fill=True, align="R")
    pdf.cell(55, 7, "DEDUCTIONS", border=1, fill=True)
    pdf.cell(40, 7, "AMOUNT", border=1, fill=True, align="R", ln=True)

    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", "", 9)
    for i in range(max_rows):
        if i < len(earnings):
            pdf.cell(55, 6, earnings[i][0], border="LR")
            pdf.cell(40, 6, _fmt(earnings[i][1]), border="LR", align="R")
        else:
            pdf.cell(95, 6, "", border="LR")
        if i < len(deductions):
            pdf.cell(55, 6, deductions[i][0], border="LR")
            pdf.cell(40, 6, _fmt(deductions[i][1]), border="LR", align="R")
        else:
            pdf.cell(95, 6, "", border="LR")
        pdf.ln()

    pdf.set_fill_color(237, 242, 247)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(55, 7, "GROSS EARNINGS", border=1, fill=True)
    pdf.cell(40, 7, _fmt(_total_earnings(req)), border=1, fill=True, align="R")
    pdf.cell(55, 7, "TOTAL DEDUCTIONS", border=1, fill=True)
    pdf.cell(40, 7, _fmt(_total_deductions(req)), border=1, fill=True, align="R", ln=True)
    pdf.ln(5)

    # Net pay with gold accent
    net = _net_pay(req)
    pdf.set_fill_color(254, 252, 191)
    pdf.set_draw_color(214, 158, 46)
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(26, 32, 44)
    pdf.cell(0, 12, f"NET PAYABLE: {_fmt(net)}", border=1, fill=True, ln=True, align="C")
    pdf.ln(3)

    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(128, 128, 128)
    pdf.cell(0, 5, f"In words: {_number_to_words(int(net))}", ln=True, align="C")
    pdf.ln(8)
    pdf.cell(0, 5, "This is a system-generated document. No signature required.", ln=True, align="C")

    return pdf.output()


def generate_modern(req: FreePayslipRequest) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Indigo header
    pdf.set_fill_color(99, 102, 241)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(130, 16, f"  {req.company_name}", fill=True)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(60, 16, _month_year(req.month, req.year), fill=True, align="R", ln=True)

    if req.company_address:
        pdf.set_fill_color(67, 56, 202)
        pdf.set_font("Helvetica", "", 8)
        pdf.set_text_color(165, 180, 252)
        pdf.cell(0, 6, f"  {req.company_address}", fill=True, ln=True)
    pdf.ln(5)

    # Employee info cards
    pdf.set_text_color(128, 128, 128)
    pdf.set_font("Helvetica", "", 8)
    labels = ["Employee Name", "Employee ID", "Designation"]
    values = [req.employee_name, req.employee_id or "-", req.designation]
    for i, (lab, val) in enumerate(zip(labels, values)):
        pdf.cell(63, 5, lab)
    pdf.ln()
    pdf.set_text_color(30, 27, 75)
    pdf.set_font("Helvetica", "B", 10)
    for val in values:
        pdf.cell(63, 7, val)
    pdf.ln()

    pdf.set_draw_color(226, 232, 240)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(2)

    pdf.set_text_color(128, 128, 128)
    pdf.set_font("Helvetica", "", 8)
    labels2 = ["Department", "PAN", "Bank Account"]
    values2 = [req.department or "-", req.pan or "-", req.bank_account or "-"]
    for lab in labels2:
        pdf.cell(63, 5, lab)
    pdf.ln()
    pdf.set_text_color(30, 27, 75)
    pdf.set_font("Helvetica", "B", 10)
    for val in values2:
        pdf.cell(63, 7, val)
    pdf.ln()
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)

    # Earnings / Deductions table
    earnings = _earnings_list(req)
    deductions = _deductions_list(req)
    max_rows = max(len(earnings), len(deductions))

    pdf.set_fill_color(99, 102, 241)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(50, 7, "EARNINGS", border=1, fill=True)
    pdf.cell(45, 7, "AMOUNT", border=1, fill=True, align="R")
    pdf.cell(50, 7, "DEDUCTIONS", border=1, fill=True)
    pdf.cell(45, 7, "AMOUNT", border=1, fill=True, align="R", ln=True)

    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", "", 9)
    for i in range(max_rows):
        bg = (i % 2 == 1)
        if bg:
            pdf.set_fill_color(248, 250, 252)
        if i < len(earnings):
            pdf.cell(50, 6, earnings[i][0], border="LR", fill=bg)
            pdf.cell(45, 6, _fmt(earnings[i][1]), border="LR", align="R", fill=bg)
        else:
            pdf.cell(95, 6, "", border="LR", fill=bg)
        if i < len(deductions):
            pdf.cell(50, 6, deductions[i][0], border="LR", fill=bg)
            pdf.cell(45, 6, _fmt(deductions[i][1]), border="LR", align="R", fill=bg)
        else:
            pdf.cell(95, 6, "", border="LR", fill=bg)
        pdf.ln()

    pdf.set_fill_color(238, 242, 255)
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_draw_color(99, 102, 241)
    pdf.cell(50, 7, "Total", border="LTB")
    pdf.cell(45, 7, _fmt(_total_earnings(req)), border="RTB", align="R")
    pdf.cell(50, 7, "Total", border="LTB")
    pdf.cell(45, 7, _fmt(_total_deductions(req)), border="RTB", align="R", ln=True)
    pdf.ln(5)

    # Net pay bar
    net = _net_pay(req)
    pdf.set_fill_color(99, 102, 241)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(95, 12, "  NET PAY", fill=True)
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(95, 12, f"{_fmt(net)}  ", fill=True, align="R", ln=True)
    pdf.ln(3)

    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(128, 128, 128)
    pdf.cell(0, 5, _number_to_words(int(net)), ln=True, align="C")
    pdf.ln(8)
    pdf.cell(0, 5, "Auto-generated payslip - No signature required", ln=True, align="C")

    return pdf.output()


_GENERATORS = {
    "standard": generate_standard,
    "corporate": generate_corporate,
    "modern": generate_modern,
}


def generate_free_payslip(req: FreePayslipRequest) -> bytes:
    gen = _GENERATORS.get(req.template.value, generate_standard)
    return gen(req)
