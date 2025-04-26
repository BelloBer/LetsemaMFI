
// "use client"

// // src/context/AuthContext.js
// import { createContext, useContext, useState, useEffect, useRef } from "react"
// import { loginBorrower, loginStaff, refreshToken, getUserProfile, createAuthenticatedApi } from "../services/auth"

// const AuthContext = createContext()

// export const useAuth = () => {
//   return useContext(AuthContext)
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const refreshIntervalRef = useRef(null)

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"))
//     if (storedUser) {
//       setUser(storedUser)
//       setupTokenRefresh(storedUser.refresh)
//     }
//     setLoading(false)

//     return () => {
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current)
//       }
//     }
//   }, [])

//   const setupTokenRefresh = (refreshTokenValue) => {
//     // Clear any existing interval
//     if (refreshIntervalRef.current) {
//       clearInterval(refreshIntervalRef.current)
//     }

//     // Set up a new interval
//     refreshIntervalRef.current = setInterval(
//       async () => {
//         try {
//           const tokens = await refreshToken(refreshTokenValue)

//           // Update user with new tokens
//           setUser((prevUser) => {
//             const updatedUser = {
//               ...prevUser,
//               access: tokens.access,
//               refresh: tokens.refresh,
//             }
//             localStorage.setItem("user", JSON.stringify(updatedUser))
//             return updatedUser
//           })
//         } catch (err) {
//           console.error("Token refresh failed:", err)
//           logout()
//         }
//       },
//       4 * 60 * 1000,
//     ) // Refresh every 4 minutes
//   }

//   const login = async (username, password, isStaff = false) => {
//     setError(null)
//     try {
//       const loginFunction = isStaff ? loginStaff : loginBorrower
//       const userData = await loginFunction(username, password)

//       const user = {
//         ...userData,
//         isStaff,
//         username,
//       }

//       localStorage.setItem("user", JSON.stringify(user))
//       setUser(user)
//       setupTokenRefresh(userData.refresh)
//       return user
//     } catch (err) {
//       setError(err.message || "Login failed")
//       throw err
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem("user")
//     setUser(null)

//     if (refreshIntervalRef.current) {
//       clearInterval(refreshIntervalRef.current)
//       refreshIntervalRef.current = null
//     }
//   }

//   // Create an API instance with the current access token
//   const api = user ? createAuthenticatedApi(user.access) : null

//   const value = {
//     user,
//     isAuthenticated: !!user,
//     isStaff: user?.isStaff || false,
//     role: user?.role || null,
//     login,
//     logout,
//     error,
//     loading,
//     api,
//     refetchUser: async () => {
//       if (user?.access) {
//         try {
//           const profile = await getUserProfile(user.access)
//           setUser((prev) => ({ ...prev, ...profile }))
//           return profile
//         } catch (err) {
//           console.error("Failed to fetch user profile:", err)
//           if (err.message.includes("401")) {
//             logout()
//           }
//           throw err
//         }
//       }
//     },
//   }

//   return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
// }



"use client"

// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { loginBorrower, loginStaff, refreshToken, getUserProfile, createAuthenticatedApi } from "../services/auth"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const refreshIntervalRef = useRef(null)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser) {
      setUser(storedUser)
      setupTokenRefresh(storedUser.refresh)
    }
    setLoading(false)

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [])

  const setupTokenRefresh = (refreshTokenValue) => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }

    // Set up a new interval
    refreshIntervalRef.current = setInterval(
      async () => {
        try {
          const tokens = await refreshToken(refreshTokenValue)

          // Update user with new tokens
          setUser((prevUser) => {
            const updatedUser = {
              ...prevUser,
              access: tokens.access,
              refresh: tokens.refresh,
            }
            localStorage.setItem("user", JSON.stringify(updatedUser))
            return updatedUser
          })
        } catch (err) {
          console.error("Token refresh failed:", err)
          logout()
        }
      },
      4 * 60 * 1000,
    ) // Refresh every 4 minutes
  }

  const login = async (username, password, isStaff = false) => {
    setError(null)
    try {
      const loginFunction = isStaff ? loginStaff : loginBorrower
      const userData = await loginFunction(username, password)

      const user = {
        ...userData,
        isStaff,
        username,
      }

      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      setupTokenRefresh(userData.refresh)
      return user
    } catch (err) {
      setError(err.message || "Login failed")
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)

    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }
  }

  // Create an API instance with the current access token
  const api = user ? createAuthenticatedApi(user.access) : null

  const value = {
    user,
    isAuthenticated: !!user,
    isStaff: user?.isStaff || false,
    role: user?.role || null,
    login,
    logout,
    error,
    loading,
    api,
    refetchUser: async () => {
      if (user?.access) {
        try {
          const profile = await getUserProfile(user.access)
          setUser((prev) => ({ ...prev, ...profile }))
          return profile
        } catch (err) {
          console.error("Failed to fetch user profile:", err)
          if (err.message && err.message.includes("401")) {
            // Token expired or invalid, log the user out
            logout()
          }
          throw err
        }
      }
    },
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}





