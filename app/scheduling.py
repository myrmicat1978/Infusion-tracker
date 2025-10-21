from datetime import date, timedelta
from .models import Infusion, TreatmentPlan


DEFAULT_INTERVALS_DAYS = {
    "lecanemab": 14,
    "donanemab": 28,
    "aducanumab": 28,
}


def _normalized_drug_name(name: str) -> str:
    return (name or "").strip().lower()


def get_default_interval_days(drug_name: str) -> int:
    return DEFAULT_INTERVALS_DAYS.get(_normalized_drug_name(drug_name), 28)


def get_effective_interval_days(plan: TreatmentPlan) -> int:
    return plan.interval_days or get_default_interval_days(plan.drug_name)


def get_last_relevant_date(plan: TreatmentPlan) -> date:
    # Prefer latest actual completion, otherwise latest scheduled; fallback to start_date
    last_completed = (
        Infusion.query.filter_by(plan_id=plan.id)
        .filter(Infusion.actual_date.isnot(None))
        .order_by(Infusion.actual_date.desc())
        .first()
    )
    if last_completed:
        return last_completed.actual_date

    last_scheduled = (
        Infusion.query.filter_by(plan_id=plan.id)
        .order_by(Infusion.scheduled_date.desc())
        .first()
    )
    if last_scheduled:
        return last_scheduled.scheduled_date

    return plan.start_date


def compute_next_scheduled_date(plan: TreatmentPlan) -> date:
    base_date = get_last_relevant_date(plan)
    interval = get_effective_interval_days(plan)
    return base_date + timedelta(days=interval)


def generate_upcoming_dates(plan: TreatmentPlan, days_ahead: int = 90, max_events: int = 10) -> list[date]:
    today = date.today()
    end_date = today + timedelta(days=days_ahead)

    dates: list[date] = []
    next_date = compute_next_scheduled_date(plan)

    while next_date <= end_date and len(dates) < max_events:
        dates.append(next_date)
        next_date = next_date + timedelta(days=get_effective_interval_days(plan))

    return dates
