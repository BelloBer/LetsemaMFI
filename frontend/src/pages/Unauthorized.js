import { Link } from "react-router-dom"
import styled from "styled-components"
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa"

const UnauthorizedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: var(--background);
  text-align: center;
`

const IconWrapper = styled.div`
  font-size: 64px;
  color: var(--warning);
  margin-bottom: 20px;
`

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 16px;
  color: var(--text);
`

const Message = styled.p`
  font-size: 18px;
  max-width: 600px;
  margin-bottom: 30px;
  color: var(--text-light);
`

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-dark);
  }
`

const Unauthorized = () => {
  return (
    <UnauthorizedContainer>
      <IconWrapper>
        <FaExclamationTriangle />
      </IconWrapper>
      <Title>Access Denied</Title>
      <Message>
        You don't have permission to access this page. Please contact your administrator if you believe this is an
        error.
      </Message>
      <BackButton to="/login">
        <FaArrowLeft /> Back to Login
      </BackButton>
    </UnauthorizedContainer>
  )
}

export default Unauthorized
