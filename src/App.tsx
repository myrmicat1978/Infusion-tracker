import { useState, useEffect } from 'react';
import { Users, Syringe, Brain, AlertTriangle } from 'lucide-react';
import { Patient, TherapySession, MRIScan, AdverseEvent } from './types';
import { storage } from './storage';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import TherapySessions from './components/TherapySessions';
import MRITracking from './components/MRITracking';
import AdverseEvents from './components/AdverseEvents';

type View = 'patients' | 'therapy' | 'mri' | 'adverse';

function App() {
  const [currentView, setCurrentView] = useState<View>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [therapySessions, setTherapySessions] = useState<TherapySession[]>([]);
  const [mriScans, setMRIScans] = useState<MRIScan[]>([]);
  const [adverseEvents, setAdverseEvents] = useState<AdverseEvent[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    setPatients(storage.getPatients());
    setTherapySessions(storage.getTherapySessions());
    setMRIScans(storage.getMRIScans());
    setAdverseEvents(storage.getAdverseEvents());
  }, []);

  const addPatient = (patient: Patient) => {
    const updated = [...patients, patient];
    setPatients(updated);
    storage.savePatients(updated);
  };

  const addTherapySession = (session: TherapySession) => {
    const updated = [...therapySessions, session];
    setTherapySessions(updated);
    storage.saveTherapySessions(updated);
  };

  const addMRIScan = (scan: MRIScan) => {
    const updated = [...mriScans, scan];
    setMRIScans(updated);
    storage.saveMRIScans(updated);
  };

  const addAdverseEvent = (event: AdverseEvent) => {
    const updated = [...adverseEvents, event];
    setAdverseEvents(updated);
    storage.saveAdverseEvents(updated);
  };

  const updateAdverseEvent = (eventId: string, updates: Partial<AdverseEvent>) => {
    const updated = adverseEvents.map(e => 
      e.id === eventId ? { ...e, ...updates } : e
    );
    setAdverseEvents(updated);
    storage.saveAdverseEvents(updated);
  };

  const navItems = [
    { id: 'patients' as View, label: 'Patients', icon: Users },
    { id: 'therapy' as View, label: 'Therapy Sessions', icon: Syringe },
    { id: 'mri' as View, label: 'MRI Tracking', icon: Brain },
    { id: 'adverse' as View, label: 'Adverse Events', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Antiamyloid Therapy Tracker</h1>
          <p className="text-blue-100 mt-1">Comprehensive patient infusion management</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center px-6 py-4 font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Registry</h2>
              <PatientList 
                patients={patients} 
                onSelectPatient={setSelectedPatient}
                selectedPatient={selectedPatient}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Patient</h2>
              <PatientForm onSubmit={addPatient} />
            </div>
          </div>
        )}

        {currentView === 'therapy' && (
          <TherapySessions
            patients={patients}
            sessions={therapySessions}
            onAddSession={addTherapySession}
          />
        )}

        {currentView === 'mri' && (
          <MRITracking
            patients={patients}
            scans={mriScans}
            onAddScan={addMRIScan}
          />
        )}

        {currentView === 'adverse' && (
          <AdverseEvents
            patients={patients}
            events={adverseEvents}
            onAddEvent={addAdverseEvent}
            onUpdateEvent={updateAdverseEvent}
          />
        )}
      </main>
    </div>
  );
}

export default App;
