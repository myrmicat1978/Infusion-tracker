from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import field_validator
from sqlmodel import Field, Relationship, SQLModel


class PatientBase(SQLModel):
    first_name: str
    last_name: str
    date_of_birth: date
    mrn: Optional[str] = None  # medical record number, optional


class Patient(PatientBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    treatment_plans: list[TreatmentPlan] = Relationship(back_populates="patient")


class PatientCreate(PatientBase):
    pass


class PatientRead(PatientBase):
    id: int


class PatientUpdate(SQLModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    mrn: Optional[str] = None


class TreatmentPlanBase(SQLModel):
    patient_id: int = Field(foreign_key="patient.id")
    drug_name: str  # e.g., lecanemab, donanemab, aducanumab
    start_date: date
    interval_weeks: int = Field(default=4, ge=1, le=12)
    total_planned_infusions: Optional[int] = None


class TreatmentPlan(TreatmentPlanBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    patient: Patient = Relationship(back_populates="treatment_plans")
    infusions: list[InfusionEvent] = Relationship(back_populates="plan")


class TreatmentPlanCreate(TreatmentPlanBase):
    pass


class TreatmentPlanRead(TreatmentPlanBase):
    id: int


class TreatmentPlanUpdate(SQLModel):
    patient_id: Optional[int] = None
    drug_name: Optional[str] = None
    start_date: Optional[date] = None
    interval_weeks: Optional[int] = Field(default=None, ge=1, le=12)
    total_planned_infusions: Optional[int] = None


class InfusionEventBase(SQLModel):
    plan_id: int = Field(foreign_key="treatmentplan.id")
    infusion_number: int
    infusion_date: date
    dose_mg: Optional[float] = None
    premedication: Optional[str] = None
    notes: Optional[str] = None


class InfusionEvent(InfusionEventBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    plan: TreatmentPlan = Relationship(back_populates="infusions")
    aria_events: list[ARIAEvent] = Relationship(back_populates="infusion_event")


class InfusionEventCreate(InfusionEventBase):
    pass


class InfusionEventRead(InfusionEventBase):
    id: int


class InfusionEventUpdate(SQLModel):
    plan_id: Optional[int] = None
    infusion_number: Optional[int] = None
    infusion_date: Optional[date] = None
    dose_mg: Optional[float] = None
    premedication: Optional[str] = None
    notes: Optional[str] = None


class ARIAType(str):
    pass  # placeholder; using string for flexibility (ARIA-E, ARIA-H)


class ARIAEventBase(SQLModel):
    infusion_event_id: int = Field(foreign_key="infusionevent.id")
    aria_type: str  # e.g., "ARIA-E" or "ARIA-H"
    severity: Optional[str] = None  # mild/moderate/severe
    detected_on: date
    resolved_on: Optional[date] = None
    mri_report: Optional[str] = None
    action_taken: Optional[str] = None  # e.g., hold infusion, dose reduce


class ARIAEvent(ARIAEventBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    infusion_event: InfusionEvent = Relationship(back_populates="aria_events")


class ARIAEventCreate(ARIAEventBase):
    pass


class ARIAEventRead(ARIAEventBase):
    id: int


class ARIAEventUpdate(SQLModel):
    infusion_event_id: Optional[int] = None
    aria_type: Optional[str] = None
    severity: Optional[str] = None
    detected_on: Optional[date] = None
    resolved_on: Optional[date] = None
    mri_report: Optional[str] = None
    action_taken: Optional[str] = None


class AdverseEventBase(SQLModel):
    patient_id: int = Field(foreign_key="patient.id")
    occurred_on: date
    description: str
    seriousness: Optional[str] = None
    related_to_drug: Optional[bool] = None


class AdverseEvent(AdverseEventBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class AdverseEventCreate(AdverseEventBase):
    pass


class AdverseEventRead(AdverseEventBase):
    id: int


class AdverseEventUpdate(SQLModel):
    patient_id: Optional[int] = None
    occurred_on: Optional[date] = None
    description: Optional[str] = None
    seriousness: Optional[str] = None
    related_to_drug: Optional[bool] = None
