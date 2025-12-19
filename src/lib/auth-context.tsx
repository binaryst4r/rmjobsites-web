import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, setUser as setUserCookie, clearUser as clearUserCookie } from './cookies';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from cookie on mount
    const loadUser = () => {
      const userCookie = getUser();
      if (userCookie) {
        setUser({
          id: userCookie.id,
          email: userCookie.email,
          admin: userCookie.admin || false,
        });
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setUser(newUser);
    setUserCookie(newUser, newToken);
  };

  const logout = () => {
    setUser(null);
    clearUserCookie();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
