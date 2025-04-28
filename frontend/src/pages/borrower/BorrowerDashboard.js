"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import { FaPlus, FaFileAlt, FaCheck, FaTimes, FaClock, FaMoneyBillWave } from "react-icons/fa"
import { loanApi } from "../../utils/api"

const DashboardContainer = styled.div`
  padding: 90px 30px 30px;
  transition: margin-left 0.3s ease-in-out;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
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

const LoansSection = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: var(--text);
`

const LoansTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 15px;
  background: var(--background);
  color: var(--text);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
`

const TableRow = styled.tr`
  &:hover {
    background: var(--background);
    cursor: pointer;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }
`

const TableCell = styled.td`
  padding: 12px 15px;
  font-size: 14px;
`

const LoanID = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const LoanIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`

const LoanIDText = styled.div`
  font-weight: 500;
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
      case "APPROVED":
        return "rgba(16, 185, 129, 0.1)"
      case "PENDING":
        return "rgba(245, 158, 11, 0.1)"
      case "REJECTED":
        return "rgba(239, 68, 68, 0.1)"
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
      default:
        return "var(--text-light)"
    }
  }};
`

const ErrorMessage = styled.div`
  color: var(--danger);
  padding: 15px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--primary);
  color: white;
  border: none;

  &:hover {
    opacity: 0.9;
  }
`

const BorrowerDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const data = await loanApi.getBorrowerLoans(user.access)
      setLoans(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching loans:", err)
      setError("Failed to load loans. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleLoanClick = (loanId) => {
    navigate(`/borrower/loans/${loanId}`)
  }

  const handleMakePayment = (loanId) => {
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
      default:
        return null
    }
  }

  return (
    <DashboardContainer>
      <PageHeader>
        <PageTitle>My Loans</PageTitle>
        <ActionButtons>
          <PrimaryButton onClick={() => navigate("/borrower/loans/apply")}>
            <FaPlus />
            Apply for Loan
          </PrimaryButton>
        </ActionButtons>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <LoansSection>
        <SectionTitle>Recent Loans</SectionTitle>
        {loading ? (
          <p>Loading loans...</p>
        ) : loans.length > 0 ? (
          <LoansTable>
            <thead>
              <tr>
                <TableHeader>Loan ID</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Term</TableHeader>
                <TableHeader>MFI</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <TableRow key={loan.loan_id}>
                  <TableCell>
                    <LoanID onClick={() => handleLoanClick(loan.loan_id)}>
                      <LoanIcon>
                        <FaFileAlt />
                      </LoanIcon>
                      <LoanIDText>{loan.loan_id}</LoanIDText>
                    </LoanID>
                  </TableCell>
                  <TableCell>M{loan.amount}</TableCell>
                  <TableCell>{loan.term} months</TableCell>
                  <TableCell>{loan.mfi_details.name}</TableCell>
                  <TableCell>{new Date(loan.issued_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={loan.status}>
                      {getStatusIcon(loan.status)} {loan.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {loan.status === "APPROVED" && (
                      <ActionButton onClick={() => handleMakePayment(loan.loan_id)}>
                        <FaMoneyBillWave /> Make Payment
                      </ActionButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </LoansTable>
        ) : (
          <p>No loans found. Apply for a loan to get started.</p>
        )}
      </LoansSection>
    </DashboardContainer>
  )
}

export default BorrowerDashboard
