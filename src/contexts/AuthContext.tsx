'use client';

import {
  api,
  getSessionAccessToken,
  normalizeItem,
  setSessionAccessToken,
} from '@/lib/api';
import { User } from '@/lib/api-types';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  googleLogin: (credential: string) => Promise<User>;
  socialLogin: (payload: { email: string; name: string; avatar: string; provider: string }) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<void>;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  refreshUser: async () => { },
  login: async () => {
    throw new Error('AuthContext not initialized');
  },
  googleLogin: async () => {
    throw new Error('AuthContext not initialized');
  },
  socialLogin: async () => {
    throw new Error('AuthContext not initialized');
  },
  register: async () => {
    throw new Error('AuthContext not initialized');
  },
  refreshAuth: async () => { },
  logout: async () => { },
});

const LOGIN_ENDPOINTS = ['/auth/login'];
const REGISTER_ENDPOINTS = ['/auth/register'];
const ME_ENDPOINTS = ['/auth/me', '/auth/get-session'];
const LOGOUT_ENDPOINTS = ['/auth/logout', '/auth/sign-out'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Track whether initial session load has already run
  const initializedRef = useRef(false);

  const clearAuthState = useCallback(() => {
    setSessionAccessToken(null);
    setAccessToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }, []);

  const extractAccessToken = useCallback((payload: unknown): string | null => {
    if (!payload || typeof payload !== 'object') return null;
    const record = payload as {
      accessToken?: unknown;
      data?: { accessToken?: unknown };
    };
    if (typeof record.accessToken === 'string') return record.accessToken;
    if (typeof record.data?.accessToken === 'string')
      return record.data.accessToken;
    return null;
  }, []);

  const extractUser = useCallback((payload: unknown): User | null => {
    if (!payload || typeof payload !== 'object') return null;
    const root = payload as { user?: unknown; data?: unknown };
    if (root.user && typeof root.user === 'object') return root.user as User;
    const fromData = normalizeItem<User>(root.data);
    if (fromData) return fromData;
    return normalizeItem<User>(payload);
  }, []);

  // Use refs to hold stable references to avoid useEffect re-runs
  const extractAccessTokenRef = useRef(extractAccessToken);
  const extractUserRef = useRef(extractUser);
  const clearAuthStateRef = useRef(clearAuthState);
  useEffect(() => { extractAccessTokenRef.current = extractAccessToken; }, [extractAccessToken]);
  useEffect(() => { extractUserRef.current = extractUser; }, [extractUser]);
  useEffect(() => { clearAuthStateRef.current = clearAuthState; }, [clearAuthState]);

  const tryRefreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await api.post('/auth/refresh-token');
      return extractAccessTokenRef.current(res.data);
    } catch {
      return null;
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    for (const endpoint of ME_ENDPOINTS) {
      try {
        const meRes = await api.get(endpoint);
        const nextUser = extractUserRef.current(meRes.data);
        setUser(nextUser);
        return;
      } catch {
        // Try next user endpoint.
      }
    }
    throw new Error('Unable to fetch current user');
  }, []);

  const refreshAuth = useCallback(async () => {
    const existingToken = getSessionAccessToken();
    if (!existingToken) {
      const refreshedToken = await tryRefreshAccessToken();
      if (!refreshedToken) {
        clearAuthStateRef.current();
        return;
      }
      setSessionAccessToken(refreshedToken);
      setAccessToken(refreshedToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', refreshedToken);
      }
    }
    try {
      await fetchCurrentUser();
    } catch (error) {
      clearAuthStateRef.current();
      throw error;
    }
  }, [tryRefreshAccessToken, fetchCurrentUser]);

  const refreshUser = useCallback(async () => {
    await fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Run ONCE on mount only — stable via empty dep array + ref guard
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let isMounted = true;

    const loadSession = async () => {
      try {
        const storedToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null;

        if (storedToken) {
          if (!isMounted) return;
          setSessionAccessToken(storedToken);
          setAccessToken(storedToken);
          try {
            await fetchCurrentUser();
            return;
          } catch {
            // stored token invalid, try refresh
            const refreshedToken = await tryRefreshAccessToken();
            if (refreshedToken) {
              if (!isMounted) return;
              setSessionAccessToken(refreshedToken);
              setAccessToken(refreshedToken);
              if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', refreshedToken);
              }
              try {
                await fetchCurrentUser();
                return;
              } catch {
                clearAuthStateRef.current();
              }
            } else {
              clearAuthStateRef.current();
            }
          }
          return;
        }

        // No stored token — try cookie-based refresh
        const refreshedToken = await tryRefreshAccessToken();
        if (!refreshedToken) {
          // Last resort: maybe a session cookie exists
          try {
            await fetchCurrentUser();
          } catch {
            if (!getSessionAccessToken()) {
              setSessionAccessToken(null);
              setAccessToken(null);
              setUser(null);
            }
          }
          return;
        }

        if (!isMounted) return;
        setSessionAccessToken(refreshedToken);
        setAccessToken(refreshedToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', refreshedToken);
        }
        try {
          await fetchCurrentUser();
        } catch {
          clearAuthStateRef.current();
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    let lastError: unknown = null;

    for (const endpoint of LOGIN_ENDPOINTS) {
      try {
        const response = await api.post(endpoint, {
          email,
          password,
        });

        const token = extractAccessToken(response.data);
        const nextUser = extractUser(response.data);

        if (!token || !nextUser) {
          throw new Error('Login response missing token or user data');
        }

        setSessionAccessToken(token);
        setAccessToken(token);
        setUser(nextUser);
        setIsLoading(false);

        // Persist token to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', token);
        }

        // Ensure latest user data is loaded from /auth/me after login.
        void fetchCurrentUser();

        return nextUser;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Login failed');
  };

  const googleLogin = async (credential: string): Promise<User> => {
    const response = await api.post('/auth/google/callback', { credential });

    const token = extractAccessToken(response.data);
    const nextUser = extractUser(response.data);

    if (!token || !nextUser) {
      throw new Error('Google login response missing token or user data');
    }

    setSessionAccessToken(token);
    setAccessToken(token);
    setUser(nextUser);
    setIsLoading(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }

    void fetchCurrentUser();
    return nextUser;
  };

  const socialLogin = async (socialPayload: { email: string; name: string; avatar: string; provider: string }): Promise<User> => {
    try {
      const response = await api.post('/auth/social-login', socialPayload);
      const token = extractAccessToken(response.data);
      const nextUser = extractUser(response.data);

      if (!token || !nextUser) {
        throw new Error('Social login response missing token or user data');
      }

      setSessionAccessToken(token);
      setAccessToken(token);
      setUser(nextUser);
      setIsLoading(false);

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
      }

      void fetchCurrentUser();
      return nextUser;
    } catch (error: any) {
      console.error('API Error in socialLogin:', {
        url: api.defaults.baseURL + '/auth/social-login',
        message: error.message,
        isAxiosError: error.isAxiosError
      });
      throw error;
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    let lastError: unknown = null;

    for (const endpoint of REGISTER_ENDPOINTS) {
      try {
        await api.post(endpoint, payload);
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error('Registration failed');
  };

  const logout = async () => {
    for (const endpoint of LOGOUT_ENDPOINTS) {
      try {
        await api.post(endpoint);
        break;
      } catch {
        // Try next logout endpoint.
      }
    }

    clearAuthState();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        refreshUser,
        login,
        googleLogin,
        socialLogin,
        register,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
