"use client"

import { useState } from "react"
import styled from "styled-components"
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSearch,
  FaChartLine,
  FaFilter,
  FaEllipsisV,
} from "react-icons/fa"

const PageContainer = styled.div`
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

const SecondaryButton = styled(Button)`
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);

  &:hover {
    background: var(--background);
  }
`

const SearchFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`

const SearchContainer = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 40px;
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

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
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

const StatChange = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => (props.isPositive ? "var(--success)" : "var(--danger)")};
  margin-right: 8px;
`

const StatPeriod = styled.div`
  color: var(--text-light);
`

const FilterTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 0;
  }
`

const FilterTab = styled.button`
  padding: 8px 16px;
  background: ${(props) => (props.active ? "var(--primary)" : "transparent")};
  color: ${(props) => (props.active ? "white" : "var(--text)")};
  border: ${(props) => (props.active ? "none" : "1px solid var(--border)")};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.active ? "var(--primary)" : "var(--background)")};
  }
`

const RepaymentTable = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.th`
  text-align: left;
  padding: 16px;
  background: var(--background);
  color: var(--text);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--border);

  &:first-child {
    padding-left: 20px;
  }

  &:last-child {
    padding-right: 20px;
    text-align: right;
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
  padding: 16px;
  font-size: 14px;

  &:first-child {
    padding-left: 20px;
  }

  &:last-child {
    padding-right: 20px;
    text-align: right;
  }
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
      case "Paid":
        return "rgba(16, 185, 129, 0.1)"
      case "Upcoming":
        return "rgba(59, 130, 246, 0.1)"
      case "Overdue":
        return "rgba(239, 68, 68, 0.1)"
      default:
        return "rgba(100, 116, 139, 0.1)"
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "Paid":
        return "var(--success)"
      case "Upcoming":
        return "var(--primary)"
      case "Overdue":
        return "var(--danger)"
      default:
        return "var(--text-light)"
    }
  }};
`

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: var(--primary);
  }
`

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid var(--border);
`

const PageInfo = styled.div`
  font-size: 14px;
  color: var(--text-light);
`

const PageControls = styled.div`
  display: flex;
  gap: 5px;
`

const PageButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: ${(props) => (props.active ? "var(--primary)" : "transparent")};
  color: ${(props) => (props.active ? "white" : "var(--text)")};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.active ? "var(--primary)" : "var(--background)")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const RepaymentTracking = () => {
  const [activeTab, setActiveTab] = useState("all")

  // Sample repayment data
  const repayments = [
    {
      id: "P-2023-001",
      loanId: "L-2023-112",
      borrower: "Thabo Mokoena",
      amount: "M1,000",
      dueDate: "2023-06-20",
      status: "Paid",
      paymentDate: "2023-06-18",
      paymentMethod: "Mobile Money",
    },
    {
      id: "P-2023-002",
      loanId: "L-2023-112",
      borrower: "Thabo Mokoena",
      amount: "M1,000",
      dueDate: "2023-07-20",
      status: "Paid",
      paymentDate: "2023-07-20",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "P-2023-003",
      loanId: "L-2023-112",
      borrower: "Thabo Mokoena",
      amount: "M1,000",
      dueDate: "2023-08-20",
      status: "Upcoming",
      paymentDate: "-",
      paymentMethod: "-",
    },
    {
      id: "P-2023-004",
      loanId: "L-2023-098",
      borrower: "Lineo Mphutlane",
      amount: "M850",
      dueDate: "2023-06-15",
      status: "Paid",
      paymentDate: "2023-06-15",
      paymentMethod: "Cash",
    },
    {
      id: "P-2023-005",
      loanId: "L-2023-098",
      borrower: "Lineo Mphutlane",
      amount: "M850",
      dueDate: "2023-07-15",
      status: "Overdue",
      paymentDate: "-",
      paymentMethod: "-",
    },
    {
      id: "P-2023-006",
      loanId: "L-2023-098",
      borrower: "Lineo Mphutlane",
      amount: "M850",
      dueDate: "2023-08-15",
      status: "Upcoming",
      paymentDate: "-",
      paymentMethod: "-",
    },
    {
      id: "P-2023-007",
      loanId: "L-2023-076",
      borrower: "Teboho Letsie",
      amount: "M1,200",
      dueDate: "2023-07-05",
      status: "Paid",
      paymentDate: "2023-07-03",
      paymentMethod: "Mobile Money",
    },
  ]

  // Filter repayments based on active tab
  const filteredRepayments =
    activeTab === "all"
      ? repayments
      : repayments.filter((repayment) => repayment.status.toLowerCase() === activeTab.toLowerCase())

  // Status icon mapping
  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <FaCheckCircle />
      case "Upcoming":
        return <FaCalendarAlt />
      case "Overdue":
        return <FaExclamationTriangle />
      default:
        return null
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Repayment Tracking</PageTitle>
        <ActionButtons>
          <SecondaryButton>
            <FaFilter />
            Filter
          </SecondaryButton>
          <SecondaryButton>
            <FaChartLine />
            Reports
          </SecondaryButton>
        </ActionButtons>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Repayments</StatTitle>
            <StatIcon bgColor="var(--primary)">
              <FaMoneyBillWave />
            </StatIcon>
          </StatHeader>
          <StatValue>M45,600</StatValue>
          <StatFooter>
            <StatChange isPositive={true}>
              <FaCheckCircle style={{ marginRight: "4px" }} />
              92%
            </StatChange>
            <StatPeriod>collection rate</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Upcoming Payments</StatTitle>
            <StatIcon bgColor="var(--secondary)">
              <FaCalendarAlt />
            </StatIcon>
          </StatHeader>
          <StatValue>M12,850</StatValue>
          <StatFooter>
            <StatPeriod>due this month</StatPeriod>
          </StatFooter>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Overdue Payments</StatTitle>
            <StatIcon bgColor="var(--danger)">
              <FaExclamationTriangle />
            </StatIcon>
          </StatHeader>
          <StatValue>M3,750</StatValue>
          <StatFooter>
            <StatChange isPositive={false}>
              <FaExclamationTriangle style={{ marginRight: "4px" }} />
              8%
            </StatChange>
            <StatPeriod>of total portfolio</StatPeriod>
          </StatFooter>
        </StatCard>
      </StatsGrid>

      <SearchFilterContainer>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput placeholder="Search by borrower or loan ID..." />
        </SearchContainer>
      </SearchFilterContainer>

      <FilterTabs>
        <FilterTab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All Repayments
        </FilterTab>
        <FilterTab active={activeTab === "paid"} onClick={() => setActiveTab("paid")}>
          Paid
        </FilterTab>
        <FilterTab active={activeTab === "upcoming"} onClick={() => setActiveTab("upcoming")}>
          Upcoming
        </FilterTab>
        <FilterTab active={activeTab === "overdue"} onClick={() => setActiveTab("overdue")}>
          Overdue
        </FilterTab>
      </FilterTabs>

      <RepaymentTable>
        <Table>
          <thead>
            <tr>
              <TableHeader>Payment ID</TableHeader>
              <TableHeader>Loan ID</TableHeader>
              <TableHeader>Borrower</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Due Date</TableHeader>
              <TableHeader>Payment Date</TableHeader>
              <TableHeader>Payment Method</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredRepayments.map((repayment) => (
              <TableRow key={repayment.id}>
                <TableCell>{repayment.id}</TableCell>
                <TableCell>{repayment.loanId}</TableCell>
                <TableCell>{repayment.borrower}</TableCell>
                <TableCell>{repayment.amount}</TableCell>
                <TableCell>{repayment.dueDate}</TableCell>
                <TableCell>{repayment.paymentDate}</TableCell>
                <TableCell>{repayment.paymentMethod}</TableCell>
                <TableCell>
                  <StatusBadge status={repayment.status}>
                    {getStatusIcon(repayment.status)} {repayment.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButton>
                    <FaEllipsisV />
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        <Pagination>
          <PageInfo>Showing 1-7 of 24 repayments</PageInfo>
          <PageControls>
            <PageButton disabled>&lt;</PageButton>
            <PageButton active>1</PageButton>
            <PageButton>2</PageButton>
            <PageButton>3</PageButton>
            <PageButton>&gt;</PageButton>
          </PageControls>
        </Pagination>
      </RepaymentTable>
    </PageContainer>
  )
}

export default RepaymentTracking

