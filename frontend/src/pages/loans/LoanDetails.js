"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import { FaArrowLeft, FaUser, FaMoneyBillWave, FaCalendarAlt, FaFileAlt, FaCalculator, FaBuilding } from "react-icons/fa"
import { loanApi } from "../../utils/api"
import { calculateLoanDetails } from "../../utils/loanCalculations"

const DetailsContainer = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
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

const InfoSection = styled.div`
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

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`

const ActionButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ApproveButton = styled(ActionButton)`
  background: var(--success);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background: var(--success-dark);
  }
`

const RejectButton = styled(ActionButton)`
  background: var(--danger);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background: var(--danger-dark);
  }
`

const LoanDetails = () => {
  const { loanId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loan, setLoan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchLoanDetails()
  }, [loanId])

  const fetchLoanDetails = async () => {
    try {
      console.log("Fetching loan details for ID:", loanId)
      const data = await loanApi.getLoanDetails(user.access, loanId)
      console.log("Received loan data:", data)
      setLoan(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching loan details:", err)
      if (err.message.includes("permission")) {
        setError("You do not have permission to view this loan")
      } else if (err.message.includes("not found")) {
        setError("Loan not found")
      } else {
        setError(err.message || "Failed to load loan details. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await loanApi.updateLoanStatus(user.access, loanId, newStatus)
      await fetchLoanDetails() // Refresh loan details
    } catch (err) {
      console.error("Error updating loan status:", err)
      setError("Failed to update loan status. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <DetailsContainer>
        <DetailsHeader>
          <BackButton onClick={() => navigate("/loans")}>
            <FaArrowLeft />
          </BackButton>
          <DetailsTitle>Loan Details</DetailsTitle>
        </DetailsHeader>
        <p>Loading loan details...</p>
      </DetailsContainer>
    )
  }

  if (error) {
    return (
      <DetailsContainer>
        <DetailsHeader>
          <BackButton onClick={() => navigate("/loans")}>
            <FaArrowLeft />
          </BackButton>
          <DetailsTitle>Loan Details</DetailsTitle>
        </DetailsHeader>
        <ErrorMessage>{error}</ErrorMessage>
      </DetailsContainer>
    )
  }

  if (!loan) {
    return (
      <DetailsContainer>
        <DetailsHeader>
          <BackButton onClick={() => navigate("/loans")}>
            <FaArrowLeft />
          </BackButton>
          <DetailsTitle>Loan Details</DetailsTitle>
        </DetailsHeader>
        <ErrorMessage>Loan not found</ErrorMessage>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <DetailsHeader>
        <BackButton onClick={() => navigate("/loans")}>
          <FaArrowLeft />
        </BackButton>
        <DetailsTitle>Loan Details</DetailsTitle>
        {loan && (
          <LoanStatusBadge status={loan.status}>
            {loan.status}
          </LoanStatusBadge>
        )}
      </DetailsHeader>

      {loan && (
        <>
          <InfoSection>
            <SectionTitle>
              <FaUser /> Borrower Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Full Name</InfoLabel>
                <InfoValue>{loan.borrower_details.full_name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>National ID</InfoLabel>
                <InfoValue>{loan.borrower_details.national_id}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{loan.borrower_details.phone}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{loan.borrower_details.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Address</InfoLabel>
                <InfoValue>
                  {loan.borrower_details.address.street}, {loan.borrower_details.address.city}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          <InfoSection>
            <SectionTitle>
              <FaMoneyBillWave /> Loan Information
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
                <InfoValue>{new Date(loan.issued_date).toLocaleDateString()}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Due Date</InfoLabel>
                <InfoValue>{new Date(loan.due_date).toLocaleDateString()}</InfoValue>
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
          </InfoSection>

          {loan.additional_notes && (
            <InfoSection>
              <SectionTitle>
                <FaFileAlt /> Additional Notes
              </SectionTitle>
              <p>{loan.additional_notes}</p>
            </InfoSection>
          )}

          {loan.status === "PENDING" && (
            <ActionButtons>
              <ApproveButton
                onClick={() => handleStatusUpdate("APPROVED")}
                disabled={updating}
              >
                Approve Loan
              </ApproveButton>
              <RejectButton
                onClick={() => handleStatusUpdate("REJECTED")}
                disabled={updating}
              >
                Reject Loan
              </RejectButton>
            </ActionButtons>
          )}
        </>
      )}
    </DetailsContainer>
  )
}

export default LoanDetails