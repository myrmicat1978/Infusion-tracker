from __future__ import annotations
from datetime import date, datetime
from typing import Dict, List

from flask import (
    abort,
    flash,
    redirect,
    render_template,
    request,
    send_file,
    url_for,
)
from io import BytesIO

from . import app, db
from .models import Infusion, Patient, TreatmentPlan
from . import scheduling
from .ics_export import build_calendar_for_infusions


# ---------- Utilities ----------

def calculate_age(dob: date | None) -> int | None:
    if not dob:
        return None
    today = date.today()
    years = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    return max(0, years)


@app.template_filter("age")
def age_filter(dob: date | None) -> str:
    age = calculate_age(dob)
    return str(age) if age is not None else "-"


# ---------- Routes ----------

@app.route("/")
def home():
    return redirect(url_for("patients_index"))


@app.route("/patients")
def patients_index():
    patients: List[Patient] = Patient.query.order_by(Patient.full_name.asc()).all()

    completed_counts: Dict[int, int] = {
        pid: count
        for pid, count in (
            db.session.query(Infusion.patient_id, db.func.count(Infusion.id))
            .filter(Infusion.status == "completed")
            .group_by(Infusion.patient_id)
            .all()
        )
    }

    return render_template(
        "patients/index.html",
        patients=patients,
        completed_counts=completed_counts,
    )


@app.route("/patients/new", methods=["GET", "POST"])
def patients_new():
    if request.method == "POST":
        full_name = (request.form.get("full_name") or "").strip()
        dob_str = request.form.get("date_of_birth") or ""
        mrn = (request.form.get("medical_record_number") or "").strip()

        if not full_name:
            flash("Full name is required", "error")
            return render_template("patients/new.html")

        dob: date | None = None
        if dob_str:
            try:
                dob = datetime.strptime(dob_str, "%Y-%m-%d").date()
            except ValueError:
                flash("Invalid date of birth format", "error")
                return render_template("patients/new.html")

        patient = Patient(full_name=full_name, date_of_birth=dob, medical_record_number=mrn)
        db.session.add(patient)
        db.session.commit()
        flash("Patient registered", "success")
        return redirect(url_for("patient_show", patient_id=patient.id))

    return render_template("patients/new.html")


@app.route("/patients/<int:patient_id>")
def patient_show(patient_id: int):
    patient = Patient.query.get_or_404(patient_id)

    # Plans
    plans: List[TreatmentPlan] = (
        TreatmentPlan.query.filter_by(patient_id=patient.id)
        .order_by(TreatmentPlan.created_at.desc())
        .all()
    )

    # Infusions grouped
    infusions: List[Infusion] = (
        Infusion.query.filter_by(patient_id=patient.id)
        .order_by(Infusion.scheduled_date.desc())
        .all()
    )

    completed_count = (
        db.session.query(db.func.count(Infusion.id))
        .filter(Infusion.patient_id == patient.id, Infusion.status == "completed")
        .scalar()
    ) or 0

    return render_template(
        "patients/show.html",
        patient=patient,
        plans=plans,
        infusions=infusions,
        completed_count=completed_count,
    )


@app.route("/plans/new", methods=["GET", "POST"])
def plans_new():
    patient_id = request.args.get("patient_id") or request.form.get("patient_id")
    if not patient_id:
        abort(400)
    patient = Patient.query.get_or_404(int(patient_id))

    if request.method == "POST":
        drug_name = (request.form.get("drug_name") or "").strip().lower()
        interval_days_str = request.form.get("interval_days") or ""
        start_date_str = request.form.get("start_date") or ""
        num_planned_str = request.form.get("num_planned_infusions") or ""
        notes = request.form.get("notes") or ""

        if drug_name not in {"lecanemab", "donanemab"}:
            flash("Drug must be lecanemab or donanemab", "error")
            return render_template("plans/new.html", patient=patient)

        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        except ValueError:
            flash("Invalid start date", "error")
            return render_template("plans/new.html", patient=patient)

        try:
            interval_days = int(interval_days_str) if interval_days_str else scheduling.get_default_interval_days(drug_name)
        except ValueError:
            interval_days = scheduling.get_default_interval_days(drug_name)

        num_planned = None
        if num_planned_str:
            try:
                num_planned = int(num_planned_str)
            except ValueError:
                flash("Invalid number of planned infusions", "error")
                return render_template("plans/new.html", patient=patient)

        plan = TreatmentPlan(
            patient_id=patient.id,
            drug_name=drug_name,
            interval_days=interval_days,
            start_date=start_date,
            num_planned_infusions=num_planned,
            notes=notes or None,
            active=True,
        )
        db.session.add(plan)
        db.session.commit()
        flash("Treatment plan created", "success")
        return redirect(url_for("patient_show", patient_id=patient.id))

    return render_template("plans/new.html", patient=patient)


