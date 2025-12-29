"""Styles management endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.cache import cache
from app.models import Agency, AgencyStyle
from app.api.routes.auth import get_current_agency

router = APIRouter()


# Pydantic schemas
class StylesUpdateRequest(BaseModel):
    primary_color: str = None
    secondary_color: str = None
    accent_color: str = None
    sidebar_bg: str = None
    sidebar_text: str = None
    font_family: str = None
    font_size_base: int = None
    logo_url: str = None
    favicon_url: str = None
    custom_css: str = None
    custom_js: str = None


@router.get("/")
async def get_styles(
    current_agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """Get current agency's styles."""
    styles = db.query(AgencyStyle).filter_by(
        agency_id=current_agency.id
    ).first()

    if not styles:
        # Return defaults if no styles exist yet
        return {
            "primary_color": "#4F46E5",
            "secondary_color": "#10B981",
            "accent_color": "#F59E0B",
            "sidebar_bg": "#1F2937",
            "sidebar_text": "#F9FAFB",
            "font_family": "Inter",
            "font_size_base": 14,
            "logo_url": None,
            "favicon_url": None,
            "custom_css": "",
            "custom_js": ""
        }

    return {
        "primary_color": styles.primary_color,
        "secondary_color": styles.secondary_color,
        "accent_color": styles.accent_color,
        "sidebar_bg": styles.sidebar_bg,
        "sidebar_text": styles.sidebar_text,
        "font_family": styles.font_family,
        "font_size_base": styles.font_size_base,
        "logo_url": styles.logo_url,
        "favicon_url": styles.favicon_url,
        "custom_css": styles.custom_css,
        "custom_js": styles.custom_js
    }


@router.put("/")
async def update_styles(
    request: StylesUpdateRequest,
    current_agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """Update agency styles."""
    # Get or create styles
    styles = db.query(AgencyStyle).filter_by(
        agency_id=current_agency.id
    ).first()

    if not styles:
        styles = AgencyStyle(agency_id=current_agency.id)
        db.add(styles)

    # Update fields (only if provided)
    update_data = request.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(styles, field, value)

    db.commit()
    db.refresh(styles)

    # Invalidate cache for this agency
    cache_pattern = f"config:{current_agency.ghl_agency_id}:*"
    cache.delete_pattern(cache_pattern)

    return {
        "success": True,
        "message": "Styles updated successfully"
    }
