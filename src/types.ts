export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  mrn: string; // Medical Record Number
  diagnosis: string;
  createdAt: string;
}

export interface TherapySession {
  id: string;
  patientId: string;
  therapyType: 'Leqembi' | 'Aduhelm' | 'Donanemab' | 'Other';
  date: string;
  dosage: string;
  infusionDuration: string;
  administeredBy: string;
  notes: string;
}

export interface MRIScan {
  id: string;
  patientId: string;
  date: string;
  scanType: 'Baseline' | 'Follow-up' | 'Safety';
  ariaStatus: 'None' | 'ARIA-E' | 'ARIA-H' | 'Both';
  severity?: 'Mild' | 'Moderate' | 'Severe';
  findings: string;
}

export interface AdverseEvent {
  id: string;
  patientId: string;
  date: string;
  event: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  action: string;
  resolved: boolean;
  resolvedDate?: string;
}
