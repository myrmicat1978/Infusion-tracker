from typing import List, Optional

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.db import get_session
from app.models import (
    Patient,
    TreatmentPlan,
    TreatmentPlanCreate,
    TreatmentPlanRead,
    TreatmentPlanUpdate,
)

router = APIRouter()


@router.post("/", response_model=TreatmentPlanRead)
def create_plan(payload: TreatmentPlanCreate) -> TreatmentPlanRead:
    with get_session() as session:
        patient = session.get(Patient, payload.patient_id)
        if not patient:
            raise HTTPException(status_code=400, detail="Patient does not exist")
        plan = TreatmentPlan(**payload.model_dump())
        session.add(plan)
        session.commit()
        session.refresh(plan)
        return plan


@router.get("/", response_model=List[TreatmentPlanRead])
def list_plans(patient_id: Optional[int] = None) -> List[TreatmentPlanRead]:
    with get_session() as session:
        statement = select(TreatmentPlan)
        if patient_id is not None:
            statement = statement.where(TreatmentPlan.patient_id == patient_id)
        results = session.exec(statement).all()
        return results


@router.get("/{plan_id}", response_model=TreatmentPlanRead)
def get_plan(plan_id: int) -> TreatmentPlanRead:
    with get_session() as session:
        plan = session.get(TreatmentPlan, plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        return plan


@router.put("/{plan_id}", response_model=TreatmentPlanRead)
def update_plan(plan_id: int, payload: TreatmentPlanUpdate) -> TreatmentPlanRead:
    with get_session() as session:
        plan = session.get(TreatmentPlan, plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        if payload.patient_id is not None:
            patient = session.get(Patient, payload.patient_id)
            if not patient:
                raise HTTPException(status_code=400, detail="Patient does not exist")
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(plan, key, value)
        session.add(plan)
        session.commit()
        session.refresh(plan)
        return plan


@router.delete("/{plan_id}")
def delete_plan(plan_id: int) -> dict:
    with get_session() as session:
        plan = session.get(TreatmentPlan, plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        session.delete(plan)
        session.commit()
        return {"ok": True}
