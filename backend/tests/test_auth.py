def test_register(client):
    res = client.post("/api/v1/auth/register", json={
        "email": "new@example.com",
        "password": "password123",
        "full_name": "New User",
        "company_name": "New Corp",
    })
    assert res.status_code == 201
    data = res.json()
    assert data["user"]["email"] == "new@example.com"
    assert data["business"]["company_name"] == "New Corp"
    assert "access_token" in data["token"]


def test_register_duplicate(client):
    payload = {
        "email": "dup@example.com",
        "password": "password123",
        "full_name": "Dup User",
        "company_name": "Dup Corp",
    }
    client.post("/api/v1/auth/register", json=payload)
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 409


def test_login(client):
    client.post("/api/v1/auth/register", json={
        "email": "login@example.com",
        "password": "password123",
        "full_name": "Login User",
        "company_name": "Login Corp",
    })
    res = client.post("/api/v1/auth/login", data={
        "username": "login@example.com",
        "password": "password123",
    })
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_invalid(client):
    res = client.post("/api/v1/auth/login", data={
        "username": "nobody@example.com",
        "password": "wrong",
    })
    assert res.status_code == 401


def test_me(auth_client):
    res = auth_client.get("/api/v1/auth/me")
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["email"] == "test@example.com"
    assert "business" in data


def test_me_unauthenticated(client):
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401
