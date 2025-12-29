"""Authentication endpoints - login, register, token management."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models import Agency

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Pydantic schemas
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    ghl_agency_id: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


# Helper functions
def hash_password(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.JWT_EXPIRATION_MINUTES
        )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt


def get_current_agency(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Agency:
    """Dependency to get current authenticated agency."""
    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        agency_id: str = payload.get("sub")
        if agency_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    agency = db.query(Agency).filter_by(ghl_agency_id=agency_id).first()
    if agency is None:
        raise credentials_exception

    return agency


# Routes
@router.post("/register", response_model=TokenResponse)
async def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new agency.

    Args:
        request: Registration data (name, email, password, ghl_agency_id)
        db: Database session

    Returns:
        JWT access token

    Raises:
        400: If email or GHL agency ID already exists
    """
    # Check if email already exists
    existing_email = db.query(Agency).filter_by(email=request.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if GHL agency ID already exists
    existing_agency = db.query(Agency).filter_by(
        ghl_agency_id=request.ghl_agency_id
    ).first()
    if existing_agency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GHL Agency ID already registered"
        )

    # Create new agency
    new_agency = Agency(
        name=request.name,
        email=request.email,
        password_hash=hash_password(request.password),
        ghl_agency_id=request.ghl_agency_id
    )

    db.add(new_agency)
    db.commit()
    db.refresh(new_agency)

    # Create access token
    access_token = create_access_token(
        data={"sub": new_agency.ghl_agency_id}
    )

    return TokenResponse(
        access_token=access_token,
        expires_in=settings.JWT_EXPIRATION_MINUTES * 60
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login with email and password.

    Args:
        request: Login credentials (email, password)
        db: Database session

    Returns:
        JWT access token

    Raises:
        401: If credentials are invalid
    """
    # Find agency by email
    agency = db.query(Agency).filter_by(email=request.email).first()

    if not agency or not verify_password(request.password, agency.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": agency.ghl_agency_id}
    )

    return TokenResponse(
        access_token=access_token,
        expires_in=settings.JWT_EXPIRATION_MINUTES * 60
    )


@router.get("/me")
async def get_current_user(
    current_agency: Agency = Depends(get_current_agency)
):
    """
    Get current authenticated agency details.

    Args:
        current_agency: Injected from JWT token

    Returns:
        Agency information (excluding password hash)
    """
    return {
        "id": str(current_agency.id),
        "ghl_agency_id": current_agency.ghl_agency_id,
        "name": current_agency.name,
        "email": current_agency.email,
        "plan_tier": current_agency.plan_tier,
        "created_at": current_agency.created_at.isoformat()
    }
