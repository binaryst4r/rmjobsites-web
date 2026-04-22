import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import type { ServiceRequestFormData } from '../types/ServiceRequest';

const SERVICE_TYPES = [
  'Level',
  'Laser',
  'Pipe Laser',
  'Slope Laser',
  'Transit',
  'Theodolite',
  'GPS - On site service',
  'GPS 3D modeling',
  'Chase Drain'
];

const TURN_AROUND_OPTIONS: Record<string, string[]> = {
  'Level': [
    'Standard 7-10 business days - $180.00',
    '48 hour rush - $435',
    '24 hour rush - $600',
  ],
  'Laser': [
    'Standard 7-10 business days - $180.00',
    '48 hour rush - $435',
    '24 hour rush - $600',
  ],
  'Slope Laser': [
    'Standard 7-10 business days - $280',
    '48 hour rush - $680',
    '24 hour rush - $880',
  ],
  'Pipe Laser': [
    'Standard 7-10 business days - $280',
    '48 hour rush - $680',
    '24 hour rush - $880',
  ],
  'Theodolite': [
    'Standard 7-10 business days - $410',
    '48 hour rush - $990',
    '24 hour rush - $1300',
  ],
  'Transit': [
    'Standard 10-14 business days - $410',
    '48 hour rush - $990',
    '24 hour rush - $1300',
  ],
};

const VARIES_BY_PROJECT_SERVICES = ['GPS - On site service', 'GPS 3D modeling', 'Chase Drain'];
const VARIES_MESSAGE = 'Turn around time varies by project. We will contact you to discuss turn around time';

const RENTAL_PRICES: Record<string, string> = {
  'Level': '$50/day, $90/week, $175/month',
  'Laser': '$50/day, $90/week, $175/month',
  'Pipe Laser': '$115/day, $225/week, $450/month',
  'Theodolite': '$100/day, $140/week, $225/month',
  'Transit': '$50/day, $90/week, $175/month',
  'Slope Laser': '$100/day, $140/week, $225/month',
  'GPS - On site service': '$400/day, $800/week, $2100/month',
};

const HIDE_RENTAL_SERVICES = ['GPS 3D modeling', 'Chase Drain'];

const ACCESSORY_OPTIONS: Record<string, string[]> = {
  'Level': ['Carrying Case'],
  'Laser': ['Detector', 'Detector Bracket', 'Carrying Case'],
  'Slope Laser': ['Detector', 'Detector Bracket', 'Carrying Case'],
  'Pipe Laser': ['Chargers', 'Feet', 'Targets', 'Target Holder', 'Carrying Case'],
  'Theodolite': ['Carrying Case'],
  'Transit': ['Carrying Case'],
};

