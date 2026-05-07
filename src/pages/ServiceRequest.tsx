import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import type {
  ServiceRequestFormData,
  TrinaryStatus,
  RentalStatus,
} from '../types/ServiceRequest';

const SERVICE_TYPES = [
  'Level',
  'Laser',
  'Pipe Laser',
  'Slope Laser',
  'Transit',
  'Theodolite',
  'GPS On-Site Service',
  'GPS 3D Modeling',
  'Chase Drain',
  'Unsure - please call me',
] as const;

type ServiceType = (typeof SERVICE_TYPES)[number];

interface TurnAroundOption {
  value: string;
  label: string;
}

const VARIES_OPTION: TurnAroundOption = {
  value: 'Varies - we will contact you',
  label: 'Turn around time varies by project. We will contact you to discuss turn around time.',
};

const TURN_AROUND_BY_TYPE: Partial<Record<ServiceType, TurnAroundOption[]>> = {
  Level: [
    { value: 'Standard 7-10 business days - $180', label: 'Standard 7-10 business days — $180.00' },
    { value: '48 hour rush - $435', label: '48 hour rush — $435' },
    { value: '24 hour rush - $600', label: '24 hour rush — $600' },
  ],
  Laser: [
    { value: 'Standard 7-10 business days - $180', label: 'Standard 7-10 business days — $180.00' },
    { value: '48 hour rush - $435', label: '48 hour rush — $435' },
    { value: '24 hour rush - $600', label: '24 hour rush — $600' },
  ],
  'Slope Laser': [
    { value: 'Standard 7-10 business days - $280', label: 'Standard 7-10 business days — $280' },
    { value: '48 hour rush - $680', label: '48 hour rush — $680' },
    { value: '24 hour rush - $880', label: '24 hour rush — $880' },
  ],
  'Pipe Laser': [
    { value: 'Standard 7-10 business days - $280', label: 'Standard 7-10 business days — $280' },
    { value: '48 hour rush - $680', label: '48 hour rush — $680' },
    { value: '24 hour rush - $880', label: '24 hour rush — $880' },
  ],
  Theodolite: [
    { value: 'Standard 7-10 business days - $410', label: 'Standard 7-10 business days — $410' },
    { value: '48 hour rush - $990', label: '48 hour rush — $990' },
    { value: '24 hour rush - $1300', label: '24 hour rush — $1300' },
  ],
  Transit: [
    { value: 'Standard 10-14 business days - $410', label: 'Standard 10-14 business days — $410' },
    { value: '48 hour rush - $990', label: '48 hour rush — $990' },
    { value: '24 hour rush - $1300', label: '24 hour rush — $1300' },
  ],
  'GPS On-Site Service': [VARIES_OPTION],
  'GPS 3D Modeling': [VARIES_OPTION],
  'Chase Drain': [VARIES_OPTION],
};

const REPLACEMENT_PARTS_BY_TYPE: Partial<Record<ServiceType, string[]>> = {
  Level: ['Carrying Case'],
  Laser: ['Detector', 'Detector Bracket', 'Carrying Case'],
  'Pipe Laser': ['Chargers', 'Feet', 'Targets', 'Target Holder', 'Carrying Case'],
  Theodolite: ['Carrying Case'],
  Transit: ['Carrying Case'],
  'Slope Laser': ['Detector', 'Detector Bracket', 'Carrying Case'],
};

const RENTAL_PRICING_DURING_SERVICE: Record<string, string> = {
  Level: '$50/day, $90/week, $175/month',
  Laser: '$50/day, $90/week, $175/month',
  'Pipe Laser': '$115/day, $225/week, $450/month',
  Theodolite: '$100/day, $140/week, $225/month',
  Transit: '$50/day, $90/week, $175/month',
  'Slope Laser': '$100/day, $140/week, $225/month',
  'GPS On-Site': '$400/day, $800/week, $2100/month',
};

// GPS modeling and Chase Drain don't surface the parts/rental questions per the spec.
const HIDE_REPLACEMENT_FOR: ServiceType[] = ['GPS On-Site Service', 'GPS 3D Modeling', 'Chase Drain'];
const HIDE_RENTAL_DURING_FOR: ServiceType[] = ['GPS 3D Modeling', 'Chase Drain'];

const TRINARY_OPTIONS: { value: TrinaryStatus; label: string }[] = [
  { value: 'NO', label: 'No' },
  { value: 'YES', label: 'Yes' },
  { value: 'DONT_KNOW', label: "Don't know" },
];

const RENTAL_OPTIONS: { value: RentalStatus; label: string }[] = [
  { value: 'NO', label: 'No' },
  { value: 'YES', label: 'Yes' },
];

const getInitial = (
  email?: string,
  phone?: string,
  company?: string,
  name?: string,
): ServiceRequestFormData => ({
  customer_name: name || '',
  customer_email: email || '',
  customer_phone: phone || '',
  company: company || '',
  service_requested: '',
  pickup_date: '',
  dropoff_time: '',
  after_hours_dropoff: false,
  turn_around_time: '',
  damage_status: '',
  replacement_status: '',
  replacement_parts: [],
  rental_status: '',
  rental_during_service_type: '',
  notes: '',
});

