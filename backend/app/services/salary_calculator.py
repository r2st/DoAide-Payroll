"""Indian payroll salary computation engine."""
from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

from app.models.mixins import ZERO

_CENT = Decimal("0.01")
_PF_RATE = Decimal("0.12")
_PF_BASIC_CAP = Decimal("15000.00")
_ESI_EMPLOYEE_RATE = Decimal("0.0075")
_ESI_EMPLOYER_RATE = Decimal("0.0325")
_ESI_GROSS_CAP = Decimal("21000.00")


def _q(v: Decimal) -> Decimal:
    return v.quantize(_CENT, rounding=ROUND_HALF_UP)


def compute_monthly_salary(
    basic_salary: Decimal,
    hra_percentage: Decimal,
    da_percentage: Decimal,
    special_allowance: Decimal,
    travel_allowance: Decimal,
    medical_allowance: Decimal,
    days_worked: int,
    days_in_period: int,
) -> dict[str, Decimal]:
    if days_in_period <= 0:
        return {k: ZERO for k in [
            "basic", "hra", "da", "special_allowance",
            "travel_allowance", "medical_allowance", "gross_salary",
        ]}
    ratio = Decimal(days_worked) / Decimal(days_in_period)
    basic = _q(basic_salary * ratio)
    hra = _q(basic * hra_percentage / Decimal("100"))
    da = _q(basic * da_percentage / Decimal("100"))
    sa = _q(special_allowance * ratio)
    ta = _q(travel_allowance * ratio)
    ma = _q(medical_allowance * ratio)
    gross = basic + hra + da + sa + ta + ma
    return {
        "basic": basic,
        "hra": hra,
        "da": da,
        "special_allowance": sa,
        "travel_allowance": ta,
        "medical_allowance": ma,
        "gross_salary": gross,
    }


def compute_pf(basic_monthly: Decimal, pf_applicable: bool) -> tuple[Decimal, Decimal]:
    if not pf_applicable:
        return ZERO, ZERO
    capped = min(basic_monthly, _PF_BASIC_CAP)
    employee_pf = _q(capped * _PF_RATE)
    employer_pf = _q(capped * _PF_RATE)
    return employee_pf, employer_pf


def compute_esi(gross_monthly: Decimal, esi_applicable: bool) -> tuple[Decimal, Decimal]:
    if not esi_applicable or gross_monthly > _ESI_GROSS_CAP:
        return ZERO, ZERO
    employee_esi = _q(gross_monthly * _ESI_EMPLOYEE_RATE)
    employer_esi = _q(gross_monthly * _ESI_EMPLOYER_RATE)
    return employee_esi, employer_esi


def compute_professional_tax(gross_monthly: Decimal, applicable: bool = True) -> Decimal:
    if not applicable:
        return ZERO
    if gross_monthly <= Decimal("7500"):
        return ZERO
    if gross_monthly <= Decimal("10000"):
        return Decimal("175.00")
    return Decimal("200.00")


def compute_tds(annual_income: Decimal, regime: str = "new") -> Decimal:
    if regime == "new":
        return _compute_tds_new(annual_income)
    return _compute_tds_old(annual_income)


def _compute_tds_new(annual_income: Decimal) -> Decimal:
    standard_deduction = Decimal("75000")
    taxable = max(ZERO, annual_income - standard_deduction)
    slabs = [
        (Decimal("300000"), ZERO),
        (Decimal("400000"), Decimal("0.05")),
        (Decimal("300000"), Decimal("0.10")),
        (Decimal("200000"), Decimal("0.15")),
        (Decimal("300000"), Decimal("0.20")),
        (None, Decimal("0.30")),
    ]
    return _slab_tax(taxable, slabs)


def _compute_tds_old(annual_income: Decimal) -> Decimal:
    standard_deduction = Decimal("50000")
    taxable = max(ZERO, annual_income - standard_deduction)
    slabs = [
        (Decimal("250000"), ZERO),
        (Decimal("250000"), Decimal("0.05")),
        (Decimal("500000"), Decimal("0.20")),
        (None, Decimal("0.30")),
    ]
    return _slab_tax(taxable, slabs)


def _slab_tax(taxable: Decimal, slabs: list[tuple[Decimal | None, Decimal]]) -> Decimal:
    tax = ZERO
    remaining = taxable
    for limit, rate in slabs:
        if remaining <= ZERO:
            break
        if limit is None:
            tax += _q(remaining * rate)
            break
        chunk = min(remaining, limit)
        tax += _q(chunk * rate)
        remaining -= chunk
    monthly = _q(tax / Decimal("12"))
    return monthly
