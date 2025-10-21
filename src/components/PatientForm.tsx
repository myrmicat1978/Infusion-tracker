import { useState } from 'react';
import { Patient } from '../types';

interface PatientFormProps {
  onSubmit: (patient: Patient) => void;
}

function PatientForm({ onSubmit }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    mrn: '',
    diagnosis: 'Alzheimer\'s Disease',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newPatient);
    
    // Reset form
    setFormData({
      name: '',
      dateOfBirth: '',
      mrn: '',
      diagnosis: 'Alzheimer\'s Disease',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medical Record Number (MRN) *
          </label>
          <input
            type="text"
            required
            value={formData.mrn}
            onChange={e => setFormData({ ...formData, mrn: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="MRN123456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnosis *
          </label>
          <select
            value={formData.diagnosis}
            onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Alzheimer's Disease</option>
            <option>Mild Cognitive Impairment</option>
            <option>Cerebral Amyloid Angiopathy</option>
            <option>Other Amyloid-related Condition</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Add Patient
        </button>
      </div>
    </form>
  );
}

export default PatientForm;
