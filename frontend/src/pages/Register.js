"use client"

// src/pages/Register.js
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import styled from "styled-components"
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from "react-icons/fa"

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--background);
`

const RegisterCard = styled.div`
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

const RegisterButton = styled.button`
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

const LoginLink = styled.div`
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

const Register = ({ onLogin }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setError("")
      setLoading(true)

      // For demo purposes, just store the user in localStorage
      // In a real app, you would register with your backend
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          name: name,
          email: email,
          role: "User",
        }),
      )

      // Call the onLogin callback
      onLogin()

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (error) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          Letsema<span>.</span>
        </Logo>
        <FormTitle>Create an account</FormTitle>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <InputGroup>
              <InputIcon>
                <FaEnvelope />
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

          <FormGroup>
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </InputGroup>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <RegisterButton type="submit" disabled={loading}>
            {loading ? (
              "Registering..."
            ) : (
              <>
                <FaUserPlus />
                Register
              </>
            )}
          </RegisterButton>
        </form>

        <LoginLink>
          Already have an account? <Link to="/login">Login</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  )
}

export default Register

