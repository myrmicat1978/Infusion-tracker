from typing import List, Optional

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.db import get_session
from app.models import (
    Patient,
    PatientCreate,
    PatientRead,
    PatientUpdate,
)

router = APIRouter()


@router.post("/", response_model=PatientRead)
def create_patient(payload: PatientCreate) -> PatientRead:
    with get_session() as session:
        patient = Patient(**payload.model_dump())
        session.add(patient)
        session.commit()
        session.refresh(patient)
        return patient


@router.get("/", response_model=List[PatientRead])
def list_patients(q: Optional[str] = None) -> List[PatientRead]:
    with get_session() as session:
        statement = select(Patient)
        if q:
            like = f"%{q}%"
            statement = statement.where(
                (Patient.first_name.ilike(like)) | (Patient.last_name.ilike(like))
            )
        results = session.exec(statement).all()
        return results


@router.get("/{patient_id}", response_model=PatientRead)
def get_patient(patient_id: int) -> PatientRead:
    with get_session() as session:
        patient = session.get(Patient, patient_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient


@router.put("/{patient_id}", response_model=PatientRead)
def update_patient(patient_id: int, payload: PatientUpdate) -> PatientRead:
    with get_session() as session:
        patient = session.get(Patient, patient_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(patient, key, value)
        session.add(patient)
        session.commit()
        session.refresh(patient)
        return patient


@router.delete("/{patient_id}")
def delete_patient(patient_id: int) -> dict:
    with get_session() as session:
        patient = session.get(Patient, patient_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        session.delete(patient)
        session.commit()
        return {"ok": True}
