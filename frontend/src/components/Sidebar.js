"use client"

import { FaHome, FaUsers, FaMoneyBillWave, FaChartLine, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  SidebarContainer,
  SidebarHeader,
  Logo,
  LogoIcon,
  ToggleButton,
  MenuSection,
  MenuLabel,
  MenuItem,
  MenuText,
  SidebarFooter,
  FooterText,
} from "../styles/SidebarStyles"

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <SidebarContainer collapsed={collapsed}>
      <SidebarHeader collapsed={collapsed}>
        <Logo collapsed={collapsed}>
          Letsema<span>.</span>
        </Logo>
        <LogoIcon collapsed={collapsed}>
          L<span>.</span>
        </LogoIcon>
        <ToggleButton onClick={toggleSidebar}>{collapsed ? <FaBars /> : <FaTimes />}</ToggleButton>
      </SidebarHeader>

      <MenuSection>
        <MenuLabel collapsed={collapsed}>Main</MenuLabel>
        <MenuItem to="/dashboard" active={isActive("/dashboard")} collapsed={collapsed}>
          <FaHome />
          <MenuText collapsed={collapsed}>Dashboard</MenuText>
        </MenuItem>
        <MenuItem to="/dashboard/borrowers" active={isActive("/borrowers")} collapsed={collapsed}>
          <FaUsers />
          <MenuText collapsed={collapsed}>Borrowers</MenuText>
        </MenuItem>
        <MenuItem to="/dashboard/loans" active={isActive("/loans")} collapsed={collapsed}>
          <FaMoneyBillWave />
          <MenuText collapsed={collapsed}>Loans</MenuText>
        </MenuItem>

        <MenuLabel collapsed={collapsed}>Reports</MenuLabel>
        <MenuItem to="/dashboard/reports" active={isActive("/reports")} collapsed={collapsed}>
          <FaChartLine />
          <MenuText collapsed={collapsed}>Analytics</MenuText>
        </MenuItem>

        <MenuLabel collapsed={collapsed}>Settings</MenuLabel>
        <MenuItem to="/dashboard/settings" active={isActive("/settings")} collapsed={collapsed}>
          <FaCog />
          <MenuText collapsed={collapsed}>Settings</MenuText>
        </MenuItem>
        <MenuItem as="button" onClick={handleLogout} collapsed={collapsed}>
          <FaSignOutAlt />
          <MenuText collapsed={collapsed}>Logout</MenuText>
        </MenuItem>
      </MenuSection>

      <SidebarFooter collapsed={collapsed}>
        <FooterText>Letsema Loan Management v1.0</FooterText>
      </SidebarFooter>
    </SidebarContainer>
  )
}

export default Sidebar

