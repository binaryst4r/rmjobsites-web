import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../lib/cart-context';
import { useAuth } from '../lib/auth-context';
import { api } from '../lib/api';
import { initializeSquarePayments, initializeCard, tokenizeCard, destroyCard } from '../lib/square-payments';

interface OrderSummary {
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
}

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, isLoading: cartLoading } = useCart();
  const { user } = useAuth();

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
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

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

        const result = await api.calculateOrder(lineItems);
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
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
        shipping_address: address ? {
          address_line_1: address,
          locality: city,
          administrative_district_level_1: state,
          postal_code: postalCode
        } : undefined
      });

      // Mark order as completed, clear cart, and navigate to confirmation
      setOrderCompleted(true);
      clearCart();
      navigate('/order-confirmation', { state: { order: result.order, payment: result.payment } });
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment failed. Please try again.');
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

              {/* Shipping Info Section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Shipping Info</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">State / Province</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
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

          {/* Shipping Info Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Shipping Info</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
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
