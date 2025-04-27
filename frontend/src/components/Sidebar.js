import {
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHistory,
  FaCalendarAlt,
  FaUserCog,
  FaBuilding,
  FaUserPlus,
  FaUser,
} from "react-icons/fa"
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
  const { logout, user } = useAuth()

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Check if user has admin role
  const isAdmin = user?.role === "SYSTEM_ADMIN" || user?.role === "MFI_ADMIN"

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
        <MenuItem to="/dashboard" active={location.pathname === "/dashboard"} collapsed={collapsed}>
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
        <MenuItem to="/dashboard/credit-history" active={isActive("/credit-history")} collapsed={collapsed}>
          <FaHistory />
          <MenuText collapsed={collapsed}>Credit History</MenuText>
        </MenuItem>
        <MenuItem to="/dashboard/repayments" active={isActive("/repayments")} collapsed={collapsed}>
          <FaCalendarAlt />
          <MenuText collapsed={collapsed}>Repayments</MenuText>
        </MenuItem>

        <MenuLabel collapsed={collapsed}>Reports</MenuLabel>
        <MenuItem to="/dashboard/analytics" active={isActive("/analytics")} collapsed={collapsed}>
          <FaChartLine />
          <MenuText collapsed={collapsed}>Analytics</MenuText>
        </MenuItem>

        {isAdmin && (
          <>
            <MenuLabel collapsed={collapsed}>Administration</MenuLabel>
            <MenuItem to="/dashboard/users" active={isActive("/users")} collapsed={collapsed}>
              <FaUserCog />
              <MenuText collapsed={collapsed}>User Management</MenuText>
            </MenuItem>
            {user?.role === "MFI_ADMIN" && (
              <MenuItem to="/dashboard/register-loan-officer" active={isActive("/register-loan-officer")} collapsed={collapsed}>
                <FaUserPlus />
                <MenuText collapsed={collapsed}>Register Loan Officer</MenuText>
              </MenuItem>
            )}
            {user?.role === "SYSTEM_ADMIN" && (
              <MenuItem to="/dashboard/mfis" active={isActive("/mfis")} collapsed={collapsed}>
                <FaBuilding />
                <MenuText collapsed={collapsed}>MFI Management</MenuText>
              </MenuItem>
            )}
          </>
        )}

        <MenuLabel collapsed={collapsed}>Settings</MenuLabel>
        <MenuItem to="/dashboard/profile" active={isActive("/profile")} collapsed={collapsed}>
          <FaUser />
          <MenuText collapsed={collapsed}>My Profile</MenuText>
        </MenuItem>
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

