import { FaBell, FaUserCircle, FaSearch, FaEnvelope, FaCalendarAlt } from "react-icons/fa"
import styled from "styled-components"

const NavbarContainer = styled.nav`
  width: 100%;
  height: 70px;
  background: var(--card-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  color: var(--text);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 90;
  transition: all 0.3s ease-in-out;
  margin-left: ${(props) => (props.sidebarCollapsed ? "80px" : "260px")};
  width: calc(100% - ${(props) => (props.sidebarCollapsed ? "80px" : "260px")});
`

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    display: none;
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
  
  &::placeholder {
    color: var(--text-light);
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

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 20px;
  cursor: pointer;
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--background);
    color: var(--primary);
  }
`

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--background);
  }
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
  font-size: 20px;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const UserName = styled.span`
  font-weight: 600;
  font-size: 14px;
`

const UserRole = styled.span`
  font-size: 12px;
  color: var(--text-light);
`

const DateDisplay = styled.div`
  font-size: 14px;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const Navbar = ({ sidebarCollapsed }) => {
  // Get current date
  const today = new Date()
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  const formattedDate = today.toLocaleDateString("en-US", options)

  return (
    <NavbarContainer sidebarCollapsed={sidebarCollapsed}>
      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput placeholder="Search..." />
      </SearchContainer>

      <NavItems>
        <DateDisplay>
          <FaCalendarAlt />
          {formattedDate}
        </DateDisplay>

        <IconButton>
          <FaEnvelope />
          <NotificationBadge>3</NotificationBadge>
        </IconButton>

        <IconButton>
          <FaBell />
          <NotificationBadge>5</NotificationBadge>
        </IconButton>

        <UserProfile>
          <UserAvatar>
            <FaUserCircle />
          </UserAvatar>
          <UserInfo>
            <UserName>John Doe</UserName>
            <UserRole>Administrator</UserRole>
          </UserInfo>
        </UserProfile>
      </NavItems>
    </NavbarContainer>
  )
}

export default Navbar

