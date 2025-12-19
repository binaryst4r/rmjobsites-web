import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: () => api.login(email, password),
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  const canvasHeight = window.innerHeight - 100

  return (
    <div style={{ height: `${canvasHeight}px` }} className="flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {loginMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {loginMutation.error.message}
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
          </div>

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn-primary"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-sm text-blue-600 hover:text-blue-500">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