const getInitialFormData = (userEmail?: string): ServiceRequestFormData => ({
  customer_name: '',
  customer_email: userEmail || '',
  company: '',
  service_requested: '',
  pickup_date: '',
  return_date: '',
  turn_around_time: '',
  after_hours_dropoff: false,
  dropped_or_impacted: null,
  needs_replacement_accessories: null,
  needs_rental: false,
  manufacturer: '',
  model: '',
  serial_number: '',
  notes: '',
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
      setFormData(getInitialFormData(user?.email));
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
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        if (name === 'service_requested') {
          updated.turn_around_time = VARIES_BY_PROJECT_SERVICES.includes(value)
            ? VARIES_MESSAGE
            : '';
          updated.needs_replacement_accessories = null;
          if (HIDE_RENTAL_SERVICES.includes(value)) {
            updated.needs_rental = false;
          }
        }
        return updated;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'dropped_or_impacted') {
      const mapped = value === 'Yes' ? true : value === 'No' ? false : null;
      setFormData(prev => ({ ...prev, [name]: mapped }));
    } else if (name === 'needs_rental') {
      setFormData(prev => ({ ...prev, [name]: value === 'Yes' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 px-6 py-5">
            <h1 className="text-2xl font-bold text-white">Service Request</h1>
            <p className="text-sm text-gray-300 mt-1">Submit your equipment service request below</p>
          </div>

          <div className="p-6 sm:p-8">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800 text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {mutation.isError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 text-sm">{mutation.error.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer & Company */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 w-full">
                  Contact Information
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {user ? (
                      <>
                        <label className="label">Customer Email</label>
                        <p className="mt-1 text-gray-900 py-2">{user.email}</p>
                      </>
                    ) : (
                      <>
                        <label htmlFor="customer_email" className="label">Customer Email</label>
                        <input
                          type="email"
                          id="customer_email"
                          name="customer_email"
                          required
                          value={formData.customer_email}
                          onChange={handleChange}
                          className="input"
                        />
                      </>
                    )}
                  </div>
                  <div>
                    <label htmlFor="company" className="label">Company</label>
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
                </div>
              </fieldset>

              {/* Service & Scheduling */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 w-full">
                  Service Details
                </legend>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="service_requested" className="label">Service Requested</label>
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
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    {formData.service_requested && (
                      <div>
                        <label htmlFor="turn_around_time" className="label">Turn Around Time</label>
                        {VARIES_BY_PROJECT_SERVICES.includes(formData.service_requested) ? (
                          <p className="mt-2 text-sm text-gray-500 italic">{VARIES_MESSAGE}</p>
                        ) : (
                          <select
                            id="turn_around_time"
                            name="turn_around_time"
                            required
                            value={formData.turn_around_time}
                            onChange={handleChange}
                            className="input"
                          >
                            <option value="">Select Turn Around Time</option>
                            {(TURN_AROUND_OPTIONS[formData.service_requested] || []).map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pickup_date" className="label">Pickup Date</label>
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
                      <label htmlFor="return_date" className="label">Return Date</label>
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

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="after_hours_dropoff"
                      name="after_hours_dropoff"
                      checked={formData.after_hours_dropoff}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="after_hours_dropoff" className="text-sm text-gray-700">
                      After hours drop-off
                    </label>
                    <div className="relative group">
                      <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 text-xs text-white bg-gray-800 rounded shadow-lg z-10">
                        Are you dropping off after hours? Normal business hours are M-F 8:30 - 5:00PM, if you select this option we will contact you with instructions.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Equipment Info */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 w-full">
                  Equipment Information
                </legend>
                <div className="space-y-4">
                  {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="manufacturer" className="label">Manufacturer</label>
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
                      <label htmlFor="model" className="label">Model</label>
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
                      <label htmlFor="serial_number" className="label">Serial Number</label>
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
                  </div> */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dropped_or_impacted" className="label">Dropped or impacted?</label>
                      <select
                        id="dropped_or_impacted"
                        name="dropped_or_impacted"
                        required
                        value={formData.dropped_or_impacted === true ? 'Yes' : formData.dropped_or_impacted === false ? 'No' : 'IDK'}
                        onChange={(e) => handleSelectChange('dropped_or_impacted', e.target.value)}
                        className="input"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                        <option value="IDK">I don't know</option>
                      </select>
                    </div>

                    {ACCESSORY_OPTIONS[formData.service_requested] && (
                      <div>
                        <label htmlFor="needs_replacement_accessories" className="label">
                          Need replacement accessories?
                        </label>
                        <select
                          id="needs_replacement_accessories"
                          name="needs_replacement_accessories"
                          value={formData.needs_replacement_accessories || ''}
                          onChange={handleChange}
                          className="input"
                        >
                          <option value="">None</option>
                          {ACCESSORY_OPTIONS[formData.service_requested].map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {!HIDE_RENTAL_SERVICES.includes(formData.service_requested) && (
                    <div className="sm:w-1/2">
                      <label htmlFor="needs_rental" className="label">Need rental during service?</label>
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
                      {formData.needs_rental && RENTAL_PRICES[formData.service_requested] && (
                        <p className="mt-2 text-sm text-gray-500">
                          Rental pricing: {RENTAL_PRICES[formData.service_requested]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </fieldset>

              {/* Notes */}
              <fieldset>
                <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 w-full">
                  Additional Notes
                </legend>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="input h-auto"
                  placeholder="Any additional information..."
                />
              </fieldset>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="btn-primary"
                >
                  {mutation.isPending ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
