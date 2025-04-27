"use client"

// src/pages/Login.js
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import styled from "styled-components"
import { FaUser, FaLock, FaSignInAlt, FaUserTie, FaEye, FaEyeSlash } from "react-icons/fa"

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  padding: 20px;
`

const LoginContainer = styled.div`
  max-width: 450px;
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

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RegisterLink = styled.div`
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

const LoginTabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
`

const LoginTab = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${(props) => (props.active ? "var(--primary)" : "transparent")};
  color: ${(props) => (props.active ? "white" : "var(--text)")};
  border: none;
  border-bottom: 3px solid ${(props) => (props.active ? "var(--primary)" : "transparent")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${(props) => (props.active ? "var(--primary)" : "rgba(8, 145, 178, 0.1)")};
  }
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  
  &:hover {
    color: var(--text);
  }
`

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [loginType, setLoginType] = useState("borrower") // "borrower" or "staff"
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!credentials.username || !credentials.password) {
      setError("Please fill in both fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const isStaff = loginType === "staff"
      const user = await login(credentials.username, credentials.password, isStaff)

      console.log("Login successful, redirecting based on role:", user.role)

      // Redirect based on user role
      if (user.role === "BORROWER") {
        navigate("/borrower/dashboard")
      } else {
        // For all staff roles (SYSTEM_ADMIN, MFI_ADMIN, LOAN_OFFICER, CREDIT_ANALYST)
        navigate("/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginWrapper>
      <LoginContainer>
        <Logo>
          Letsema<span>.</span>
        </Logo>
        <Title>Sign in to your account</Title>

        <LoginTabs>
          <LoginTab active={loginType === "borrower"} onClick={() => setLoginType("borrower")}>
            <FaUser /> Borrower
          </LoginTab>
          <LoginTab active={loginType === "staff"} onClick={() => setLoginType("staff")}>
            <FaUserTie /> Staff
          </LoginTab>
        </LoginTabs>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : `Sign In as ${loginType === "borrower" ? "Borrower" : "Staff"}`}
            {!loading && <FaSignInAlt />}
          </Button>
        </Form>

        <RegisterLink>
          {loginType === "borrower" ? (
            <>
              Don't have an account? <Link to="/register/borrower">Register as a borrower</Link>
            </>
          ) : (
            <>Staff registration is managed by administrators</>
          )}
        </RegisterLink>
      </LoginContainer>
    </LoginWrapper>
  )
}

export default Login
