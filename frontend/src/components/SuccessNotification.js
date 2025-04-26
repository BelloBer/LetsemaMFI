"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { FaCheckCircle, FaTimes } from "react-icons/fa"

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #10b981;
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  max-width: 400px;
  animation: slideIn 0.3s ease-out forwards;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`

const IconContainer = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MessageContainer = styled.div`
  flex: 1;
`

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`

const Message = styled.div`
  font-size: 14px;
  opacity: 0.9;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`

const SuccessNotification = ({ title, message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
  }

  if (!visible) return null

  return (
    <NotificationContainer>
      <IconContainer>
        <FaCheckCircle />
      </IconContainer>
      <MessageContainer>
        <Title>{title}</Title>
        {message && <Message>{message}</Message>}
      </MessageContainer>
      <CloseButton onClick={handleClose}>
        <FaTimes />
      </CloseButton>
    </NotificationContainer>
  )
}

export default SuccessNotification
