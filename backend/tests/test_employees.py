def test_create_employee(auth_client):
    res = auth_client.post("/api/v1/employees", json={
        "employee_code": "EMP001",
        "full_name": "Alice Smith",
        "email": "alice@example.com",
        "date_of_joining": "2024-01-15",
        "department": "Engineering",
        "designation": "Developer",
    })
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["employee_code"] == "EMP001"
    assert data["full_name"] == "Alice Smith"


def test_list_employees(auth_client):
    auth_client.post("/api/v1/employees", json={
        "employee_code": "EMP002",
        "full_name": "Bob Jones",
        "date_of_joining": "2024-02-01",
    })
    res = auth_client.get("/api/v1/employees")
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["total"] >= 1


def test_get_employee(auth_client):
    create = auth_client.post("/api/v1/employees", json={
        "employee_code": "EMP003",
        "full_name": "Charlie",
        "date_of_joining": "2024-03-01",
    })
    emp_id = create.json()["data"]["id"]
    res = auth_client.get(f"/api/v1/employees/{emp_id}")
    assert res.status_code == 200
    assert res.json()["data"]["full_name"] == "Charlie"


def test_update_employee(auth_client):
    create = auth_client.post("/api/v1/employees", json={
        "employee_code": "EMP004",
        "full_name": "Diana",
        "date_of_joining": "2024-04-01",
    })
    emp_id = create.json()["data"]["id"]
    res = auth_client.put(f"/api/v1/employees/{emp_id}", json={
        "department": "Finance",
    })
    assert res.status_code == 200
    assert res.json()["data"]["department"] == "Finance"


def test_delete_employee(auth_client):
    create = auth_client.post("/api/v1/employees", json={
        "employee_code": "EMP005",
        "full_name": "Eve",
        "date_of_joining": "2024-05-01",
    })
    emp_id = create.json()["data"]["id"]
    res = auth_client.delete(f"/api/v1/employees/{emp_id}")
    assert res.status_code == 200
    assert res.json()["data"]["deleted"] is True


def test_employee_not_found(auth_client):
    res = auth_client.get("/api/v1/employees/99999")
    assert res.status_code == 404
