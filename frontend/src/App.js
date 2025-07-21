import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';

// Base API configuration
axios.defaults.baseURL = 'https://lockit-server.onrender.com/api';


// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  body {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    color: #333;
  }
`;

// Styled Components
const Container = styled(motion.div)`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled(motion.input)`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a6bff;
    box-shadow: 0 0 0 3px rgba(74, 107, 255, 0.2);
  }
`;

const Button = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: #4a6bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3a5bef;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #4a6bff;
  border: 1px solid #4a6bff;

  &:hover {
    background: rgba(74, 107, 255, 0.1);
  }
`;

const PasswordList = styled(motion.ul)`
  list-style: none;
  margin: 2rem 0;
`;

const PasswordItem = styled(motion.li)`
  background: #f8f9fa;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const Title = styled(motion.h2)`
  color: #4a6bff;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const QRContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  text-align: center;
`;

const ErrorMessage = styled(motion.div)`
  color: #ff4a4a;
  padding: 0.5rem;
  background: rgba(255, 74, 74, 0.1);
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled(motion.div)`
  color: #4CAF50;
  padding: 0.5rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1rem;
`;

// Auth context
const AuthContext = React.createContext();

function App() {
  const [auth, setAuth] = useState({
    token: null,
    username: null,
    isAuthenticated: false
  });

  const login = (token, username) => {
    setAuth({
      token,
      username,
      isAuthenticated: true
    });
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setAuth({
      token: null,
      username: null,
      isAuthenticated: false
    });
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setAuth({
        token,
        username,
        isAuthenticated: true
      });
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <AuthContext.Provider value={{ auth, login, logout }}>
        <Router>
          <AnimatePresence>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </Router>
      </AuthContext.Provider>
    </>
  );
}

// Protected route component
function ProtectedRoute({ children }) {
  const { auth } = React.useContext(AuthContext);
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Home component
function Home() {
  const { auth } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [auth, navigate]);

  return null;
}

// Register component
function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [twoFA, setTwoFA] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/register', {
        username: formData.username,
        password: formData.password
      });
      setTwoFA(response.data);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would verify the code with the server
      // For demo purposes, we'll just proceed
      setSuccess('2FA setup successful! You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title>Register</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleRegister}>
          <FormGroup>
            <label>Username:</label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          </FormGroup>
          <FormGroup>
            <label>Password:</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </FormGroup>
          <FormGroup>
            <label>Confirm Password:</label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
            />
          </FormGroup>
          <Button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </Form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account?{' '}
          <SecondaryButton onClick={() => navigate('/login')}>
            Login
          </SecondaryButton>
        </p>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Title>Setup Two-Factor Authentication</Title>
      {success && <SuccessMessage>{success}</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <QRContainer>
        <p>Scan this QR code with your authenticator app:</p>
        
        <div style={{ 
          background: 'white', 
          padding: '1rem', 
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          <QRCodeSVG 
            value={twoFA.otpauthUrl} 
            size={200} 
            level="H"
          />
        </div>
        
        <div>
          <p>Or enter this secret manually:</p>
          <div style={{
            background: '#f5f5f5',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            margin: '0.5rem 0'
          }}>
            {twoFA.twoFASecret}
          </div>
        </div>
        
        <FormGroup style={{ width: '100%', maxWidth: '300px' }}>
          <label>Enter 6-digit verification code:</label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(value);
            }}
            placeholder="123456"
            style={{ textAlign: 'center', letterSpacing: '0.5em' }}
          />
        </FormGroup>
        
        <Button
          onClick={handleVerify2FA}
          disabled={isLoading || verificationCode.length !== 6}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </QRContainer>
    </Container>
  );
}

// Login component
function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    token: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/login', formData);
      login(response.data.accessToken, response.data.username);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please check your credentials and 2FA code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Title>Login</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Username:</label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Password:</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>2FA Code:</label>
          <Input
            type="text"
            name="token"
            value={formData.token}
            onChange={handleChange}
            required
            placeholder="Enter 6-digit code from your authenticator app"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </FormGroup>
        <Button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account?{' '}
        <SecondaryButton onClick={() => navigate('/register')}>
          Register
        </SecondaryButton>
      </p>
    </Container>
  );
}

// Dashboard component
function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({
    site: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { auth, logout } = React.useContext(AuthContext);

  useEffect(() => {
    const fetchPasswords = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/passwords', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setPasswords(response.data);
      } catch (error) {
        setError('Failed to fetch passwords');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPasswords();
  }, [auth.token]);

  const handleChange = (e) => {
    setNewPassword({
      ...newPassword,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post('/passwords', newPassword, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      
      // Refresh passwords list
      const response = await axios.get('/passwords', {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setPasswords(response.data);
      setNewPassword({ site: '', username: '', password: '' });
    } catch (error) {
      setError('Failed to save password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Welcome, {auth.username}!</Title>
        <Button 
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ backgroundColor: '#ff4a4a' }}
        >
          Logout
        </Button>
      </div>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <h3>Your Passwords</h3>
      {isLoading ? (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          Loading...
        </div>
      ) : passwords.length === 0 ? (
        <p style={{ textAlign: 'center', margin: '2rem 0' }}>
          No passwords saved yet.
        </p>
      ) : (
        <PasswordList>
          <AnimatePresence>
            {passwords.map((item, index) => (
              <PasswordItem
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div>
                  <strong>{item.site}</strong> - {item.username} - {item.password}
                </div>
              </PasswordItem>
            ))}
          </AnimatePresence>
        </PasswordList>
      )}
      
      <h3>Add New Password</h3>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Site:</label>
          <Input
            type="text"
            name="site"
            value={newPassword.site}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Username:</label>
          <Input
            type="text"
            name="username"
            value={newPassword.username}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Password:</label>
          <Input
            type="text"
            name="password"
            value={newPassword.password}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Saving...' : 'Save Password'}
        </Button>
      </Form>
    </Container>
  );
}

export default App;