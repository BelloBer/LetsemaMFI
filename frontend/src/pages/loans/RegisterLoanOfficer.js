"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import { FaUserPlus, FaBuilding, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa"
import { registerStaff } from "../../services/auth"

const RegisterContainer = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 90px auto 30px;
`

const RegisterHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
  
  &:hover {
    color: var(--primary);
  }
`

const RegisterTitle = styled.h2`
  font-size: 24px;
  margin: 0;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormGroup = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
  }
`

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 16px;
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  
  &:hover {
    color: var(--text);
  }
`

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
  
  &:hover {
    background: var(--primary-dark);
  }
  
  &:disabled {
    background: var(--text-light);
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  color: var(--danger);
  padding: 15px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
`

const SuccessMessage = styled.div`
  color: var(--success);
  padding: 15px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
`

const RegisterLoanOfficer = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // Add MFI ID and role to the registration data
      const registrationData = {
        ...formData,
        mfi: user.mfi,
        role: "LOAN_OFFICER",
      }

      await registerStaff(registrationData)
      setSuccess("Loan officer registered successfully!")
      setFormData({
        username: "",
        email: "",
        password: "",
      })
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.message || "Failed to register loan officer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <RegisterContainer>
      <RegisterHeader>
        <BackButton onClick={() => navigate("/loans")}>
          <FaArrowLeft />
        </BackButton>
        <RegisterTitle>Register Loan Officer</RegisterTitle>
      </RegisterHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <InputIcon>
            <FaUser />
          </InputIcon>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <InputIcon>
            <FaEnvelope />
          </InputIcon>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <InputIcon>
            <FaLock />
          </InputIcon>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </PasswordToggle>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Loan Officer"}
          {!loading && <FaUserPlus />}
        </SubmitButton>
      </Form>
    </RegisterContainer>
  )
}

export default RegisterLoanOfficer 