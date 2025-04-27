// src/utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/users"
const LOANS_API_URL = API_BASE_URL.replace("/users", "/loans")

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
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
    } else if (typeof data === "object") {
      // Format validation errors nicely
      const errorMessages = []
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          errorMessages.push(`${key}: ${value.join(", ")}`)
        } else if (typeof value === "string") {
          errorMessages.push(`${key}: ${value}`)
        } else if (typeof value === "object") {
          // Handle nested errors
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            errorMessages.push(`${key}.${nestedKey}: ${nestedValue}`)
          }
        }
      }
      throw new Error(errorMessages.join("\n"))
    }
    throw new Error(response.statusText)
  }

  return data
}

// Loan API functions
export const loanApi = {
  applyForLoan: async (token, loanData) => {
    const response = await fetch(`${LOANS_API_URL}/apply/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(loanData),
    })

    return handleApiResponse(response)
  },

  getLoanDetails: async (token, loanId) => {
    try {
      const response = await fetch(`${LOANS_API_URL}/${loanId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Failed to fetch loan details: ${response.status}`)
      }

      return handleApiResponse(response)
    } catch (error) {
      console.error("API Error in getLoanDetails:", error)
      throw error
    }
  },

  getBorrowerLoans: async (token) => {
    const response = await fetch(`${LOANS_API_URL}/borrower/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },

  getMFILoans: async (token) => {
    const response = await fetch(`${LOANS_API_URL}/mfi/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },

  updateLoanStatus: async (token, loanId, status) => {
    const response = await fetch(`${LOANS_API_URL}/${loanId}/status/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    return handleApiResponse(response)
  },
}

// MFI API functions
export const mfiApi = {
  getActiveMFIs: async (token) => {
    const response = await fetch(`${API_BASE_URL}/mfis/active/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },
}
