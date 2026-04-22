import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';

export default function ResetPassword() {
  const { token = '' } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const resetMutation = useMutation({
    mutationFn: () => api.resetPassword(token, password, confirmation),
    onSuccess: (data) => {
      if (data?.token && data?.user) {
        login(data.token, data.user);
        navigate('/');
      } else {
        navigate('/login');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return;
    if (password !== confirmation) return;
    resetMutation.mutate();
  };

  const passwordsMatch = !confirmation || password === confirmation;
  const canvasHeight = window.innerHeight - 100;

  return (
    <div style={{ height: `${canvasHeight}px` }} className="flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Set a new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose a password you'll use to sign in to RMJobsites.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {resetMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {resetMutation.error.message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="label">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="password_confirmation" className="label">
                Confirm password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                minLength={6}
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="input"
              />
              {!passwordsMatch && (
                <p className="mt-1 text-sm text-red-600">Passwords don't match.</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={resetMutation.isPending || !passwordsMatch || password.length < 6}
            className="btn-primary"
          >
            {resetMutation.isPending ? 'Saving...' : 'Set password'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
