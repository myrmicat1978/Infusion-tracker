from datetime import date, datetime
from . import db


class Patient(db.Model):
    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False, index=True)
    date_of_birth = db.Column(db.Date, nullable=True)
    medical_record_number = db.Column(db.String(64), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    plans = db.relationship(
        "TreatmentPlan",
        backref="patient",
        lazy=True,
        cascade="all, delete-orphan",
    )
    infusions = db.relationship(
        "Infusion",
        backref="patient",
        lazy=True,
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Patient {self.id} {self.full_name}>"


class TreatmentPlan(db.Model):
    __tablename__ = "treatment_plans"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(
        db.Integer,
        db.ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    drug_name = db.Column(db.String(64), nullable=False)
    interval_days = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    num_planned_infusions = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    infusions = db.relationship(
        "Infusion",
        backref="plan",
        lazy=True,
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<TreatmentPlan {self.id} {self.drug_name} patient={self.patient_id}>"


class Infusion(db.Model):
    __tablename__ = "infusions"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(
        db.Integer,
        db.ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    plan_id = db.Column(
        db.Integer,
        db.ForeignKey("treatment_plans.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    sequence_number = db.Column(db.Integer, nullable=True)
    scheduled_date = db.Column(db.Date, nullable=False)
    actual_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(32), nullable=False)  # scheduled | completed | missed
    dose_mg = db.Column(db.Float, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        db.Index("idx_infusions_patient_scheduled", "patient_id", "scheduled_date"),
    )

    def is_overdue(self) -> bool:
        return self.status == "scheduled" and self.scheduled_date < date.today()

    def __repr__(self) -> str:
        return f"<Infusion {self.id} plan={self.plan_id} {self.status} {self.scheduled_date}>"
