//src/pages/Register.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f1f8f5;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #004d40;
  text-align: center;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #b0bec5;
  border-radius: 6px;
  font-size: 1rem;
  &:focus {
    border-color: #00796b;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #b0bec5;
  border-radius: 6px;
  font-size: 1rem;
  &:focus {
    border-color: #00796b;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #004d40;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #00796b;
  }
  &:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled(Message)`
  background-color: #f8d7da;
  color: #d32f2f;
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled(Message)`
  background-color: #d4edda;
  color: #388e3c;
  border: 1px solid #c3e6cb;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'BORROWER',
    mfi: ''
  });
  const [mfis, setMfis] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'SYSTEM_ADMIN') {
      api.get('/api/mfis/').then(res => setMfis(res.data));
    }
  }, [user, api]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await register(formData);
      setSuccess('Registration successful! Redirecting...');
      
      setTimeout(() => {
        navigate(user ? '/' : '/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data.detail || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterContainer>
      <Title>Register New User</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          minLength="8"
        />
        <Select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          disabled={!user}
        >
          <option value="BORROWER">Borrower</option>
          {user?.role === 'SYSTEM_ADMIN' && (
            <>
              <option value="LOAN_OFFICER">Loan Officer</option>
              <option value="MFI_ADMIN">MFI Admin</option>
              <option value="CREDIT_ANALYST">Credit Analyst</option>
              <option value="AUDITOR">Auditor</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
            </>
          )}
        </Select>
        {user?.role === 'SYSTEM_ADMIN' && (
          <Select
            value={formData.mfi}
            onChange={(e) => setFormData({...formData, mfi: e.target.value})}
          >
            <option value="">Select MFI</option>
            {mfis.map(mfi => (
              <option key={mfi.id} value={mfi.id}>
                {mfi.name}
              </option>
            ))}
          </Select>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </Form>
    </RegisterContainer>
  );
};

export default Register;
