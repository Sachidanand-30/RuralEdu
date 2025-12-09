import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("lms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistUser = (value) => {
    setUser(value);
    if (value) {
      localStorage.setItem("lms_user", JSON.stringify(value));
    } else {
      localStorage.removeItem("lms_user");
    }
  };

  const login = async ({ email, password, role }) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/${role}/login`, { email, password });
      persistUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role, grade }) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/${role}/register`, { name, email, password, grade });
      persistUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // ignore
    } finally {
      persistUser(null);
    }
  };

  // optional: sync axios defaults with stored cookie
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

