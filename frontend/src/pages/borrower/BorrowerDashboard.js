"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartLine,
  FaExclamationTriangle,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa"
import { Link, useLocation } from "react-router-dom"
import SuccessNotification from "../../components/SuccessNotification"

const DashboardContainer = styled.div`
  padding: 90px 30px 30px;
  max-width: 1200px;
  margin: 0 auto;
`

const WelcomeSection = styled.div`
  margin-bottom: 30px;
`

const WelcomeTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
`

const WelcomeSubtitle = styled.p`
  color: var(--text-light);
  font-size: 16px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`

const StatCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`

const StatTitle = styled.h3`
  font-size: 16px;
  color: var(--text-light);
  margin: 0;
`

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => props.bgColor || "var(--primary-light)"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
`

const StatFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
`

const StatPeriod = styled.div`
  color: var(--text-light);
`

const SectionTitle = styled.h2`
  font-size: 20px;
  margin: 30px 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const LoanTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid var(--border);
  color: var(--text-light);
  font-weight: 600;
  font-size: 14px;
`

const TableRow = styled.tr`
  &:hover {
    background: var(--background);
  }
`

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
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

const PaymentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }
`

const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const PaymentName = styled.div`
  font-weight: 500;
  font-size: 14px;
`

const PaymentDate = styled.div`
  font-size: 12px;
  color: var(--text-light);
`

const PaymentAmount = styled.div`
  font-weight: 600;
  font-size: 14px;
