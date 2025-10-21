# Antiamyloid Therapy Infusion Tracker

A comprehensive web application for tracking antiamyloid therapy infusions for patients with Alzheimer's disease and related conditions.

## Features

### 📋 Patient Management
- Register and manage patient information
- Track demographics, MRN, diagnosis, and date of birth
- View complete patient profiles

### 💉 Therapy Session Tracking
- Record infusion sessions for antiamyloid therapies:
  - Leqembi (Lecanemab)
  - Aduhelm (Aducanumab)
  - Donanemab
  - Other therapies
- Track dosage, infusion duration, and administering staff
- Maintain detailed session notes
- View complete therapy history per patient

### 🧠 MRI & ARIA Monitoring
- Record MRI scan results (Baseline, Follow-up, Safety)
- Monitor for Amyloid-Related Imaging Abnormalities (ARIA):
  - ARIA-E (Edema)
  - ARIA-H (Hemorrhage)
- Track severity levels (Mild, Moderate, Severe)
- Document detailed radiological findings
- Essential for safety monitoring during antiamyloid therapy

### ⚠️ Adverse Event Management
- Report and track adverse events
- Categorize by severity (Mild, Moderate, Severe)
- Document actions taken
- Mark events as resolved/unresolved
- Track resolution dates
- Separate active and resolved events for easy monitoring

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Persistence**: Local Storage

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Add Patients**: Start by registering patients in the "Patients" tab
2. **Record Infusions**: Navigate to "Therapy Sessions" to log infusion appointments
3. **Track MRIs**: Use "MRI Tracking" to monitor ARIA and document scan results
4. **Manage Events**: Report and track adverse events in the "Adverse Events" tab

## Data Storage

This application uses browser Local Storage for data persistence. Data is stored locally on the user's device and is not transmitted to any server.

## Clinical Context

Antiamyloid therapies are monoclonal antibodies designed to target and remove amyloid-beta plaques in the brain, a hallmark of Alzheimer's disease. These therapies require:

- Regular IV infusions (typically bi-weekly)
- Careful monitoring for ARIA through MRI scans
- Tracking of infusion-related reactions and other adverse events
- Comprehensive documentation for safety and efficacy

This application provides a centralized system for healthcare providers to manage all aspects of antiamyloid therapy administration and monitoring.

## License

MIT