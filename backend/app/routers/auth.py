"""Auth router: register, login, me."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_business, get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.models.business import Business
from app.models.user import User
from app.schemas.auth import (
    BusinessOut,
    MeOut,
    RegisterRequest,
    RegisterResponse,
    Token,
    UserOut,
)

router = APIRouter()


@router.post("/auth/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered.")

    business = Business(company_name=body.company_name, pan=body.pan)
    db.add(business)
    db.flush()

    user = User(
        business_id=business.id,
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.refresh(business)

    token = create_access_token(user.id)
    return RegisterResponse(
        user=UserOut.model_validate(user),
        business=BusinessOut.model_validate(business),
        token=Token(access_token=token),
    )


@router.post("/auth/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated.")
    token = create_access_token(user.id)
    return Token(access_token=token)


@router.get("/auth/me")
def me(
    current_user: User = Depends(get_current_user),
    business: Business = Depends(get_current_business),
):
    return {
        "data": MeOut(
            **UserOut.model_validate(current_user).model_dump(),
            business=BusinessOut.model_validate(business),
        )
    }
