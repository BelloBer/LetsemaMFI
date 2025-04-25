import styled from "styled-components"
import { Link } from "react-router-dom"

export const SidebarContainer = styled.div`
  width: ${(props) => (props.collapsed ? "80px" : "260px")};
  height: 100vh;
  background: var(--sidebar);
  color: white;
  position: fixed;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: ${(props) => (props.collapsed ? "none" : "4px 0 10px rgba(0, 0, 0, 0.1)")};
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--sidebar);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? "center" : "space-between")};
  padding: ${(props) => (props.collapsed ? "20px 0" : "20px")};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

export const Logo = styled.div`
  font-size: ${(props) => (props.collapsed ? "0" : "24px")};
  font-weight: 700;
  color: white;
  transition: all 0.3s ease;
  overflow: hidden;
  white-space: nowrap;
  
  span {
    color: var(--primary-light);
  }
`

export const LogoIcon = styled.div`
  display: ${(props) => (props.collapsed ? "block" : "none")};
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-light);
`

export const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary-light);
  }
`

export const MenuSection = styled.div`
  margin-top: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const MenuLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  padding: ${(props) => (props.collapsed ? "10px 0" : "10px 20px")};
  margin-top: 10px;
  letter-spacing: 1px;
  display: ${(props) => (props.collapsed ? "none" : "block")};
`

export const MenuItem = styled(({ collapsed, active, as: Component = Link, ...rest }) => <Component {...rest} />)`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.collapsed ? "0" : "12px")};
  padding: ${(props) => (props.collapsed ? "16px 0" : "14px 20px")};
  text-decoration: none;
  color: ${(props) => (props.active ? "white" : "rgba(255, 255, 255, 0.7)")};
  font-size: 16px;
  transition: all 0.2s ease-in-out;
  border-left: ${(props) => (props.active ? "4px solid var(--primary-light)" : "4px solid transparent")};
  background: ${(props) => (props.active ? "var(--sidebar-hover)" : "transparent")};
  justify-content: ${(props) => (props.collapsed ? "center" : "flex-start")};
  border: none;
  width: 100%;
  cursor: pointer;
  position: relative;

  &:hover {
    background: var(--sidebar-hover);
    color: white;
  }

  svg {
    font-size: 18px;
    min-width: 18px;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: ${(props) => (props.active ? "var(--primary-light)" : "transparent")};
    transition: all 0.2s ease;
  }
  
  &:hover::after {
    background: ${(props) => (!props.active ? "rgba(255, 255, 255, 0.2)" : "var(--primary-light)")};
  }
`

export const MenuText = styled.span`
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.collapsed ? 0 : 1)};
  display: ${(props) => (props.collapsed ? "none" : "inline")};
  white-space: nowrap;
`

export const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${(props) => (props.collapsed ? "none" : "block")};
`

export const FooterText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
`



