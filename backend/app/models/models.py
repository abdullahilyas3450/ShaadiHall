from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Numeric, CheckConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, server_default="user")
    is_active = Column(Boolean, server_default="true")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bookings = relationship("Booking", back_populates="user")
    admin_profile = relationship("Admin", back_populates="user", uselist=False)

    __table_args__ = (
        CheckConstraint("role IN ('user', 'admin')", name="check_user_role"),
    )

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="admin_profile")

class Hall(Base):
    __tablename__ = "halls"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    description = Column(String)
    capacity = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    price_per_hour = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String)
    is_active = Column(Boolean, server_default="true")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bookings = relationship("Booking", back_populates="hall")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    hall_id = Column(UUID(as_uuid=True), ForeignKey("halls.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, nullable=False, server_default="confirmed")
    total_price = Column(Numeric(10, 2), nullable=False)
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookings")
    hall = relationship("Hall", back_populates="bookings")

    __table_args__ = (
        CheckConstraint("status IN ('confirmed', 'cancelled', 'pending')", name="check_booking_status"),
    )
