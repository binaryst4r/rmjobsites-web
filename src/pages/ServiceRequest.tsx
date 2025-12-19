import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import type { ServiceRequestFormData } from '../types/ServiceRequest';

const SERVICE_TYPES = [
  'Level',
  'Laser',
  'Pipe Laser',
  'Transit',
  'Theodolite',
  'GPS - On site service',
  'GPS 3D modeling',
];

const getInitialFormData = (userEmail?: string): ServiceRequestFormData => ({
  customer_name: userEmail || '',
  company: '',
  service_requested: '',
  pickup_date: '',
  return_date: '',
  dropped_or_impacted: false,
  needs_replacement_accessories: false,
  needs_rush: false,
  needs_rental: false,
  manufacturer: '',
  model: '',
  serial_number: '',
});

export const ServiceRequest = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState<ServiceRequestFormData>(() =>
    getInitialFormData(user?.email)
  );

  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (data: ServiceRequestFormData) => api.createServiceRequest(data),
    onSuccess: () => {
      setSuccessMessage('Service request submitted successfully!');
      // Reset form
      setFormData(getInitialFormData(user?.email));
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'dropped_or_impacted' || name === 'needs_replacement_accessories' ||
        name === 'needs_rush' || name === 'needs_rental') {
      setFormData(prev => ({ ...prev, [name]: value === 'Yes' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Request</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {mutation.isError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{mutation.error.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Field - Spans half width on desktop */}
          <div className="md:w-1/2">
            {user ? (
              <div>
                <label className="label">Customer</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
            ) : (
              <div>
                <label htmlFor="customer_name" className="label">
                  Customer
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="company" className="label">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="service_requested" className="label">
                  Service Requested
                </label>
                <select
                  id="service_requested"
                  name="service_requested"
                  required
                  value={formData.service_requested}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Service</option>
                  {SERVICE_TYPES.map(service => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickup_date" className="label">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    id="pickup_date"
                    name="pickup_date"
                    required
                    value={formData.pickup_date}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="return_date" className="label">
                    Return Date
                  </label>
                  <input
                    type="date"
                    id="return_date"
                    name="return_date"
                    required
                    value={formData.return_date}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dropped_or_impacted" className="label">
                  Dropped or impacted?
                </label>
                <select
                  id="dropped_or_impacted"
                  name="dropped_or_impacted"
                  required
                  value={formData.dropped_or_impacted ? 'Yes' : 'No'}
                  onChange={(e) => handleSelectChange('dropped_or_impacted', e.target.value)}
                  className="input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label htmlFor="needs_replacement_accessories" className="label">
                  Need replacement accessories?
                </label>
                <select
                  id="needs_replacement_accessories"
                  name="needs_replacement_accessories"
                  required
                  value={formData.needs_replacement_accessories ? 'Yes' : 'No'}
                  onChange={(e) => handleSelectChange('needs_replacement_accessories', e.target.value)}
                  className="input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="needs_rush" className="label">
                  Need rush service?
                </label>
                <select
                  id="needs_rush"
                  name="needs_rush"
                  required
                  value={formData.needs_rush ? 'Yes' : 'No'}
                  onChange={(e) => handleSelectChange('needs_rush', e.target.value)}
                  className="input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label htmlFor="needs_rental" className="label">
                  Need rental during service?
                </label>
                <select
                  id="needs_rental"
                  name="needs_rental"
                  required
                  value={formData.needs_rental ? 'Yes' : 'No'}
                  onChange={(e) => handleSelectChange('needs_rental', e.target.value)}
                  className="input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label htmlFor="manufacturer" className="label">
                  Manufacturer
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  required
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="model" className="label">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="serial_number" className="label">
                  Serial Number
                </label>
                <input
                  type="text"
                  id="serial_number"
                  name="serial_number"
                  required
                  value={formData.serial_number}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-6">
            <div className="hidden md:block w-1/2" />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full md:w-1/2"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
