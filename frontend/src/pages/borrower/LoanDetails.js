"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import { FaArrowLeft, FaMoneyBillWave, FaCalendarAlt, FaFileAlt, FaCalculator, FaCheck, FaTimes, FaClock } from "react-icons/fa"
import { loanApi } from "../../utils/api"
import { calculateLoanDetails } from "../../utils/loanCalculations"

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

const ErrorMessage = styled.div`
  color: var(--danger);
  padding: 15px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
`

const CalculationSection = styled.div`
  background: var(--background);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`

const CalculationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
`

const CalculationItem = styled.div`
  display: flex;
  flex-direction: column;
`

const CalculationLabel = styled.div`
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 5px;
`

const CalculationValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
`

const PaymentScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 15px;
  background: var(--card-bg);
  color: var(--text);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
`

const TableRow = styled.tr`
  &:hover {
    background: var(--background);
  }
`

const TableCell = styled.td`
  padding: 12px 15px;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
`

const ActionButton = styled.button`
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
  margin-top: 20px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const LoanDetails = () => {
  const { loanId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loan, setLoan] = useState(null)
  const [loanCalculations, setLoanCalculations] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const data = await loanApi.getLoanDetails(user.access, loanId)
        setLoan(data)
        
        // Calculate loan details using simple interest
        const calculations = calculateLoanDetails(
          Number(data.amount),
          Number(data.interest),
          Number(data.term)
        )
        setLoanCalculations(calculations)
        
        setError(null)
      } catch (err) {
        console.error("Error fetching loan details:", err)
        setError("Failed to load loan details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchLoanDetails()
  }, [loanId, user.access])

  const handleMakePayment = () => {
    navigate(`/borrower/make-payment?loanId=${loanId}`)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <FaCheck />
      case "PENDING":
        return <FaClock />
      case "REJECTED":
        return <FaTimes />
      case "REPAID":
        return <FaCheck />
      default:
        return null
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
                <InfoValue>{loan.loan_id}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Amount</InfoLabel>
                <InfoValue>M{loan.amount}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Term</InfoLabel>
                <InfoValue>{loan.term} months</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Interest Rate</InfoLabel>
                <InfoValue>{loan.interest}%</InfoValue>
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
                <InfoLabel>MFI</InfoLabel>
                <InfoValue>{loan.mfi_details.name}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </LoanInfoSection>

          {loanCalculations && (
            <LoanInfoSection>
              <SectionTitle>
                <FaCalculator /> Loan Calculations
              </SectionTitle>
              <CalculationGrid>
                <CalculationItem>
                  <CalculationLabel>Monthly Payment</CalculationLabel>
                  <CalculationValue>M{loanCalculations.monthlyPayment}</CalculationValue>
                </CalculationItem>
                <CalculationItem>
                  <CalculationLabel>Total Payment</CalculationLabel>
                  <CalculationValue>M{loanCalculations.totalPayment}</CalculationValue>
                </CalculationItem>
                <CalculationItem>
                  <CalculationLabel>Total Interest</CalculationLabel>
                  <CalculationValue>M{loanCalculations.totalInterest}</CalculationValue>
                </CalculationItem>
              </CalculationGrid>

              <SectionTitle style={{ marginTop: "20px" }}>Payment Schedule</SectionTitle>
              <PaymentScheduleTable>
                <thead>
                  <tr>
                    <TableHeader>Payment #</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Payment Amount</TableHeader>
                    <TableHeader>Principal</TableHeader>
                    <TableHeader>Interest</TableHeader>
                    <TableHeader>Remaining Balance</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {loanCalculations.paymentSchedule.map((payment) => (
                    <TableRow key={payment.paymentNumber}>
                      <TableCell>{payment.paymentNumber}</TableCell>
                      <TableCell>{payment.paymentDate.toLocaleDateString()}</TableCell>
                      <TableCell>M{payment.paymentAmount.toFixed(2)}</TableCell>
                      <TableCell>M{payment.principalPayment.toFixed(2)}</TableCell>
                      <TableCell>M{payment.interestPayment.toFixed(2)}</TableCell>
                      <TableCell>M{payment.remainingBalance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </PaymentScheduleTable>
            </LoanInfoSection>
          )}

          {loan.additional_notes && (
            <LoanInfoSection>
              <SectionTitle>
                <FaFileAlt /> Additional Notes
              </SectionTitle>
              <p>{loan.additional_notes}</p>
            </LoanInfoSection>
          )}

          {loan.status === "APPROVED" && (
            <ActionButton onClick={handleMakePayment}>
              <FaMoneyBillWave /> Make Payment
            </ActionButton>
          )}
        </>
      )}
    </DetailsContainer>
  )
}

export default LoanDetails
