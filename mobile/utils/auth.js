import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from './api';

// Create the Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    authenticated: false,
    user: null,
    loading: true,
  });

  // Check for token on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userJson = await AsyncStorage.getItem('user');
        
        if (token && userJson) {
          const user = JSON.parse(userJson);
          setAuthState({
            token,
            authenticated: true,
            user,
            loading: false,
          });
        } else {
          setAuthState({
            token: null,
            authenticated: false,
            user: null,
            loading: false,
          });
        }
      } catch (error) {
        console.log('Error loading auth state', error);
        setAuthState({
          token: null,
          authenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    loadToken();
  }, []);

  // Sign in
  const signIn = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const { access_token, user } = response;

      // Save token and user to storage
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update auth state
      setAuthState({
        token: access_token,
        authenticated: true,
        user,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      console.log('Sign in error', error);
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Authentication failed'
      };
    }
  };

  // Sign up
  const signUp = async (username, email, password) => {
    try {
      const response = await api.register(username, email, password);
      const { access_token, user } = response;

      // Save token and user to storage
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update auth state
      setAuthState({
        token: access_token,
        authenticated: true,
        user,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      console.log('Sign up error', error);
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Registration failed'
      };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // Remove token and user from storage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      // Update auth state
      setAuthState({
        token: null,
        authenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.log('Sign out error', error);
    }
  };

  // Get auth header
  const getAuthHeader = () => {
    if (!authState.token) return {};
    return { Authorization: `Bearer ${authState.token}` };
  };

  return (
    <AuthContext.Provider 
      value={{ 
        authState, 
        getAuthHeader,
        signIn, 
        signUp, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
