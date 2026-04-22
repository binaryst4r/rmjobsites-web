import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const forgotMutation = useMutation({
    mutationFn: () => api.forgotPassword(email),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotMutation.mutate();
  };

  const canvasHeight = window.innerHeight - 100;

  return (
    <div style={{ height: `${canvasHeight}px` }} className="flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you a link to set a new password.
          </p>
        </div>

        {forgotMutation.isSuccess ? (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded text-sm">
            If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your inbox (and spam folder) — the link expires in 15 minutes.
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {forgotMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {forgotMutation.error.message}
              </div>
            )}
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={forgotMutation.isPending}
              className="btn-primary"
            >
              {forgotMutation.isPending ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
