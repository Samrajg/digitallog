from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID
import models

class AdminBase(BaseModel):
    email: EmailStr
    role: models.Role

class AdminCreate(AdminBase):
    password: str

class Admin(AdminBase):
    id: UUID
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class QRCodeBase(BaseModel):
    type: models.QRType
    label: str
    url: str
    is_active: bool = True

class QRCodeCreate(QRCodeBase):
    pass

class QRCode(QRCodeBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

class VisitorBase(BaseModel):
    full_name: str
    phone: str
    purpose: str
    person_to_meet: str
    qr_id: UUID

class VisitorCreate(VisitorBase):
    pass

class Visitor(VisitorBase):
    id: UUID
    entry_time: datetime
    status: models.VisitorStatus
    class Config:
        from_attributes = True

class VehicleBase(BaseModel):
    driver_name: str
    vehicle_number: str
    vehicle_type: str
    purpose: str
    qr_id: UUID

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: UUID
    entry_time: datetime
    permitted: bool
    watchman_pin_verified: bool
    class Config:
        from_attributes = True
