import React, { createContext, useState, useEffect } from 'react';
import Storage from '../utils/storage';
import { ASYNC_STORAGE_KEYS } from '../config/constants';
import authService from '../api/services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on app launch
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedToken = await Storage.get(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
      const savedUser = await Storage.get(ASYNC_STORAGE_KEYS.USER_DATA);

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user: userData, token: authToken } = response.data.data;

      // Save to state
      setUser(userData);
      setToken(authToken);
      setIsAuthenticated(true);

      // Save to storage
      await Storage.set(ASYNC_STORAGE_KEYS.AUTH_TOKEN, authToken);
      await Storage.set(ASYNC_STORAGE_KEYS.USER_DATA, userData);

      return { success: true, data: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, token: authToken } = response.data.data;

      // Save to state
      setUser(newUser);
      setToken(authToken);
      setIsAuthenticated(true);

      // Save to storage
      await Storage.set(ASYNC_STORAGE_KEYS.AUTH_TOKEN, authToken);
      await Storage.set(ASYNC_STORAGE_KEYS.USER_DATA, newUser);

      return { success: true, data: newUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();

      // Clear state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      // Clear storage
      await Storage.remove(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
      await Storage.remove(ASYNC_STORAGE_KEYS.USER_DATA);

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  };

  const updateUser = async (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    await Storage.set(ASYNC_STORAGE_KEYS.USER_DATA, updatedUser);
  };

  const updateKYCStatus = async (kycData) => {
    const updatedUser = {
      ...user,
      kycStatus: kycData.kycStatus,
      cnicFrontUrl: kycData.cnicFrontUrl,
      cnicBackUrl: kycData.cnicBackUrl,
      selfieUrl: kycData.selfieUrl,
    };
    setUser(updatedUser);
    await Storage.set(ASYNC_STORAGE_KEYS.USER_DATA, updatedUser);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    updateKYCStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};