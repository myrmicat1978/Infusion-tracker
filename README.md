# Antiamyloid Infusion Tracker

A lightweight Flask app to track antiamyloid infusions (Lecanemab, Donanemab), patients, treatment plans, and infusion events.

## Features
- Patient registration with DOB and auto-calculated age
- Patient list with count of completed infusions
- Support for Lecanemab and Donanemab treatment plans
- Schedule next infusion based on plan interval
- Record scheduled and completed infusions

## Getting started

### 1) Create virtual environment and install dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2) Run the app
```bash
export FLASK_APP=run.py
python run.py
# App runs on http://localhost:5000
```

### 3) Usage
- Register a patient via "Register Patient"
- Create a treatment plan (Lecanemab or Donanemab)
- Use "Schedule next" to auto-schedule based on interval
- Add/complete infusions as they occur

## Notes
- Default intervals: Lecanemab q14 days, Donanemab q28 days
- Uses SQLite by default (file `infusions.db`)
