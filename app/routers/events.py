from typing import List, Optional

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.db import get_session
from app.models import (
    ARIAEvent,
    ARIAEventCreate,
    ARIAEventRead,
    ARIAEventUpdate,
    AdverseEvent,
    AdverseEventCreate,
    AdverseEventRead,
    AdverseEventUpdate,
    InfusionEvent,
    InfusionEventCreate,
    InfusionEventRead,
    InfusionEventUpdate,
    TreatmentPlan,
)

router = APIRouter()


# Infusion events
@router.post("/infusions", response_model=InfusionEventRead)
def create_infusion(payload: InfusionEventCreate) -> InfusionEventRead:
    with get_session() as session:
        plan = session.get(TreatmentPlan, payload.plan_id)
        if not plan:
            raise HTTPException(status_code=400, detail="Plan does not exist")
        event = InfusionEvent(**payload.model_dump())
        session.add(event)
        session.commit()
        session.refresh(event)
        return event


@router.get("/infusions", response_model=List[InfusionEventRead])
def list_infusions(plan_id: Optional[int] = None) -> List[InfusionEventRead]:
    with get_session() as session:
        statement = select(InfusionEvent)
        if plan_id is not None:
            statement = statement.where(InfusionEvent.plan_id == plan_id)
        results = session.exec(statement).all()
        return results


@router.get("/infusions/{event_id}", response_model=InfusionEventRead)
def get_infusion(event_id: int) -> InfusionEventRead:
    with get_session() as session:
        event = session.get(InfusionEvent, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Infusion event not found")
        return event


@router.put("/infusions/{event_id}", response_model=InfusionEventRead)
def update_infusion(event_id: int, payload: InfusionEventUpdate) -> InfusionEventRead:
    with get_session() as session:
        event = session.get(InfusionEvent, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Infusion event not found")
        if payload.plan_id is not None:
            plan = session.get(TreatmentPlan, payload.plan_id)
            if not plan:
                raise HTTPException(status_code=400, detail="Plan does not exist")
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(event, key, value)
        session.add(event)
        session.commit()
        session.refresh(event)
        return event


@router.delete("/infusions/{event_id}")
def delete_infusion(event_id: int) -> dict:
    with get_session() as session:
        event = session.get(InfusionEvent, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Infusion event not found")
        session.delete(event)
        session.commit()
        return {"ok": True}


# ARIA events
@router.post("/aria", response_model=ARIAEventRead)
def create_aria(payload: ARIAEventCreate) -> ARIAEventRead:
    with get_session() as session:
        infusion = session.get(InfusionEvent, payload.infusion_event_id)
        if not infusion:
            raise HTTPException(status_code=400, detail="Infusion event does not exist")
        event = ARIAEvent(**payload.model_dump())
        session.add(event)
        session.commit()
        session.refresh(event)
        return event


@router.get("/aria", response_model=List[ARIAEventRead])
def list_aria(infusion_event_id: Optional[int] = None) -> List[ARIAEventRead]:
    with get_session() as session:
        statement = select(ARIAEvent)
        if infusion_event_id is not None:
            statement = statement.where(ARIAEvent.infusion_event_id == infusion_event_id)
        results = session.exec(statement).all()
        return results


@router.get("/aria/{aria_id}", response_model=ARIAEventRead)
def get_aria(aria_id: int) -> ARIAEventRead:
    with get_session() as session:
        event = session.get(ARIAEvent, aria_id)
        if not event:
            raise HTTPException(status_code=404, detail="ARIA event not found")
        return event


@router.put("/aria/{aria_id}", response_model=ARIAEventRead)
def update_aria(aria_id: int, payload: ARIAEventUpdate) -> ARIAEventRead:
    with get_session() as session:
        event = session.get(ARIAEvent, aria_id)
        if not event:
            raise HTTPException(status_code=404, detail="ARIA event not found")
        if payload.infusion_event_id is not None:
            infusion = session.get(InfusionEvent, payload.infusion_event_id)
            if not infusion:
                raise HTTPException(status_code=400, detail="Infusion event does not exist")
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(event, key, value)
        session.add(event)
        session.commit()
        session.refresh(event)
        return event


@router.delete("/aria/{aria_id}")
def delete_aria(aria_id: int) -> dict:
    with get_session() as session:
        event = session.get(ARIAEvent, aria_id)
        if not event:
            raise HTTPException(status_code=404, detail="ARIA event not found")
        session.delete(event)
        session.commit()
        return {"ok": True}


# Adverse events
@router.post("/adverse", response_model=AdverseEventRead)
def create_adverse(payload: AdverseEventCreate) -> AdverseEventRead:
    with get_session() as session:
        event = AdverseEvent(**payload.model_dump())
        session.add(event)
        session.commit()
        session.refresh(event)
        return event


@router.get("/adverse", response_model=List[AdverseEventRead])
def list_adverse(patient_id: Optional[int] = None) -> List[AdverseEventRead]:
    with get_session() as session:
        statement = select(AdverseEvent)
        if patient_id is not None:
            statement = statement.where(AdverseEvent.patient_id == patient_id)
        results = session.exec(statement).all()
        return results


@router.get("/adverse/{adv_id}", response_model=AdverseEventRead)
def get_adverse(adv_id: int) -> AdverseEventRead:
    with get_session() as session:
        event = session.get(AdverseEvent, adv_id)
        if not event:
            raise HTTPException(status_code=404, detail="Adverse event not found")
        return event


@router.put("/adverse/{adv_id}", response_model=AdverseEventRead)
def update_adverse(adv_id: int, payload: AdverseEventUpdate) -> AdverseEventRead:
    with get_session() as session:
        event = session.get(AdverseEvent, adv_id)
        if not event:
            raise HTTPException(status_code=404, detail="Adverse event not found")
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(event, key, value)
        session.add(event)
        session.commit()
        session.refresh(event)
        return event


@router.delete("/adverse/{adv_id}")
def delete_adverse(adv_id: int) -> dict:
    with get_session() as session:
        event = session.get(AdverseEvent, adv_id)
        if not event:
            raise HTTPException(status_code=404, detail="Adverse event not found")
        session.delete(event)
        session.commit()
        return {"ok": True}
