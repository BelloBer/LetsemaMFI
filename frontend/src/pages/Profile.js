"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import styled from "styled-components"
import { FaUser, FaEnvelope, FaBuilding } from "react-icons/fa"

const ProfileContainer = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 90px auto 30px;
`

const ProfileHeader = styled.div`
  margin-bottom: 30px;
`

const ProfileTitle = styled.h2`
  font-size: 24px;
  margin: 0;
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

const Profile = () => {
  const { user } = useAuth()

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>Profile</ProfileTitle>
      </ProfileHeader>

      <InfoSection>
        <SectionTitle>
          <FaUser /> Personal Information
        </SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Username</InfoLabel>
            <InfoValue>{user?.username}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user?.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Role</InfoLabel>
            <InfoValue>{user?.role}</InfoValue>
          </InfoItem>
        </InfoGrid>
      </InfoSection>

      {user?.mfi && (
        <InfoSection>
          <SectionTitle>
            <FaBuilding /> MFI Information
          </SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>MFI Name</InfoLabel>
              <InfoValue>{user.mfi.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>MFI Location</InfoLabel>
              <InfoValue>{user.mfi.location}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </InfoSection>
      )}
    </ProfileContainer>
  )
}

export default Profile