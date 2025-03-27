"use client"

// src/pages/Register.js
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { register } from "../services/auth"
import { useNavigate, Link } from "react-router-dom"
import styled from "styled-components"
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaBuilding, FaUserPlus } from "react-icons/fa"

const RegisterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  padding: 20px;
`

const RegisterContainer = styled.div`
  max-width: 550px;
  width: 100%;
  padding: 2.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  text-align: center;
  margin-bottom: 10px;
  
  span {
    color: var(--text);
  }
`

const Title = styled.h2`
  color: var(--text);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const FormGroup = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
  }
`

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 1.2rem;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--text-light);
    cursor: not-allowed;
  }
`

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ErrorMessage = styled(Message)`
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
`

const SuccessMessage = styled(Message)`
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
`

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-light);
  
  a {
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "BORROWER",
    mfi: "",
  })
  const [mfis, setMfis] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, api } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === "SYSTEM_ADMIN") {
      api.get("/api/mfis/").then((res) => setMfis(res.data))
    }
  }, [user, api])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await register(formData)
      setSuccess("Registration successful! Redirecting...")

      setTimeout(() => {
        navigate(user ? "/dashboard" : "/login")
      }, 2000)
    } catch (err) {
      setError(err.response?.data.detail || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RegisterWrapper>
      <RegisterContainer>
        <Logo>
          Letsema<span>.</span>
        </Logo>
        <Title>Create your account</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength="8"
            />
          </FormGroup>

          <FormGroup>
            <InputIcon>
              <FaUserTag />
            </InputIcon>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={!user}
            >
              <option value="BORROWER">Borrower</option>
              {user?.role === "SYSTEM_ADMIN" && (
                <>
                  <option value="LOAN_OFFICER">Loan Officer</option>
                  <option value="MFI_ADMIN">MFI Admin</option>
                  <option value="CREDIT_ANALYST">Credit Analyst</option>
                  <option value="AUDITOR">Auditor</option>
                  <option value="SYSTEM_ADMIN">System Admin</option>
                </>
              )}
            </Select>
          </FormGroup>

          {user?.role === "SYSTEM_ADMIN" && (
            <FormGroup>
              <InputIcon>
                <FaBuilding />
              </InputIcon>
              <Select value={formData.mfi} onChange={(e) => setFormData({ ...formData, mfi: e.target.value })}>
                <option value="">Select MFI</option>
                {mfis.map((mfi) => (
                  <option key={mfi.id} value={mfi.id}>
                    {mfi.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
            {!isSubmitting && <FaUserPlus />}
          </Button>
        </Form>

        <LoginLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginLink>
      </RegisterContainer>
    </RegisterWrapper>
  )
}

export default Register

