"use client"

import { useState } from "react"
import styled from "styled-components"
import { FaSearch, FaPlus, FaFilter, FaUserCircle, FaEdit, FaTrash, FaLock } from "react-icons/fa"

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

const UsersTable = styled.div`
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`

const UserName = styled.div`
  font-weight: 500;
  margin-bottom: 3px;
`

const UserEmail = styled.div`
  font-size: 12px;
  color: var(--text-light);
`

const RoleBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.role) {
      case "SYSTEM_ADMIN":
        return "rgba(6, 182, 212, 0.1)"
      case "MFI_ADMIN":
        return "rgba(139, 92, 246, 0.1)"
      case "LOAN_OFFICER":
        return "rgba(16, 185, 129, 0.1)"
      case "CREDIT_ANALYST":
        return "rgba(245, 158, 11, 0.1)"
      case "BORROWER":
        return "rgba(59, 130, 246, 0.1)"
      default:
        return "rgba(100, 116, 139, 0.1)"
    }
  }};
  color: ${(props) => {
    switch (props.role) {
      case "SYSTEM_ADMIN":
        return "var(--primary)"
      case "MFI_ADMIN":
        return "var(--secondary)"
      case "LOAN_OFFICER":
        return "var(--success)"
      case "CREDIT_ANALYST":
        return "var(--warning)"
      case "BORROWER":
        return "var(--primary-dark)"
      default:
        return "var(--text-light)"
    }
  }};
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => (props.active ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")};
  color: ${(props) => (props.active ? "var(--success)" : "var(--danger)")};
`

const ActionButtonsGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--background);
    color: ${(props) => props.color || "var(--primary)"};
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

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("all")

  // Sample user data
  const users = [
    {
      id: "U-2023-001",
      name: "Thabo Mokoena",
      email: "thabo.mokoena@example.com",
      role: "SYSTEM_ADMIN",
      mfi: "All MFIs",
      status: "active",
      lastLogin: "2023-07-25 14:30",
    },
    {
      id: "U-2023-002",
      name: "Lineo Mphutlane",
      email: "lineo.m@example.com",
      role: "MFI_ADMIN",
      mfi: "Basotho Finance Solutions",
      status: "active",
      lastLogin: "2023-07-24 09:15",
    },
    {
      id: "U-2023-003",
      name: "Teboho Letsie",
      email: "teboho.l@example.com",
      role: "LOAN_OFFICER",
      mfi: "Basotho Finance Solutions",
      status: "active",
      lastLogin: "2023-07-25 11:45",
    },
    {
      id: "U-2023-004",
      name: "Palesa Mokete",
      email: "palesa.m@example.com",
      role: "CREDIT_ANALYST",
      mfi: "Khoebo Loans",
      status: "active",
      lastLogin: "2023-07-23 16:20",
    },
    {
      id: "U-2023-005",
      name: "Tumelo Ramokoatsi",
      email: "tumelo.r@example.com",
      role: "LOAN_OFFICER",
      mfi: "Potlako Loans Inc.",
      status: "inactive",
      lastLogin: "2023-07-10 08:30",
    },
    {
      id: "U-2023-006",
      name: "Nthabiseng Motaung",
      email: "nthabiseng.m@example.com",
      role: "BORROWER",
      mfi: "N/A",
      status: "active",
      lastLogin: "2023-07-22 10:15",
    },
  ]

  // Filter users based on active tab
  const filteredUsers =
    activeTab === "all"
      ? users
      : activeTab === "active"
        ? users.filter((user) => user.status === "active")
        : activeTab === "inactive"
          ? users.filter((user) => user.status === "inactive")
          : users.filter((user) => user.role === activeTab)

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>User Management</PageTitle>
        <ActionButtons>
          <SecondaryButton>
            <FaFilter />
            Filter
          </SecondaryButton>
          <PrimaryButton>
            <FaPlus />
            Add User
          </PrimaryButton>
        </ActionButtons>
      </PageHeader>

      <SearchFilterContainer>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput placeholder="Search users..." />
        </SearchContainer>
      </SearchFilterContainer>

      <FilterTabs>
        <FilterTab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All Users
        </FilterTab>
        <FilterTab active={activeTab === "active"} onClick={() => setActiveTab("active")}>
          Active
        </FilterTab>
        <FilterTab active={activeTab === "inactive"} onClick={() => setActiveTab("inactive")}>
          Inactive
        </FilterTab>
        <FilterTab active={activeTab === "SYSTEM_ADMIN"} onClick={() => setActiveTab("SYSTEM_ADMIN")}>
          System Admins
        </FilterTab>
        <FilterTab active={activeTab === "MFI_ADMIN"} onClick={() => setActiveTab("MFI_ADMIN")}>
          MFI Admins
        </FilterTab>
        <FilterTab active={activeTab === "LOAN_OFFICER"} onClick={() => setActiveTab("LOAN_OFFICER")}>
          Loan Officers
        </FilterTab>
        <FilterTab active={activeTab === "BORROWER"} onClick={() => setActiveTab("BORROWER")}>
          Borrowers
        </FilterTab>
      </FilterTabs>

      <UsersTable>
        <Table>
          <thead>
            <tr>
              <TableHeader>User</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>MFI</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Last Login</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <UserInfo>
                    <UserAvatar>
                      <FaUserCircle />
                    </UserAvatar>
                    <UserDetails>
                      <UserName>{user.name}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                    </UserDetails>
                  </UserInfo>
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role}>{user.role.replace("_", " ")}</RoleBadge>
                </TableCell>
                <TableCell>{user.mfi}</TableCell>
                <TableCell>
                  <StatusBadge active={user.status === "active"}>
                    {user.status === "active" ? "Active" : "Inactive"}
                  </StatusBadge>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <ActionButtonsGroup>
                    <ActionButton title="Edit User">
                      <FaEdit />
                    </ActionButton>
                    <ActionButton title="Reset Password">
                      <FaLock />
                    </ActionButton>
                    <ActionButton title="Delete User" color="var(--danger)">
                      <FaTrash />
                    </ActionButton>
                  </ActionButtonsGroup>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        <Pagination>
          <PageInfo>Showing 1-6 of 6 users</PageInfo>
          <PageControls>
            <PageButton disabled>&lt;</PageButton>
            <PageButton active>1</PageButton>
            <PageButton disabled>&gt;</PageButton>
          </PageControls>
        </Pagination>
      </UsersTable>
    </PageContainer>
  )
}

export default UserManagement

