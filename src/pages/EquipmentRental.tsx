import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import type { EquipmentRentalRequestFormData } from '../types/EquipmentRentalRequest';

const EQUIPMENT_TYPES = [
  'Level',
  'Laser',
  'Pipe Laser',
  'Transit',
  'Theodolite',
  'GPS',
];

const getInitialFormData = (userEmail?: string): EquipmentRentalRequestFormData => ({
  customer_first_name: '',
  customer_last_name: '',
  customer_email: userEmail || '',
  customer_phone: '',
  equipment_type: '',
  pickup_date: '',
  return_date: '',
  rental_agreement_accepted: false,
  payment_method: '',
});

export default function EquipmentRental() {
  const { user } = useAuth();

  const [formData, setFormData] = useState<EquipmentRentalRequestFormData>(() =>
    getInitialFormData(user?.email)
  );

  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (data: EquipmentRentalRequestFormData) => api.createEquipmentRentalRequest(data),
    onSuccess: () => {
      setSuccessMessage('Equipment rental request submitted successfully!');
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Equipment Rental Form</h1>

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
          {/* Customer Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer_first_name" className="label">
                  First Name
                </label>
                <input
                  type="text"
                  id="customer_first_name"
                  name="customer_first_name"
                  required
                  value={formData.customer_first_name}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="customer_last_name" className="label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="customer_last_name"
                  name="customer_last_name"
                  required
                  value={formData.customer_last_name}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="customer_email" className="label">
                Email Address
              </label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                required
                value={formData.customer_email}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="customer_phone" className="label">
                Phone Number
              </label>
              <input
                type="tel"
                id="customer_phone"
                name="customer_phone"
                required
                value={formData.customer_phone}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* Select Equipment */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Equipment</h2>
            <select
              id="equipment_type"
              name="equipment_type"
              required
              value={formData.equipment_type}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Equipment</option>
              {EQUIPMENT_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Rental Agreement */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rental Agreement Form</h2>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="rental_agreement_accepted"
                name="rental_agreement_accepted"
                required
                checked={formData.rental_agreement_accepted}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rental_agreement_accepted" className="ml-2 text-sm text-gray-700">
                By checking this box you agree that you have read the terms in this{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Rental Agreement Form
                </a>
                .
              </label>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
            <input
              type="text"
              id="payment_method"
              name="payment_method"
              required
              value={formData.payment_method}
              onChange={handleChange}
              placeholder="e.g., Visa ending 1234"
              className="input"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary max-w-md"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
