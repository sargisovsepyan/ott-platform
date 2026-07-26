import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";
import { configureApiClient } from "../api/client";
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from "../utils/authStorage";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readAuthSession());
  const sessionRef = useRef(session);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(() => {
    sessionRef.current = null;
    clearAuthSession();
    setSession(null);
  }, []);

  useEffect(() => {
    let isActive = true;
    const resetApiClient = configureApiClient({
      getToken: () => sessionRef.current?.token ?? null,
      onUnauthorized: logout,
    });

    queueMicrotask(() => {
      if (isActive) {
        setIsInitializing(false);
      }
    });

    return () => {
      isActive = false;
      resetApiClient();
    };
  }, [logout]);

  const login = useCallback(async (credentials, options) => {
    const result = await loginUser(credentials, options);
    const nextSession = { user: result.user, token: result.token };
    sessionRef.current = nextSession;
    writeAuthSession(nextSession);
    setSession(nextSession);
    return result;
  }, []);

  const register = useCallback(
    (credentials, options) => registerUser(credentials, options),
    [],
  );

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token && session?.user),
      isAdmin: session?.user?.role === "admin",
      isInitializing,
      login,
      register,
      logout,
    }),
    [isInitializing, login, logout, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
