"""Feature Lock model - controls which GHL features are visible/hidden."""

from sqlalchemy import Column, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class FeatureLock(Base):
    """
    Feature Lock model.
    Controls which GHL dashboard features are hidden for a sub-account.
    """

    __tablename__ = "feature_locks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subaccount_id = Column(
        UUID(as_uuid=True),
        ForeignKey("subaccounts.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    # Sidebar menu items to hide
    hide_dashboard = Column(Boolean, default=False)
    hide_conversations = Column(Boolean, default=False)
    hide_calendar = Column(Boolean, default=False)
    hide_contacts = Column(Boolean, default=False)
    hide_opportunities = Column(Boolean, default=False)
    hide_payments = Column(Boolean, default=False)
    hide_sites = Column(Boolean, default=False)
    hide_funnels = Column(Boolean, default=False)
    hide_workflows = Column(Boolean, default=False)
    hide_triggers = Column(Boolean, default=False)
    hide_reporting = Column(Boolean, default=False)
    hide_memberships = Column(Boolean, default=False)
    hide_marketing = Column(Boolean, default=False)

    # Additional feature restrictions
    disable_exports = Column(Boolean, default=False)
    disable_bulk_actions = Column(Boolean, default=False)

    # Timestamp
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationship
    subaccount = relationship("Subaccount", backref="feature_lock", uselist=False)

    def to_dict(self):
        """Convert to dictionary for API response."""
        return {
            "dashboard": self.hide_dashboard,
            "conversations": self.hide_conversations,
            "calendar": self.hide_calendar,
            "contacts": self.hide_contacts,
            "opportunities": self.hide_opportunities,
            "payments": self.hide_payments,
            "sites": self.hide_sites,
            "funnels": self.hide_funnels,
            "workflows": self.hide_workflows,
            "triggers": self.hide_triggers,
            "reporting": self.hide_reporting,
            "memberships": self.hide_memberships,
            "marketing": self.hide_marketing,
            "exports": self.disable_exports,
            "bulk_actions": self.disable_bulk_actions
        }

    def __repr__(self):
        return f"<FeatureLock for Subaccount {self.subaccount_id}>"
