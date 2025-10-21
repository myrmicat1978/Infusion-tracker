import { useState } from 'react';
import { Patient, MRIScan } from '../types';
import { format } from 'date-fns';
import { Brain, AlertCircle } from 'lucide-react';

interface MRITrackingProps {
  patients: Patient[];
  scans: MRIScan[];
  onAddScan: (scan: MRIScan) => void;
}

function MRITracking({ patients, scans, onAddScan }: MRITrackingProps) {
  const [formData, setFormData] = useState<{
    patientId: string;
    date: string;
    scanType: 'Baseline' | 'Follow-up' | 'Safety';
    ariaStatus: 'None' | 'ARIA-E' | 'ARIA-H' | 'Both';
    severity: '' | 'Mild' | 'Moderate' | 'Severe';
    findings: string;
  }>({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    scanType: 'Follow-up',
    ariaStatus: 'None',
    severity: '',
    findings: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newScan: MRIScan = {
      id: Date.now().toString(),
      ...formData,
      severity: formData.severity || undefined,
    };

    onAddScan(newScan);
    
    // Reset form
    setFormData({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      scanType: 'Follow-up',
      ariaStatus: 'None',
      severity: '',
      findings: '',
    });
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const patientScans = scans.filter(s => s.patientId === formData.patientId);

  const getAriaStatusColor = (status: string) => {
    switch (status) {
      case 'None':
        return 'bg-green-100 text-green-800';
      case 'ARIA-E':
      case 'ARIA-H':
        return 'bg-yellow-100 text-yellow-800';
      case 'Both':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Add MRI Form */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Record MRI Scan</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              <strong>ARIA Monitoring:</strong> Regular MRI monitoring is essential for detecting 
              Amyloid-Related Imaging Abnormalities (ARIA-E: edema, ARIA-H: hemorrhage).
            </p>
          </div>
        </div>

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
                Scan Date *
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
                Scan Type *
              </label>
              <select
                value={formData.scanType}
                onChange={e => setFormData({ ...formData, scanType: e.target.value as 'Baseline' | 'Follow-up' | 'Safety' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Baseline">Baseline</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Safety">Safety</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ARIA Status *
              </label>
              <select
                value={formData.ariaStatus}
                onChange={e => setFormData({ ...formData, ariaStatus: e.target.value as 'None' | 'ARIA-E' | 'ARIA-H' | 'Both' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="None">None</option>
                <option value="ARIA-E">ARIA-E (Edema)</option>
                <option value="ARIA-H">ARIA-H (Hemorrhage)</option>
                <option value="Both">Both ARIA-E and ARIA-H</option>
              </select>
            </div>

            {formData.ariaStatus !== 'None' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value as 'Mild' | 'Moderate' | 'Severe' | '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select severity --</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Findings *
              </label>
              <textarea
                required
                value={formData.findings}
                onChange={e => setFormData({ ...formData, findings: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed radiological findings..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Record MRI Scan
            </button>
          </div>
        </form>
      </div>

      {/* MRI History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {selectedPatient ? `${selectedPatient.name}'s MRI History` : 'MRI History'}
        </h2>
        
        {patientScans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            <p>
              {formData.patientId 
                ? 'No MRI scans recorded for this patient yet.' 
                : 'Select a patient to view their MRI history.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {patientScans
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(scan => (
                <div key={scan.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center">
                        <Brain className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {scan.scanType} MRI
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(new Date(scan.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getAriaStatusColor(scan.ariaStatus)}`}>
                      {scan.ariaStatus}
                    </span>
                  </div>
                  
                  {scan.severity && (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Severity:</span> {scan.severity}
                    </p>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Findings:</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{scan.findings}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MRITracking;
