import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ekyam_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('ekyam_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('ekyam_token', data.token);
    setUser(data);
    return data;
  };

  const register = async (form) => {
    const data = await api.register(form);
    if (data.token) {
      localStorage.setItem('ekyam_token', data.token);
      setUser(data);
    }
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const data = await api.verifyOtp({ email, otp });
    localStorage.setItem('ekyam_token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ekyam_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
