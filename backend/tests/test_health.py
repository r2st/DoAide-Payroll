def test_root(client):
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["app"] == "DoAide Payroll"
    assert data["status"] == "ok"


def test_health(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["status"] == "healthy"
    assert data["database"] == "ok"
