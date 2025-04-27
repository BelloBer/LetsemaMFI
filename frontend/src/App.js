"use client"

// src/App.js
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import styled from "styled-components"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import Borrowers from "./pages/Borrowers"
import Loans from "./pages/Loans"
import LoanApplication from "./components/LoanApplication"
import CreditHistory from "./pages/CreditHistory"
import RepaymentTracking from "./pages/RepaymentTracking"
import Analytics from "./pages/Analytics"
import UserManagement from "./pages/UserManagement"
import MFIManagement from "./pages/MFIManagement"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import GlobalStyles from "./styles/GlobalStyles"
import BorrowerRegistrationPage from "./pages/BorrowerRegistrationPage"
import BorrowerRoutes from "./pages/borrower/BorrowerRoutes"
import Unauthorized from "./pages/Unauthorized"
import RegisterLoanOfficer from './pages/loans/RegisterLoanOfficer'
import LoanDetails from './pages/loans/LoanDetails'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
`

const PageContainer = styled.div`
  flex: 1;
  padding: 1rem;
  transition: margin-left 0.3s;
`

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
`

// Component to redirect users based on their role
const RoleBasedRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  // Redirect based on user role
  if (user.role === "BORROWER") {
    return <Navigate to="/borrower/dashboard" replace />
  } else {
    // For all staff roles
    return <Navigate to="/dashboard" replace />
  }
}

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <Router>
      <GlobalStyles />
      <AuthProvider>
      
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute roles={["SYSTEM_ADMIN", "MFI_ADMIN", "LOAN_OFFICER", "CREDIT_ANALYST"]}>
                <AppContainer>
                  <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
                  <PageContainer style={{ marginLeft: sidebarCollapsed ? "80px" : "260px" }}>
                    <Navbar sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/borrowers" element={<Borrowers />} />
                      <Route path="/loans" element={<Loans />} />
                      <Route path="/loans/new" element={<LoanApplication />} />
                      <Route path="/credit-history" element={<CreditHistory />} />
                      <Route path="/repayments" element={<RepaymentTracking />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/users" element={<UserManagement />} />
                      <Route path="/mfis" element={<MFIManagement />} />
                      <Route path="/register-staff" element={<Register />} />
                      <Route path="/register-loan-officer" element={<RegisterLoanOfficer />} />
                    </Routes>
                  </PageContainer>
                </AppContainer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans/:loanId"
            element={
              <ProtectedRoute roles={["SYSTEM_ADMIN", "MFI_ADMIN", "LOAN_OFFICER", "CREDIT_ANALYST"]}>
                <AppContainer>
                  <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
                  <PageContainer style={{ marginLeft: sidebarCollapsed ? "80px" : "260px" }}>
                    <Navbar sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
                    <LoanDetails />
                  </PageContainer>
                </AppContainer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrower/*"
            element={
              <ProtectedRoute roles={["BORROWER"]}>
                <BorrowerRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register/borrower"
            element={
              <AuthContainer>
                <BorrowerRegistrationPage />
              </AuthContainer>
            }
          />
          <Route
            path="/login"
            element={
              <AuthContainer>
                <Login />
              </AuthContainer>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Add a role-based redirect for the root path */}
          <Route path="/" element={<RoleBasedRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
