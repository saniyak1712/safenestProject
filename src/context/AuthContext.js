import React, { createContext, useState, useEffect } from 'react';
import { clearAuth, getStoredAuth, saveAuth } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, role, name, email, hostelId } = getStoredAuth();

    if (token) {
      setUser({ token, role, name, email, hostelId });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    saveAuth(userData);
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
