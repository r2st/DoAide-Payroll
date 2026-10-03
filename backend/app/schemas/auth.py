"""Auth schemas."""
from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class BusinessCreate(BaseModel):
    company_name: str = Field(min_length=2)
    pan: str | None = Field(default=None, pattern=r"^[A-Z]{5}[0-9]{4}[A-Z]$")
    gstin: str | None = None


class BusinessOut(BaseModel):
    id: int
    company_name: str
    trade_name: str | None = None
    pan: str | None = None
    plan: str
    is_active: bool

    model_config = {"from_attributes": True}


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    phone: str | None = None
    role: str
    is_active: bool

    model_config = {"from_attributes": True}


class MeOut(UserOut):
    business: BusinessOut


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1)
    company_name: str = Field(min_length=2)
    pan: str | None = Field(default=None, pattern=r"^[A-Z]{5}[0-9]{4}[A-Z]$")


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterResponse(BaseModel):
    user: UserOut
    business: BusinessOut
    token: Token
