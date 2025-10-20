from datetime import timedelta
from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.db import get_session
from app.models import InfusionEvent, TreatmentPlan

router = APIRouter()


@router.get("/patient/{patient_id}")
def patient_summary(patient_id: int) -> Dict[str, Any]:
    with get_session() as session:
        plans = session.exec(
            select(TreatmentPlan).where(TreatmentPlan.patient_id == patient_id)
        ).all()
        if not plans:
            raise HTTPException(status_code=404, detail="No plans for patient")

        response: Dict[str, Any] = {"patient_id": patient_id, "plans": []}
        for plan in plans:
            last_infusion = session.exec(
                select(InfusionEvent)
                .where(InfusionEvent.plan_id == plan.id)
                .order_by(InfusionEvent.infusion_date.desc())
            ).first()

            base_date = last_infusion.infusion_date if last_infusion else plan.start_date
            next_date = base_date + timedelta(weeks=plan.interval_weeks)

            count_infusions = session.exec(
                select(InfusionEvent).where(InfusionEvent.plan_id == plan.id)
            ).all()
            num_given = len(count_infusions)
            remaining = (
                max(plan.total_planned_infusions - num_given, 0)
                if plan.total_planned_infusions is not None
                else None
            )

            response["plans"].append(
                {
                    "plan_id": plan.id,
                    "drug_name": plan.drug_name,
                    "start_date": str(plan.start_date),
                    "interval_weeks": plan.interval_weeks,
                    "total_planned_infusions": plan.total_planned_infusions,
                    "num_infusions_given": num_given,
                    "next_infusion_date": str(next_date),
                    "remaining_planned": remaining,
                }
            )
        return response
