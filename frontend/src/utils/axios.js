// src/utils/axios.js
import axios from "axios"

// Create a base API instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
})

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't handle auth errors here to avoid circular dependencies
    // Let the components handle their own auth errors
    return Promise.reject(error)
  },
)

export default api

