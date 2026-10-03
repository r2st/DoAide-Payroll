"""Shared model mixins: timestamps, soft delete, business scoping, money."""
from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, func
from sqlalchemy.orm import Mapped, declared_attr, mapped_column

Money = Numeric(16, 2)
MONEY_MAX = Decimal("99999999999999.99")
ZERO = Decimal("0.00")


def utcnow() -> datetime:
    return datetime.now(UTC)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(default=utcnow, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        default=utcnow, onupdate=utcnow, server_default=func.now()
    )


class SoftDeleteMixin:
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)

    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None

    def soft_delete(self) -> None:
        self.deleted_at = utcnow()


class BusinessScopedMixin:
    @declared_attr
    def business_id(cls) -> Mapped[int]:
        return mapped_column(ForeignKey("businesses.id"), nullable=False, index=True)
