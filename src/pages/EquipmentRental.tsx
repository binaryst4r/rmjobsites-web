import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import type {
  EquipmentRentalRequestFormData,
  RentalDurationUnit,
} from '../types/EquipmentRentalRequest';

const EQUIPMENT_TYPES = [
  'Laser',
  'Level',
  'Pipe Laser',
  'Slope Laser',
  'Transit',
  'Theodolite',
  'GPS On-Site',
] as const;

type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

interface PricingTier {
  day: string;
  week: string;
  month: string;
}

const RENTAL_PRICING: Record<EquipmentType, PricingTier> = {
  Laser: { day: '$100/day', week: '$175/week', month: '$350/month' },
  Level: { day: '$100/day', week: '$175/week', month: '$350/month' },
  'Pipe Laser': { day: '$225/day', week: '$450/week', month: '$900/month' },
  'Slope Laser': { day: '$200/day', week: '$275/week', month: '$450/month' },
  Transit: { day: '$100/day', week: '$175/week', month: '$350/month' },
  Theodolite: { day: '$200/day', week: '$275/week', month: '$450/month' },
  'GPS On-Site': { day: '$700/day', week: '$1,400/week', month: '$4,200/month' },
};

const RENTAL_AGREEMENT_URL =
  'https://drive.google.com/file/d/14Z2K8x54GmSIWkxZqqsnzXH2N8twbCNw/view?usp=sharing';

const getInitialFormData = (
  userEmail?: string,
  userPhone?: string,
  userCompany?: string,
): EquipmentRentalRequestFormData => ({
  company_name: userCompany || '',
  contact_name: '',
  customer_email: userEmail || '',
  customer_phone: userPhone || '',
  equipment_type: '',
  rental_duration_unit: '',
  rental_duration_amount: '',
  rental_agreement_accepted: false,
  notes: '',
});

export default function EquipmentRental() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [formData, setFormData] = useState<EquipmentRentalRequestFormData>(() =>
    getInitialFormData(
      user?.email,
      user?.phone_number,
      user?.company_name,
    ),
  );

  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (data: EquipmentRentalRequestFormData) =>
      api.createEquipmentRentalRequest(data),
    onSuccess: () => {
      setSuccessMessage(
        'Thank you for filling out a rental request form. Your requested equipment has been set aside for you. We will contact you shortly.',
      );
      setFormData(
        getInitialFormData(
          user?.email,
          user?.phone_number,
          user?.company_name,
        ),
      );
      setTimeout(() => setSuccessMessage(''), 8000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const selectedEquipment = formData.equipment_type as EquipmentType | '';
  const pricing = selectedEquipment && RENTAL_PRICING[selectedEquipment];

  const setDurationUnit = (unit: RentalDurationUnit) => {
    setFormData((prev) => ({ ...prev, rental_duration_unit: unit }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipment Rental Request</h1>
        <p className="text-gray-600 mb-8">
          First-time customers, please enter your phone number and email so we can confirm.
        </p>

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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company */}
          <div>
            <label htmlFor="company_name" className="label">
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              required
              value={formData.company_name}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Contact */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900">
              Contact <span className="text-red-600">*</span>
            </legend>
            <div>
              <label htmlFor="contact_name" className="label">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                required
                value={formData.contact_name}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="customer_email" className="label">
                Email {!isLoggedIn && <span className="text-red-600">*</span>}
              </label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                required={!isLoggedIn}
                value={formData.customer_email}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="customer_phone" className="label">
                Phone Number {!isLoggedIn && <span className="text-red-600">*</span>}
              </label>
              <input
                type="tel"
                id="customer_phone"
                name="customer_phone"
                required={!isLoggedIn}
                value={formData.customer_phone}
                onChange={handleChange}
                className="input"
              />
            </div>
          </fieldset>

          {/* Rental Type */}
          <div>
            <label htmlFor="equipment_type" className="label">
              Rental Type <span className="text-red-600">*</span>
            </label>
            <select
              id="equipment_type"
              name="equipment_type"
              required
              value={formData.equipment_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  equipment_type: e.target.value,
                  rental_duration_unit: '',
                  rental_duration_amount: '',
                }))
              }
              className="input"
            >
              <option value="">Select equipment</option>
              {EQUIPMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Rental Duration */}
          {pricing && (
            <fieldset className="space-y-3">
              <legend className="text-lg font-semibold text-gray-900">
                Rental Duration <span className="text-red-600">*</span>
              </legend>
              <p className="text-sm text-gray-600">
                Select your rate, then enter how many {formData.rental_duration_unit ? `${formData.rental_duration_unit}s` : 'days/weeks/months'} you need.
              </p>

              {(['day', 'week', 'month'] as RentalDurationUnit[]).map((unit) => (
                <label
                  key={unit}
                  className={`flex items-start gap-3 p-3 border-2 rounded-md cursor-pointer transition-colors ${
                    formData.rental_duration_unit === unit
                      ? 'border-red-900 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="rental_duration_unit"
                    value={unit}
                    checked={formData.rental_duration_unit === unit}
                    onChange={() => setDurationUnit(unit)}
                    className="mt-1 h-4 w-4 text-red-900 border-gray-300"
                    required
                  />
                  <span className="text-sm text-gray-800">
                    <span className="font-medium capitalize">Rent by the {unit}</span>
                    <span className="text-gray-600"> &mdash; {pricing[unit]}</span>
                  </span>
                </label>
              ))}

              {formData.rental_duration_unit && (
                <div className="pl-6">
                  <label htmlFor="rental_duration_amount" className="label">
                    How many {formData.rental_duration_unit}s? <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="rental_duration_amount"
                    name="rental_duration_amount"
                    min={1}
                    step={1}
                    required
                    value={formData.rental_duration_amount}
                    onChange={handleChange}
                    className="input max-w-xs"
                  />
                </div>
              )}
            </fieldset>
          )}

          {/* Comments */}
          <div>
            <label htmlFor="notes" className="label">
              Any other comments, notes, or questions?
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="input resize-none"
            />
          </div>

          {/* Rental Agreement */}
          <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900">Rental Agreement</h2>
            <p className="text-sm text-gray-700">
              <a
                href={RENTAL_AGREEMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-900 underline hover:no-underline"
              >
                View the rental agreement form
              </a>
              .
            </p>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="rental_agreement_accepted"
                name="rental_agreement_accepted"
                required
                checked={formData.rental_agreement_accepted}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-red-900 focus:ring-red-700 border-gray-300 rounded"
              />
              <label
                htmlFor="rental_agreement_accepted"
                className="ml-2 text-sm text-gray-700"
              >
                I have read and agree to the terms in the Rental Agreement Form.
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary max-w-md"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Rental Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
