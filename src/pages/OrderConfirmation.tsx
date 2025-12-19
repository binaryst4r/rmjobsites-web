import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface Money {
  amount: number;
  currency: string;
}

interface OrderLineItem {
  name: string;
  quantity: string;
  total_money?: Money;
}

interface Order {
  id: string;
  state: string;
  created_at: string;
  total_money?: Money;
  total_line_items_money?: Money;
  total_tax_money?: Money;
  total_service_charge_money?: Money;
  line_items?: OrderLineItem[];
}

interface Payment {
  id: string;
  status: string;
  card_details?: {
    card?: {
      card_brand?: string;
      last_4?: string;
    };
  };
}

interface OrderConfirmationState {
  order: Order;
  payment?: Payment;
}

export function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderConfirmationState | null;

  useEffect(() => {
    // Redirect to home if no order data
    if (!state?.order) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state?.order) {
    return null;
  }

  const { order, payment } = state;
  const totalAmount = order.total_money?.amount || 0;

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono text-sm">{order.id}</span>
            </div>

            {payment && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Payment ID</span>
                <span className="font-mono text-sm">{payment.id}</span>
              </div>
            )}

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Date</span>
              <span>{formatDate(order.created_at)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {payment?.status || order.state}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Items</h3>
            <div className="space-y-3">
              {order.line_items?.map((item: OrderLineItem, index: number) => (
                <div key={index} className="flex justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.total_money?.amount || 0)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="space-y-2 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(order.total_line_items_money?.amount || 0)}</span>
            </div>

            {order.total_tax_money && order.total_tax_money.amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes</span>
                <span>{formatCurrency(order.total_tax_money.amount)}</span>
              </div>
            )}

            {order.total_service_charge_money && order.total_service_charge_money.amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{formatCurrency(order.total_service_charge_money.amount)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        {payment?.card_details && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="flex items-center gap-3">
              <div className="text-gray-600">
                {payment.card_details.card?.card_brand || 'Card'} ending in {payment.card_details.card?.last_4 || '****'}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/shop"
            className="flex-1 bg-black text-white text-center py-3 px-6 rounded font-medium hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/account"
            className="flex-1 bg-white text-black border border-gray-300 text-center py-3 px-6 rounded font-medium hover:bg-gray-50 transition"
          >
            View Order History
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>A confirmation email has been sent to your email address.</p>
          <p className="mt-2">
            Need help? <a href="/contact" className="text-red-900 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
