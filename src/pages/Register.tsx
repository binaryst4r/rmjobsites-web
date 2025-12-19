import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const registerMutation = useMutation({
    mutationFn: () => api.register(email, password, passwordConfirmation),
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  const canvasHeight = window.innerHeight - 100

  return (
    <div style={{ height: `${canvasHeight}px` }} className="flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {registerMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {registerMutation.error.message}
            </div>
          )}
          <div className="space-y-4">
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
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="password_confirmation" className="label">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="btn-primary"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Register'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
