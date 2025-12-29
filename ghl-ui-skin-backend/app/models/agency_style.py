"""Agency Style model - stores UI customization preferences."""

from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class AgencyStyle(Base):
    """
    Agency Style model.
    Stores visual customization settings for an agency.
    """

    __tablename__ = "agency_styles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agency_id = Column(
        UUID(as_uuid=True),
        ForeignKey("agencies.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    # Colors (hex format)
    primary_color = Column(String(7), default="#4F46E5")
    secondary_color = Column(String(7), default="#10B981")
    accent_color = Column(String(7), default="#F59E0B")
    sidebar_bg = Column(String(7), default="#1F2937")
    sidebar_text = Column(String(7), default="#F9FAFB")

    # Typography
    font_family = Column(String(100), default="Inter")
    font_size_base = Column(Integer, default=14)

    # Branding
    logo_url = Column(Text, nullable=True)
    favicon_url = Column(Text, nullable=True)

    # Custom CSS/JS
    custom_css = Column(Text, nullable=True)
    custom_js = Column(Text, nullable=True)

    # Timestamp
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationship
    agency = relationship("Agency", backref="style", uselist=False)

    def __repr__(self):
        return f"<AgencyStyle for Agency {self.agency_id}>"
