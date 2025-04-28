"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import { FaCheck, FaTimes, FaClock, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa"

const PageContainer = styled.div`
  padding: 90px 30px 30px;
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

const RepaymentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`

const RepaymentCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`

const RepaymentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`

const RepaymentTitle = styled.h3`
  font-size: 18px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "PAID":
        return "rgba(16, 185, 129, 0.1)"
      case "PENDING":
        return "rgba(245, 158, 11, 0.1)"
      case "OVERDUE":
        return "rgba(239, 68, 68, 0.1)"
      case "UPCOMING":
        return "rgba(59, 130, 246, 0.1)"
      case "VERIFIED":
        return "rgba(16, 185, 129, 0.1)"
      default:
        return "rgba(100, 116, 139, 0.1)"
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "PAID":
        return "var(--success)"
      case "PENDING":
        return "var(--warning)"
      case "OVERDUE":
        return "var(--danger)"
      case "UPCOMING":
        return "var(--primary)"
      case "VERIFIED":
        return "var(--success)"
      default:
        return "var(--text-light)"
    }
  }};
`

const RepaymentInfo = styled.div`
  margin-bottom: 15px;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
`

const InfoLabel = styled.span`
  color: var(--text-light);
`

const InfoValue = styled.span`
  font-weight: 500;
`

const LoanInfo = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
`

const RemainingAmount = styled.div`
  margin-top: 10px;
  padding: 8px;
  background: var(--primary-light);
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`

const ErrorMessage = styled.div`
  color: var(--danger);
  padding: 15px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
`

const BorrowerRepayments = () => {
  const { api } = useAuth()
  const [repayments, setRepayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRepayments()
  }, [])

  const fetchRepayments = async () => {
    try {
      const data = await api.get(`${process.env.REACT_APP_API_URL.replace('/users', '/loans')}/repayments/borrower/`)
      setRepayments(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching repayments:", err)
      setError("Failed to load repayments. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <FaCheck />
      case "PENDING":
        return <FaClock />
      case "OVERDUE":
        return <FaTimes />
      case "UPCOMING":
        return <FaCalendarAlt />
      case "VERIFIED":
        return <FaCheck />
      default:
        return null
    }
  }

  const getDisplayStatus = (repayment) => {
    // If the repayment has a status, use it
    if (repayment.status) {
      return repayment.status
    }
    
    // Otherwise, determine status based on dates
    const now = new Date()
    const dueDate = new Date(repayment.due_date)
    
    if (dueDate < now) {
      return "OVERDUE"
    } else if ((dueDate - now) / (1000 * 60 * 60 * 24) <= 7) {
      return "UPCOMING"
    } else {
      return "PENDING"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <PageContainer>
        <PageTitle>My Repayments</PageTitle>
        <p>Loading repayments...</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>My Repayments</PageTitle>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <RepaymentsGrid>
        {repayments.map((repayment) => (
          <RepaymentCard key={repayment.repayment_id}>
            <RepaymentHeader>
              <RepaymentTitle>
                <FaMoneyBillWave />
                Repayment #{repayment.repayment_id.slice(0, 8)}
              </RepaymentTitle>
              <StatusBadge status={getDisplayStatus(repayment)}>
                {getStatusIcon(getDisplayStatus(repayment))} {getDisplayStatus(repayment)}
              </StatusBadge>
            </RepaymentHeader>

            <RepaymentInfo>
              <InfoRow>
                <InfoLabel>Loan ID</InfoLabel>
                <InfoValue>{repayment.loan_details.loan_id}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Amount</InfoLabel>
                <InfoValue>M{repayment.amount}</InfoValue>
              </InfoRow>
              
              {repayment.payment_date && (
                <InfoRow>
                  <InfoLabel>Payment Date</InfoLabel>
                  <InfoValue>{formatDate(repayment.payment_date)}</InfoValue>
                </InfoRow>
              )}
              {repayment.payment_method && (
                <InfoRow>
                  <InfoLabel>Payment Method</InfoLabel>
                  <InfoValue>{repayment.payment_method}</InfoValue>
                </InfoRow>
              )}
            </RepaymentInfo>

            <LoanInfo>
              <InfoRow>
                <InfoLabel>Loan Amount</InfoLabel>
                <InfoValue>M{repayment.loan_details.amount}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Loan Term</InfoLabel>
                <InfoValue>{repayment.loan_details.term} months</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Loan Status</InfoLabel>
                <InfoValue>{repayment.loan_details.status}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Loan Due Date</InfoLabel>
                <InfoValue>{formatDate(repayment.loan_details.due_date)}</InfoValue>
              </InfoRow>
              {repayment.remaining_amount !== null && (
                <RemainingAmount>
                  Remaining Amount: M{repayment.remaining_amount}
                </RemainingAmount>
              )}
            </LoanInfo>
          </RepaymentCard>
        ))}
      </RepaymentsGrid>
    </PageContainer>
  )
}

export default BorrowerRepayments 