from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal

# Base Schema
class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# User Schemas
class UserBase(BaseSchema):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    role: str
    is_active: bool
    created_at: datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenRefresh(BaseModel):
    refresh_token: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Hall Schemas
class HallBase(BaseSchema):
    name: str
    description: Optional[str] = None
    capacity: int
    location: str
    price_per_hour: Decimal
    image_url: Optional[str] = None

class HallCreate(HallBase):
    pass

class HallUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    capacity: Optional[int] = None
    location: Optional[str] = None
    price_per_hour: Optional[Decimal] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class HallResponse(HallBase):
    id: UUID
    is_active: bool
    created_at: datetime

# Booking Schemas
class BookingBase(BaseSchema):
    hall_id: UUID
    title: str
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: UUID
    user_id: UUID
    status: str
    total_price: Decimal
    created_at: datetime

class BookingWithDetails(BookingResponse):
    user: UserResponse
    hall: HallResponse

# Admin Schemas
class AdminStats(BaseModel):
    total_bookings: int
    total_revenue: Decimal
    bookings_today: int
    active_halls: int

# Chat Schemas
class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    message: str
    halls: Optional[List[dict]] = None
    booking: Optional[dict] = None
