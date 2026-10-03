"""Statutory filing model."""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy import Date, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, Money, TimestampMixin


class FilingType(str, Enum):
    PF_MONTHLY = "pf_monthly"
    ESI_MONTHLY = "esi_monthly"
    TDS_QUARTERLY = "tds_quarterly"
    PT_MONTHLY = "pt_monthly"


class FilingStatus(str, Enum):
    PENDING = "pending"
    FILED = "filed"
    ACKNOWLEDGED = "acknowledged"
    LATE = "late"


class StatutoryFiling(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "statutory_filings"

    id: Mapped[int] = mapped_column(primary_key=True)
    filing_type: Mapped[FilingType] = mapped_column(nullable=False)
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[FilingStatus] = mapped_column(default=FilingStatus.PENDING)
    amount: Mapped[Decimal] = mapped_column(Money, nullable=False)
    reference_number: Mapped[str | None] = mapped_column(String(100), default=None)
    filed_at: Mapped[datetime | None] = mapped_column(DateTime, default=None)
    notes: Mapped[str | None] = mapped_column(Text, default=None)
