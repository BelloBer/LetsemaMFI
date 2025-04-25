"use client"

import { useState } from "react"
import styled from "styled-components"
import {
  FaSearch,
  FaPlus,
  FaFilter,
  FaBuilding,
  FaEdit,
  FaTrash,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
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

const MFIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`

const MFICard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`

const MFICardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`

const MFIInfo = styled.div`
  display: flex;
  gap: 15px;
`

const MFIAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`

const MFIDetails = styled.div`
  display: flex;
  flex-direction: column;
`

const MFIName = styled.h3`
  font-size: 18px;
  margin: 0 0 5px;
`

const MFIID = styled.div`
  font-size: 12px;
  color: var(--text-light);
`

const MFIActions = styled.div`
  display: flex;
  gap: 8px;
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

const MFIContact = styled.div`
  margin-bottom: 15px;
`

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 14px;
  color: var(--text-light);
`

const MFIStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: var(--background);
  border-radius: 8px;
`

const StatIcon = styled.div`
  font-size: 18px;
  color: ${(props) => props.color || "var(--primary)"};
  margin-bottom: 5px;
`

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
`

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-light);
  text-align: center;
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

const MFIManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample MFI data
  const mfis = [
    {
      id: "MFI-001",
      name: "Basotho Finance Solutions",
      email: "info@basothofinance.co.ls",
      phone: "+266 2231 2345",
      address: "123 Kingsway Road, Maseru, Lesotho",
      status: "active",
      users: 24,
      loans: 842,
      portfolio: "M5.2M",
    },
    {
      id: "MFI-002",
      name: "Khoebo Loans",
      email: "support@khoeboloans.co.ls",
      phone: "+266 2232 6789",
      address: "45 Main Street, Leribe, Lesotho",
      status: "active",
      users: 18,
      loans: 635,
      portfolio: "M3.8M",
    },
    {
      id: "MFI-003",
      name: "Potlako Loans Inc.",
      email: "info@potlakoloans.co.ls",
      phone: "+266 2233 4567",
      address: "78 Commercial Road, Mafeteng, Lesotho",
      status: "active",
      users: 15,
      loans: 412,
      portfolio: "M2.5M",
    },
    {
      id: "MFI-004",
      name: "Thuso Microfinance",
      email: "contact@thusomfi.co.ls",
      phone: "+266 2234 7890",
      address: "32 Hospital Road, Mohale's Hoek, Lesotho",
      status: "inactive",
      users: 8,
      loans: 156,
      portfolio: "M0.9M",
    },
  ]

  // Filter MFIs based on search query
  const filteredMFIs = searchQuery
    ? mfis.filter(
        (mfi) =>
          mfi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mfi.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mfis

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>MFI Management</PageTitle>
        <ActionButtons>
          <SecondaryButton>
            <FaFilter />
            Filter
          </SecondaryButton>
          <PrimaryButton>
            <FaPlus />
            Add MFI
          </PrimaryButton>
        </ActionButtons>
      </PageHeader>

      <SearchFilterContainer>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            placeholder="Search MFIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </SearchFilterContainer>

      <MFIGrid>
        {filteredMFIs.map((mfi) => (
          <MFICard key={mfi.id}>
            <MFICardHeader>
              <MFIInfo>
                <MFIAvatar>
                  <FaBuilding />
                </MFIAvatar>
                <MFIDetails>
                  <MFIName>{mfi.name}</MFIName>
                  <MFIID>{mfi.id}</MFIID>
                </MFIDetails>
              </MFIInfo>
              <MFIActions>
                <ActionButton title="Edit MFI">
                  <FaEdit />
                </ActionButton>
                <ActionButton title="Delete MFI" color="var(--danger)">
                  <FaTrash />
                </ActionButton>
              </MFIActions>
            </MFICardHeader>

            <MFIContact>
              <ContactItem>Email: {mfi.email}</ContactItem>
              <ContactItem>Phone: {mfi.phone}</ContactItem>
              <ContactItem>Address: {mfi.address}</ContactItem>
            </MFIContact>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <StatusBadge active={mfi.status === "active"}>
                {mfi.status === "active" ? "Active" : "Inactive"}
              </StatusBadge>
            </div>

            <MFIStats>
              <StatItem>
                <StatIcon color="var(--secondary)">
                  <FaUsers />
                </StatIcon>
                <StatValue>{mfi.users}</StatValue>
                <StatLabel>Users</StatLabel>
              </StatItem>
              <StatItem>
                <StatIcon color="var(--success)">
                  <FaMoneyBillWave />
                </StatIcon>
                <StatValue>{mfi.loans}</StatValue>
                <StatLabel>Loans</StatLabel>
              </StatItem>
              <StatItem>
                <StatIcon color="var(--primary)">
                  <FaChartLine />
                </StatIcon>
                <StatValue>{mfi.portfolio}</StatValue>
                <StatLabel>Portfolio</StatLabel>
              </StatItem>
            </MFIStats>
          </MFICard>
        ))}
      </MFIGrid>
    </PageContainer>
  )
}

export default MFIManagement

