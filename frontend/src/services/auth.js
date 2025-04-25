
// src/services/auth.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/users"

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type")

  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }

  const data = await response.json()

  if (!response.ok) {
    // Handle structured validation errors
    if (data.detail) {
      throw new Error(data.detail)
    } else if (typeof data === 'object') {
      // Format validation errors nicely
      const errorMessages = []
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          errorMessages.push(`${key}: ${value.join(', ')}`)
        } else if (typeof value === 'string') {
          errorMessages.push(`${key}: ${value}`)
        } else if (typeof value === 'object') {
          // Handle nested errors
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            errorMessages.push(`${key}.${nestedKey}: ${nestedValue}`)
          }
        }
      }
      throw new Error(errorMessages.join('\n'))
    }
    throw new Error(response.statusText)
  }

  return data
}

// Staff Registration
export const registerStaff = async (staffData) => {
  const response = await fetch(`${API_URL}/register/staff/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staffData),
  })
  return handleResponse(response)
}

// Borrower Registration
export const registerBorrower = async (borrowerData) => {
  const response = await fetch(`${API_URL}/register/borrower/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(borrowerData),
  })
  return handleResponse(response)
}
// Borrower Login
export const loginBorrower = async (username, password) => {
  const response = await fetch(`${API_URL}/login/borrower/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse(response)
}

// Staff Login (using JWT)
export const loginStaff = async (username, password) => {
  const response = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse(response)
}

// Token Refresh
export const refreshToken = async (refreshToken) => {
  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  })
  return handleResponse(response)
}

// Get User Profile
export const getUserProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(response)
}

// Get MFIs list
export const getMFIs = async () => {
  const response = await fetch(`${API_URL.replace("/users", "/mfis")}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  return handleResponse(response)
}

// Create API instance with auth token
export const createAuthenticatedApi = (token) => {
  return {
    get: async (url) => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse(response)
    },
    post: async (url, data) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      return handleResponse(response)
    },
    put: async (url, data) => {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      return handleResponse(response)
    },
    delete: async (url) => {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse(response)
    },
  }
}






