"use client"

import styled from "styled-components"
import {
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaEllipsisH,
} from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

const DashboardContainer = styled.div`
  padding: 90px 30px 30px;
  transition: margin-left 0.3s ease-in-out;
`

const PageHeader = styled.div`
  margin-bottom: 30px;
`

const WelcomeMessage = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
`

const SubHeading = styled.p`
  color: var(--text-light);
  font-size: 16px;
  margin-bottom: 20px;
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

const StatChange = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => (props.isPositive ? "var(--success)" : "var(--danger)")};
  margin-right: 8px;
`

const StatPeriod = styled.div`
  color: var(--text-light);
`

const SectionTitle = styled.h2`
  font-size: 20px;
  margin: 30px 0 20px;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const RecentLoansCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const CardTitle = styled.h3`
  font-size: 18px;
  margin: 0;
`

const CardAction = styled.button`
  background: transparent;
  border: none;
  color: var(--text-light);
  cursor: pointer;

  &:hover {
    color: var(--primary);
  }
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
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "Approved":
        return "rgba(16, 185, 129, 0.1)"
      case "Pending":
        return "rgba(245, 158, 11, 0.1)"
      case "Rejected":
        return "rgba(239, 68, 68, 0.1)"
      default:
        return "rgba(100, 116, 139, 0.1)"
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "Approved":
        return "var(--success)"
      case "Pending":
        return "var(--warning)"
      case "Rejected":
        return "var(--danger)"
      default:
        return "var(--text-light)"
    }
  }};
`

const UpcomingPaymentsCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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

const Dashboard = () => {
  const { user } = useAuth()

  // Sample data for recent loans with Sesotho names and Maloti currency
  const recentLoans = [
    { id: "L-2023-001", borrower: "Thabo Mokoena", amount: "M5,000", date: "2023-05-15", status: "Approved" },
    { id: "L-2023-002", borrower: "Lineo Mphutlane", amount: "M8,500", date: "2023-05-14", status: "Pending" },
    { id: "L-2023-003", borrower: "Teboho Letsie", amount: "M3,200", date: "2023-05-12", status: "Approved" },
    { id: "L-2023-004", borrower: "Palesa Mokete", amount: "M10,000", date: "2023-05-10", status: "Rejected" },
    { id: "L-2023-005", borrower: "Tumelo Ramokoatsi", amount: "M7,500", date: "2023-05-08", status: "Approved" },
  ]

  // Sample data for upcoming payments
  const upcomingPayments = [
    { borrower: "Thabo Mokoena", date: "May 25, 2023", amount: "M450" },
    { borrower: "Teboho Letsie", date: "May 28, 2023", amount: "M320" },
    { borrower: "Tumelo Ramokoatsi", date: "June 1, 2023", amount: "M680" },
    { borrower: "Nthabiseng Motaung", date: "June 3, 2023", amount: "M550" },
  ]

  return (
    <DashboardContainer>
      <PageHeader>
        <WelcomeMessage>Welcome back, {user?.username || "Mohlomphehi"}!</WelcomeMessage>
        <SubHeading>Here's what's happening with your loan portfolio today.</SubHeading>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Borrowers</StatTitle>
            <StatIcon bgColor="var(--primary)">
              <FaUsers />
            </StatIcon>
          </StatHeader>
          <StatValue>1,284</StatValue>
          <StatFooter>
            <StatChange isPositive={true}>
              <FaArrowUp style={{ marginRight: "4px" }} />
              12.5%
            </StatChange>
            <StatPeriod>vs last month</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Active Loans</StatTitle>
            <StatIcon bgColor="var(--secondary)">
              <FaMoneyBillWave />
            </StatIcon>
          </StatHeader>
          <StatValue>842</StatValue>
          <StatFooter>
            <StatChange isPositive={true}>
              <FaArrowUp style={{ marginRight: "4px" }} />
              8.2%
            </StatChange>
            <StatPeriod>vs last month</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Disbursed</StatTitle>
            <StatIcon bgColor="var(--success)">
              <FaChartLine />
            </StatIcon>
          </StatHeader>
          <StatValue>M1.2M</StatValue>
          <StatFooter>
            <StatChange isPositive={true}>
              <FaArrowUp style={{ marginRight: "4px" }} />
              15.3%
            </StatChange>
            <StatPeriod>vs last month</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Overdue Payments</StatTitle>
            <StatIcon bgColor="var(--danger)">
              <FaExclamationTriangle />
            </StatIcon>
          </StatHeader>
          <StatValue>24</StatValue>
          <StatFooter>
            <StatChange isPositive={false}>
              <FaArrowDown style={{ marginRight: "4px" }} />
              3.8%
            </StatChange>
            <StatPeriod>vs last month</StatPeriod>
          </StatFooter>
        </StatCard>
      </StatsGrid>

      <GridContainer>
        <RecentLoansCard>
          <CardHeader>
            <CardTitle>Recent Loan Applications</CardTitle>
            <CardAction>
              <FaEllipsisH />
            </CardAction>
          </CardHeader>

          <LoanTable>
            <thead>
              <tr>
                <TableHeader>Loan ID</TableHeader>
                <TableHeader>Borrower</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
              </tr>
            </thead>
            <tbody>
              {recentLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.id}</TableCell>
                  <TableCell>{loan.borrower}</TableCell>
                  <TableCell>{loan.amount}</TableCell>
                  <TableCell>{loan.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={loan.status}>{loan.status}</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </LoanTable>
        </RecentLoansCard>

        <UpcomingPaymentsCard>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardAction>
              <FaEllipsisH />
            </CardAction>
          </CardHeader>

          {upcomingPayments.map((payment, index) => (
            <PaymentItem key={index}>
              <PaymentInfo>
                <PaymentName>{payment.borrower}</PaymentName>
                <PaymentDate>{payment.date}</PaymentDate>
              </PaymentInfo>
              <PaymentAmount>{payment.amount}</PaymentAmount>
            </PaymentItem>
          ))}
        </UpcomingPaymentsCard>
      </GridContainer>
    </DashboardContainer>
  )
}

export default Dashboard

