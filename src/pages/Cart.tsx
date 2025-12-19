import { Link } from 'react-router-dom';
import { useCart } from '../lib/cart-context';
import { formatCentsToDollars } from '../lib/money';

export function Cart() {
  const { items, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Link
            to="/shop"
            className="inline-block bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden md:block max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-12">Shopping Cart</h1>

        {/* Cart Items */}
        <div className="space-y-8">
          {items.map((item) => (
            <div
              key={item.variationId}
              className="flex items-start gap-4 pb-8 border-b border-gray-200"
            >
              {/* Product Image */}
              <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {item.productName} x {item.quantity}
                </h3>
                <p className="text-sm text-gray-500">{item.variationName}</p>
              </div>

              {/* Price and Remove */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 mb-3">
                  ${formatCentsToDollars(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.variationId)}
                  className="text-sm text-red-900 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold">Subtotal</span>
            <span className="font-bold">${formatCentsToDollars(subtotal)}</span>
          </div>
          <p className="text-sm text-gray-500">
            Shipping and taxes will be calculated at checkout
          </p>
        </div>

        {/* Checkout Button */}
        <Link
          to="/checkout"
          className="block w-full mt-8 bg-red-900 text-white py-4 rounded text-center font-semibold hover:bg-red-800 transition-colors"
        >
          Checkout
        </Link>

        {/* Continue Shopping Link */}
        <div className="mt-6 text-center">
          <Link to="/shop" className="text-sm text-red-900 hover:text-red-700">
            or Continue Shopping
          </Link>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

          {/* Cart Items */}
          <div className="space-y-6 mb-6">
            {items.map((item) => (
              <div
                key={item.variationId}
                className="flex items-start gap-3 pb-6 border-b border-gray-200"
              >
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info and Price */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                      <h3 className="text-base font-bold text-gray-900">
                        {item.productName} x {item.quantity}
                      </h3>
                      <p className="text-xs text-gray-500">{item.variationName}</p>
                    </div>
                    <p className="text-base font-bold text-gray-900 flex-shrink-0">
                      ${formatCentsToDollars(item.price * item.quantity)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.variationId)}
                    className="text-xs text-red-900 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold">Subtotal</span>
              <span className="text-base font-bold">${formatCentsToDollars(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500">
              Shipping and taxes will be calculated at checkout
            </p>
          </div>

          {/* Checkout Button */}
          <Link
            to="/checkout"
            className="block w-full bg-black text-white py-4 rounded text-center font-semibold hover:bg-gray-800 transition-colors mb-4"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
