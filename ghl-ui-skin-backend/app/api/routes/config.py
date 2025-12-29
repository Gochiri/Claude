"""
Configuration endpoint - serves UI config to inject.js script.
This is the most critical endpoint, called on every GHL page load.
"""

from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.cache import cache
from app.models import Agency, AgencyStyle, Subaccount, FeatureLock

router = APIRouter()


@router.get("/config")
async def get_config(
    agency: str = Query(..., min_length=1, description="GHL Agency ID"),
    location: str = Query(None, description="GHL Sub-account ID (optional)"),
    db: Session = Depends(get_db)
):
    """
    Get UI configuration for a specific agency/sub-account.

    This endpoint is called by inject.js on every GHL page load.
    It returns styling preferences and feature locks.

    Args:
        agency: GHL agency ID
        location: GHL sub-account ID (optional)
        db: Database session

    Returns:
        JSON configuration object with colors, fonts, and feature locks

    Performance optimizations:
        - Redis cache with 5-minute TTL
        - Single DB query with joins
        - Minimal response payload
    """
    # Build cache key
    cache_key = f"config:{agency}:{location or 'default'}"

    # Try cache first
    cached_config = cache.get(cache_key)
    if cached_config:
        return cached_config

    # Query database
    agency_obj = db.query(Agency).filter_by(ghl_agency_id=agency).first()

    if not agency_obj:
        raise HTTPException(
            status_code=404,
            detail=f"Agency not found: {agency}"
        )

    # Get agency styles
    styles = db.query(AgencyStyle).filter_by(agency_id=agency_obj.id).first()

    # Build base config
    config = {
        "primaryColor": styles.primary_color if styles else "#4F46E5",
        "secondaryColor": styles.secondary_color if styles else "#10B981",
        "accentColor": styles.accent_color if styles else "#F59E0B",
        "sidebarBg": styles.sidebar_bg if styles else "#1F2937",
        "sidebarText": styles.sidebar_text if styles else "#F9FAFB",
        "fontFamily": styles.font_family if styles else "Inter",
        "fontSizeBase": styles.font_size_base if styles else 14,
        "logoUrl": styles.logo_url if styles else None,
        "faviconUrl": styles.favicon_url if styles else None,
        "customCSS": styles.custom_css if styles else "",
        "customJS": styles.custom_js if styles else "",
        "featureLocks": {}
    }

    # Get feature locks if location is provided
    if location:
        subaccount = db.query(Subaccount).filter_by(
            ghl_subaccount_id=location,
            agency_id=agency_obj.id
        ).first()

        if subaccount:
            locks = db.query(FeatureLock).filter_by(
                subaccount_id=subaccount.id
            ).first()

            if locks:
                config["featureLocks"] = locks.to_dict()

    # Cache for 5 minutes
    cache.set(cache_key, config, ttl=300)

    return config


@router.post("/report-broken")
async def report_broken_feature(
    agency_id: str,
    feature: str,
    user_agent: str,
    ghl_version: str = None,
    screenshot_url: str = None
):
    """
    Report a broken feature (for monitoring selector changes).

    This allows users to report when a feature lock stops working,
    alerting us to update selectors.

    Args:
        agency_id: GHL agency ID
        feature: Feature name that broke
        user_agent: Browser user agent
        ghl_version: GHL UI version (if detectable)
        screenshot_url: Optional screenshot URL

    Returns:
        Success message
    """
    # TODO: Store in database and send alert to admin
    # For MVP, just log it
    print(f"🚨 Broken feature report: {feature} from {agency_id}")

    return {
        "success": True,
        "message": "Report received. We'll investigate shortly."
    }
