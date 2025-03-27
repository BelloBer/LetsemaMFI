// src/services/auth.js
import api from "../utils/axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

export const login = async (credentials) => {
  try {
    const response = await api.post(`/api/users/token/`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    // Return consistent error format
    if (error.response) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject({ detail: "Network error" })
  }
}

export const register = async (userData) => {
  try {
    const response = await api.post(`/api/users/register/`, userData)
    return response.data
  } catch (error) {
    if (error.response) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject({ detail: "Registration failed" })
  }
}

export const getProfile = async () => {
  try {
    const response = await api.get(`/api/users/profile/`)
    return response.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const logout = async () => {
  try {
    await api.post(`/api/users/logout/`)
    localStorage.removeItem("token")
  } catch (error) {
    console.error("Logout error:", error)
  }
}