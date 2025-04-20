"use client"

import { useState, useEffect } from "react"
import { registerBorrower, getMFIs } from "../services/auth"
import { useNavigate, Link } from "react-router-dom"
import styled from "styled-components"
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBuilding,
  FaUserPlus,
} from "react-icons/fa"

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
  max-width: 650px;
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
  margin-bottom: 1rem;
  font-size: 1.5rem;
`

const Subtitle = styled.p`
  color: var(--text-light);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
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

const BorrowerRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    date_of_birth: "",
    national_id: "",
    phone: "",
    address: {
      street: "",
      city: "",
      district: "",
      postal_code: "",
    },
    // mfi: "",
  })

  // const [mfis, setMfis] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // useEffect(() => {
  //   // Fetch MFIs for registration
  //   getMFIs()
  //     .then((data) => setMfis(data))
  //     .catch((err) => console.error("Failed to fetch MFIs:", err))
  // }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      // Handle nested address fields
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsSubmitting(false)
      return
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...dataToSubmit } = formData

      await registerBorrower(dataToSubmit)
      setSuccess("Registration successful! Redirecting to login...")

      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
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
        <Title>Borrower Registration</Title>
        <Subtitle>Create an account to apply for loans and manage your credit history</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>
              <FaUser /> Account Information
            </SectionTitle>
            <FormRow>
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
            </FormRow>
            <FormRow>
              <FormGroup>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
              </FormGroup>
              <FormGroup>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FaIdCard /> Personal Information
            </SectionTitle>
            <FormRow>
              <FormGroup>
                <InputIcon>
                  <FaUser />
                </InputIcon>
                <Input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <InputIcon>
                  <FaCalendarAlt />
                </InputIcon>
                <Input
                  type="date"
                  name="date_of_birth"
                  placeholder="Date of Birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <InputIcon>
                <FaIdCard />
              </InputIcon>
              <Input
                type="text"
                name="national_id"
                placeholder="National ID Number"
                value={formData.national_id}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FaPhone /> Contact Information
            </SectionTitle>
            <FormGroup>
              <InputIcon>
                <FaPhone />
              </InputIcon>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone Number (e.g. +266 5885 1234)"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <SectionTitle>
              <FaMapMarkerAlt /> Address
            </SectionTitle>
            <FormRow>
              <FormGroup>
                <InputIcon>
                  <FaMapMarkerAlt />
                </InputIcon>
                <Input
                  type="text"
                  name="address.street"
                  placeholder="Street Address"
                  value={formData.address.street}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <InputIcon>
                  <FaMapMarkerAlt />
                </InputIcon>
                <Input
                  type="text"
                  name="address.city"
                  placeholder="City/Village"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <InputIcon>
                  <FaMapMarkerAlt />
                </InputIcon>
                <Input
                  type="text"
                  name="address.district"
                  placeholder="District"
                  value={formData.address.district}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <InputIcon>
                  <FaMapMarkerAlt />
                </InputIcon>
                <Input
                  type="text"
                  name="address.postal_code"
                  placeholder="Postal Code"
                  value={formData.address.postal_code}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          {/* <FormSection>
            <SectionTitle>
              <FaBuilding /> MFI Selection
            </SectionTitle>
            <FormGroup>
              <InputIcon>
                <FaBuilding />
              </InputIcon>
              <Select name="mfi" value={formData.mfi} onChange={handleChange} required>
                <option value="">Select MFI to Apply With</option>
                {mfis.map((mfi) => (
                  <option key={mfi.mfi_id} value={mfi.mfi_id}>
                    {mfi.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </FormSection> */}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Register as Borrower"}
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

export default BorrowerRegistration
