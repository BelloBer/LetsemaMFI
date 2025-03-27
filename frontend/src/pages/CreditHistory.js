"use client"

import { useState } from "react"
import styled from "styled-components"
import { FaSearch, FaFileAlt, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa"

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

const SearchContainer = styled.div`
  position: relative;
  width: 400px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px 12px 45px;
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
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-size: 18px;
`

const SearchButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }
`

const CreditHistoryCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`

const BorrowerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const BorrowerAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`

const BorrowerDetails = styled.div`
  flex: 1;
`

const BorrowerName = styled.h2`
  font-size: 22px;
  margin: 0 0 5px;
`

const BorrowerID = styled.div`
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 10px;
`

const BorrowerContact = styled.div`
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: var(--text);

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 5px;
  }
`

const CreditScoreSection = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const CreditScoreCard = styled.div`
  flex: 1;
  background: ${(props) => props.background || "var(--background)"};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${(props) => {
    if (props.score >= 700) return "linear-gradient(135deg, #10B981 0%, #059669 100%)"
    if (props.score >= 500) return "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
    return "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)"
  }};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`

const ScoreValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
`

const ScoreMax = styled.div`
  font-size: 14px;
  opacity: 0.8;
`

const ScoreLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
`

const ScoreDescription = styled.div`
  font-size: 14px;
  color: var(--text-light);
`

const RiskIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => {
    if (props.risk === "Low") return "var(--success)"
    if (props.risk === "Medium") return "var(--warning)"
    return "var(--danger)"
  }};
  margin-top: 10px;
`

const LoanHistorySection = styled.div`
  margin-bottom: 30px;
`

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const LoanTable = styled.table`
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
      case "Active":
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
      case "Active":
        return "var(--primary)"
      case "Overdue":
        return "var(--danger)"
      default:
        return "var(--text-light)"
    }
  }};
`

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-light);
  font-size: 16px;
  background: var(--background);
  border-radius: 12px;
  margin-top: 20px;
