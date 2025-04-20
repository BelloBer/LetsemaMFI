"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaHistory,
  FaExclamationTriangle,
} from "react-icons/fa"

const DetailsContainer = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 90px auto 30px;
`

const DetailsHeader = styled.div`
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

const DetailsTitle = styled.h2`
  font-size: 24px;
  margin: 0;
`

const LoanStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-left: auto;
  background: ${(props) => {
    switch (props.status) {
      case "APPROVED":
        return "rgba(16, 185, 129, 0.1)"
      case "PENDING":
        return "rgba(245, 158, 11, 0.1)"
      case "REJECTED":
        return "rgba(239, 68, 68, 0.1)"
      case "REPAID":
        return "rgba(59, 130, 246, 0.1)"
      default:
        return "rgba(100, 116, 139, 0.1)"
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "APPROVED":
        return "var(--success)"
      case "PENDING":
        return "var(--warning)"
      case "REJECTED":
        return "var(--danger)"
      case "REPAID":
        return "var(--primary)"
      default:
        return "var(--text-light)"
    }
  }};
`

const LoanInfoSection = styled.div`
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoLabel = styled.div`
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 5px;
`

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
`

const PaymentScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 15px;
  background: var(--background);
  color: var(--text);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
  
  &:first-child {
    border-top-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
  }
`

const TableRow = styled.tr`
  &:hover {
    background: var(--background);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }
`

const TableCell = styled.td`
  padding: 12px 15px;
  font-size: 14px;
`

const PaymentStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "PAID":
        return "rgba(16, 185, 129, 0.1)"
      case "UPCOMING":
        return "rgba(59, 130, 246, 0.1)"
      case "OVERDUE":
        return "rgba(239, 68, 68, 0.1)"
      default:
        return "rgba(100, 116, 139, 0.1)"
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "PAID":
        return "var(--success)"
      case "UPCOMING":
        return "var(--primary)"
      case "OVERDUE":
        return "var(--danger)"
      default:
        return "var(--text-light)"
    }
  }};
`

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;

  &:hover {
    background: var(--primary-dark);
  }
`

const ErrorMessage = styled.div`
  color: var(--danger);
  padding: 15px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
`

const LoanDetails = () => {
  const { loanId } = useParams()
  const navigate = useNavigate()
  const { api } = useAuth()
  const [loan, setLoan] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!api) return

      setLoading(true)
      try {
        // Fetch loan details
        const loanData = await api.get(`${process.env.REACT_APP_API_URL}/api/loans/${loanId}/`)
        setLoan(loanData)

        // Fetch payment schedule
        const paymentsData = await api.get(`${process.env.REACT_APP_API_URL}/api/loans/${loanId}/payments/`)
        setPayments(paymentsData)
      } catch (err) {
        console.error("Error fetching loan details:", err)
        setError("Failed to load loan details. Please try again later.")

        // For demo purposes, use mock data
        const mockLoan = {
          loan_id: loanId || "550e8400-e29b-41d4-a716-446655440000",
          amount: "5000.00",
          status: "APPROVED",
          issued_date: "2023-05-15T10:30:00Z",
          due_date: "2024-05-15T10:30:00Z",
          term: 12,
          interest: "12.000",
          purpose: "business",
          total_amount: "5600.00",
          monthly_payment: "466.67",
        }

        setLoan(mockLoan)

        // Generate mock payment schedule
        const mockPayments = []
        const startDate = new Date("2023-05-15")

        for (let i = 0; i < 12; i++) {
          const paymentDate = new Date(startDate)
          paymentDate.setMonth(startDate.getMonth() + i)

          let status = "UPCOMING"
          if (i < 3) {
            status = "PAID"
          } else if (i === 3) {
            status = "OVERDUE"
          }

          mockPayments.push({
            payment_id: i + 1,
            amount: "466.67",
            due_date: paymentDate.toISOString(),
            status: status,
            payment_date: status === "PAID" ? paymentDate.toISOString() : null,
          })
        }

        setPayments(mockPayments)
      } finally {
        setLoading(false)
      }
    }

    fetchLoanDetails()
  }, [api, loanId])

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <FaCheckCircle />
      case "PENDING":
        return <FaClock />
      case "REJECTED":
        return <FaTimesCircle />
      case "REPAID":
        return <FaCheckCircle />
      case "PAID":
        return <FaCheckCircle />
      case "UPCOMING":
        return <FaCalendarAlt />
      case "OVERDUE":
        return <FaExclamationTriangle />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <DetailsContainer>
        <DetailsHeader>
          <BackButton onClick={() => navigate("/borrower/dashboard")}>
            <FaArrowLeft />
          </BackButton>
          <DetailsTitle>Loan Details</DetailsTitle>
        </DetailsHeader>
        <p>Loading loan details...</p>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <DetailsHeader>
        <BackButton onClick={() => navigate("/borrower/dashboard")}>
          <FaArrowLeft />
        </BackButton>
        <DetailsTitle>Loan Details</DetailsTitle>
        {loan && (
          <LoanStatusBadge status={loan.status}>
            {getStatusIcon(loan.status)} {loan.status}
          </LoanStatusBadge>
        )}
      </DetailsHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loan && (
        <>
          <LoanInfoSection>
            <SectionTitle>
              <FaFileAlt /> Loan Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Loan ID</InfoLabel>
                <InfoValue>{loan.loan_id.substring(0, 8)}...</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Principal Amount</InfoLabel>
                <InfoValue>M{Number.parseFloat(loan.amount).toFixed(2)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Term</InfoLabel>
                <InfoValue>{loan.term} months</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Interest Rate</InfoLabel>
                <InfoValue>{Number.parseFloat(loan.interest).toFixed(1)}%</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Issue Date</InfoLabel>
                <InfoValue>{formatDate(loan.issued_date)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Due Date</InfoLabel>
                <InfoValue>{formatDate(loan.due_date)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Purpose</InfoLabel>
                <InfoValue style={{ textTransform: "capitalize" }}>{loan.purpose}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Monthly Payment</InfoLabel>
                <InfoValue>
                  M{loan.monthly_payment || (Number.parseFloat(loan.total_amount) / loan.term).toFixed(2)}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Total to Repay</InfoLabel>
                <InfoValue>
                  M
                  {loan.total_amount ||
                    (Number.parseFloat(loan.amount) * (1 + Number.parseFloat(loan.interest) / 100)).toFixed(2)}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </LoanInfoSection>

          <LoanInfoSection>
            <SectionTitle>
              <FaHistory /> Payment Schedule
            </SectionTitle>

            {payments.length > 0 ? (
              <PaymentScheduleTable>
                <thead>
                  <tr>
                    <TableHeader>#</TableHeader>
                    <TableHeader>Due Date</TableHeader>
                    <TableHeader>Amount</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Payment Date</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <TableRow key={payment.payment_id}>
                      <TableCell>{payment.payment_id}</TableCell>
                      <TableCell>{formatDate(payment.due_date)}</TableCell>
                      <TableCell>M{Number.parseFloat(payment.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={payment.status}>
                          {getStatusIcon(payment.status)} {payment.status}
                        </PaymentStatusBadge>
                      </TableCell>
                      <TableCell>{payment.payment_date ? formatDate(payment.payment_date) : "-"}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </PaymentScheduleTable>
            ) : (
              <p>No payment schedule available.</p>
            )}
          </LoanInfoSection>

          {loan.status === "APPROVED" && (
            <ActionButton>
              <FaMoneyBillWave /> Make a Payment
            </ActionButton>
          )}
        </>
      )}
    </DetailsContainer>
  )
}

export default LoanDetails
