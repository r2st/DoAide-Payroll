"""Free tools router — no authentication required.

Endpoints: payslip generator, batch payslip (ZIP), CTC breakdown, professional tax lookup.
"""
from __future__ import annotations

import io
import zipfile
from decimal import Decimal

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import Response

from app.schemas.free_tools import (
    BatchPayslipRequest,
    CTCBreakdownRequest,
    FreePayslipRequest,
)
from app.services.ctc_calculator import compute_ctc_breakdown
from app.services.free_payslip_pdf import generate_free_payslip

router = APIRouter(prefix="/free", tags=["free-tools"])


@router.post("/payslip")
def generate_payslip(req: FreePayslipRequest):
    pdf_bytes = generate_free_payslip(req)
    filename = f"payslip_{req.employee_name.replace(' ', '_')}_{req.month:02d}_{req.year}.pdf"
    return Response(
        content=bytes(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/payslip/batch")
def generate_batch_payslips(req: BatchPayslipRequest):
    if not req.months:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "At least one month required")
    if len(req.months) > 12:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Maximum 12 months per batch")

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for entry in req.months:
            month = entry.get("month")
            year = entry.get("year")
            if not month or not year:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, "Each month entry needs 'month' and 'year'")

            single = FreePayslipRequest(
                company_name=req.company_name,
                company_address=req.company_address,
                employee_name=req.employee_name,
                employee_id=req.employee_id,
                designation=req.designation,
                department=req.department,
                pan=req.pan,
                bank_account=req.bank_account,
                month=int(month),
                year=int(year),
                earnings=req.earnings,
                deductions=req.deductions,
                template=req.template,
            )
            pdf_bytes = generate_free_payslip(single)
            fname = f"payslip_{req.employee_name.replace(' ', '_')}_{int(month):02d}_{year}.pdf"
            zf.writestr(fname, bytes(pdf_bytes))

    zip_bytes = buf.getvalue()
    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="payslips_{req.employee_name.replace(" ", "_")}.zip"'},
    )


@router.post("/ctc-breakdown")
def ctc_breakdown(req: CTCBreakdownRequest):
    return compute_ctc_breakdown(
        annual_ctc=req.annual_ctc,
        metro=req.metro,
        include_esi=req.include_esi,
    )


PROFESSIONAL_TAX_RATES: dict[str, list[dict]] = {
    "maharashtra": [
        {"min": 0, "max": 7500, "tax": "0"},
        {"min": 7501, "max": 10000, "tax": "175"},
        {"min": 10001, "max": None, "tax": "200 (300 in Feb)"},
    ],
    "karnataka": [
        {"min": 0, "max": 15000, "tax": "0"},
        {"min": 15001, "max": 25000, "tax": "200"},
        {"min": 25001, "max": None, "tax": "300"},
    ],
    "west_bengal": [
        {"min": 0, "max": 10000, "tax": "0"},
        {"min": 10001, "max": 15000, "tax": "110"},
        {"min": 15001, "max": 25000, "tax": "130"},
        {"min": 25001, "max": 40000, "tax": "150"},
        {"min": 40001, "max": None, "tax": "200"},
    ],
    "tamil_nadu": [
        {"min": 0, "max": 21000, "tax": "0"},
        {"min": 21001, "max": 30000, "tax": "100"},
        {"min": 30001, "max": 45000, "tax": "235"},
        {"min": 45001, "max": 60000, "tax": "510"},
        {"min": 60001, "max": 75000, "tax": "760"},
        {"min": 75001, "max": None, "tax": "1095"},
    ],
    "andhra_pradesh": [
        {"min": 0, "max": 15000, "tax": "0"},
        {"min": 15001, "max": 20000, "tax": "150"},
        {"min": 20001, "max": None, "tax": "200"},
    ],
    "telangana": [
        {"min": 0, "max": 15000, "tax": "0"},
        {"min": 15001, "max": 20000, "tax": "150"},
        {"min": 20001, "max": None, "tax": "200"},
    ],
    "gujarat": [
        {"min": 0, "max": 5999, "tax": "0"},
        {"min": 6000, "max": 8999, "tax": "80"},
        {"min": 9000, "max": 11999, "tax": "150"},
        {"min": 12000, "max": None, "tax": "200"},
    ],
    "madhya_pradesh": [
        {"min": 0, "max": 18750, "tax": "0"},
        {"min": 18751, "max": 25000, "tax": "125"},
        {"min": 25001, "max": 33333, "tax": "167"},
        {"min": 33334, "max": None, "tax": "208"},
    ],
    "kerala": [
        {"min": 0, "max": 11999, "tax": "0"},
        {"min": 12000, "max": 17999, "tax": "120"},
        {"min": 18000, "max": 29999, "tax": "180"},
        {"min": 30000, "max": None, "tax": "250"},
    ],
    "rajasthan": [
        {"min": 0, "max": 12000, "tax": "0"},
        {"min": 12001, "max": 15000, "tax": "100"},
        {"min": 15001, "max": 25000, "tax": "150"},
        {"min": 25001, "max": None, "tax": "200"},
    ],
    "odisha": [
        {"min": 0, "max": 13304, "tax": "0"},
        {"min": 13305, "max": 25000, "tax": "125"},
        {"min": 25001, "max": None, "tax": "200"},
    ],
    "assam": [
        {"min": 0, "max": 10000, "tax": "0"},
        {"min": 10001, "max": 15000, "tax": "150"},
        {"min": 15001, "max": 25000, "tax": "180"},
        {"min": 25001, "max": None, "tax": "208"},
    ],
    "meghalaya": [
        {"min": 0, "max": 4166, "tax": "0"},
        {"min": 4167, "max": 6250, "tax": "16.50"},
        {"min": 6251, "max": 8333, "tax": "25"},
        {"min": 8334, "max": 12500, "tax": "41.50"},
        {"min": 12501, "max": None, "tax": "166.50"},
    ],
}


@router.get("/professional-tax")
def list_professional_tax_states():
    return {
        "states": [
            {"code": code, "name": code.replace("_", " ").title(), "slabs_count": len(slabs)}
            for code, slabs in PROFESSIONAL_TAX_RATES.items()
        ],
    }


@router.get("/professional-tax/{state_code}")
def get_professional_tax(state_code: str):
    key = state_code.lower().replace("-", "_").replace(" ", "_")
    if key not in PROFESSIONAL_TAX_RATES:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Professional tax data not available for '{state_code}'")
    return {
        "state": key.replace("_", " ").title(),
        "state_code": key,
        "slabs": PROFESSIONAL_TAX_RATES[key],
    }


@router.get("/professional-tax/{state_code}/calculate")
def calculate_professional_tax(state_code: str, monthly_salary: Decimal):
    key = state_code.lower().replace("-", "_").replace(" ", "_")
    if key not in PROFESSIONAL_TAX_RATES:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Professional tax data not available for '{state_code}'")

    slabs = PROFESSIONAL_TAX_RATES[key]
    tax = Decimal("0")
    for slab in slabs:
        slab_min = Decimal(str(slab["min"]))
        slab_max = Decimal(str(slab["max"])) if slab["max"] is not None else None
        if slab_max is None or monthly_salary <= slab_max:
            if monthly_salary >= slab_min:
                tax_str = str(slab["tax"]).split(" ")[0]
                tax = Decimal(tax_str)
            break
    return {
        "state": key.replace("_", " ").title(),
        "monthly_salary": str(monthly_salary),
        "professional_tax": str(tax),
        "annual_tax": str(tax * Decimal("12")),
    }
