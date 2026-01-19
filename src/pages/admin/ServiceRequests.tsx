import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';
import type { ServiceRequest, User } from '../../types/ServiceRequest';

interface ServiceRequestResponse {
  service_requests: ServiceRequest[];
}

interface AdminUsersResponse {
  users: User[];
}

export function AdminServiceRequests() {
  const queryClient = useQueryClient();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<ServiceRequestResponse>({
    queryKey: ['admin', 'service-requests'],
    queryFn: adminApi.getServiceRequests,
  });

  const { data: adminUsersData } = useQuery<AdminUsersResponse>({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getAdminUsers,
  });

  const assignMutation = useMutation({
    mutationFn: ({ serviceRequestId, userId }: { serviceRequestId: number; userId: number }) =>
      adminApi.assignServiceRequest(serviceRequestId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-requests'] });
      setOpenDropdownId(null);
    },
  });

  const handleAssign = (serviceRequestId: number, userId: number) => {
    assignMutation.mutate({ serviceRequestId, userId });
  };

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
        <div className="text-lg text-red-600">Error loading service requests</div>
      </div>
    );
  }

  const serviceRequests = data?.service_requests;
  const adminUsers = adminUsersData?.users || [];

  if (serviceRequests?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">No service requests found</div>
      </div>
    );
  }

  const getUserDisplayName = (user: User | null) => {
    if (!user) return 'Unassigned';
    if (user.given_name && user.family_name) {
      return `${user.given_name} ${user.family_name}`;
    }
    if (user.given_name) return user.given_name;
    return user.email;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-12">Service Requests</h1>

        <div>
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 border-b pb-4">
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Assigned</div>
            <div className="col-span-2"></div>
          </div>

          {/* Service Request Rows */}
          {serviceRequests?.map((request) => (
            <div
              key={request.id}
              className="grid grid-cols-12 gap-4 items-center border-b py-6 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-2">
                <div className="font-medium text-blue-600">{request.customer_name}</div>
                <div className="text-sm text-gray-500 mt-1">{request.customer_email}</div>
              </div>
              <div className="col-span-2 text-sm">
                {new Date(request.created_at).toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: '2-digit',
                })}
              </div>
              <div className="col-span-4 text-sm">
                <b>{request.service_requested} - Model:</b> {request.model} <b>SN:</b> {request.serial_number}
              </div>
              <div className="col-span-2 text-sm">
                {request.assigned_user ? (
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium mr-2">
                      {request.assigned_user.given_name?.[0] || request.assigned_user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{getUserDisplayName(request.assigned_user)}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Unassigned</span>
                )}
              </div>
              <div className="col-span-2 flex justify-end relative">
                <button
                  onClick={() => setOpenDropdownId(openDropdownId === request.id ? null : request.id)}
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

                {openDropdownId === request.id && (
                  <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg z-10 min-w-[200px]">
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                        Assign to
                      </div>
                      {adminUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleAssign(request.id, user.id)}
                          disabled={assignMutation.isPending}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium mr-2">
                            {user.given_name?.[0] || user.email[0].toUpperCase()}
                          </div>
                          {getUserDisplayName(user)}
                          {request.assigned_user?.id === user.id && (
                            <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Service Requests</h1>

          <div className="space-y-4">
            {/* Service Request Rows */}
            {serviceRequests?.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No service requests found
              </div>
            ) : (
              serviceRequests?.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-medium text-blue-600 text-sm">{request.customer_name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{request.customer_email}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(request.created_at).toLocaleDateString('en-US', {
                          month: 'numeric',
                          day: 'numeric',
                          year: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === request.id ? null : request.id)}
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

                      {openDropdownId === request.id && (
                        <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-[180px]">
                          <div className="py-2">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                              Assign to
                            </div>
                            {adminUsers.map((user) => (
                              <button
                                key={user.id}
                                onClick={() => handleAssign(request.id, user.id)}
                                disabled={assignMutation.isPending}
                                className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium mr-2">
                                  {user.given_name?.[0] || user.email[0].toUpperCase()}
                                </div>
                                <span className="truncate">{getUserDisplayName(user)}</span>
                                {request.assigned_user?.id === user.id && (
                                  <svg className="w-3 h-3 ml-auto text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs mb-3">
                    <b>{request.service_requested} - Model:</b> {request.model} <b>SN:</b> {request.serial_number}
                  </div>

                  {request.assigned_user && (
                    <div className="flex items-center text-xs">
                      <span className="text-gray-500 mr-2">Assigned to:</span>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium mr-1">
                          {request.assigned_user.given_name?.[0] || request.assigned_user.email[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{getUserDisplayName(request.assigned_user)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
