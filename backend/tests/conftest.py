import os

os.environ.setdefault("OPENROUTER_API_KEY", "")
os.environ.setdefault("JWT_SECRET", "test-jwt-secret-that-is-long-enough-for-validation")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("REDIS_URL", "unix:///dev/null")
os.environ.setdefault("BCRYPT_ROUNDS", "4")
os.environ.setdefault("ENVIRONMENT", "test")

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.core.database import Base, get_db
from app.main import app


@pytest.fixture()
def db_session():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = session_factory()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session):
    def _override():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override
    with TestClient(app) as tc:
        yield tc
    app.dependency_overrides.clear()


@pytest.fixture()
def auth_client(client):
    res = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "company_name": "Test Corp",
    })
    assert res.status_code == 201
    token = res.json()["token"]["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client