`

const ActionButton = styled(Link)`
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
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 20px;

  &:hover {
    background: var(--primary-dark);
    color: white;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: var(--text-light);
`

const BorrowerDashboard = () => {
  const { user, api } = useAuth()
  const [loans, setLoans] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [borrowerInfo, setBorrowerInfo] = useState(null)
  const [notification, setNotification] = useState(null)
  const location = useLocation()

  // Check for success message in location state
  useEffect(() => {
    if (location.state?.success) {
      setNotification({
        title: "Success!",
        message: location.state.message || "Operation completed successfully.",
      })

      // Clear the location state to prevent showing the notification again on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location])

  // Get status icon based on loan status
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
      default:
        return null
    }
  }

  useEffect(() => {
    const fetchBorrowerData = async () => {
      if (!api) return

      setLoading(true)
      try {
        // Fetch borrower profile
        const borrowerProfile = await api.get(`${process.env.REACT_APP_API_URL}/profile/borrower/`)
        setBorrowerInfo(borrowerProfile)

        // Fetch loans
        const loansData = await api.get(`${process.env.REACT_APP_API_URL}/api/loans/borrower/`)
        setLoans(loansData)

        // Fetch upcoming payments
        const paymentsData = await api.get(`${process.env.REACT_APP_API_URL}/api/payments/upcoming/`)
        setPayments(paymentsData)
      } catch (err) {
        console.error("Error fetching borrower data:", err)
        setError("Failed to load your dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBorrowerData()
  }, [api])

  // For demo purposes, use mock data if API calls fail
  const mockLoans = [
    {
      loan_id: "550e8400-e29b-41d4-a716-446655440000",
      amount: "5000.00",
      status: "APPROVED",
      issued_date: "2023-05-15T10:30:00Z",
      due_date: "2024-05-15T10:30:00Z",
      term: 12,
      interest: "12.000",
    },
    {
      loan_id: "550e8400-e29b-41d4-a716-446655440001",
      amount: "3000.00",
      status: "PENDING",
      issued_date: "2023-06-20T14:45:00Z",
      due_date: null,
      term: 6,
      interest: "10.000",
    },
    {
      loan_id: "550e8400-e29b-41d4-a716-446655440002",
      amount: "8000.00",
      status: "REPAID",
      issued_date: "2022-10-05T09:15:00Z",
      due_date: "2023-04-05T09:15:00Z",
      term: 6,
      interest: "12.000",
    },
  ]

  const mockPayments = [
    {
      id: 1,
      loan_id: "550e8400-e29b-41d4-a716-446655440000",
      amount: "450.00",
      due_date: "2023-06-15T10:30:00Z",
    },
    {
      id: 2,
      loan_id: "550e8400-e29b-41d4-a716-446655440000",
      amount: "450.00",
      due_date: "2023-07-15T10:30:00Z",
    },
  ]

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate total borrowed amount
  const totalBorrowed =
    loans.length > 0
      ? loans.reduce((sum, loan) => sum + Number.parseFloat(loan.amount), 0).toFixed(2)
      : mockLoans.reduce((sum, loan) => sum + Number.parseFloat(loan.amount), 0).toFixed(2)

  // Count active loans
  const activeLoans =
    loans.length > 0
      ? loans.filter((loan) => loan.status === "APPROVED").length
      : mockLoans.filter((loan) => loan.status === "APPROVED").length

  return (
    <DashboardContainer>
      {notification && (
        <SuccessNotification
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <WelcomeSection>
        <WelcomeTitle>Welcome, {user?.username || "Borrower"}</WelcomeTitle>
        <WelcomeSubtitle>Here's an overview of your loans and upcoming payments</WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Borrowed</StatTitle>
            <StatIcon bgColor="var(--primary)">
              <FaMoneyBillWave />
            </StatIcon>
          </StatHeader>
          <StatValue>M{totalBorrowed}</StatValue>
          <StatFooter>
            <StatPeriod>across all loans</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Active Loans</StatTitle>
            <StatIcon bgColor="var(--secondary)">
              <FaFileAlt />
            </StatIcon>
          </StatHeader>
          <StatValue>{activeLoans}</StatValue>
          <StatFooter>
            <StatPeriod>currently active</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Next Payment</StatTitle>
            <StatIcon bgColor="var(--warning)">
              <FaCalendarAlt />
            </StatIcon>
          </StatHeader>
          <StatValue>
            {payments.length > 0
              ? `M${payments[0].amount}`
              : mockPayments.length > 0
                ? `M${mockPayments[0].amount}`
                : "M0.00"}
          </StatValue>
          <StatFooter>
            <StatPeriod>
              due{" "}
              {payments.length > 0
                ? formatDate(payments[0].due_date)
                : mockPayments.length > 0
                  ? formatDate(mockPayments[0].due_date)
                  : "N/A"}
            </StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Credit Score</StatTitle>
            <StatIcon bgColor="var(--success)">
              <FaChartLine />
            </StatIcon>
          </StatHeader>
          <StatValue>720</StatValue>
          <StatFooter>
            <StatPeriod>good standing</StatPeriod>
          </StatFooter>
        </StatCard>
      </StatsGrid>

      <GridContainer>
        <Card>
          <SectionTitle>
            <FaFileAlt /> Your Loans
          </SectionTitle>

          {loading ? (
            <p>Loading your loans...</p>
          ) : error ? (
            <p>{error}</p>
          ) : loans.length > 0 || mockLoans.length > 0 ? (
            <LoanTable>
              <thead>
                <tr>
                  <TableHeader>Loan ID</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Term</TableHeader>
                  <TableHeader>Interest</TableHeader>
                  <TableHeader>Issue Date</TableHeader>
                  <TableHeader>Due Date</TableHeader>
                  <TableHeader>Status</TableHeader>
                </tr>
              </thead>
              <tbody>
                {(loans.length > 0 ? loans : mockLoans).map((loan) => (
                  <TableRow key={loan.loan_id}>
                    <TableCell>{loan.loan_id.substring(0, 8)}...</TableCell>
                    <TableCell>M{Number.parseFloat(loan.amount).toFixed(2)}</TableCell>
                    <TableCell>{loan.term} months</TableCell>
                    <TableCell>{Number.parseFloat(loan.interest).toFixed(1)}%</TableCell>
                    <TableCell>{formatDate(loan.issued_date)}</TableCell>
                    <TableCell>{formatDate(loan.due_date)}</TableCell>
                    <TableCell>
                      <StatusBadge status={loan.status}>
                        {getStatusIcon(loan.status)} {loan.status}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </LoanTable>
          ) : (
            <EmptyState>
              <FaExclamationTriangle style={{ fontSize: "24px", marginBottom: "10px" }} />
              <p>You don't have any loans yet.</p>
              <ActionButton to="/borrower/apply">Apply for a Loan</ActionButton>
            </EmptyState>
          )}

          {(loans.length > 0 || mockLoans.length > 0) && (
            <ActionButton to="/borrower/apply">Apply for a New Loan</ActionButton>
          )}
        </Card>

        <Card>
          <SectionTitle>
            <FaCalendarAlt /> Upcoming Payments
          </SectionTitle>

          {loading ? (
            <p>Loading payments...</p>
          ) : error ? (
            <p>{error}</p>
          ) : payments.length > 0 || mockPayments.length > 0 ? (
            <>
              {(payments.length > 0 ? payments : mockPayments).map((payment) => (
                <PaymentItem key={payment.id}>
                  <PaymentInfo>
                    <PaymentName>Loan Payment</PaymentName>
                    <PaymentDate>Due: {formatDate(payment.due_date)}</PaymentDate>
                  </PaymentInfo>
                  <PaymentAmount>M{Number.parseFloat(payment.amount).toFixed(2)}</PaymentAmount>
                </PaymentItem>
              ))}
            </>
          ) : (
            <EmptyState>
              <p>No upcoming payments</p>
            </EmptyState>
          )}
        </Card>
      </GridContainer>
    </DashboardContainer>
  )
}

export default BorrowerDashboard
