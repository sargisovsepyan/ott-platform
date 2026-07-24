import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [isInitializing] = useState(false);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  useEffect(
    () =>
      configureApiClient({
        getToken: () => session?.token ?? null,
        onUnauthorized: logout,
      }),
    [logout, session?.token],
  );

  const login = useCallback(async (credentials, options) => {
    const result = await loginUser(credentials, options);
    const nextSession = { user: result.user, token: result.token };
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
