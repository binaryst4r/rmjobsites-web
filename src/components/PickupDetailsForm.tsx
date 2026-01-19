import React from 'react';

export interface PickupDetails {
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
}

interface PickupDetailsFormProps {
  pickupDetails: PickupDetails;
  onPickupDetailsChange: (details: PickupDetails) => void;
  errors?: {
    date?: string;
    time?: string;
  };
}

const PickupDetailsForm: React.FC<PickupDetailsFormProps> = ({
  pickupDetails,
  onPickupDetailsChange,
  errors = {},
}) => {
  // Calculate next business day (skip weekends)
  const getNextBusinessDay = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // If tomorrow is Saturday (6), add 2 days to get Monday
    // If tomorrow is Sunday (0), add 1 day to get Monday
    if (tomorrow.getDay() === 6) {
      tomorrow.setDate(tomorrow.getDate() + 2);
    } else if (tomorrow.getDay() === 0) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }

    return tomorrow.toISOString().split('T')[0];
  };

  // Get minimum date (tomorrow or next business day)
  const getMinDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Check if a date is a weekend
  const isWeekend = (dateString: string): boolean => {
    const date = new Date(dateString + 'T00:00:00');
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Generate time options (8 AM to 5 PM in 30-minute intervals)
  const timeOptions = [];
  for (let hour = 8; hour < 17; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 16) { // Don't add 5:30 PM
      timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    onPickupDetailsChange({
      ...pickupDetails,
      date: newDate,
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPickupDetailsChange({
      ...pickupDetails,
      time: e.target.value,
    });
  };

  // Initialize with next business day and 10 AM if not set
  React.useEffect(() => {
    if (!pickupDetails.date) {
      onPickupDetailsChange({
        date: getNextBusinessDay(),
        time: pickupDetails.time || '10:00',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount with initial values

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Pickup Details
      </h2>

      {/* Pickup Address */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700 mb-1">
          Pickup Location
        </div>
        <div className="text-gray-900">
          7204 E 53rd Pl<br />
          Commerce City, CO 80022
        </div>
      </div>

      {/* Pickup Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pickup Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={pickupDetails.date}
          onChange={handleDateChange}
          min={getMinDate()}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.date
              ? 'border-red-500'
              : isWeekend(pickupDetails.date)
              ? 'border-yellow-500'
              : 'border-gray-300'
          }`}
          required
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
        {!errors.date && pickupDetails.date && isWeekend(pickupDetails.date) && (
          <p className="mt-1 text-sm text-yellow-600">
            Weekend pickup is not available. Please select a weekday or contact us to arrange.
          </p>
        )}
      </div>

      {/* Pickup Time */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pickup Time <span className="text-red-500">*</span>
        </label>
        <select
          value={pickupDetails.time}
          onChange={handleTimeChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.time ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select a time</option>
          {timeOptions.map((time) => {
            const [hour, minute] = time.split(':');
            const hourNum = parseInt(hour, 10);
            const ampm = hourNum >= 12 ? 'PM' : 'AM';
            const displayHour = hourNum > 12 ? hourNum - 12 : hourNum;
            const displayTime = `${displayHour}:${minute} ${ampm}`;

            return (
              <option key={time} value={time}>
                {displayTime}
              </option>
            );
          })}
        </select>
        {errors.time && (
          <p className="mt-1 text-sm text-red-600">{errors.time}</p>
        )}
      </div>

      {/* Note about weekend pickups */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Pickup hours are Monday-Friday, 8:00 AM - 5:00 PM.
          Need weekend pickup? Please contact us to arrange.
        </p>
      </div>
    </div>
  );
};

export default PickupDetailsForm;
