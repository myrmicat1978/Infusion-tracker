import { useState } from 'react';
import { Patient, AdverseEvent } from '../types';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AdverseEventsProps {
  patients: Patient[];
  events: AdverseEvent[];
  onAddEvent: (event: AdverseEvent) => void;
  onUpdateEvent: (eventId: string, updates: Partial<AdverseEvent>) => void;
}

function AdverseEvents({ patients, events, onAddEvent, onUpdateEvent }: AdverseEventsProps) {
  const [formData, setFormData] = useState<{
    patientId: string;
    date: string;
    event: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    action: string;
  }>({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    event: '',
    severity: 'Mild',
    action: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: AdverseEvent = {
      id: Date.now().toString(),
      ...formData,
      resolved: false,
    };

    onAddEvent(newEvent);
    
    // Reset form
    setFormData({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      event: '',
      action: '',
    });
  };

  const handleResolve = (eventId: string) => {
    onUpdateEvent(eventId, {
      resolved: true,
      resolvedDate: new Date().toISOString(),
    });
  };

  const handleUnresolve = (eventId: string) => {
    onUpdateEvent(eventId, {
      resolved: false,
      resolvedDate: undefined,
    });
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const patientEvents = events.filter(e => e.patientId === formData.patientId);
  const unresolvedEvents = patientEvents.filter(e => !e.resolved);
  const resolvedEvents = patientEvents.filter(e => e.resolved);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild':
        return 'bg-yellow-100 text-yellow-800';
      case 'Moderate':
        return 'bg-orange-100 text-orange-800';
      case 'Severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Add Event Form */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Report Adverse Event</h2>
        
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
                Event Date *
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
                Adverse Event Description *
              </label>
              <textarea
                required
                value={formData.event}
                onChange={e => setFormData({ ...formData, event: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Infusion-related reaction, headache, confusion..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity *
              </label>
              <select
                value={formData.severity}
                onChange={e => setFormData({ ...formData, severity: e.target.value as 'Mild' | 'Moderate' | 'Severe' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Taken *
              </label>
              <textarea
                required
                value={formData.action}
                onChange={e => setFormData({ ...formData, action: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Treatment provided, interventions, follow-up plan..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Report Event
            </button>
          </div>
        </form>
      </div>

      {/* Event History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {selectedPatient ? `${selectedPatient.name}'s Adverse Events` : 'Adverse Events'}
        </h2>
        
        {patientEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            <p>
              {formData.patientId 
                ? 'No adverse events recorded for this patient.' 
                : 'Select a patient to view their adverse events.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unresolved Events */}
            {unresolvedEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                  Active Events ({unresolvedEvents.length})
                </h3>
                <div className="space-y-3">
                  {unresolvedEvents
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(event => (
                      <div key={event.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getSeverityColor(event.severity)}`}>
                                {event.severity}
                              </span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(event.date), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium mb-2">{event.event}</p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Action:</span> {event.action}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleResolve(event.id)}
                          className="mt-3 flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Resolved
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Resolved Events */}
            {resolvedEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Resolved Events ({resolvedEvents.length})
                </h3>
                <div className="space-y-3">
                  {resolvedEvents
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(event => (
                      <div key={event.id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getSeverityColor(event.severity)}`}>
                                {event.severity}
                              </span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(event.date), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium mb-2 line-through">{event.event}</p>
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Action:</span> {event.action}
                            </p>
                            {event.resolvedDate && (
                              <p className="text-xs text-green-600">
                                Resolved on {format(new Date(event.resolvedDate), 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnresolve(event.id)}
                          className="mt-2 flex items-center text-sm text-gray-600 hover:text-gray-700 font-medium"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Mark as Unresolved
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdverseEvents;