@app.route("/plans/<int:plan_id>/schedule_next", methods=["POST"])
def plans_schedule_next(plan_id: int):
    plan = TreatmentPlan.query.get_or_404(plan_id)
    next_date = scheduling.compute_next_scheduled_date(plan)
    infusion = Infusion(
        patient_id=plan.patient_id,
        plan_id=plan.id,
        sequence_number=None,
        scheduled_date=next_date,
        actual_date=None,
        status="scheduled",
    )
    db.session.add(infusion)
    db.session.commit()
    flash(f"Scheduled next infusion on {next_date.isoformat()}", "success")
    return redirect(url_for("patient_show", patient_id=plan.patient_id))


@app.route("/infusions/new", methods=["GET", "POST"])
def infusions_new():
    patient_id = request.args.get("patient_id") or request.form.get("patient_id")
    if not patient_id:
        abort(400)
    patient = Patient.query.get_or_404(int(patient_id))
    plans = TreatmentPlan.query.filter_by(patient_id=patient.id, active=True).all()
    if not plans:
        flash("Create a treatment plan before adding infusions", "error")
        return redirect(url_for("plans_new", patient_id=patient.id))

    if request.method == "POST":
        plan_id = int(request.form.get("plan_id"))
        status = (request.form.get("status") or "scheduled").strip().lower()
        date_str = request.form.get("date") or ""

        try:
            d = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            flash("Invalid date", "error")
            return render_template("infusions/new.html", patient=patient, plans=plans)

        if status not in {"scheduled", "completed"}:
            status = "scheduled"

        infusion = Infusion(
            patient_id=patient.id,
            plan_id=plan_id,
            scheduled_date=d,
            actual_date=d if status == "completed" else None,
            status=status,
        )
        db.session.add(infusion)
        db.session.commit()
        flash("Infusion saved", "success")
        return redirect(url_for("patient_show", patient_id=patient.id))

    return render_template("infusions/new.html", patient=patient, plans=plans)


@app.route("/infusions/<int:infusion_id>/complete", methods=["POST"])
def infusion_complete(infusion_id: int):
    infusion = Infusion.query.get_or_404(infusion_id)
    date_str = request.form.get("actual_date") or ""
    actual = None
    if date_str:
        try:
            actual = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            flash("Invalid completion date", "error")
            return redirect(url_for("patient_show", patient_id=infusion.patient_id))
    else:
        actual = date.today()

    infusion.actual_date = actual
    infusion.status = "completed"
    db.session.commit()
    flash("Infusion marked as completed", "success")
    return redirect(url_for("patient_show", patient_id=infusion.patient_id))


@app.route("/patients/<int:patient_id>/calendar.ics")
def patient_calendar(patient_id: int):
    Patient.query.get_or_404(patient_id)
    infusions = (
        Infusion.query.filter_by(patient_id=patient_id)
        .order_by(Infusion.scheduled_date.asc())
        .all()
    )
    cal = build_calendar_for_infusions(infusions)
    data = cal.serialize()
    buf = BytesIO(data.encode("utf-8"))
    return send_file(
        buf,
        as_attachment=True,
        download_name=f"patient-{patient_id}-infusions.ics",
        mimetype="text/calendar",
    )
