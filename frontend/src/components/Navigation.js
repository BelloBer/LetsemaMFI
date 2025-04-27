import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { Nav, NavContainer, Logo, MenuButton, NavLinks, NavLink, LogoutButton } from '../styles/NavigationStyles'

const Navigation = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isMFIAdmin = user?.role === "MFI_ADMIN"
  const isLoanOfficer = user?.role === "LOAN_OFFICER"

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">Letsema MFI</Logo>
        <MenuButton onClick={() => setIsOpen(!isOpen)}>
          <FaBars />
        </MenuButton>
        <NavLinks isOpen={isOpen}>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/loans">Loans</NavLink>
          {isMFIAdmin && (
            <NavLink to="/register-loan-officer">Register Loan Officer</NavLink>
          )}
          <NavLink to="/profile">Profile</NavLink>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavLinks>
      </NavContainer>
    </Nav>
  )
}

export default Navigation 