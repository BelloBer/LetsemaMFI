"use client"

import { useState, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { FaArrowLeft, FaCheck, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle, FaCalculator } from "react-icons/fa"

const ApplicationContainer = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 90px auto 30px;
`

const ApplicationHeader = styled.div`
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

const ApplicationTitle = styled.h2`
  font-size: 24px;
  margin: 0;
`

const FormSection = styled.div`
  margin-bottom: 30px;
`

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
    margin-left: 15px;
  }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`

const Input = styled.input`
  padding: 12px 15px;
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

const Select = styled.select`
  padding: 12px 15px;
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

const Textarea = styled.textarea`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text);
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-light);
    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`

const PrimaryButton = styled(Button)`
  background: var(--primary);
  color: white;
  border: none;
`

const SecondaryButton = styled(Button)`
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  
  &:hover {
    background: var(--background);
  }
`

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 15px;
    right: -50%;
    width: 100%;
    height: 2px;
    background: ${(props) => (props.active || props.completed ? "var(--primary)" : "var(--border)")};
    z-index: 0;
  }
`

const StepCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) => (props.completed ? "var(--success)" : props.active ? "var(--primary)" : "var(--background)")};
  border: 2px solid ${(props) => (props.completed ? "var(--success)" : props.active ? "var(--primary)" : "var(--border)")};
  color: ${(props) => (props.completed || props.active ? "white" : "var(--text-light)")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  z-index: 1;
`

const StepLabel = styled.div`
  font-size: 12px;
  color: ${(props) => (props.active ? "var(--primary)" : "var(--text-light)")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
`

const ErrorMessage = styled.div`
  color: var(--danger);
  font-size: 14px;
  margin-top: 5px;
`

const CalculationResult = styled.div`
  background: var(--background);
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
`

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 10px;
    border-top: 1px solid var(--border);
    font-weight: 600;
  }
`

const InfoTooltip = styled.span`
  cursor: help;
  color: var(--primary);
`

const LoanApplicationForm = () => {
  const navigate = useNavigate()
  const { api } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    amount: "",
    term: "12",
    purpose: "",
    employment_status: "",
    monthly_income: "",
    additional_info: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculationVisible, setCalculationVisible] = useState(false)

  const totalSteps = 3

  const validateStep = (step) => {
    const stepErrors = {}
    let isValid = true

    if (step === 1) {
      if (!formData.amount || isNaN(formData.amount) || Number.parseFloat(formData.amount) <= 0) {
        stepErrors.amount = "Please enter a valid loan amount"
        isValid = false
      }
      if (!formData.term) {
        stepErrors.term = "Please select a loan term"
        isValid = false
      }
      if (!formData.purpose) {
        stepErrors.purpose = "Please select a loan purpose"
        isValid = false
      }
    } else if (step === 2) {
      if (!formData.employment_status) {
        stepErrors.employment_status = "Please select your employment status"
        isValid = false
      }
      if (
        !formData.monthly_income ||
        isNaN(formData.monthly_income) ||
        Number.parseFloat(formData.monthly_income) <= 0
      ) {
        stepErrors.monthly_income = "Please enter a valid monthly income"
        isValid = false
      }
    }

    setErrors(stepErrors)
    return isValid
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      // Submit loan application to API
      await api.post(`${process.env.REACT_APP_API_URL}/api/loans/apply/`, formData)

      // Navigate to success page or dashboard
      navigate("/borrower/dashboard", {
        state: {
          success: true,
          message: "Your loan application has been submitted successfully!",
        },
      })
    } catch (error) {
      console.error("Error submitting loan application:", error)
      setErrors({
        submit: "Failed to submit loan application. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Use useCallback to memoize the calculation function
  const calculateLoan = useCallback(() => {
    const amount = Number.parseFloat(formData.amount)
    const term = Number.parseInt(formData.term)
    const interestRate = 0.12 // 12% annual interest rate

    if (isNaN(amount) || amount <= 0 || isNaN(term) || term <= 0) {
      return null
    }

    // Simple interest calculation
    const totalInterest = amount * interestRate * (term / 12)
    const totalAmount = amount + totalInterest
    const monthlyPayment = totalAmount / term

    return {
      principal: amount.toFixed(2),
      interestRate: (interestRate * 100).toFixed(1),
      totalInterest: totalInterest.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(2),
    }
  }, [formData.amount, formData.term])

  const toggleCalculation = () => {
    setCalculationVisible(!calculationVisible)
  }

  const loanCalculation = calculateLoan()

  return (
    <ApplicationContainer>
      <ApplicationHeader>
        <BackButton onClick={() => navigate("/borrower/dashboard")}>
          <FaArrowLeft />
        </BackButton>
        <ApplicationTitle>New Loan Application</ApplicationTitle>
      </ApplicationHeader>

      <StepIndicator>
        <Step active={currentStep === 1} completed={currentStep > 1}>
          <StepCircle active={currentStep === 1} completed={currentStep > 1}>
            {currentStep > 1 ? <FaCheck /> : 1}
          </StepCircle>
          <StepLabel active={currentStep === 1}>Loan Details</StepLabel>
        </Step>
        <Step active={currentStep === 2} completed={currentStep > 2}>
          <StepCircle active={currentStep === 2} completed={currentStep > 2}>
            {currentStep > 2 ? <FaCheck /> : 2}
          </StepCircle>
          <StepLabel active={currentStep === 2}>Financial Info</StepLabel>
        </Step>
        <Step active={currentStep === 3}>
          <StepCircle active={currentStep === 3}>3</StepCircle>
          <StepLabel active={currentStep === 3}>Review & Submit</StepLabel>
        </Step>
      </StepIndicator>

      {currentStep === 1 && (
        <FormSection>
          <SectionTitle>
            <FaMoneyBillWave /> Loan Details
          </SectionTitle>
          <FormRow>
            <FormGroup>
              <Label>
                <FaMoneyBillWave /> Loan Amount (M)
              </Label>
              <Input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
              />
              {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>
                <FaCalendarAlt /> Loan Term
              </Label>
              <Select name="term" value={formData.term} onChange={handleChange}>
                <option value="">Select loan term</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </Select>
              {errors.term && <ErrorMessage>{errors.term}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>
                <FaInfoCircle /> Purpose of Loan
              </Label>
              <Select name="purpose" value={formData.purpose} onChange={handleChange}>
                <option value="">Select purpose</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="medical">Medical</option>
                <option value="other">Other</option>
              </Select>
              {errors.purpose && <ErrorMessage>{errors.purpose}</ErrorMessage>}
            </FormGroup>
          </FormRow>

          <Button
            type="button"
            onClick={toggleCalculation}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "transparent",
              border: "none",
              color: "var(--primary)",
              padding: "10px 0",
              cursor: "pointer",
            }}
          >
            <FaCalculator /> {calculationVisible ? "Hide" : "Show"} Loan Calculation
          </Button>

          {calculationVisible && loanCalculation && (
            <CalculationResult>
              <ResultRow>
                <span>Principal Amount:</span>
                <span>M{loanCalculation.principal}</span>
              </ResultRow>
              <ResultRow>
                <span>Interest Rate:</span>
                <span>{loanCalculation.interestRate}%</span>
              </ResultRow>
              <ResultRow>
                <span>Total Interest:</span>
                <span>M{loanCalculation.totalInterest}</span>
              </ResultRow>
              <ResultRow>
                <span>Monthly Payment:</span>
                <span>M{loanCalculation.monthlyPayment}</span>
              </ResultRow>
              <ResultRow>
                <span>Total Amount to Repay:</span>
                <span>M{loanCalculation.totalAmount}</span>
              </ResultRow>
            </CalculationResult>
          )}
          {errors.calculation && <ErrorMessage>{errors.calculation}</ErrorMessage>}
        </FormSection>
      )}

      {currentStep === 2 && (
        <FormSection>
          <SectionTitle>
            <FaMoneyBillWave /> Financial Information
          </SectionTitle>
          <FormRow>
            <FormGroup>
              <Label>Employment Status</Label>
              <Select name="employment_status" value={formData.employment_status} onChange={handleChange}>
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="self_employed">Self-Employed</option>
                <option value="business_owner">Business Owner</option>
                <option value="unemployed">Unemployed</option>
                <option value="retired">Retired</option>
              </Select>
              {errors.employment_status && <ErrorMessage>{errors.employment_status}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>
                <FaMoneyBillWave /> Monthly Income (M)
              </Label>
              <Input
                type="number"
                name="monthly_income"
                placeholder="Enter monthly income"
                value={formData.monthly_income}
                onChange={handleChange}
              />
              {errors.monthly_income && <ErrorMessage>{errors.monthly_income}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Additional Information (Optional)</Label>
              <Textarea
                name="additional_info"
                placeholder="Enter any additional information that might support your application"
                value={formData.additional_info}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>
        </FormSection>
      )}

      {currentStep === 3 && (
        <FormSection>
          <SectionTitle>Review & Submit</SectionTitle>
          <div className="review-summary">
            <p>Please review all information before submitting the loan application.</p>
            <div
              className="card"
              style={{ marginTop: "20px", padding: "20px", background: "var(--background)", borderRadius: "8px" }}
            >
              <h4>Loan Details</h4>
              <p>Amount: M{formData.amount}</p>
              <p>Term: {formData.term} months</p>
              <p>Purpose: {formData.purpose}</p>

              <h4 style={{ marginTop: "20px" }}>Financial Information</h4>
              <p>Employment Status: {formData.employment_status}</p>
              <p>Monthly Income: M{formData.monthly_income}</p>
              {formData.additional_info && (
                <>
                  <h4 style={{ marginTop: "20px" }}>Additional Information</h4>
                  <p>{formData.additional_info}</p>
                </>
              )}

              {loanCalculation && (
                <>
                  <h4 style={{ marginTop: "20px" }}>Loan Calculation</h4>
                  <p>Monthly Payment: M{loanCalculation.monthlyPayment}</p>
                  <p>Total to Repay: M{loanCalculation.totalAmount}</p>
                </>
              )}
            </div>

            {errors.submit && <ErrorMessage style={{ marginTop: "20px" }}>{errors.submit}</ErrorMessage>}
          </div>
        </FormSection>
      )}

      <ButtonGroup>
        {currentStep > 1 && <SecondaryButton onClick={prevStep}>Back</SecondaryButton>}
        {currentStep < totalSteps ? (
          <PrimaryButton onClick={nextStep} style={{ marginLeft: "auto" }}>
            Continue
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={handleSubmit} style={{ marginLeft: "auto" }} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </PrimaryButton>
        )}
      </ButtonGroup>
    </ApplicationContainer>
  )
}

export default LoanApplicationForm
