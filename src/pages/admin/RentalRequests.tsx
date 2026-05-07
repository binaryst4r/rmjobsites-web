import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';

interface RentalRequestItem {
  id: number;
  customer_name: string;
  company_name: string | null;
  customer_email: string;
  duration: string | null;
  equipment: string;
  created_at: string;
}

interface RentalRequestsResponse {
  equipment_rental_requests: RentalRequestItem[];
}

export function AdminRentalRequests() {
  const { data, isLoading, error } = useQuery<RentalRequestsResponse>({
    queryKey: ['admin', 'rental-requests'],
    queryFn: adminApi.getRentalRequests,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading rental requests</div>
      </div>
    );
  }

  const rentalRequests = data?.equipment_rental_requests;

  if (rentalRequests?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">No rental requests found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-12">Rental Requests</h1>

        <div>
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 border-b pb-4">
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-6">Equipment</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rental Request Rows */}
          {rentalRequests?.map((request) => (
            <div
              key={request.id}
              className="grid grid-cols-12 gap-4 items-center border-b py-6 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-3">
                <div className="font-medium text-blue-600">{request.customer_name}</div>
                {request.company_name && (
                  <div className="text-xs text-gray-500 mt-0.5">{request.company_name}</div>
                )}
                <div className="text-sm text-gray-500 mt-1">{request.customer_email}</div>
              </div>
              <div className="col-span-2 text-sm">
                {request.duration || '—'}
              </div>
              <div className="col-span-6 text-sm">
                {request.equipment}
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Actions"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Rental Requests</h1>

          <div className="space-y-4">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 pb-2 border-b">
              <div className="col-span-4">Customer</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-6">Equipment</div>
            </div>

            {/* Rental Request Rows */}
            {rentalRequests?.map((request) => (
              <div key={request.id} className="border-b pb-4">
                <div className="grid grid-cols-12 gap-2 text-sm">
                  <div className="col-span-4">
                    <div className="font-medium text-blue-600 text-sm">{request.customer_name}</div>
                    {request.company_name && (
                      <div className="text-[10px] text-gray-500">{request.company_name}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-0.5">{request.customer_email}</div>
                  </div>
                  <div className="col-span-2 text-xs">
                    {request.duration || '—'}
                  </div>
                  <div className="col-span-6 flex items-start justify-between gap-2">
                    <div className="text-xs">{request.equipment}</div>
                    <button
                      className="p-1 hover:bg-gray-200 rounded shrink-0"
                      aria-label="Actions"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
