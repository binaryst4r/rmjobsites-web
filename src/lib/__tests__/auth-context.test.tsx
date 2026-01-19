import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../auth-context';
import * as cookies from '../cookies';

// Mock the cookies module
vi.mock('../cookies', () => ({
  getUser: vi.fn(),
  setUser: vi.fn(),
  clearUser: vi.fn(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthProvider initialization', () => {
    it('loads user from cookie on mount', async () => {
      const mockUserCookie = { id: 1, email: 'test@example.com', admin: false, jwt: 'test-token' };
      vi.mocked(cookies.getUser).mockReturnValue(mockUserCookie);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // User should not include jwt field
      expect(result.current.user).toEqual({
        id: mockUserCookie.id,
        email: mockUserCookie.email,
        admin: mockUserCookie.admin
      });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('starts with null user when no cookie exists', async () => {
      vi.mocked(cookies.getUser).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('sets isLoading to false after initialization', async () => {
      vi.mocked(cookies.getUser).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // In happy-dom, effects run synchronously, so isLoading may already be false
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('login', () => {
    it('sets user and calls setUserCookie', async () => {
      vi.mocked(cookies.getUser).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const mockUser = { id: 1, email: 'new@example.com', admin: false };
      const mockToken = 'test-token';

      act(() => {
        result.current.login(mockToken, mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(cookies.setUser).toHaveBeenCalledWith(mockUser, mockToken);
    });
  });

  describe('logout', () => {
    it('clears user and calls clearUserCookie', async () => {
      const mockUserCookie = { id: 1, email: 'test@example.com', admin: false, jwt: 'test-token' };
      vi.mocked(cookies.getUser).mockReturnValue(mockUserCookie);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // User should not include jwt field
      expect(result.current.user).toEqual({
        id: mockUserCookie.id,
        email: mockUserCookie.email,
        admin: mockUserCookie.admin
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(cookies.clearUser).toHaveBeenCalled();
    });
  });

  describe('useAuth hook', () => {
    it('throws error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });
});
