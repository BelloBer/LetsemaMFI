"use client"

// src/App.js
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import GlobalStyles from "./styles/GlobalStyles"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import Borrowers from "./pages/Borrowers"
import Loans from "./pages/Loans"
import LoanApplication from "./components/LoanApplication"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { supabase } from '../utils/supabase'

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Handle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setIsAuthenticated(true)
    }
  }, [])

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsAuthenticated(false)
  }

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <Router>
      <GlobalStyles />
      {isAuthenticated ? (
        <div className="app-container">
          <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} onLogout={handleLogout} />
          <div className="page-container" style={{ marginLeft: sidebarCollapsed ? "80px" : "260px" }}>
            <Navbar sidebarCollapsed={sidebarCollapsed} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/borrowers" element={<Borrowers />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/loans/new" element={<LoanApplication />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  )
}

export default App

