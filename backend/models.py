from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, UUID
from sqlalchemy.orm import relationship
from database import Base
import enum
import uuid
import datetime

class QRType(enum.Enum):
    VISITOR = "visitor"
    VEHICLE = "vehicle"

class VisitorStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"

class Role(enum.Enum):
    ADMIN = "admin"
    WATCHMAN = "watchman"

class Admin(Base):
    __tablename__ = "admins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(Role), default=Role.ADMIN)

class QRCode(Base):
    __tablename__ = "qr_codes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(Enum(QRType))
    label = Column(String)
    url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String)
    phone = Column(String)
    purpose = Column(String)
    person_to_meet = Column(String)
    entry_time = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(Enum(VisitorStatus), default=VisitorStatus.PENDING)
    qr_id = Column(UUID(as_uuid=True), ForeignKey("qr_codes.id"))

    qr = relationship("QRCode")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_name = Column(String)
    vehicle_number = Column(String)
    vehicle_type = Column(String)
    purpose = Column(String)
    entry_time = Column(DateTime, default=datetime.datetime.utcnow)
    permitted = Column(Boolean, default=False)
    watchman_pin_verified = Column(Boolean, default=False)
    qr_id = Column(UUID(as_uuid=True), ForeignKey("qr_codes.id"))

    qr = relationship("QRCode")
