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
    
    /* New variables for enhanced styling */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
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
    transition: color var(--transition-fast);
  }
  
  a:hover {
    color: var(--primary);
  }

  button {
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  input, select, textarea {
    font-size: 1rem;
    transition: all var(--transition-fast);
  }
  
  input:focus, select:focus, textarea:focus {
    outline: none;
  }

  .page-container {
    transition: margin-left var(--transition-normal);
  }

  .card {
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
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
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  /* Utility classes */
  .animate-fadeIn {
    animation: fadeIn 0.5s ease forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.5s ease forwards;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  
  .text-center {
    text-align: center;
  }
  
  .flex {
    display: flex;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-center {
    justify-content: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .gap-2 {
    gap: 0.5rem;
  }
  
  .gap-4 {
    gap: 1rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  .h-full {
    height: 100%;
  }
  
  .p-4 {
    padding: 1rem;
  }
  
  .m-4 {
    margin: 1rem;
  }
  
  .rounded {
    border-radius: var(--radius-md);
  }
  
  .shadow {
    box-shadow: var(--shadow-md);
  }
`

export default GlobalStyles

