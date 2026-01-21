import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../lib/cart-context';
import { useAuth } from '../lib/auth-context';
import { api } from '../lib/api';
import { initializeSquarePayments, initializeCard, tokenizeCard, destroyCard } from '../lib/square-payments';
import FulfillmentSelector from '../components/FulfillmentSelector';
import PickupDetailsForm from '../components/PickupDetailsForm';
import type { FulfillmentType } from '../components/FulfillmentSelector';
import type { PickupDetails } from '../components/PickupDetailsForm';

interface OrderSummary {
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
}

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, isLoading: cartLoading } = useCart();
  const { user, refreshProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [cardInitialized, setCardInitialized] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Form state
  const [email, setEmail] = useState(user?.email || '');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [address, setAddress] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Fulfillment state
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('PICKUP');
  const [pickupDetails, setPickupDetails] = useState<PickupDetails>({
    date: '',
    time: '10:00',
  });

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    pickupDate?: string;
    pickupTime?: string;
  }>({});

  // Redirect if cart is empty (wait for cart to load first, skip if order just completed)
  useEffect(() => {
    if (!cartLoading && !orderCompleted && items.length === 0) {
      navigate('/cart');
    }
  }, [items, cartLoading, orderCompleted, navigate]);

  // Initialize Square Payments SDK
  useEffect(() => {
    let mounted = true;

    async function initSquare() {
      try {
        const config = await api.getSquareConfig();
        await initializeSquarePayments(config);

        if (mounted) {
          await initializeCard('card-container');
          setCardInitialized(true);
        }
      } catch (err) {
        console.error('Failed to initialize Square:', err);
        if (mounted) {
          setError('Failed to load payment form. Please refresh the page.');
        }
      }
    }

    initSquare();

    return () => {
      mounted = false;
      destroyCard();
    };
  }, []);

  // Calculate order totals
  useEffect(() => {
    async function calculateOrder() {
      try {
        const lineItems = items.map(item => ({
          catalog_object_id: item.variationId,
          quantity: item.quantity.toString()
        }));

        const result = await api.calculateOrder(lineItems, fulfillmentType);
        setOrderSummary({
          subtotal: result.subtotal,
          taxes: result.taxes,
          shipping: result.shipping,
          total: result.total
        });
      } catch (err) {
        console.error('Failed to calculate order:', err);
        setError('Failed to calculate order totals');
      }
    }

    if (items.length > 0) {
      calculateOrder();
    }
  }, [items, fulfillmentType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Validate based on fulfillment type
    const errors: typeof validationErrors = {};

    if (fulfillmentType === 'SHIPMENT') {
      if (!address.trim()) errors.address = 'Address is required for shipping';
      if (!city.trim()) errors.city = 'City is required for shipping';
      if (!state.trim()) errors.state = 'State is required for shipping';
      if (!postalCode.trim()) errors.postalCode = 'Postal code is required for shipping';
    } else if (fulfillmentType === 'PICKUP') {
      if (!pickupDetails.date) errors.pickupDate = 'Pickup date is required';
      if (!pickupDetails.time) errors.pickupTime = 'Pickup time is required';

      // Check if date is a weekend
      const pickupDate = new Date(pickupDetails.date + 'T00:00:00');
      const day = pickupDate.getDay();
      if (day === 0 || day === 6) {
        errors.pickupDate = 'Weekend pickup is not available. Please select a weekday.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors before continuing.');
      return;
    }

    setLoading(true);

    try {
      // Tokenize the card
      const paymentToken = await tokenizeCard();

      // Prepare line items
      const lineItems = items.map(item => ({
        catalog_object_id: item.variationId,
        quantity: item.quantity.toString()
      }));

      // Create order with payment
      const result = await api.createOrder({
        line_items: lineItems,
        payment_token: paymentToken,
        customer_info: {
          email,
          given_name: givenName || undefined,
          family_name: familyName || undefined
        },
        fulfillment_type: fulfillmentType,
        shipping_address: fulfillmentType === 'SHIPMENT' ? {
          address_line_1: address,
          address_line_2: addressLine2 || undefined,
          locality: city,
          administrative_district_level_1: state,
          postal_code: postalCode,
          country: 'US'
        } : undefined,
        pickup_details: fulfillmentType === 'PICKUP' ? pickupDetails : undefined
      });

      // Refresh user profile to get updated square_customer_id
      await refreshProfile();

      // Mark order as completed, clear cart, and navigate to confirmation
      setOrderCompleted(true);
      clearCart();
      navigate('/order-confirmation', {
        state: {
          order: result.order,
          payment: result.payment,
          fulfillmentType
        }
      });
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Customer</h2>
                <div>
                  <label className="block text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Fulfillment Selection */}
              <FulfillmentSelector
                selectedType={fulfillmentType}
                onTypeChange={setFulfillmentType}
              />

              {/* Conditional: Pickup Details or Shipping Address */}
              {fulfillmentType === 'PICKUP' ? (
                <PickupDetailsForm
                  pickupDetails={pickupDetails}
                  onPickupDetailsChange={setPickupDetails}
                  errors={{
                    date: validationErrors.pickupDate,
                    time: validationErrors.pickupTime,
                  }}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full px-4 py-2 border rounded ${
                          validationErrors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {validationErrors.address && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Address Line 2</label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`w-full px-4 py-2 border rounded ${
                          validationErrors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {validationErrors.city && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm mb-2">
                        State / Province <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={`w-full px-4 py-2 border rounded ${
                          validationErrors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {validationErrors.state && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm mb-2">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className={`w-full px-4 py-2 border rounded ${
                          validationErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {validationErrors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.postalCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Payment</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">First Name</label>
                      <input
                        type="text"
                        value={givenName}
                        onChange={(e) => setGivenName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Last Name</label>
                      <input
                        type="text"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Card Details</label>
                    <div id="card-container" className="border border-gray-300 rounded p-4"></div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !cardInitialized}
                className="w-full bg-black text-white py-4 rounded font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : orderSummary ? `Pay ${formatCurrency(orderSummary.total)}` : 'Pay Now'}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-gray-100 p-8 rounded-lg h-fit">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.variationId} className="flex gap-4 pb-6 border-b border-gray-300">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded bg-white"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-sm text-gray-600">{item.variationName}</p>
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    <p className="font-semibold mt-2">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}

              {orderSummary && (
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>{formatCurrency(orderSummary.taxes)}</span>
                  </div>
                  <div className="flex justify-between pb-4 border-b border-gray-300">
                    <span>Shipping</span>
                    <span>{formatCurrency(orderSummary.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4">
                    <span>Total</span>
                    <span>{formatCurrency(orderSummary.total)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Order Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.variationId} className="flex gap-3 pb-4 border-b border-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{item.productName}</h3>
                  <p className="text-xs text-gray-600">{item.variationName}</p>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  <p className="font-semibold text-sm mt-1">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {orderSummary && (
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(orderSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{formatCurrency(orderSummary.taxes)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span>Shipping</span>
                <span>{formatCurrency(orderSummary.shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2">
                <span>Total</span>
                <span>{formatCurrency(orderSummary.total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Customer</h2>
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Fulfillment Selection */}
          <FulfillmentSelector
            selectedType={fulfillmentType}
            onTypeChange={setFulfillmentType}
          />

          {/* Conditional: Pickup Details or Shipping Address */}
          {fulfillmentType === 'PICKUP' ? (
            <PickupDetailsForm
              pickupDetails={pickupDetails}
              onPickupDetailsChange={setPickupDetails}
              errors={{
                date: validationErrors.pickupDate,
                time: validationErrors.pickupTime,
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      validationErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.address && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      validationErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.city && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    State / Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      validationErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.state && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      validationErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.postalCode && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payment Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Payment</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">First Name</label>
                  <input
                    type="text"
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Last Name</label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Card Details</label>
                <div id="card-container" className="border border-gray-300 rounded p-3"></div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !cardInitialized}
            className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : orderSummary ? `Pay ${formatCurrency(orderSummary.total)}` : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