export const ServiceRequest = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const initialName = useMemo(() => {
    const u = user as { given_name?: string; family_name?: string } | null;
    if (!u) return '';
    return [u.given_name, u.family_name].filter(Boolean).join(' ');
  }, [user]);

  const [form, setForm] = useState<ServiceRequestFormData>(() =>
    getInitial(
      user?.email,
      // @ts-expect-error optional fields on User
      user?.phone_number,
      // @ts-expect-error optional fields on User
      user?.company_name,
      initialName,
    ),
  );

  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (data: ServiceRequestFormData) => api.createServiceRequest(data),
    onSuccess: () => {
      setSuccessMessage(
        'Thank you for filling out a service request form. Due to the nature of the service request, draft invoices will be shared with you for approval before the service begins. Your business is important to us, and we will contact you within 24 hours.',
      );
      setForm(
        getInitial(
          user?.email,
          // @ts-expect-error optional fields on User
          user?.phone_number,
          // @ts-expect-error optional fields on User
          user?.company_name,
          initialName,
        ),
      );
      setTimeout(() => setSuccessMessage(''), 10000);
    },
  });

  const serviceType = form.service_requested as ServiceType | '';
  const turnAroundOptions = serviceType ? TURN_AROUND_BY_TYPE[serviceType] || [] : [];
  const partsForService = serviceType ? REPLACEMENT_PARTS_BY_TYPE[serviceType] : undefined;
  const isUnsure = serviceType === 'Unsure - please call me';
  const showReplacement = serviceType && !isUnsure && !HIDE_REPLACEMENT_FOR.includes(serviceType);
  const showRentalDuring = serviceType && !isUnsure && !HIDE_RENTAL_DURING_FOR.includes(serviceType);
  const showDropoffAndTurnaround = serviceType && !isUnsure;

  const handleSelectService = (value: string) => {
    setForm((prev) => ({
      ...prev,
      service_requested: value,
      // Reset dependent fields when service type changes
      turn_around_time: '',
      damage_status: '',
      replacement_status: '',
      replacement_parts: [],
      rental_status: '',
      rental_during_service_type: '',
    }));
  };

  const togglePart = (part: string) => {
    setForm((prev) => {
      const has = prev.replacement_parts.includes(part);
      return {
        ...prev,
        replacement_parts: has
          ? prev.replacement_parts.filter((p) => p !== part)
          : [...prev.replacement_parts, part],
      };
    });
  };

  const handleField = <K extends keyof ServiceRequestFormData>(
    name: K,
    value: ServiceRequestFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Request</h1>
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
            <label htmlFor="company" className="label">
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="company"
              required
              value={form.company}
              onChange={(e) => handleField('company', e.target.value)}
              className="input"
            />
          </div>

          {/* Contact */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900">
              Contact <span className="text-red-600">*</span>
            </legend>
            <div>
              <label htmlFor="customer_name" className="label">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="customer_name"
                required
                value={form.customer_name}
                onChange={(e) => handleField('customer_name', e.target.value)}
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
                required={!isLoggedIn}
                value={form.customer_email}
                onChange={(e) => handleField('customer_email', e.target.value)}
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
                required={!isLoggedIn}
                value={form.customer_phone}
                onChange={(e) => handleField('customer_phone', e.target.value)}
                className="input"
              />
            </div>
          </fieldset>

          {/* Select Service Type */}
          <div>
            <label htmlFor="service_requested" className="label">
              Select Service Type <span className="text-red-600">*</span>
            </label>
            <select
              id="service_requested"
              required
              value={form.service_requested}
              onChange={(e) => handleSelectService(e.target.value)}
              className="input"
            >
              <option value="">Select a service</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {isUnsure && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-900">
              Thanks &mdash; we&rsquo;ll reach out to discuss what service you need. The rest of the
              form is optional.
            </div>
          )}

          {showDropoffAndTurnaround && (
            <>
              {/* Drop off date / time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickup_date" className="label">
                    Drop off Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    id="pickup_date"
                    required
                    value={form.pickup_date}
                    onChange={(e) => handleField('pickup_date', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="dropoff_time" className="label">
                    Drop off Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="time"
                    id="dropoff_time"
                    required
                    value={form.dropoff_time}
                    onChange={(e) => handleField('dropoff_time', e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="after_hours_dropoff"
                  checked={form.after_hours_dropoff}
                  onChange={(e) => handleField('after_hours_dropoff', e.target.checked)}
                  className="mt-1 h-4 w-4 text-red-900 border-gray-300 rounded"
                />
                <label htmlFor="after_hours_dropoff" className="text-sm text-gray-700">
                  Are you dropping off after hours? Normal business hours are M-F 8:30 - 5:00PM.
                  If you select this option we will contact you with instructions.
                </label>
              </div>

              {/* Turn Around Time */}
              <fieldset className="space-y-3">
                <legend className="text-lg font-semibold text-gray-900">
                  Turn Around Time <span className="text-red-600">*</span>
                </legend>
                {turnAroundOptions.length === 1 && turnAroundOptions[0] === VARIES_OPTION ? (
                  <>
                    <p className="text-sm text-gray-700 italic">{VARIES_OPTION.label}</p>
                    <input type="hidden" name="turn_around_time" value={VARIES_OPTION.value} />
                  </>
                ) : (
                  turnAroundOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3 border-2 rounded-md cursor-pointer transition-colors ${
                        form.turn_around_time === opt.value
                          ? 'border-red-900 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="turn_around_time"
                        value={opt.value}
                        checked={form.turn_around_time === opt.value}
                        onChange={() => handleField('turn_around_time', opt.value)}
                        className="mt-1 h-4 w-4 text-red-900 border-gray-300"
                        required
                      />
                      <span className="text-sm text-gray-800">{opt.label}</span>
                    </label>
                  ))
                )}
              </fieldset>

              {/* Damage status */}
              <fieldset className="space-y-3">
                <legend className="text-lg font-semibold text-gray-900">
                  Has it been dropped or taken impact in any way?{' '}
                  <span className="text-red-600">*</span>
                </legend>
                <div className="flex flex-wrap gap-3">
                  {TRINARY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`px-4 py-2 border-2 rounded-md cursor-pointer text-sm transition-colors ${
                        form.damage_status === opt.value
                          ? 'border-red-900 bg-red-50 text-red-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="damage_status"
                        value={opt.value}
                        checked={form.damage_status === opt.value}
                        onChange={() => handleField('damage_status', opt.value)}
                        className="sr-only"
                        required
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {/* Replacement parts */}
          {showReplacement && (
            <fieldset className="space-y-3">
              <legend className="text-lg font-semibold text-gray-900">
                Do you need any replacement parts added to this service?{' '}
                <span className="text-red-600">*</span>
              </legend>
              <div className="flex flex-wrap gap-3">
                {TRINARY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`px-4 py-2 border-2 rounded-md cursor-pointer text-sm transition-colors ${
                      form.replacement_status === opt.value
                        ? 'border-red-900 bg-red-50 text-red-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="replacement_status"
                      value={opt.value}
                      checked={form.replacement_status === opt.value}
                      onChange={() => handleField('replacement_status', opt.value)}
                      className="sr-only"
                      required
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              {form.replacement_status === 'YES' && partsForService && partsForService.length > 0 && (
                <div className="pl-4 mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Select the parts you need:
                  </p>
                  {partsForService.map((part) => (
                    <label key={part} className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={form.replacement_parts.includes(part)}
                        onChange={() => togglePart(part)}
                        className="h-4 w-4 text-red-900 border-gray-300 rounded"
                      />
                      <span>{part}</span>
                    </label>
                  ))}
                </div>
              )}
            </fieldset>
          )}

          {/* Rental during service */}
          {showRentalDuring && (
            <fieldset className="space-y-3">
              <legend className="text-lg font-semibold text-gray-900">
                Do you need a rental during the service?{' '}
                <span className="text-red-600">*</span>
              </legend>
              <p className="text-sm text-gray-600">
                We offer 50% off rental rates during repairs.
              </p>
              <div className="flex flex-wrap gap-3">
                {RENTAL_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`px-4 py-2 border-2 rounded-md cursor-pointer text-sm transition-colors ${
                      form.rental_status === opt.value
                        ? 'border-red-900 bg-red-50 text-red-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rental_status"
                      value={opt.value}
                      checked={form.rental_status === opt.value}
                      onChange={() => handleField('rental_status', opt.value)}
                      className="sr-only"
                      required
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              {form.rental_status === 'YES' && (
                <div className="pl-4 mt-3 space-y-2">
                  <label htmlFor="rental_during_service_type" className="label">
                    Which equipment? <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="rental_during_service_type"
                    required
                    value={form.rental_during_service_type}
                    onChange={(e) =>
                      handleField('rental_during_service_type', e.target.value)
                    }
                    className="input"
                  >
                    <option value="">Select equipment</option>
                    {Object.keys(RENTAL_PRICING_DURING_SERVICE).map((eq) => (
                      <option key={eq} value={eq}>
                        {eq}
                      </option>
                    ))}
                  </select>
                  {form.rental_during_service_type &&
                    RENTAL_PRICING_DURING_SERVICE[form.rental_during_service_type] && (
                      <p className="text-sm text-gray-600 italic">
                        {RENTAL_PRICING_DURING_SERVICE[form.rental_during_service_type]}{' '}
                        (50% off applied during repair)
                      </p>
                    )}
                </div>
              )}
            </fieldset>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="label">
              Any other comments, notes, or questions?
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={form.notes}
              onChange={(e) => handleField('notes', e.target.value)}
              className="input resize-none"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary max-w-md"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Service Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
