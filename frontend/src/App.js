// src/App.js
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Borrowers from "./pages/Borrowers";
import Loans from "./pages/Loans";
import LoanApplication from "./components/LoanApplication";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const PageContainer = styled.div`
  flex: 1;
  padding: 1rem;
  transition: margin-left 0.3s;
`;

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContainer>
                  <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
                  <PageContainer style={{ marginLeft: sidebarCollapsed ? "80px" : "260px" }}>
                    <Navbar sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/borrowers" element={<Borrowers />} />
                      <Route path="/loans" element={<Loans />} />
                      <Route path="/loans/new" element={<LoanApplication />} />
                    </Routes>
                  </PageContainer>
                </AppContainer>
              </ProtectedRoute>
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
          <Route
            path="/register"
            element={
              <AuthContainer>
                <Register />
              </AuthContainer>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;