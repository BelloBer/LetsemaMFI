"use client"

// src/pages/Login.js
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import styled from "styled-components"
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa"

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--background);
`

const LoginCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 40px;
`

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  color: var(--text);

  span {
    color: var(--primary);
  }
`

const FormTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
  color: var(--text);
`

const FormGroup = styled.div`
  margin-bottom: 20px;
`

const InputGroup = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 15px 12px 45px;
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
`

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 16px;
`

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  color: var(--danger);
  font-size: 14px;
  margin-top: 5px;
  text-align: center;
`

const ForgotPassword = styled.div`
  text-align: center;
  margin-top: 20px;

  a {
    color: var(--primary);
    font-size: 14px;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  
  a {
    color: var(--primary);
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setError("")
      setLoading(true)

      // For demo purposes, accept any credentials
      // In a real app, you would validate against your backend
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          name: "Demo User",
          email: email,
          role: "Administrator",
        }),
      )

      // Call the onLogin callback
      onLogin()

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (error) {
      setError("Failed to log in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          Letsema<span>.</span>
        </Logo>
        <FormTitle>Login to your account</FormTitle>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <LoginButton type="submit" disabled={loading}>
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <FaSignInAlt />
                Login
              </>
            )}
          </LoginButton>
        </form>

        <ForgotPassword>
          <a href="/forgot-password">Forgot your password?</a>
        </ForgotPassword>

        <RegisterLink>
          Don't have an account? <Link to="/register">Register</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  )
}

export default Login

