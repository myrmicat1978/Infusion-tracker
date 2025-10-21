import { Patient } from '../types';
import { format } from 'date-fns';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  selectedPatient: Patient | null;
}

function PatientList({ patients, onSelectPatient, selectedPatient }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        <p>No patients registered yet. Add your first patient to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="divide-y divide-gray-200">
        {patients.map(patient => (
          <div
            key={patient.id}
            onClick={() => onSelectPatient(patient)}
            className={`p-6 cursor-pointer transition-colors ${
              selectedPatient?.id === patient.id
                ? 'bg-blue-50 border-l-4 border-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-600 mt-1">MRN: {patient.mrn}</p>
                <p className="text-sm text-gray-600">
                  DOB: {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Diagnosis:</span> {patient.diagnosis}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                Added {format(new Date(patient.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientList;
