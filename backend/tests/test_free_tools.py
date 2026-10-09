"""Tests for free tools API endpoints (no auth required)."""
import zipfile
import io


def test_generate_payslip_standard(client):
    resp = client.post("/api/v1/free/payslip", json={
        "company_name": "Test Corp",
        "employee_name": "Ravi Kumar",
        "designation": "Engineer",
        "month": 3,
        "year": 2026,
        "earnings": {"basic_salary": "50000", "hra": "20000"},
        "deductions": {"provident_fund": "1800", "professional_tax": "200"},
        "template": "standard",
    })
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/pdf"
    assert resp.content[:4] == b"%PDF"


def test_generate_payslip_corporate(client):
    resp = client.post("/api/v1/free/payslip", json={
        "company_name": "MegaCorp Ltd",
        "employee_name": "Priya Sharma",
        "designation": "Manager",
        "month": 6,
        "year": 2026,
        "earnings": {"basic_salary": "75000"},
        "deductions": {},
        "template": "corporate",
    })
    assert resp.status_code == 200
    assert resp.content[:4] == b"%PDF"


def test_generate_payslip_modern(client):
    resp = client.post("/api/v1/free/payslip", json={
        "company_name": "StartupXYZ",
        "employee_name": "Amit Patel",
        "designation": "Developer",
        "month": 12,
        "year": 2025,
        "earnings": {"basic_salary": "30000", "da": "5000", "medical": "1500"},
        "deductions": {"esi": "158", "tds": "2000"},
        "template": "modern",
    })
    assert resp.status_code == 200
    assert resp.content[:4] == b"%PDF"


def test_generate_payslip_missing_company_name(client):
    resp = client.post("/api/v1/free/payslip", json={
        "employee_name": "Test",
        "designation": "Dev",
        "month": 1,
        "year": 2026,
        "earnings": {"basic_salary": "10000"},
        "deductions": {},
    })
    assert resp.status_code == 422


def test_generate_payslip_invalid_month(client):
    resp = client.post("/api/v1/free/payslip", json={
        "company_name": "Test",
        "employee_name": "Test",
        "designation": "Dev",
        "month": 13,
        "year": 2026,
        "earnings": {"basic_salary": "10000"},
        "deductions": {},
    })
    assert resp.status_code == 422


def test_batch_payslips(client):
    resp = client.post("/api/v1/free/payslip/batch", json={
        "company_name": "Test Corp",
        "employee_name": "Ravi Kumar",
        "designation": "Engineer",
        "months": [{"month": 1, "year": 2026}, {"month": 2, "year": 2026}, {"month": 3, "year": 2026}],
        "earnings": {"basic_salary": "50000"},
        "deductions": {"provident_fund": "1800"},
        "template": "standard",
    })
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/zip"
    zf = zipfile.ZipFile(io.BytesIO(resp.content))
    assert len(zf.namelist()) == 3
    for name in zf.namelist():
        assert name.endswith(".pdf")
        assert zf.read(name)[:4] == b"%PDF"


def test_batch_payslips_empty_months(client):
    resp = client.post("/api/v1/free/payslip/batch", json={
        "company_name": "Test",
        "employee_name": "Test",
        "designation": "Dev",
        "months": [],
        "earnings": {"basic_salary": "10000"},
        "deductions": {},
    })
    assert resp.status_code == 422


def test_ctc_breakdown(client):
    resp = client.post("/api/v1/free/ctc-breakdown", json={
        "annual_ctc": "1200000",
        "metro": True,
        "include_esi": False,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["annual_ctc"] == "1200000"
    assert data["metro"] is True
    assert "earnings" in data
    assert "deductions" in data
    assert "net_salary" in data


def test_ctc_breakdown_low_salary(client):
    resp = client.post("/api/v1/free/ctc-breakdown", json={
        "annual_ctc": "200000",
        "metro": False,
        "include_esi": True,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["include_esi"] is True


def test_ctc_breakdown_invalid(client):
    resp = client.post("/api/v1/free/ctc-breakdown", json={
        "annual_ctc": "-100",
    })
    assert resp.status_code == 422


def test_list_professional_tax_states(client):
    resp = client.get("/api/v1/free/professional-tax")
    assert resp.status_code == 200
    data = resp.json()
    assert "states" in data
    codes = [s["code"] for s in data["states"]]
    assert "maharashtra" in codes
    assert "karnataka" in codes


def test_get_professional_tax_slabs(client):
    resp = client.get("/api/v1/free/professional-tax/maharashtra")
    assert resp.status_code == 200
    data = resp.json()
    assert data["state_code"] == "maharashtra"
    assert len(data["slabs"]) > 0


def test_get_professional_tax_not_found(client):
    resp = client.get("/api/v1/free/professional-tax/invalid_state")
    assert resp.status_code == 404


def test_calculate_professional_tax(client):
    resp = client.get("/api/v1/free/professional-tax/maharashtra/calculate?monthly_salary=25000")
    assert resp.status_code == 200
    data = resp.json()
    assert data["professional_tax"] == "200"
    assert data["annual_tax"] == "2400"


def test_calculate_professional_tax_low_salary(client):
    resp = client.get("/api/v1/free/professional-tax/maharashtra/calculate?monthly_salary=5000")
    assert resp.status_code == 200
    data = resp.json()
    assert data["professional_tax"] == "0"


def test_calculate_professional_tax_mid_slab(client):
    resp = client.get("/api/v1/free/professional-tax/maharashtra/calculate?monthly_salary=8000")
    assert resp.status_code == 200
    data = resp.json()
    assert data["professional_tax"] == "175"
