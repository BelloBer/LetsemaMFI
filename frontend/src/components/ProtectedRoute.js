"use client"

// src/components/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import styled from "styled-components"

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--background);
`

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid var(--border);
  border-top: 5px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Only check roles if they are specified
  if (roles && roles.length > 0) {
    // Get the user's role, ensuring it's case-insensitive
    const userRole = user?.role?.toUpperCase() || ""

    // Check if the user has one of the required roles (case-insensitive)
    const hasRequiredRole = roles.some((role) => role.toUpperCase() === userRole)

    if (!hasRequiredRole) {
      console.log("Access denied: User role", userRole, "not in required roles", roles)
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}
