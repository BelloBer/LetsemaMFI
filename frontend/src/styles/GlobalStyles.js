// src/styles/GlobalStyles.js
import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  :root {
    --primary: #0891b2;
    --primary-light: #06b6d4;
    --primary-dark: #0e7490;
    --secondary: #8b5cf6;
    --secondary-light: #a78bfa;
    --accent: #f97316;
    --background: #f8fafc;
    --card-bg: #ffffff;
    --text: #1e293b;
    --text-light: #64748b;
    --sidebar: #0f172a;
    --sidebar-hover: #1e293b;
    --border: #e2e8f0;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Segoe UI', sans-serif;
  }

  body {
    background: var(--background);
    color: var(--text);
    font-size: 16px;
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 1rem;
    color: var(--text);
  }

  h1 {
    font-size: 2.25rem;
  }

  h2 {
    font-size: 1.875rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 1rem;
    color: var(--text-light);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
  }

  .page-container {
    transition: margin-left 0.3s ease-in-out;
  }

  .card {
    background: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .badge-success {
    background-color: rgba(16, 185, 129, 0.1);
    color: var(--success);
  }

  .badge-warning {
    background-color: rgba(245, 158, 11, 0.1);
    color: var(--warning);
  }

  .badge-danger {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--danger);
  }
`

export default GlobalStyles

