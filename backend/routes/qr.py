from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import models, schemas, database
from database import get_db

router = APIRouter(prefix="/qrs", tags=["qrs"])

@router.post("/", response_model=schemas.QRCode)
async def create_qr_code(qr: schemas.QRCodeCreate, db: Session = Depends(get_db)):
    db_qr = models.QRCode(**qr.dict())
    db.add(db_qr)
    db.commit()
    db.refresh(db_qr)
    return db_qr

@router.get("/", response_model=List[schemas.QRCode])
async def get_qr_codes(db: Session = Depends(get_db)):
    return db.query(models.QRCode).all()

@router.get("/{qr_id}", response_model=schemas.QRCode)
async def get_qr_code(qr_id: UUID, db: Session = Depends(get_db)):
    db_qr = db.query(models.QRCode).filter(models.QRCode.id == qr_id).first()
    if not db_qr:
        raise HTTPException(status_code=404, detail="QR code not found")
    return db_qr

@router.delete("/{qr_id}")
async def delete_qr_code(qr_id: UUID, db: Session = Depends(get_db)):
    db_qr = db.query(models.QRCode).filter(models.QRCode.id == qr_id).first()
    if not db_qr:
        raise HTTPException(status_code=404, detail="QR code not found")
    db.delete(db_qr)
    db.commit()
    return {"message": "QR code deleted"}

@router.patch("/{qr_id}/toggle", response_model=schemas.QRCode)
async def toggle_qr_code(qr_id: UUID, db: Session = Depends(get_db)):
    db_qr = db.query(models.QRCode).filter(models.QRCode.id == qr_id).first()
    if not db_qr:
        raise HTTPException(status_code=404, detail="QR code not found")
    db_qr.is_active = not db_qr.is_active
    db.commit()
    db.refresh(db_qr)
    return db_qr
