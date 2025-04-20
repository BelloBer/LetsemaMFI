"use client"

import { useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import { FaHome, FaUser, FaFileAlt, FaSignOutAlt, FaBars, FaTimes, FaBell, FaEnvelope } from "react-icons/fa"

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`

const Sidebar = styled.div`
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
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--sidebar);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
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

const MenuItem = styled(Link)`
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
  position: relative;

  &:hover {
    background: var(--sidebar-hover);
    color: white;
  }

  svg {
    font-size: 18px;
    min-width: 18px;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: ${(props) => (props.active ? "var(--primary-light)" : "transparent")};
    transition: all 0.2s ease;
  }
  
  &:hover::after {
    background: ${(props) => (!props.active ? "rgba(255, 255, 255, 0.2)" : "var(--primary-light)")};
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

const MainContent = styled.div`
  flex: 1;
  margin-left: ${(props) => (props.sidebarCollapsed ? "80px" : "260px")};
  transition: margin-left 0.3s ease-in-out;
  background: var(--background);
  min-height: 100vh;
`

const NavbarStyled = styled.nav`
  width: calc(100% - ${(props) => (props.sidebarCollapsed ? "80px" : "260px")});
  height: 70px;
  background: var(--card-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  color: var(--text);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 90;
  transition: all 0.3s ease-in-out;
  margin-left: ${(props) => (props.sidebarCollapsed ? "80px" : "260px")};
`

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 20px;
  cursor: pointer;
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--background);
    color: var(--primary);
  }
`

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: var(--background);
  }
`

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const UserName = styled.span`
  font-weight: 600;
  font-size: 14px;
`

const UserRole = styled.span`
  font-size: 12px;
  color: var(--text-light);
`

const UserDropdownStyled = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  z-index: 100;
  margin-top: 10px;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transform: ${(props) => (props.isOpen ? "translateY(0)" : "translateY(-10px)")};
  transition: all 0.3s ease;
`

const DropdownItem = styled(Link)`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    background: var(--background);
    color: var(--primary);
  }
  
  svg {
    font-size: 16px;
    color: var(--text-light);
  }
`

const DropdownButton = styled.button`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  
  &:hover {
    background: var(--background);
    color: var(--primary);
  }
  
  svg {
    font-size: 16px;
    color: var(--text-light);
  }
`

const DropdownDivider = styled.div`
  height: 1px;
  background: var(--border);
  margin: 8px 0;
`

// Create a UserDropdown component to handle the isOpen prop
const UserDropdown = ({ isOpen, children }) => {
  return <UserDropdownStyled isOpen={isOpen}>{children}</UserDropdownStyled>
}

// Create a Navbar component to handle the sidebarCollapsed prop
const Navbar = ({ sidebarCollapsed, children }) => {
  return <NavbarStyled sidebarCollapsed={sidebarCollapsed}>{children}</NavbarStyled>
}

const BorrowerLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  return (
    <LayoutContainer>
      <Sidebar collapsed={sidebarCollapsed}>
        <SidebarHeader collapsed={sidebarCollapsed}>
          <Logo collapsed={sidebarCollapsed}>
            Letsema<span>.</span>
          </Logo>
          <LogoIcon collapsed={sidebarCollapsed}>
            L<span>.</span>
          </LogoIcon>
          <ToggleButton onClick={toggleSidebar}>{sidebarCollapsed ? <FaBars /> : <FaTimes />}</ToggleButton>
        </SidebarHeader>

        <MenuSection>
          <MenuItem
            to="/borrower/dashboard"
            active={location.pathname === "/borrower/dashboard" || location.pathname === "/borrower"}
            collapsed={sidebarCollapsed}
          >
            <FaHome />
            <MenuText collapsed={sidebarCollapsed}>Dashboard</MenuText>
          </MenuItem>

          <MenuItem to="/borrower/apply" active={isActive("/apply")} collapsed={sidebarCollapsed}>
            <FaFileAlt />
            <MenuText collapsed={sidebarCollapsed}>Apply for Loan</MenuText>
          </MenuItem>

          <MenuItem to="/borrower/profile" active={isActive("/profile")} collapsed={sidebarCollapsed}>
            <FaUser />
            <MenuText collapsed={sidebarCollapsed}>My Profile</MenuText>
          </MenuItem>

          <MenuItem as="button" onClick={handleLogout} collapsed={sidebarCollapsed}>
            <FaSignOutAlt />
            <MenuText collapsed={sidebarCollapsed}>Logout</MenuText>
          </MenuItem>
        </MenuSection>

        <SidebarFooter collapsed={sidebarCollapsed}>
          <FooterText>Letsema Loan Management v1.0</FooterText>
        </SidebarFooter>
      </Sidebar>

      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <Navbar sidebarCollapsed={sidebarCollapsed}>
          <div></div>
          <NavItems>
            <IconButton>
              <FaBell />
              <NotificationBadge>2</NotificationBadge>
            </IconButton>

            <IconButton>
              <FaEnvelope />
              <NotificationBadge>1</NotificationBadge>
            </IconButton>

            <UserProfile onClick={() => setDropdownOpen(!dropdownOpen)}>
              <UserAvatar>
                <FaUser />
              </UserAvatar>
              <UserInfo>
                <UserName>{user?.username || "Borrower"}</UserName>
                <UserRole>Borrower</UserRole>
              </UserInfo>

              <UserDropdown isOpen={dropdownOpen}>
                <DropdownItem to="/borrower/profile">
                  <FaUser />
                  My Profile
                </DropdownItem>
                <DropdownDivider />
                <DropdownButton onClick={handleLogout}>
                  <FaSignOutAlt />
                  Logout
                </DropdownButton>
              </UserDropdown>
            </UserProfile>
          </NavItems>
        </Navbar>

        <Outlet />
      </MainContent>
    </LayoutContainer>
  )
}

export default BorrowerLayout
