import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
