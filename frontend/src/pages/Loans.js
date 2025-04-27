"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { FaSearch, FaPlus, FaFilter, FaEllipsisV, FaFileAlt, FaCheck, FaTimes, FaClock } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { loanApi } from "../utils/api"
import { useNavigate } from "react-router-dom"

const LoansContainer = styled.div`
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

const FilterTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
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

  &:hover {
    background: ${(props) => (props.active ? "var(--primary)" : "var(--background)")};
  }
`

const LoansTable = styled.div`
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
    cursor: pointer;
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

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;
`

const MenuContent = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1000;
  display: ${props => props.show ? 'block' : 'none'};
`

const MenuItem = styled.button`
  width: 100%;
  padding: 10px 15px;
  text-align: left;
  background: none;
  border: none;
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: var(--background);
  }

  &.approve {
    color: var(--success);
  }

  &.reject {
    color: var(--danger);
  }
`

const Loans = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const data = await loanApi.getMFILoans(user.access)
      setLoans(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching loans:', err)
      setError('Failed to load loans. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (loanId, newStatus) => {
    try {
      await loanApi.updateLoanStatus(user.access, loanId, newStatus)
      // Refresh the loans list
      fetchLoans()
      setShowMenu(false)
    } catch (err) {
      console.error('Error updating loan status:', err)
      setError('Failed to update loan status. Please try again.')
    }
  }

  const handleLoanClick = (loanId) => {
    navigate(`/loans/${loanId}`)
  }

  // Filter loans based on active tab
  const filteredLoans = activeTab === "all" 
    ? loans 
    : loans.filter(loan => loan.status.toLowerCase() === activeTab)

  // Status icon mapping
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
    <LoansContainer>
      <PageHeader>
        <PageTitle>Loans</PageTitle>
        <ActionButtons>
          <SecondaryButton>
            <FaFilter />
            Filter
          </SecondaryButton>
          <PrimaryButton onClick={() => navigate("/loans/new")}>
            <FaPlus />
            New Loan
          </PrimaryButton>
        </ActionButtons>
      </PageHeader>

      <SearchFilterContainer>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput placeholder="Search loans..." />
        </SearchContainer>
      </SearchFilterContainer>

      <FilterTabs>
        <FilterTab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All Loans
        </FilterTab>
        <FilterTab active={activeTab === "approved"} onClick={() => setActiveTab("approved")}>
          Approved
        </FilterTab>
        <FilterTab active={activeTab === "pending"} onClick={() => setActiveTab("pending")}>
          Pending
        </FilterTab>
        <FilterTab active={activeTab === "rejected"} onClick={() => setActiveTab("rejected")}>
          Rejected
        </FilterTab>
      </FilterTabs>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <LoansTable>
        <Table>
          <thead>
            <tr>
              <TableHeader>Loan ID</TableHeader>
              <TableHeader>Borrower</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Interest</TableHeader>
              <TableHeader>Term</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.loan_id} onClick={() => handleLoanClick(loan.loan_id)}>
                <TableCell>
                  <LoanID>
                    <LoanIcon>
                      <FaFileAlt />
                    </LoanIcon>
                    <LoanIDText>{loan.loan_id}</LoanIDText>
                  </LoanID>
                </TableCell>
                <TableCell>{loan.borrower_details.full_name}</TableCell>
                <TableCell>M{loan.amount}</TableCell>
                <TableCell>{loan.interest}%</TableCell>
                <TableCell>{loan.term} months</TableCell>
                <TableCell>{new Date(loan.issued_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <StatusBadge status={loan.status}>
                    {getStatusIcon(loan.status)}
                    {loan.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionMenu>
                    <ActionButton onClick={() => {
                      setSelectedLoan(loan)
                      setShowMenu(!showMenu)
                    }}>
                      <FaEllipsisV />
                    </ActionButton>
                    {selectedLoan?.loan_id === loan.loan_id && (
                      <MenuContent show={showMenu}>
                        {loan.status === "PENDING" && (
                          <>
                            <MenuItem 
                              className="approve"
                              onClick={() => handleStatusUpdate(loan.loan_id, "APPROVED")}
                            >
                              <FaCheck /> Approve
                            </MenuItem>
                            <MenuItem 
                              className="reject"
                              onClick={() => handleStatusUpdate(loan.loan_id, "REJECTED")}
                            >
                              <FaTimes /> Reject
                            </MenuItem>
                          </>
                        )}
                      </MenuContent>
                    )}
                  </ActionMenu>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        <Pagination>
          <PageInfo>Showing {filteredLoans.length} loans</PageInfo>
          <PageControls>
            <PageButton disabled>&lt;</PageButton>
            <PageButton active>1</PageButton>
            <PageButton>&gt;</PageButton>
          </PageControls>
        </Pagination>
      </LoansTable>
    </LoansContainer>
  )
}

export default Loans

