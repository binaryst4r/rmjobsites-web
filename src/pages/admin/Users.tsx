import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';
import type { AdminUserListItem, AdminUserListResponse } from '../../types/adminUser';

const PER_PAGE = 25;

function displayName(user: AdminUserListItem): string {
  const full = `${user.given_name ?? ''} ${user.family_name ?? ''}`.trim();
  return full || '—';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
}

export function AdminUsers() {
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(input.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [input]);

  const { data, isLoading, error } = useQuery<AdminUserListResponse>({
    queryKey: ['admin', 'users', { q, page, perPage: PER_PAGE }],
    queryFn: () => adminApi.getUsers({ q: q || undefined, page, per_page: PER_PAGE }),
    placeholderData: (prev) => prev,
  });

  const users = data?.users ?? [];
  const meta = data?.meta;
  const totalPages = meta?.total_pages ?? 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">User Directory</h1>

        <div className="mb-6 relative max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by name or email"
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900"
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
          )}
        </div>

        {isLoading && !data ? (
          <div className="text-lg py-12">Loading...</div>
        ) : error ? (
          <div className="text-lg text-red-600 py-12">Error loading users</div>
        ) : users.length === 0 ? (
          <div className="text-lg text-gray-500 py-12">
            {q ? 'No users match your search' : 'No users found'}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 border-b pb-4">
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Phone</div>
              <div className="col-span-1">Role</div>
              <div className="col-span-2">Customer ID</div>
              <div className="col-span-1">Created</div>
            </div>

            {users.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-12 gap-4 items-center border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 font-medium text-blue-600">{displayName(u)}</div>
                <div className="col-span-3 text-sm">{u.email}</div>
                <div className="col-span-2 text-sm text-gray-700">{u.phone_number ?? '—'}</div>
                <div className="col-span-1">
                  {u.admin && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Admin
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-xs text-gray-600 font-mono truncate" title={u.square_customer_id ?? ''}>
                  {u.square_customer_id ?? '—'}
                </div>
                <div className="col-span-1 text-sm text-gray-700">{formatDate(u.created_at)}</div>
              </div>
            ))}
          </div>
        )}

        {meta && users.length > 0 && (
          <div className="flex items-center justify-between mt-6 text-sm">
            <div className="text-gray-600">
              Page {meta.page} of {Math.max(totalPages, 1)} — {meta.total_count} users
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-4">
        <h1 className="text-2xl font-bold mb-4">User Directory</h1>

        <div className="mb-4 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by name or email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900"
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
          )}
        </div>

        {isLoading && !data ? (
          <div className="py-12 text-center">Loading...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-600">Error loading users</div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            {q ? 'No users match your search' : 'No users found'}
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="border-b pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-blue-600 text-sm">{displayName(u)}</div>
                  {u.admin && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-700 mt-0.5">{u.email}</div>
                {u.phone_number && (
                  <div className="text-xs text-gray-500 mt-0.5">{u.phone_number}</div>
                )}
                <div className="text-xs text-gray-500 mt-1 flex justify-between">
                  <span className="font-mono truncate" title={u.square_customer_id ?? ''}>
                    {u.square_customer_id ?? '—'}
                  </span>
                  <span>{formatDate(u.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && users.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="text-gray-600">
              Page {meta.page} of {Math.max(totalPages, 1)} — {meta.total_count}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