`

const CreditHistory = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [borrowerFound, setBorrowerFound] = useState(true)

  // Sample borrower data
  const borrower = {
    id: "B-2023-001",
    name: "Thabo Mokoena",
    nationalId: "9201015876123",
    email: "thabo.mokoena@example.com",
    phone: "+266 5885 1234",
    address: "123 Kingsway Road, Maseru, Lesotho",
    creditScore: 720,
    riskLevel: "Low",
  }

  // Sample loan history data
  const loanHistory = [
    {
      id: "L-2023-005",
      mfi: "Basotho Finance Solutions",
      amount: "M7,500",
      dateIssued: "2023-01-15",
      dateDue: "2023-07-15",
      status: "Paid",
      paymentHistory: "Regular",
    },
    {
      id: "L-2022-089",
      mfi: "Khoebo Loans",
      amount: "M5,000",
      dateIssued: "2022-08-10",
      dateDue: "2023-02-10",
      status: "Paid",
      paymentHistory: "Regular",
    },
    {
      id: "L-2022-042",
      mfi: "Potlako Loans Inc.",
      amount: "M3,200",
      dateIssued: "2022-04-05",
      dateDue: "2022-10-05",
      status: "Paid",
      paymentHistory: "Late (2 payments)",
    },
    {
      id: "L-2023-112",
      mfi: "Basotho Finance Solutions",
      amount: "M12,000",
      dateIssued: "2023-05-20",
      dateDue: "2024-05-20",
      status: "Active",
      paymentHistory: "Regular",
    },
  ]

  const handleSearch = () => {
    // In a real application, this would make an API call to search for the borrower
    console.log("Searching for:", searchQuery)
    // For demo purposes, we'll just toggle the borrowerFound state
    setBorrowerFound(true)
  }

  const getRiskIcon = (risk) => {
    switch (risk) {
      case "Low":
        return <FaCheckCircle />
      case "Medium":
        return <FaExclamationTriangle />
      case "High":
        return <FaTimesCircle />
      default:
        return null
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <FaCheckCircle />
      case "Active":
        return <FaInfoCircle />
      case "Overdue":
        return <FaExclamationTriangle />
      default:
        return null
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Credit History Repository</PageTitle>
      </PageHeader>

      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search by National ID, Name, or Phone Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </SearchContainer>

      {borrowerFound ? (
        <CreditHistoryCard>
          <BorrowerInfo>
            <BorrowerAvatar>TM</BorrowerAvatar>
            <BorrowerDetails>
              <BorrowerName>{borrower.name}</BorrowerName>
              <BorrowerID>National ID: {borrower.nationalId}</BorrowerID>
              <BorrowerContact>
                <div>Email: {borrower.email}</div>
                <div>Phone: {borrower.phone}</div>
              </BorrowerContact>
            </BorrowerDetails>
          </BorrowerInfo>

          <CreditScoreSection>
            <CreditScoreCard>
              <ScoreCircle score={borrower.creditScore}>
                <ScoreValue>{borrower.creditScore}</ScoreValue>
                <ScoreMax>/850</ScoreMax>
              </ScoreCircle>
              <ScoreLabel>Credit Score</ScoreLabel>
              <ScoreDescription>
                {borrower.creditScore >= 700
                  ? "Excellent credit score. Low risk borrower."
                  : borrower.creditScore >= 500
                    ? "Fair credit score. Moderate risk borrower."
                    : "Poor credit score. High risk borrower."}
              </ScoreDescription>
            </CreditScoreCard>

            <CreditScoreCard background="var(--background)">
              <SectionTitle>Risk Assessment</SectionTitle>
              <div>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontWeight: "500", marginBottom: "5px" }}>Default Risk</div>
                  <RiskIndicator risk={borrower.riskLevel}>
                    {getRiskIcon(borrower.riskLevel)} {borrower.riskLevel} Risk
                  </RiskIndicator>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontWeight: "500", marginBottom: "5px" }}>Payment Consistency</div>
                  <RiskIndicator risk="Low">
                    <FaCheckCircle /> Consistent
                  </RiskIndicator>
                </div>

                <div>
                  <div style={{ fontWeight: "500", marginBottom: "5px" }}>Loan Stacking</div>
                  <RiskIndicator risk="Medium">
                    <FaExclamationTriangle /> 1 Active Loan
                  </RiskIndicator>
                </div>
              </div>
            </CreditScoreCard>
          </CreditScoreSection>

          <LoanHistorySection>
            <SectionTitle>
              <FaFileAlt /> Loan History (Across All MFIs)
            </SectionTitle>
            <LoanTable>
              <thead>
                <tr>
                  <TableHeader>Loan ID</TableHeader>
                  <TableHeader>MFI</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Date Issued</TableHeader>
                  <TableHeader>Due Date</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Payment History</TableHeader>
                </tr>
              </thead>
              <tbody>
                {loanHistory.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.id}</TableCell>
                    <TableCell>{loan.mfi}</TableCell>
                    <TableCell>{loan.amount}</TableCell>
                    <TableCell>{loan.dateIssued}</TableCell>
                    <TableCell>{loan.dateDue}</TableCell>
                    <TableCell>
                      <StatusBadge status={loan.status}>
                        {getStatusIcon(loan.status)} {loan.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{loan.paymentHistory}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </LoanTable>
          </LoanHistorySection>
        </CreditHistoryCard>
      ) : (
        <NoResultsMessage>
          <FaExclamationTriangle style={{ fontSize: "24px", marginBottom: "10px" }} />
          <div>No borrower found with the provided information.</div>
          <div style={{ marginTop: "5px", fontSize: "14px" }}>
            Try searching with a different National ID, name, or phone number.
          </div>
        </NoResultsMessage>
      )}
    </PageContainer>
  )
}

export default CreditHistory

