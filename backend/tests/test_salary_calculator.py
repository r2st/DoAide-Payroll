from decimal import Decimal

from app.services.salary_calculator import (
    compute_esi,
    compute_monthly_salary,
    compute_pf,
    compute_professional_tax,
    compute_tds,
)


def test_compute_monthly_salary_full_month():
    result = compute_monthly_salary(
        basic_salary=Decimal("30000"),
        hra_percentage=Decimal("40"),
        da_percentage=Decimal("10"),
        special_allowance=Decimal("5000"),
        travel_allowance=Decimal("2000"),
        medical_allowance=Decimal("1250"),
        days_worked=30,
        days_in_period=30,
    )
    assert result["basic"] == Decimal("30000.00")
    assert result["hra"] == Decimal("12000.00")
    assert result["da"] == Decimal("3000.00")
    assert result["gross_salary"] == Decimal("53250.00")


def test_compute_monthly_salary_prorated():
    result = compute_monthly_salary(
        basic_salary=Decimal("30000"),
        hra_percentage=Decimal("40"),
        da_percentage=Decimal("0"),
        special_allowance=Decimal("0"),
        travel_allowance=Decimal("0"),
        medical_allowance=Decimal("0"),
        days_worked=15,
        days_in_period=30,
    )
    assert result["basic"] == Decimal("15000.00")
    assert result["hra"] == Decimal("6000.00")


def test_pf_under_cap():
    emp, er = compute_pf(Decimal("10000"), True)
    assert emp == Decimal("1200.00")
    assert er == Decimal("1200.00")


def test_pf_at_cap():
    emp, er = compute_pf(Decimal("20000"), True)
    assert emp == Decimal("1800.00")
    assert er == Decimal("1800.00")


def test_pf_not_applicable():
    emp, er = compute_pf(Decimal("30000"), False)
    assert emp == Decimal("0.00")
    assert er == Decimal("0.00")


def test_esi_under_threshold():
    emp, er = compute_esi(Decimal("20000"), True)
    assert emp == Decimal("150.00")
    assert er == Decimal("650.00")


def test_esi_over_threshold():
    emp, er = compute_esi(Decimal("25000"), True)
    assert emp == Decimal("0.00")
    assert er == Decimal("0.00")


def test_professional_tax_low():
    assert compute_professional_tax(Decimal("7000")) == Decimal("0")


def test_professional_tax_mid():
    assert compute_professional_tax(Decimal("9000")) == Decimal("175.00")


def test_professional_tax_high():
    assert compute_professional_tax(Decimal("50000")) == Decimal("200.00")


def test_tds_new_regime():
    monthly = compute_tds(Decimal("600000"), "new")
    assert monthly >= Decimal("0")
    assert isinstance(monthly, Decimal)


def test_tds_old_regime():
    monthly = compute_tds(Decimal("1200000"), "old")
    assert monthly > Decimal("0")


def test_tds_below_exemption():
    monthly = compute_tds(Decimal("200000"), "new")
    assert monthly == Decimal("0.00")
