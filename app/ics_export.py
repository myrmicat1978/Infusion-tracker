from datetime import datetime, timedelta
from typing import Iterable

from ics import Calendar, Event
from .models import Infusion


def build_calendar_for_infusions(infusions: Iterable[Infusion]) -> Calendar:
    cal = Calendar()
    for inf in infusions:
        d = inf.actual_date or inf.scheduled_date
        if not d:
            continue
        e = Event()
        e.name = f"Infusion: {inf.plan.drug_name.capitalize()}"
        e.begin = datetime(d.year, d.month, d.day, 9, 0)
        e.duration = timedelta(hours=2)
        e.description = f"Patient ID: {inf.patient_id}. Status: {inf.status}."
        e.uid = f"infusion-{inf.id}@tracker"
        cal.events.add(e)
    return cal
