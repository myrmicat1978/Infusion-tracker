# Quick Start Guide

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Application Workflow

### 1. Register Patients

Start by adding patients in the **Patients** tab:
- Enter patient name, date of birth, MRN (Medical Record Number)
- Select diagnosis type
- Click "Add Patient"

### 2. Record Therapy Sessions

Navigate to **Therapy Sessions**:
- Select a patient from the dropdown
- Choose the therapy type (Leqembi, Aduhelm, Donanemab, Other)
- Enter infusion date, dosage, and duration
- Record who administered the therapy
- Add any relevant notes
- Click "Record Session"

The session history will appear on the right side, showing all infusions for the selected patient.

### 3. Track MRI Scans

Go to **MRI Tracking**:
- Select the patient
- Enter scan date and type (Baseline, Follow-up, Safety)
- Document ARIA status:
  - **None**: No abnormalities detected
  - **ARIA-E**: Amyloid-Related Imaging Abnormalities - Edema
  - **ARIA-H**: Amyloid-Related Imaging Abnormalities - Hemorrhage
  - **Both**: Both ARIA-E and ARIA-H present
- If ARIA is detected, specify severity (Mild, Moderate, Severe)
- Enter detailed radiological findings
- Click "Record MRI Scan"

### 4. Manage Adverse Events

Access **Adverse Events**:
- Select the patient
- Enter the event date and description
- Choose severity level (Mild, Moderate, Severe)
- Document actions taken
- Click "Report Event"

Events are displayed in two sections:
- **Active Events**: Currently unresolved events (highlighted in orange)
- **Resolved Events**: Events marked as resolved (shown with strikethrough)

You can toggle events between active and resolved states.

## Data Management

### Data Storage
- All data is stored locally in your browser's Local Storage
- Data persists between sessions
- No data is sent to external servers

### Data Backup
To backup your data:
1. Open browser Developer Tools (F12)
2. Go to Application > Local Storage
3. Look for keys starting with `antiamyloid_`
4. Copy and save the values

### Data Reset
To clear all data:
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

## Clinical Context

### Antiamyloid Therapies

**Leqembi (Lecanemab)**
- FDA approved for Alzheimer's disease
- Dosing: 10 mg/kg IV biweekly
- Infusion time: Approximately 60 minutes

**Aduhelm (Aducanumab)**
- FDA approved for Alzheimer's disease
- Requires titration schedule
- Infusion time: Approximately 60 minutes

**Donanemab**
- Investigational (check current status)
- Monthly infusions

### ARIA Monitoring Schedule

Regular MRI monitoring is essential:
- **Baseline**: Before starting therapy
- **Follow-up**: Per protocol (typically every 3-6 months)
- **Safety**: When ARIA is suspected or detected

### Important Reminders

1. **Pre-treatment screening**: Baseline MRI required before starting therapy
2. **ARIA monitoring**: Regular MRIs are critical for patient safety
3. **Adverse event reporting**: Document all events promptly
4. **Informed consent**: Ensure patients understand risks including ARIA
5. **APOE4 status**: Consider genotyping as ARIA risk varies by status

## Troubleshooting

### Application won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build errors
```bash
# Check TypeScript errors
npm run build
```

### Linting issues
```bash
# Run linter
npm run lint
```

## Support

For issues or questions:
1. Check the README.md for general information
2. Review this Quick Start Guide
3. Check browser console for errors (F12)

## Demo Data

To add sample data for testing:
1. Add a patient (e.g., "John Doe", DOB: 1950-01-01, MRN: "MRN001")
2. Record a therapy session for this patient
3. Add an MRI scan
4. Report an adverse event

This will populate all sections and help you understand the workflow.
