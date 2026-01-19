import React from 'react';

export type FulfillmentType = 'PICKUP' | 'SHIPMENT';

interface FulfillmentSelectorProps {
  selectedType: FulfillmentType;
  onTypeChange: (type: FulfillmentType) => void;
}

const FulfillmentSelector: React.FC<FulfillmentSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Fulfillment Method
      </h2>

      <div className="space-y-3">
        {/* Pickup Option */}
        <label
          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedType === 'PICKUP'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="fulfillment"
            value="PICKUP"
            checked={selectedType === 'PICKUP'}
            onChange={() => onTypeChange('PICKUP')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <div className="ml-3 flex-1">
            <div className="font-medium text-gray-900">
              Pickup
            </div>
            <div className="text-sm text-gray-600">
              Free - Pick up at our location
            </div>
          </div>
          <div className="text-green-600 font-semibold">
            FREE
          </div>
        </label>

        {/* Shipping Option */}
        <label
          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedType === 'SHIPMENT'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="fulfillment"
            value="SHIPMENT"
            checked={selectedType === 'SHIPMENT'}
            onChange={() => onTypeChange('SHIPMENT')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <div className="ml-3 flex-1">
            <div className="font-medium text-gray-900">
              Shipping
            </div>
            <div className="text-sm text-gray-600">
              Delivered to your address
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default FulfillmentSelector;
