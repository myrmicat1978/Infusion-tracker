# Antiamyloid Therapy Tracker API

FastAPI backend to track anti-amyloid therapies (e.g., lecanemab, donanemab) for patients: patients, treatment plans, infusions, ARIA events, and adverse events.

## Quickstart

### Using pip

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Using Poetry

```bash
poetry install
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open the API docs at `http://localhost:8000/docs`.

### Using Docker

Build and run with Docker Compose:

```bash
docker compose up --build
```

The API will be available at `http://localhost:8000`. Data (SQLite DB) is stored in a named volume `antiamyloid_data`.

## Entities

- Patient
- TreatmentPlan (drug, start date, interval weeks, total planned)
- InfusionEvent (date, number, dose, notes)
- ARIAEvent (type, severity, detected/resolved dates, MRI report, action)
- AdverseEvent (description, seriousness, relatedness)

## Example requests

Create a patient:

```bash
curl -X POST http://localhost:8000/patients/ \
  -H 'Content-Type: application/json' \
  -d '{
    "first_name": "Ada",
    "last_name": "Lovelace",
    "date_of_birth": "1990-01-01",
    "mrn": "MRN-123"
  }'
```

Create a treatment plan:

```bash
curl -X POST http://localhost:8000/plans/ \
  -H 'Content-Type: application/json' \
  -d '{
    "patient_id": 1,
    "drug_name": "lecanemab",
    "start_date": "2025-01-15",
    "interval_weeks": 2,
    "total_planned_infusions": 26
  }'
```

Record an infusion event:

```bash
curl -X POST http://localhost:8000/events/infusions \
  -H 'Content-Type: application/json' \
  -d '{
    "plan_id": 1,
    "infusion_number": 1,
    "infusion_date": "2025-01-15",
    "dose_mg": 700
  }'
```

Summarize a patient:

```bash
curl http://localhost:8000/summary/patient/1
```

## Notes

- Uses SQLite by default (`antiamyloid.db`), created on startup.
- Adjust CORS origins in `app/main.py` for production.