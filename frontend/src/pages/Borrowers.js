import styled from "styled-components"
import { FaSearch, FaPlus, FaFilter, FaEllipsisV, FaUserCircle } from "react-icons/fa"

const BorrowersContainer = styled.div`
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

const BorrowersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`

const BorrowerCard = styled.div`
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

const BorrowerCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`

const BorrowerInfo = styled.div`
  display: flex;
  gap: 15px;
`

const BorrowerAvatar = styled.div`
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

const BorrowerDetails = styled.div`
  display: flex;
  flex-direction: column;
`

const BorrowerName = styled.h3`
  font-size: 16px;
  margin: 0 0 5px;
`

const BorrowerID = styled.div`
  font-size: 12px;
  color: var(--text-light);
`

const BorrowerActions = styled.button`
  background: transparent;
  border: none;
  color: var(--text-light);
  cursor: pointer;

  &:hover {
    color: var(--primary);
  }
`

const BorrowerStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 5px;
`

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
`

const BorrowerFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--border);
`

const BorrowerStatus = styled.div`
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 20px;
  background: ${(props) => (props.active ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")};
  color: ${(props) => (props.active ? "var(--success)" : "var(--danger)")};
`

const ViewProfileButton = styled.button`
  font-size: 12px;
  color: var(--primary);
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const Borrowers = () => {
  // Sample borrowers data with Sesotho names and Lesotho contact information
  const borrowers = [
    {
      id: "B-2023-001",
      name: "Thabo Mokoena",
      email: "thabo.mokoena@gmail.com",
      phone: "+266 5885 1234",
      activeLoans: 2,
      totalBorrowed: "M12,500",
      status: "active",
    },
    {
      id: "B-2023-002",
      name: "Lineo Mphutlane",
      email: "lineo.m@gmail.com",
      phone: "+266 5987 6543",
      activeLoans: 1,
      totalBorrowed: "M8,500",
      status: "active",
    },
    {
      id: "B-2023-003",
      name: "Teboho Letsie",
      email: "teboho.l@gmail.com",
      phone: "+266 5456 7890",
      activeLoans: 3,
      totalBorrowed: "M15,700",
      status: "active",
    },
    {
      id: "B-2023-004",
      name: "Palesa Mokete",
      email: "palesa.m@gmail.com",
      phone: "+266 5234 5678",
      activeLoans: 0,
      totalBorrowed: "M10,000",
      status: "inactive",
    },
    {
      id: "B-2023-005",
      name: "Tumelo Ramokoatsi",
      email: "tumelo.r@gmail.com",
      phone: "+266 5876 5432",
      activeLoans: 1,
      totalBorrowed: "M7,500",
      status: "active",
    },
    {
      id: "B-2023-006",
      name: "Nthabiseng Motaung",
      email: "nthabiseng.m@gmail.com",
      phone: "+266 5345 6789",
      activeLoans: 2,
      totalBorrowed: "M13,200",
      status: "active",
    },
  ]

  return (
    <BorrowersContainer>
      <PageHeader>
        <PageTitle>Borrowers</PageTitle>
        <ActionButtons>
          <SecondaryButton>
            <FaFilter />
            Filter
          </SecondaryButton>
          <PrimaryButton>
            <FaPlus />
            Add Borrower
          </PrimaryButton>
        </ActionButtons>
      </PageHeader>

      <SearchFilterContainer>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput placeholder="Search borrowers..." />
        </SearchContainer>
      </SearchFilterContainer>

      <BorrowersGrid>
        {borrowers.map((borrower) => (
          <BorrowerCard key={borrower.id}>
            <BorrowerCardHeader>
              <BorrowerInfo>
                <BorrowerAvatar>
                  <FaUserCircle />
                </BorrowerAvatar>
                <BorrowerDetails>
                  <BorrowerName>{borrower.name}</BorrowerName>
                  <BorrowerID>{borrower.id}</BorrowerID>
                </BorrowerDetails>
              </BorrowerInfo>
              <BorrowerActions>
                <FaEllipsisV />
              </BorrowerActions>
            </BorrowerCardHeader>

            <div>
              <StatLabel>Email</StatLabel>
              <StatValue style={{ fontSize: "14px", fontWeight: "normal", marginBottom: "8px" }}>
                {borrower.email}
              </StatValue>

              <StatLabel>Phone</StatLabel>
              <StatValue style={{ fontSize: "14px", fontWeight: "normal", marginBottom: "15px" }}>
                {borrower.phone}
              </StatValue>
            </div>

            <BorrowerStats>
              <StatItem>
                <StatLabel>Active Loans</StatLabel>
                <StatValue>{borrower.activeLoans}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Total Borrowed</StatLabel>
                <StatValue>{borrower.totalBorrowed}</StatValue>
              </StatItem>
            </BorrowerStats>

            <BorrowerFooter>
              <BorrowerStatus active={borrower.status === "active"}>
                {borrower.status === "active" ? "Active" : "Inactive"}
              </BorrowerStatus>
              <ViewProfileButton>View Profile</ViewProfileButton>
            </BorrowerFooter>
          </BorrowerCard>
        ))}
      </BorrowersGrid>
    </BorrowersContainer>
  )
}

export default Borrowers

