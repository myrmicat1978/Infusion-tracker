import { Patient, TherapySession, MRIScan, AdverseEvent } from './types';

const STORAGE_KEYS = {
  PATIENTS: 'antiamyloid_patients',
  THERAPY_SESSIONS: 'antiamyloid_therapy_sessions',
  MRI_SCANS: 'antiamyloid_mri_scans',
  ADVERSE_EVENTS: 'antiamyloid_adverse_events',
};

export const storage = {
  // Patients
  getPatients: (): Patient[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : [];
  },
  savePatients: (patients: Patient[]) => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  },

  // Therapy Sessions
  getTherapySessions: (): TherapySession[] => {
    const data = localStorage.getItem(STORAGE_KEYS.THERAPY_SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  saveTherapySessions: (sessions: TherapySession[]) => {
    localStorage.setItem(STORAGE_KEYS.THERAPY_SESSIONS, JSON.stringify(sessions));
  },

  // MRI Scans
  getMRIScans: (): MRIScan[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MRI_SCANS);
    return data ? JSON.parse(data) : [];
  },
  saveMRIScans: (scans: MRIScan[]) => {
    localStorage.setItem(STORAGE_KEYS.MRI_SCANS, JSON.stringify(scans));
  },

  // Adverse Events
  getAdverseEvents: (): AdverseEvent[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ADVERSE_EVENTS);
    return data ? JSON.parse(data) : [];
  },
  saveAdverseEvents: (events: AdverseEvent[]) => {
    localStorage.setItem(STORAGE_KEYS.ADVERSE_EVENTS, JSON.stringify(events));
  },
};
