//srs/context/AuthContext.js
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/api/users/profile/');
      setUser(response.data);
    } catch (error) {
      logout();
    }
  }, [api]);

  const login = async (credentials) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) throw new Error("API URL not configured");
      
      const response = await axios.post(`${apiUrl}/api/users/token/`, credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      localStorage.setItem('token', response.data.access);
      setToken(response.data.access);
      
      // Fetch user profile
      const profile = await axios.get(`${apiUrl}/api/users/profile/`, {
        headers: {
          'Authorization': `Bearer ${response.data.access}`
        }
      });
      
      setUser(profile.data);
      return response.data;
    } catch (error) {
      console.error('Auth error:', error);
      const errorData = error.response?.data || { detail: 'Login failed' };
      throw errorData;
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    if (navigate) navigate('/login');
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      fetchUser();
    }
  }, [token, api, fetchUser]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);