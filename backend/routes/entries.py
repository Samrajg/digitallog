from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..database import get_db
import datetime

router = APIRouter(prefix="/entries", tags=["entries"])

@router.post("/visitor", response_model=schemas.Visitor)
async def create_visitor_entry(visitor: schemas.VisitorCreate, db: Session = Depends(get_db)):
    # Verify QR code exists and is active
    qr = db.query(models.QRCode).filter(models.QRCode.id == visitor.qr_id, models.QRCode.is_active == True).first()
    if not qr:
        raise HTTPException(status_code=404, detail="Invalid or inactive QR code")

    db_visitor = models.Visitor(**visitor.dict())
    db.add(db_visitor)
    db.commit()
    db.refresh(db_visitor)
    return db_visitor

@router.post("/vehicle", response_model=schemas.Vehicle)
async def create_vehicle_entry(vehicle: schemas.VehicleCreate, db: Session = Depends(get_db)):
    # Verify QR code exists and is active
    qr = db.query(models.QRCode).filter(models.QRCode.id == vehicle.qr_id, models.QRCode.is_active == True).first()
    if not qr:
        raise HTTPException(status_code=404, detail="Invalid or inactive QR code")

    db_vehicle = models.Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@router.get("/visitors", response_model=List[schemas.Visitor])
async def get_visitors(db: Session = Depends(get_db)):
    return db.query(models.Visitor).all()

@router.get("/vehicles", response_model=List[schemas.Vehicle])
async def get_vehicles(db: Session = Depends(get_db)):
    return db.query(models.Vehicle).all()
