"""Shared FastAPI dependencies: the current user and business."""
from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.business import Business
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_v1_prefix}/auth/login")

_credentials_exc = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

_RANK: dict[UserRole, int] = {
    UserRole.VIEWER: 0,
    UserRole.ACCOUNTANT: 1,
    UserRole.OWNER: 2,
}


def get_current_user(
    request: Request, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    subject = decode_access_token(token)
    if subject is None:
        raise _credentials_exc
    try:
        user_id = int(subject)
    except (TypeError, ValueError) as exc:
        raise _credentials_exc from exc
    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise _credentials_exc
    request.state.user_id = user.id
    return user


def get_current_business(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Business:
    business = db.get(Business, current_user.business_id)
    if business is None or not business.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This business has been deactivated.",
        )
    request.state.business_id = business.id
    request.state.role = current_user.role.value
    return business


class RequireRole:
    def __init__(self, minimum: UserRole) -> None:
        self.minimum = minimum

    def __call__(
        self,
        current_user: User = Depends(get_current_user),
        business: Business = Depends(get_current_business),
    ) -> User:
        if _RANK[current_user.role] < _RANK[self.minimum]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Your role '{current_user.role.value}' does not have sufficient permissions.",
            )
        return current_user


require_writer = RequireRole(UserRole.ACCOUNTANT)
