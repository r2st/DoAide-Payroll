"""CTC breakdown calculator — backend implementation of the frontend-only calculator."""
from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

_CENT = Decimal("0.01")
_PF_RATE = Decimal("0.12")
_PF_BASIC_CAP = Decimal("15000.00")
_ESI_EMPLOYEE_RATE = Decimal("0.0075")
_ESI_EMPLOYER_RATE = Decimal("0.0325")
_ESI_GROSS_CAP = Decimal("21000.00")
_MONTHLY_PT = Decimal("200.00")


def _q(v: Decimal) -> Decimal:
    return v.quantize(_CENT, rounding=ROUND_HALF_UP)


def compute_ctc_breakdown(
    annual_ctc: Decimal,
    metro: bool = False,
    include_esi: bool = False,
) -> dict:
    monthly_ctc = _q(annual_ctc / Decimal("12"))

    basic_annual = _q(annual_ctc * Decimal("0.50"))
    basic_monthly = _q(basic_annual / Decimal("12"))

    hra_pct = Decimal("0.50") if metro else Decimal("0.40")
    hra_annual = _q(basic_annual * hra_pct)
    hra_monthly = _q(hra_annual / Decimal("12"))

    pf_base = min(basic_monthly, _PF_BASIC_CAP)
    pf_employee_monthly = _q(pf_base * _PF_RATE)
    pf_employer_monthly = _q(pf_base * _PF_RATE)
    pf_employee_annual = _q(pf_employee_monthly * Decimal("12"))
    pf_employer_annual = _q(pf_employer_monthly * Decimal("12"))

    gross_monthly_estimate = monthly_ctc - pf_employer_monthly
    esi_employee_monthly = Decimal("0")
    esi_employer_monthly = Decimal("0")
    if include_esi and gross_monthly_estimate <= _ESI_GROSS_CAP:
        esi_employee_monthly = _q(gross_monthly_estimate * _ESI_EMPLOYEE_RATE)
        esi_employer_monthly = _q(gross_monthly_estimate * _ESI_EMPLOYER_RATE)
    esi_employee_annual = _q(esi_employee_monthly * Decimal("12"))
    esi_employer_annual = _q(esi_employer_monthly * Decimal("12"))

    pt_monthly = _MONTHLY_PT
    pt_annual = _q(pt_monthly * Decimal("12"))

    employer_contributions_annual = pf_employer_annual + esi_employer_annual
    gross_annual = _q(annual_ctc - employer_contributions_annual)
    gross_monthly = _q(gross_annual / Decimal("12"))

    special_allowance_annual = _q(gross_annual - basic_annual - hra_annual)
    special_allowance_monthly = _q(special_allowance_annual / Decimal("12"))

    total_deductions_monthly = pf_employee_monthly + esi_employee_monthly + pt_monthly
    total_deductions_annual = _q(total_deductions_monthly * Decimal("12"))

    net_monthly = _q(gross_monthly - total_deductions_monthly)
    net_annual = _q(net_monthly * Decimal("12"))

    return {
        "annual_ctc": str(annual_ctc),
        "monthly_ctc": str(monthly_ctc),
        "metro": metro,
        "include_esi": include_esi,
        "earnings": {
            "basic": {"monthly": str(basic_monthly), "annual": str(basic_annual)},
            "hra": {"monthly": str(hra_monthly), "annual": str(hra_annual)},
            "special_allowance": {
                "monthly": str(special_allowance_monthly),
                "annual": str(special_allowance_annual),
            },
        },
        "gross": {"monthly": str(gross_monthly), "annual": str(gross_annual)},
        "deductions": {
            "pf_employee": {"monthly": str(pf_employee_monthly), "annual": str(pf_employee_annual)},
            "esi_employee": {"monthly": str(esi_employee_monthly), "annual": str(esi_employee_annual)},
            "professional_tax": {"monthly": str(pt_monthly), "annual": str(pt_annual)},
            "total": {"monthly": str(total_deductions_monthly), "annual": str(total_deductions_annual)},
        },
        "employer_contributions": {
            "pf_employer": {"monthly": str(pf_employer_monthly), "annual": str(pf_employer_annual)},
            "esi_employer": {"monthly": str(esi_employer_monthly), "annual": str(esi_employer_annual)},
            "total": {
                "monthly": str(_q(pf_employer_monthly + esi_employer_monthly)),
                "annual": str(employer_contributions_annual),
            },
        },
        "net_salary": {"monthly": str(net_monthly), "annual": str(net_annual)},
    }
