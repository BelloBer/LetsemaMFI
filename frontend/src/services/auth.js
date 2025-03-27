//src/services/auth.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    throw new Error("REACT_APP_API_URL environment variable is not defined");
  }

export const login = (credentials) => {
    return axios.post(`${API_URL}/api/users/token/`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(error => {
      // Return consistent error format
      if (error.response) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject({ detail: 'Network error' });
    });
  };

export const register = (userData) => {
  return axios.post(`${API_URL}/api/users/register/`, userData);
};

export const getProfile = (token) => {
  return axios.get(`${API_URL}/api/users/profile/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
