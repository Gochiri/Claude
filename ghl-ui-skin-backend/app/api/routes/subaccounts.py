"""Sub-accounts and feature locks management."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.cache import cache
from app.models import Agency, Subaccount, FeatureLock
from app.models.agency import PlanTier
from app.api.routes.auth import get_current_agency

router = APIRouter()


# Pydantic schemas
class SubaccountCreateRequest(BaseModel):
    ghl_subaccount_id: str
    name: str
    plan_tier: PlanTier = PlanTier.FREE


class FeatureLocksUpdateRequest(BaseModel):
    hide_dashboard: bool = False
    hide_conversations: bool = False
    hide_calendar: bool = False
    hide_contacts: bool = False
    hide_opportunities: bool = False
    hide_payments: bool = False
    hide_sites: bool = False
    hide_funnels: bool = False
    hide_workflows: bool = False
    hide_triggers: bool = False
    hide_reporting: bool = False
    hide_memberships: bool = False
    hide_marketing: bool = False
    disable_exports: bool = False
    disable_bulk_actions: bool = False


@router.get("/")
async def list_subaccounts(
    current_agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """List all sub-accounts for current agency."""
    subaccounts = db.query(Subaccount).filter_by(
        agency_id=current_agency.id
    ).all()

    return [
        {
            "id": str(sub.id),
            "ghl_subaccount_id": sub.ghl_subaccount_id,
            "name": sub.name,
            "plan_tier": sub.plan_tier,
            "created_at": sub.created_at.isoformat()
        }
        for sub in subaccounts
    ]


@router.post("/")
async def create_subaccount(
    request: SubaccountCreateRequest,
    current_agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """Create a new sub-account."""
    # Check if sub-account already exists
    existing = db.query(Subaccount).filter_by(
        ghl_subaccount_id=request.ghl_subaccount_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Sub-account already exists"
        )

    # Create sub-account
    subaccount = Subaccount(
        agency_id=current_agency.id,
        ghl_subaccount_id=request.ghl_subaccount_id,
        name=request.name,
        plan_tier=request.plan_tier
    )

    db.add(subaccount)
    db.commit()
    db.refresh(subaccount)

    return {
        "success": True,
        "id": str(subaccount.id),
        "message": "Sub-account created successfully"
    }


@router.get("/{subaccount_id}/feature-locks")
async def get_feature_locks(
    subaccount_id: str,
    current_agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """Get feature locks for a sub-account."""
    # Verify ownership
    subaccount = db.query(Subaccount).filter_by(
        ghl_subaccount_id=subaccount_id,
        agency_id=current_agency.id
    ).first()

    if not subaccount:
        raise HTTPException(status_code=404, detail="Sub-account not found")

    # Get feature locks
    locks = db.query(FeatureLock).filter_by(
        subaccount_id=subaccount.id
    ).first()

    if not locks:
        # Return defaults
        return FeatureLocksUpdateRequest().dict()

    return locks.to_dict()


@router.put("/{subaccount_id}/feature-locks")
async def update_feature_locks(
    subaccount_id: str,
    request: FeatureLocksUpdateRequest,
    current_agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """Update feature locks for a sub-account."""
    # Verify ownership
    subaccount = db.query(Subaccount).filter_by(
        ghl_subaccount_id=subaccount_id,
        agency_id=current_agency.id
    ).first()

    if not subaccount:
        raise HTTPException(status_code=404, detail="Sub-account not found")

    # Get or create feature locks
    locks = db.query(FeatureLock).filter_by(
        subaccount_id=subaccount.id
    ).first()

    if not locks:
        locks = FeatureLock(subaccount_id=subaccount.id)
        db.add(locks)

    # Update fields
    update_data = request.dict()
    for field, value in update_data.items():
        setattr(locks, field, value)

    db.commit()
    db.refresh(locks)

    # Invalidate cache
    cache_pattern = f"config:{current_agency.ghl_agency_id}:{subaccount_id}"
    cache.delete(cache_pattern)

    return {
        "success": True,
        "message": "Feature locks updated successfully"
    }
