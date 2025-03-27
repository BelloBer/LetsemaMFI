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
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

