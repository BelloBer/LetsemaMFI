"use client"

import { useState } from "react"
import { FaBell, FaUserCircle, FaSearch, FaEnvelope, FaCalendarAlt, FaSignOutAlt, FaCog, FaUser } from "react-icons/fa"
import styled from "styled-components"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const NavbarContainer = styled.nav`
  width: 100%;
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
  width: calc(100% - ${(props) => (props.sidebarCollapsed ? "80px" : "260px")});
`

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 40px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text);
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-light);
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
  }
  
  &::placeholder {
    color: var(--text-light);
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 16px;
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

const DateDisplay = styled.div`
  font-size: 14px;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const UserDropdown = styled.div`
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

const DropdownItem = styled.div`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  
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

const Navbar = ({ sidebarCollapsed }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Get current date
  const today = new Date()
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  const formattedDate = today.toLocaleDateString("en-US", options)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <NavbarContainer sidebarCollapsed={sidebarCollapsed}>
      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput placeholder="Search..." />
      </SearchContainer>

      <NavItems>
        <DateDisplay>
          <FaCalendarAlt />
          {formattedDate}
        </DateDisplay>

        <IconButton>
          <FaEnvelope />
          <NotificationBadge>3</NotificationBadge>
        </IconButton>

        <IconButton>
          <FaBell />
          <NotificationBadge>5</NotificationBadge>
        </IconButton>

        <UserProfile onClick={() => setDropdownOpen(!dropdownOpen)}>
          <UserAvatar>
            <FaUserCircle />
          </UserAvatar>
          <UserInfo>
            <UserName>{user?.username || "John Doe"}</UserName>
            <UserRole>{user?.role || "Administrator"}</UserRole>
          </UserInfo>

          <UserDropdown isOpen={dropdownOpen}>
            <DropdownItem>
              <FaUser />
              My Profile
            </DropdownItem>
            <DropdownItem>
              <FaCog />
              Settings
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </DropdownItem>
          </UserDropdown>
        </UserProfile>
      </NavItems>
    </NavbarContainer>
  )
}

export default Navbar

