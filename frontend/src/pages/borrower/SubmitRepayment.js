"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import { FaMoneyBillWave, FaCalendarAlt, FaCreditCard, FaFileAlt } from "react-icons/fa"

const PageContainer = styled.div`
  padding: 90px 30px 30px;
  max-width: 800px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const PageTitle = styled.h1`
  font-size: 28px;
  margin: 0;
`

const FormContainer = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const FormGroup = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-light);
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
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
  width: 100%;
  padding: 10px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
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

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
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

const LoanInfo = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: var(--background);
  border-radius: 8px;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
`

const InfoLabel = styled.span`
  color: var(--text-light);
`

const InfoValue = styled.span`
  font-weight: 500;
`

const RemainingAmount = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: var(--primary-light);
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`

const SubmitRepayment = () => {
  const { api } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loan, setLoan] = useState(null)
  const [remainingAmount, setRemainingAmount] = useState(null)
  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "",
    payment_reference: "",
    notes: ""
  })

  useEffect(() => {
    // Get loan details from URL params
    const loanId = new URLSearchParams(location.search).get('loanId')
    if (loanId) {
      fetchLoanDetails(loanId)
    }
  }, [location.search])

  const fetchLoanDetails = async (loanId) => {
    try {
      const data = await api.get(`${process.env.REACT_APP_API_URL.replace('/users', '/loans')}/${loanId}/`)
      setLoan(data)
      
      // Calculate remaining amount
      const totalPaid = data.repayments
        ?.filter(repayment => ['PAID', 'VERIFIED'].includes(repayment.status))
        ?.reduce((sum, repayment) => sum + Number(repayment.amount), 0) || 0
      
      const remaining = Number(data.amount) - totalPaid
      setRemainingAmount(remaining)
      
      // Set max amount in form
      setFormData(prev => ({
        ...prev,
        amount: remaining.toString()
      }))
    } catch (err) {
      console.error("Error fetching loan details:", err)
      setError("Failed to load loan details. Please try again.")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post(
        `${process.env.REACT_APP_API_URL.replace('/users', '/loans')}/repayments/create/`,
        {
          ...formData,
          loan: loan.loan_id
        }
      )

      setSuccess("Payment submitted successfully! Waiting for verification.")
      setTimeout(() => {
        navigate('/borrower/repayments')
      }, 2000)
    } catch (err) {
      console.error("Error submitting payment:", err)
      setError(err.message || "Failed to submit payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!loan) {
    return (
      <PageContainer>
        <PageTitle>Submit Payment</PageTitle>
        <ErrorMessage>No loan selected. Please select a loan to make a payment.</ErrorMessage>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Submit Payment</PageTitle>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <LoanInfo>
        <InfoRow>
          <InfoLabel>Loan ID</InfoLabel>
          <InfoValue>{loan.loan_id}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Amount</InfoLabel>
          <InfoValue>M{loan.amount}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Term</InfoLabel>
          <InfoValue>{loan.term} months</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Interest Rate</InfoLabel>
          <InfoValue>{loan.interest}%</InfoValue>
        </InfoRow>
        {remainingAmount !== null && (
          <RemainingAmount>
            Remaining Amount: M{remainingAmount.toFixed(2)}
          </RemainingAmount>
        )}
      </LoanInfo>

      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <FaMoneyBillWave style={{ marginRight: "5px" }} />
              Amount
            </Label>
            <Input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter payment amount"
              required
              min="0"
              max={remainingAmount}
              step="0.01"
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <FaCreditCard style={{ marginRight: "5px" }} />
              Payment Method
            </Label>
            <Select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              required
            >
              <option value="">Select payment method</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CHEQUE">Cheque</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <FaFileAlt style={{ marginRight: "5px" }} />
              Payment Reference
            </Label>
            <Input
              type="text"
              name="payment_reference"
              value={formData.payment_reference}
              onChange={handleChange}
              placeholder="Enter payment reference number"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <FaFileAlt style={{ marginRight: "5px" }} />
              Notes
            </Label>
            <TextArea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes about the payment"
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit Payment"}
          </SubmitButton>
        </form>
      </FormContainer>
    </PageContainer>
  )
}

export default SubmitRepayment 