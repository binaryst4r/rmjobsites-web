import React from 'react';

// Temporarily disabled until per-item shipping weights/dimensions can be sourced
// reliably (Square's catalog API doesn't expose the dashboard's "Fulfill orders"
// fields). Flip to true to re-enable the Shipping option in checkout.
const SHIPPING_ENABLED = false;

export type FulfillmentType = 'PICKUP' | 'DELIVERY' | 'SHIPMENT';
export type PickupVariant = 'normal' | 'after_hours';
export type DeliveryTier = 'next_day' | 'two_day' | 'three_day';

interface FulfillmentSelectorProps {
  selectedType: FulfillmentType;
  onTypeChange: (type: FulfillmentType) => void;
  pickupVariant: PickupVariant;
  onPickupVariantChange: (variant: PickupVariant) => void;
  deliveryTier: DeliveryTier;
  onDeliveryTierChange: (tier: DeliveryTier) => void;
  onRequestPhoneCall?: () => void;
}

const subOptionClass = (active: boolean) =>
  `flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
    active ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
  }`;

const FulfillmentSelector: React.FC<FulfillmentSelectorProps> = ({
  selectedType,
  onTypeChange,
  pickupVariant,
  onPickupVariantChange,
  deliveryTier,
  onDeliveryTierChange,
  onRequestPhoneCall,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Fulfillment Method</h2>

      <div className="space-y-3">
        {/* Pickup */}
        <div
          className={`p-4 border-2 rounded-lg transition-colors ${
            selectedType === 'PICKUP' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="fulfillment"
              value="PICKUP"
              checked={selectedType === 'PICKUP'}
              onChange={() => onTypeChange('PICKUP')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-900">Pickup</div>
              <div className="text-sm text-gray-600">Pick up at our Commerce City location</div>
            </div>
            <div className="text-green-600 font-semibold">FREE</div>
          </label>

          {selectedType === 'PICKUP' && (
            <div className="mt-3 pl-7 space-y-2">
              <label className={subOptionClass(pickupVariant === 'normal')}>
                <input
                  type="radio"
                  name="pickup-variant"
                  value="normal"
                  checked={pickupVariant === 'normal'}
                  onChange={() => onPickupVariantChange('normal')}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Pickup &mdash; normal hours</span>
                  <br />
                  <span className="italic">Normal business hours are M-F 8:30 - 5:00PM</span>
                </span>
              </label>

              <label className={subOptionClass(pickupVariant === 'after_hours')}>
                <input
                  type="radio"
                  name="pickup-variant"
                  value="after_hours"
                  checked={pickupVariant === 'after_hours'}
                  onChange={() => onPickupVariantChange('after_hours')}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Pickup &mdash; after hours</span>
                  <br />
                  <span className="italic">If you select this option we will contact you with instructions</span>
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Delivery */}
        <div
          className={`p-4 border-2 rounded-lg transition-colors ${
            selectedType === 'DELIVERY' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="fulfillment"
              value="DELIVERY"
              checked={selectedType === 'DELIVERY'}
              onChange={() => onTypeChange('DELIVERY')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-900">Delivery</div>
              <div className="text-sm text-gray-600">
                Within a 50 mile radius of 7204 East 53rd Place, Commerce City CO
              </div>
            </div>
          </label>

          {selectedType === 'DELIVERY' && (
            <div className="mt-3 pl-7 space-y-2">
              <label className={subOptionClass(deliveryTier === 'next_day')}>
                <input
                  type="radio"
                  name="delivery-tier"
                  value="next_day"
                  checked={deliveryTier === 'next_day'}
                  onChange={() => onDeliveryTierChange('next_day')}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Next Day delivery</span>
                  <br />
                  <span className="italic">
                    Orders must be placed by 3pm for next day delivery, available within a 50 mile
                    radius of 7204 East 53rd Place Commerce City CO 80022
                  </span>
                </span>
              </label>

              <label className={subOptionClass(deliveryTier === 'two_day')}>
                <input
                  type="radio"
                  name="delivery-tier"
                  value="two_day"
                  checked={deliveryTier === 'two_day'}
                  onChange={() => onDeliveryTierChange('two_day')}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-900">2-Day delivery</span>
              </label>

              <label className={subOptionClass(deliveryTier === 'three_day')}>
                <input
                  type="radio"
                  name="delivery-tier"
                  value="three_day"
                  checked={deliveryTier === 'three_day'}
                  onChange={() => onDeliveryTierChange('three_day')}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-900">3-Day delivery</span>
              </label>

              <p className="text-xs text-gray-500 italic pt-1">
                Pricing for delivery is coordinated by our team after the order is placed.
              </p>
            </div>
          )}
        </div>

        {/* Shipping */}
        {SHIPPING_ENABLED && (
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
              <div className="font-medium text-gray-900">Shipping</div>
              <div className="text-sm text-gray-600">
                Calculated at checkout based on destination
              </div>
            </div>
          </label>
        )}
      </div>

      {onRequestPhoneCall && (
        <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            Unsure about your order?{' '}
            <button
              type="button"
              onClick={onRequestPhoneCall}
              className="font-semibold underline hover:no-underline"
            >
              Click here to request a phone call.
            </button>{' '}
            No payment will be collected at this time, but your order will be in the queue.
          </p>
        </div>
      )}
    </div>
  );
};

export default FulfillmentSelector;
