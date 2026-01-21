import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUser, setUser as setUserCookie, clearUser as clearUserCookie, getToken } from './cookies';
import { api } from './api';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const { user: freshUser } = await api.getProfile();
      setUser(freshUser);
      setUserCookie(freshUser, token);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      // If profile fetch fails, clear the user (token might be invalid)
      setUser(null);
      clearUserCookie();
    }
  }, []);

  useEffect(() => {
    // Load user on mount - fetch fresh data from API if we have a token
    const loadUser = async () => {
      const userCookie = getUser();
      if (userCookie?.jwt) {
        // We have a token, fetch fresh user data from API
        await refreshProfile();
      }
      setIsLoading(false);
    };

    loadUser();
  }, [refreshProfile]);

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
        refreshProfile,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
