"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import styled from "styled-components"
import { FaUser, FaEnvelope, FaBuilding, FaUserTie, FaEdit, FaSave, FaTimes } from "react-icons/fa"

const ProfileContainer = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 90px auto 30px;
`

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
`

const ProfileTitle = styled.h2`
  font-size: 24px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${(props) => (props.save ? "var(--success)" : props.cancel ? "var(--danger)" : "var(--primary)")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`

const InfoSection = styled.div`
  margin-bottom: 30px;
`

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoLabel = styled.div`
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 5px;
`

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
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

const ErrorMessage = styled.div`
  color: var(--danger);
  font-size: 14px;
  margin-top: 10px;
  padding: 10px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
`

const SuccessMessage = styled.div`
  color: var(--success);
  font-size: 14px;
  margin-top: 10px;
  padding: 10px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
`

const StaffProfile = () => {
  const { user, api } = useAuth()
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    email: user?.email || "",
  })
  const [mfiInfo, setMfiInfo] = useState(null)
  const [mfiLoading, setMfiLoading] = useState(false)

  useEffect(() => {
    // If user.mfi is a string (UUID), fetch the MFI details
    if (user?.mfi && typeof user.mfi === "string") {
      setMfiLoading(true)
      api.get(`${process.env.REACT_APP_API_URL}/mfis/${user.mfi}/`)
        .then((data) => setMfiInfo(data))
        .catch(() => setMfiInfo(null))
        .finally(() => setMfiLoading(false))
    } else if (user?.mfi && typeof user.mfi === "object") {
      setMfiInfo(user.mfi)
    } else if (user?.mfi_details) {
      setMfiInfo(user.mfi_details)
    }
  }, [user, api])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      await api.put(`${process.env.REACT_APP_API_URL}/profile/`, formData)
      setSuccess("Profile updated successfully!")
      setEditing(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    }
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>
          <FaUser /> Staff Profile
        </ProfileTitle>
        {!editing ? (
          <EditButton onClick={() => setEditing(true)}>
            <FaEdit /> Edit Profile
          </EditButton>
        ) : (
          <ButtonGroup>
            <EditButton cancel onClick={() => setEditing(false)}>
              <FaTimes /> Cancel
            </EditButton>
            <EditButton save onClick={handleSubmit}>
              <FaSave /> Save Changes
            </EditButton>
          </ButtonGroup>
        )}
      </ProfileHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <InfoSection>
        <SectionTitle>
          <FaUserTie /> Personal Information
        </SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Username</InfoLabel>
            <InfoValue>{user?.username}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email</InfoLabel>
            {editing ? (
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            ) : (
              <InfoValue>{user?.email}</InfoValue>
            )}
          </InfoItem>
          <InfoItem>
            <InfoLabel>Role</InfoLabel>
            <InfoValue>{user?.role}</InfoValue>
          </InfoItem>
        </InfoGrid>
      </InfoSection>

      <InfoSection>
        <SectionTitle>
          <FaBuilding /> MFI Information
        </SectionTitle>
        {mfiLoading ? (
          <InfoValue>Loading MFI information...</InfoValue>
        ) : mfiInfo ? (
          <InfoGrid>
            <InfoItem>
              <InfoLabel>MFI Name</InfoLabel>
              <InfoValue>{mfiInfo.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>MFI Location</InfoLabel>
              <InfoValue>{mfiInfo.location}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>MFI ID</InfoLabel>
              <InfoValue>{mfiInfo.mfi_id}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>MFI Status</InfoLabel>
              <InfoValue>{mfiInfo.is_active ? "Active" : "Inactive"}</InfoValue>
            </InfoItem>
          </InfoGrid>
        ) : (
          <InfoValue>No MFI information available.</InfoValue>
        )}
      </InfoSection>
    </ProfileContainer>
  )
}

export default StaffProfile 