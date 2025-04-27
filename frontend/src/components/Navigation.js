import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import styled from 'styled-components'

const Nav = styled.nav`
  background: var(--card-bg);
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary);
`

const MenuButton = styled.button`
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.5rem;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--card-bg);
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`

const NavLink = styled.div`
  color: var(--text);
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }
`

const LogoutButton = styled.button`
  background: var(--danger);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--danger-dark);
  }
`

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
        <Logo>Letsema MFI</Logo>
        <MenuButton onClick={() => setIsOpen(!isOpen)}>
          <FaBars />
        </MenuButton>
        <NavLinks isOpen={isOpen}>
          <NavLink onClick={() => navigate("/dashboard")}>Dashboard</NavLink>
          <NavLink onClick={() => navigate("/loans")}>Loans</NavLink>
          {isMFIAdmin && (
            <NavLink onClick={() => navigate("/register-loan-officer")}>Register Loan Officer</NavLink>
          )}
          <NavLink onClick={() => navigate("/profile")}>Profile</NavLink>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavLinks>
      </NavContainer>
    </Nav>
  )
}

export default Navigation