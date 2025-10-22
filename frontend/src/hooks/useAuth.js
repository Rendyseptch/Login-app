import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    initializeAuth();
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const initializeAuth = async () => {
    try {
      const token = getCookie('token');
      if (token) {
        await checkSession();
      }
    } catch (error) {
      console.log('No valid session found');
    } finally {
      setLoading(false);
      setSessionChecked(true);
    }
  };

  const checkSession = async () => {
    try {
      const response = await api.get('/auth/me');
      console.log('Session check response:', response.data);
      
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.log('Session check failed:', error.response?.data || error.message);
      setUser(null);
      removeCookie('token');
    }
    return false;
  };

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('userSession', 'active');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Register response:', response.data);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Logout API error:', error.message);
    } finally {
      setUser(null);
      localStorage.removeItem('userSession');
      removeCookie('token');
      window.location.href = '/login';
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Helper functions for cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const removeCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const value = {
    user,
    loading,
    darkMode,
    sessionChecked,
    login,
    register,
    logout,
    toggleDarkMode,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};