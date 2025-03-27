"use client"

// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState, useRef } from "react"
import axios from "axios"

const AuthContext = createContext()

// Create API instance outside the component to prevent recreation on each render
const createApi = (token) => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  })

  // Set up request interceptor
  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Set up response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Only logout if not trying to login
        if (!error.config.url.includes("token")) {
          localStorage.removeItem("token")
          // Don't redirect here to avoid potential loops
        }
      }
      return Promise.reject(error)
    },
  )

  return instance
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)
  const apiRef = useRef(createApi(token))
  const fetchingRef = useRef(false)

  // Update API instance when token changes
  useEffect(() => {
    apiRef.current = createApi(token)
  }, [token])

  const fetchUser = async () => {
    // Prevent concurrent fetches
    if (fetchingRef.current || !token) {
      setLoading(false)
      return
    }

    fetchingRef.current = true

    try {
      const response = await apiRef.current.get("/api/users/profile/")
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      // Only logout if it's a 401 error
      if (error.response?.status === 401) {
        logout()
      }
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  const login = async (credentials) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"

      const response = await axios.post(`${apiUrl}/api/users/token/`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      const accessToken = response.data.access
      localStorage.setItem("token", accessToken)
      setToken(accessToken)

      // Fetch user profile
      const profile = await axios.get(`${apiUrl}/api/users/profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setUser(profile.data)
      return response.data
    } catch (error) {
      console.error("Auth error:", error)
      const errorData = error.response?.data || { detail: "Login failed" }
      throw errorData
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  // Only fetch user once when component mounts or token changes
  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        api: apiRef.current,
        loading,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

