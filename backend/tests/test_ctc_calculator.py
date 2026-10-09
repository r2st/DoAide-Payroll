"""Tests for CTC breakdown calculator service."""
from decimal import Decimal

from app.services.ctc_calculator import compute_ctc_breakdown


def test_basic_ctc_breakdown():
    result = compute_ctc_breakdown(Decimal("1200000"))
    assert result["annual_ctc"] == "1200000"
    assert result["monthly_ctc"] == "100000.00"
    assert result["earnings"]["basic"]["annual"] == "600000.00"
    assert result["earnings"]["basic"]["monthly"] == "50000.00"
    assert result["metro"] is False


def test_metro_hra():
    result = compute_ctc_breakdown(Decimal("1200000"), metro=True)
    hra_annual = Decimal(result["earnings"]["hra"]["annual"])
    basic_annual = Decimal(result["earnings"]["basic"]["annual"])
    assert hra_annual == (basic_annual * Decimal("0.50")).quantize(Decimal("0.01"))


def test_non_metro_hra():
    result = compute_ctc_breakdown(Decimal("1200000"), metro=False)
    hra_annual = Decimal(result["earnings"]["hra"]["annual"])
    basic_annual = Decimal(result["earnings"]["basic"]["annual"])
    assert hra_annual == (basic_annual * Decimal("0.40")).quantize(Decimal("0.01"))


def test_pf_capped_at_15000():
    result = compute_ctc_breakdown(Decimal("1200000"))
    pf_monthly = Decimal(result["deductions"]["pf_employee"]["monthly"])
    assert pf_monthly == Decimal("1800.00")


def test_pf_low_salary_uncapped():
    result = compute_ctc_breakdown(Decimal("240000"))
    basic_monthly = Decimal(result["earnings"]["basic"]["monthly"])
    pf_monthly = Decimal(result["deductions"]["pf_employee"]["monthly"])
    expected = (basic_monthly * Decimal("0.12")).quantize(Decimal("0.01"))
    assert pf_monthly == expected


def test_esi_excluded_by_default():
    result = compute_ctc_breakdown(Decimal("1200000"), include_esi=False)
    assert result["deductions"]["esi_employee"]["monthly"] == "0"
    assert result["employer_contributions"]["esi_employer"]["monthly"] == "0"


def test_esi_included_high_salary_not_applicable():
    result = compute_ctc_breakdown(Decimal("1200000"), include_esi=True)
    assert result["deductions"]["esi_employee"]["monthly"] == "0"


def test_esi_included_low_salary():
    result = compute_ctc_breakdown(Decimal("200000"), include_esi=True)
    esi_emp = Decimal(result["deductions"]["esi_employee"]["monthly"])
    assert esi_emp > 0


def test_professional_tax():
    result = compute_ctc_breakdown(Decimal("600000"))
    pt = Decimal(result["deductions"]["professional_tax"]["monthly"])
    assert pt == Decimal("200.00")


def test_net_salary_positive():
    result = compute_ctc_breakdown(Decimal("1200000"))
    net_monthly = Decimal(result["net_salary"]["monthly"])
    assert net_monthly > 0


def test_net_equals_gross_minus_deductions():
    result = compute_ctc_breakdown(Decimal("1200000"))
    gross = Decimal(result["gross"]["monthly"])
    deductions = Decimal(result["deductions"]["total"]["monthly"])
    net = Decimal(result["net_salary"]["monthly"])
    assert net == gross - deductions


def test_ctc_equals_gross_plus_employer_contributions():
    result = compute_ctc_breakdown(Decimal("1200000"))
    gross = Decimal(result["gross"]["annual"])
    employer = Decimal(result["employer_contributions"]["total"]["annual"])
    total = gross + employer
    assert total == Decimal("1200000")
