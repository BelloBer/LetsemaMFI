"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import styled from "styled-components"
import {
  FaUser,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa"

const ProfileContainer = styled.div`
  padding: 90px 30px 30px;
  max-width: 1000px;
  margin: 0 auto;
`

const PageTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 30px;
`

const ProfileCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
`

const ProfileTitle = styled.h2`
  font-size: 20px;
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

const ProfileSection = styled.div`
  margin-bottom: 20px;
`

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 15px;
  color: var(--text-light);
`

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`

const ProfileItem = styled.div`
  margin-bottom: 15px;
`

const ProfileLabel = styled.div`
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 5px;
`

const ProfileValue = styled.div`
  font-size: 16px;
  color: var(--text);
  font-weight: ${(props) => (props.bold ? "600" : "normal")};
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

const BorrowerProfile = () => {
  const { user, api } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    email: user?.email || "",
    address: {
      street: "",
      city: "",
      district: "",
      postal_code: "",
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!api) return

      setLoading(true)
      try {
        const profileData = await api.get(`${process.env.REACT_APP_API_URL}/profile/borrower/`)
        setProfile(profileData)
        setFormData({
          phone: profileData.phone || "",
          email: user?.email || "",
          address: profileData.address || {
            street: "",
            city: "",
            district: "",
            postal_code: "",
          },
        })
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to load profile data. Please try again later.")

        // For demo purposes, use mock data
        const mockProfile = {
          borrower_id: "550e8400-e29b-41d4-a716-446655440000",
          full_name: user?.username || "John Doe",
          national_id: "9201015876123",
          date_of_birth: "1992-01-01",
          phone: "+266 5885 1234",
          address: {
            street: "123 Kingsway Road",
            city: "Maseru",
            district: "Maseru",
            postal_code: "100",
          },
          created_at: "2023-01-15T10:30:00Z",
        }

        setProfile(mockProfile)
        setFormData({
          phone: mockProfile.phone || "",
          email: user?.email || "john.doe@example.com",
          address: mockProfile.address || {
            street: "",
            city: "",
            district: "",
            postal_code: "",
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [api, user])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      // Handle nested address fields
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async () => {
    try {
      // Submit updated profile to API
      await api.put(`${process.env.REACT_APP_API_URL}/profile/borrower/`, formData)

      // Update local profile state
      setProfile((prev) => ({
        ...prev,
        phone: formData.phone,
        address: formData.address,
      }))

      setSuccess("Profile updated successfully!")
      setEditing(false)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile. Please try again.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <ProfileContainer>
        <PageTitle>Your Profile</PageTitle>
        <ProfileCard>
          <p>Loading profile information...</p>
        </ProfileCard>
      </ProfileContainer>
    )
  }

  return (
    <ProfileContainer>
      <PageTitle>Your Profile</PageTitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <ProfileCard>
        <ProfileHeader>
          <ProfileTitle>
            <FaUser /> Personal Information
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

        <ProfileSection>
          <ProfileGrid>
            <ProfileItem>
              <ProfileLabel>Full Name</ProfileLabel>
              <ProfileValue bold>{profile?.full_name}</ProfileValue>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>
                <FaIdCard style={{ marginRight: "5px" }} /> National ID
              </ProfileLabel>
              <ProfileValue>{profile?.national_id}</ProfileValue>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>
                <FaCalendarAlt style={{ marginRight: "5px" }} /> Date of Birth
              </ProfileLabel>
              <ProfileValue>{formatDate(profile?.date_of_birth)}</ProfileValue>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>
                <FaPhone style={{ marginRight: "5px" }} /> Phone Number
              </ProfileLabel>
              {editing ? (
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +266 5885 1234"
                />
              ) : (
                <ProfileValue>{profile?.phone}</ProfileValue>
              )}
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>
                <FaEnvelope style={{ marginRight: "5px" }} /> Email
              </ProfileLabel>
              {editing ? (
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              ) : (
               <ProfileValue>
                {profile?.email || user?.email || "Not provided"}
              </ProfileValue>
              )}
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>Member Since</ProfileLabel>
              <ProfileValue>{formatDate(profile?.created_at)}</ProfileValue>
            </ProfileItem>
          </ProfileGrid>
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>
            <FaMapMarkerAlt style={{ marginRight: "5px" }} /> Address Information
          </SectionTitle>
          <ProfileGrid>
            <ProfileItem>
              <ProfileLabel>Street Address</ProfileLabel>
              {editing ? (
                <Input
                  type="text"
                  name="address.street"
                  value={formData.address?.street || ""}
                  onChange={handleChange}
                  placeholder="Street Address"
                />
              ) : (
                <ProfileValue>{profile?.address?.street || "Not provided"}</ProfileValue>
              )}
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>City/Village</ProfileLabel>
              {editing ? (
                <Input
                  type="text"
                  name="address.city"
                  value={formData.address?.city || ""}
                  onChange={handleChange}
                  placeholder="City/Village"
                />
              ) : (
                <ProfileValue>{profile?.address?.city || "Not provided"}</ProfileValue>
              )}
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>District</ProfileLabel>
              {editing ? (
                <Input
                  type="text"
                  name="address.district"
                  value={formData.address?.district || ""}
                  onChange={handleChange}
                  placeholder="District"
                />
              ) : (
                <ProfileValue>{profile?.address?.district || "Not provided"}</ProfileValue>
              )}
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>Postal Code</ProfileLabel>
              {editing ? (
                <Input
                  type="text"
                  name="address.postal_code"
                  value={formData.address?.postal_code || ""}
                  onChange={handleChange}
                  placeholder="Postal Code"
                />
              ) : (
                <ProfileValue>{profile?.address?.postal_code || "Not provided"}</ProfileValue>
              )}
            </ProfileItem>
          </ProfileGrid>
        </ProfileSection>
      </ProfileCard>
    </ProfileContainer>
  )
}

export default BorrowerProfile
