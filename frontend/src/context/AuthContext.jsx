import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore user session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await authApi.getMe();
        setUser(currentUser);
      } catch (err) {
        // Ignored, user is just not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await authApi.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setError(err.message || 'Login failed');
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authApi.signup(username, email, password);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message || 'Signup failed');
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
