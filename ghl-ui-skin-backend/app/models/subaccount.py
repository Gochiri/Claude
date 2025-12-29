"""Subaccount model - represents GHL sub-accounts (agency's clients)."""

from sqlalchemy import Column, String, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base
from app.models.agency import PlanTier


class Subaccount(Base):
    """
    Subaccount model.
    Represents a sub-account (client) within a GHL agency.
    """

    __tablename__ = "subaccounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agency_id = Column(
        UUID(as_uuid=True),
        ForeignKey("agencies.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    ghl_subaccount_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    plan_tier = Column(
        Enum(PlanTier),
        default=PlanTier.FREE,
        nullable=False
    )

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    agency = relationship("Agency", backref="subaccounts")

    def __repr__(self):
        return f"<Subaccount {self.name} ({self.ghl_subaccount_id})>"
