"use client"
import { FaHome, FaUsers, FaMoneyBillWave, FaChartLine, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa"
import { Link, useLocation } from "react-router-dom"
import styled from "styled-components"

const SidebarContainer = styled.div`
  width: ${(props) => (props.collapsed ? "80px" : "260px")};
  height: 100vh;
  background: var(--sidebar);
  color: white;
  position: fixed;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: ${(props) => (props.collapsed ? "none" : "4px 0 10px rgba(0, 0, 0, 0.1)")};
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? "center" : "space-between")};
  padding: ${(props) => (props.collapsed ? "20px 0" : "20px")};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Logo = styled.div`
  font-size: ${(props) => (props.collapsed ? "0" : "24px")};
  font-weight: 700;
  color: white;
  transition: all 0.3s ease;
  overflow: hidden;
  white-space: nowrap;
  
  span {
    color: var(--primary-light);
  }
`

const LogoIcon = styled.div`
  display: ${(props) => (props.collapsed ? "block" : "none")};
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-light);
`

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary-light);
  }
`

const MenuSection = styled.div`
  margin-top: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const MenuLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  padding: ${(props) => (props.collapsed ? "10px 0" : "10px 20px")};
  margin-top: 10px;
  letter-spacing: 1px;
  display: ${(props) => (props.collapsed ? "none" : "block")};
`

const MenuItem = styled(({ collapsed, active, as: Component = Link, ...rest }) => <Component {...rest} />)`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.collapsed ? "0" : "12px")};
  padding: ${(props) => (props.collapsed ? "16px 0" : "14px 20px")};
  text-decoration: none;
  color: ${(props) => (props.active ? "white" : "rgba(255, 255, 255, 0.7)")};
  font-size: 16px;
  transition: all 0.2s ease-in-out;
  border-left: ${(props) => (props.active ? "4px solid var(--primary-light)" : "4px solid transparent")};
  background: ${(props) => (props.active ? "var(--sidebar-hover)" : "transparent")};
  justify-content: ${(props) => (props.collapsed ? "center" : "flex-start")};
  border: none;
  width: 100%;
  cursor: pointer;

  &:hover {
    background: var(--sidebar-hover);
    color: white;
  }

  svg {
    font-size: 18px;
    min-width: 18px;
  }
`

const MenuText = styled.span`
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.collapsed ? 0 : 1)};
  display: ${(props) => (props.collapsed ? "none" : "inline")};
  white-space: nowrap;
`

const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${(props) => (props.collapsed ? "none" : "block")};
`

const FooterText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
`

const Sidebar = ({ collapsed, toggleSidebar, onLogout }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
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
        <MenuItem to="/borrowers" active={isActive("/borrowers")} collapsed={collapsed}>
          <FaUsers />
          <MenuText collapsed={collapsed}>Borrowers</MenuText>
        </MenuItem>
        <MenuItem to="/loans" active={isActive("/loans")} collapsed={collapsed}>
          <FaMoneyBillWave />
          <MenuText collapsed={collapsed}>Loans</MenuText>
        </MenuItem>

        <MenuLabel collapsed={collapsed}>Reports</MenuLabel>
        <MenuItem to="/reports" active={isActive("/reports")} collapsed={collapsed}>
          <FaChartLine />
          <MenuText collapsed={collapsed}>Analytics</MenuText>
        </MenuItem>

        <MenuLabel collapsed={collapsed}>Settings</MenuLabel>
        <MenuItem to="/settings" active={isActive("/settings")} collapsed={collapsed}>
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

