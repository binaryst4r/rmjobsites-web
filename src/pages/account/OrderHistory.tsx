import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Order } from "../../types/customer";

export const OrderHistory = () => {
  const { data, isLoading, error } = useQuery<{ orders: Order[] }>({
    queryKey: ["customer-orders"],
    queryFn: () => api.getCustomerOrders(),
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (amount?: number, currency?: string) => {
    if (amount === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount / 100);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-red-600">Failed to load orders. Please try again.</p>
      </div>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">My Orders</h1>
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-600 mb-8">
        Check the status of recent orders, manage returns, and discover similar products.
      </p>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-2 md:mb-0">
                <h2 className="font-semibold text-lg">
                  Order #{order.id.substring(0, 6).toUpperCase()}
                </h2>
                <p className="text-sm text-gray-600">
                  {order.state === "COMPLETED" ? "Delivered" : order.state} on {formatDate(order.created_at)}
                </p>
              </div>
              <div className="flex space-x-4 text-sm">
                <button className="text-red-800 hover:text-red-900 font-medium">
                  Manage Order
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-red-800 hover:text-red-900 font-medium">
                  View Invoice
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 space-y-6">
              {order.line_items?.map((item, index) => (
                <div key={item.uid || index} className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  {/* Product Image Placeholder */}
                  <div className="w-full md:w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center mb-4 md:mb-0">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    {item.variation_name && (
                      <p className="text-sm text-gray-600 mb-2">{item.variation_name}</p>
                    )}
                    <p className="text-lg font-medium">
                      {formatPrice(item.total_money?.amount, item.total_money?.currency)}
                    </p>
                    {item.quantity && (
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 mt-4 md:mt-0 w-full md:w-auto">
                    <button className="bg-red-900 text-white px-6 py-2 rounded-md hover:bg-red-800 font-medium">
                      Buy Again
                    </button>
                    <button className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 font-medium">
                      Shop Similar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Order Total:</span>
                <span className="text-lg font-bold">
                  {formatPrice(order.total_money?.amount, order.total_money?.currency)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
