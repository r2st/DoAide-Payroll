import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { onUnauthorized } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const boot = useCallback(async () => {
    try {
      const res = await api.me();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    boot();
    onUnauthorized(() => setUser(null));
  }, [boot]);

  const login = async (email, password) => {
    await api.login(email, password);
    await boot();
  };

  const register = async (data) => {
    await api.register(data);
    await boot();
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const canWrite = user?.role === "owner" || user?.role === "accountant";

  return (
    <AuthContext.Provider value={{ user, loading, canWrite, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
