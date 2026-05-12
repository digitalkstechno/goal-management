import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/authApi';
import { ROLES } from '../constants';

const AuthContext = createContext(null);
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [currentUser]);

  const bootstrapAuth = useCallback(async () => {
    if (!token) {
      setAuthLoading(false);
      return;
    }
    try {
      const me = await getMeApi();
      setCurrentUser(me);
    } catch {
      setToken(null);
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void bootstrapAuth();
  }, [bootstrapAuth]);

  const login = useCallback(async (payload) => {
    const authData = await loginApi(payload);
    setToken(authData?.token || null);
    setCurrentUser(authData?.user || null);
    return authData;
  }, []);

  const register = useCallback(async (payload) => {
    const authData = await registerApi(payload);
    setToken(authData?.token || null);
    setCurrentUser(authData?.user || null);
    return authData;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
  }, []);

  const isAuthenticated = Boolean(token && currentUser);
  const isAdmin = currentUser?.role === ROLES.ADMIN;

  const value = useMemo(
    () => ({
      currentUser,
      token,
      isAuthenticated,
      authLoading,
      isAdmin,
      login,
      register,
      logout,
    }),
    [currentUser, token, isAuthenticated, authLoading, isAdmin, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
