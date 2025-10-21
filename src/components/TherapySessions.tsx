import { useState } from 'react';
import { Patient, TherapySession } from '../types';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

interface TherapySessionsProps {
  patients: Patient[];
  sessions: TherapySession[];
  onAddSession: (session: TherapySession) => void;
}

function TherapySessions({ patients, sessions, onAddSession }: TherapySessionsProps) {
  const [formData, setFormData] = useState<{
    patientId: string;
    therapyType: 'Leqembi' | 'Aduhelm' | 'Donanemab' | 'Other';
    date: string;
    dosage: string;
    infusionDuration: string;
    administeredBy: string;
    notes: string;
  }>({
    patientId: '',
    therapyType: 'Leqembi',
    date: new Date().toISOString().split('T')[0],
    dosage: '',
    infusionDuration: '',
    administeredBy: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSession: TherapySession = {
      id: Date.now().toString(),
      ...formData,
    };

    onAddSession(newSession);
    
    // Reset form (keep patient and therapy type)
    setFormData({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      dosage: '',
      infusionDuration: '',
      administeredBy: '',
      notes: '',
    });
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const patientSessions = sessions.filter(s => s.patientId === formData.patientId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Add Session Form */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Infusion Session</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Patient *
              </label>
              <select
                required
                value={formData.patientId}
                onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Choose a patient --</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (MRN: {patient.mrn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Therapy Type *
              </label>
              <select
                value={formData.therapyType}
                onChange={e => setFormData({ ...formData, therapyType: e.target.value as 'Leqembi' | 'Aduhelm' | 'Donanemab' | 'Other' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Leqembi">Leqembi (Lecanemab)</option>
                <option value="Aduhelm">Aduhelm (Aducanumab)</option>
                <option value="Donanemab">Donanemab</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Infusion Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage *
              </label>
              <input
                type="text"
                required
                value={formData.dosage}
                onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 10 mg/kg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Infusion Duration *
              </label>
              <input
                type="text"
                required
                value={formData.infusionDuration}
                onChange={e => setFormData({ ...formData, infusionDuration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 60 minutes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Administered By *
              </label>
              <input
                type="text"
                required
                value={formData.administeredBy}
                onChange={e => setFormData({ ...formData, administeredBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nurse/Physician name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional observations or notes"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Record Session
            </button>
          </div>
        </form>
      </div>

      {/* Session History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {selectedPatient ? `${selectedPatient.name}'s Sessions` : 'Session History'}
        </h2>
        
        {patientSessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            <p>
              {formData.patientId 
                ? 'No therapy sessions recorded for this patient yet.' 
                : 'Select a patient to view their therapy history.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {patientSessions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(session => (
                <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {session.therapyType}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(session.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">{session.infusionDuration}</span>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-medium">Dosage:</span> {session.dosage}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Administered by:</span> {session.administeredBy}
                    </p>
                    {session.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-gray-700">
                          <span className="font-medium">Notes:</span> {session.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TherapySessions;
