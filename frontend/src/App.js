import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';

// Base API configuration - Use environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_BASE_URL;

console.log('🔗 API Base URL:', API_BASE_URL);

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    min-height: 100vh;
    color: #e8e8e8;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

// Styled Components
const Container = styled(motion.div)`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    margin: 0.5rem;
    padding: 1rem;
    border-radius: 12px;
  }
`;

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const FormGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #b8b8b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled(motion.input)`
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  color: #e8e8e8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    background: rgba(255, 255, 255, 0.12);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #6366f1;
  border: 2px solid #6366f1;

  &:hover {
    background: rgba(99, 102, 241, 0.1);
  }
`;

const PasswordList = styled(motion.ul)`
  list-style: none;
  margin: 2rem 0;
  display: grid;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const PasswordItem = styled(motion.li)`
  background: rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const PasswordContent = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const PasswordInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SiteName = styled.strong`
  font-size: 1.1rem;
  color: #6366f1;
  font-weight: 600;
`;

const Username = styled.span`
  color: #b8b8b8;
  font-size: 0.9rem;
`;

const Password = styled.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #e8e8e8;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &::after {
    content: 'Click to copy';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    white-space: nowrap;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #b8b8b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #6366f1;
    background: rgba(99, 102, 241, 0.1);
  }
`;

const CopyButton = styled.button`
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #6366f1;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 1rem;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.5);
  }

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: 0.8rem;
  }
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${props => {
    if (props.strength === 'weak') return '#ef4444';
    if (props.strength === 'medium') return '#f59e0b';
    if (props.strength === 'strong') return '#10b981';
    return '#b8b8b8';
  }};
`;

const StrengthBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 0.3rem;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.strength}%;
    background: ${props => {
      if (props.strength <= 33) return '#ef4444';
      if (props.strength <= 66) return '#f59e0b';
      return '#10b981';
    }};
    transition: all 0.3s ease;
  }
`;

const Title = styled(motion.h1)`
  color: #ffffff;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled(motion.h2)`
  color: #b8b8b8;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 500;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const QRContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem 0;
  text-align: center;
`;

const QRWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SecretKey = styled.div`
  background: rgba(255, 255, 255, 0.08);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  word-break: break-all;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e8e8e8;
  font-size: 0.9rem;
  margin: 1rem 0;
`;

const ErrorMessage = styled(motion.div)`
  color: #ef4444;
  padding: 1rem 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const SuccessMessage = styled(motion.div)`
  color: #10b981;
  padding: 1rem 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const WelcomeText = styled.div`
  h1 {
    color: #ffffff;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    color: #b8b8b8;
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const LogoutButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;

  &:hover {
    box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #b8b8b8;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #6366f1;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top: 3px solid #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
  }
`;

const Toast = styled(motion.div)`
  background: ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  max-width: 300px;

  @media (max-width: 768px) {
    max-width: none;
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
  }
`;

// Auth context
const AuthContext = React.createContext();

function App() {
  const [auth, setAuth] = useState({
    token: null,
    username: null,
    isAuthenticated: false
  });
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

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
      <AuthContext.Provider value={{ auth, login, logout, showToast }}>
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
        <ToastContainer>
          <AnimatePresence>
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                type={toast.type}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.3 }}
              >
                {toast.message}
              </Toast>
            ))}
          </AnimatePresence>
        </ToastContainer>
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
        <Title>Create Account</Title>
        <Subtitle>Secure your digital life with our password manager</Subtitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleRegister}>
          <FormGroup>
            <Label>Username</Label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Enter your username"
            />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Create a strong password"
            />
          </FormGroup>
          <FormGroup>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Confirm your password"
            />
          </FormGroup>
          <Button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#b8b8b8' }}>
          Already have an account?{' '}
          <SecondaryButton 
            onClick={() => navigate('/login')}
            style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Sign In
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
      <Title>Two-Factor Authentication</Title>
      <Subtitle>Scan the QR code with your authenticator app</Subtitle>
      {success && <SuccessMessage>{success}</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <QRContainer>
        <QRWrapper>
          <QRCodeSVG 
            value={twoFA.otpauthUrl} 
            size={200} 
            level="H"
          />
        </QRWrapper>
        
        <div>
          <p style={{ color: '#b8b8b8', marginBottom: '1rem' }}>
            Or enter this secret manually in your authenticator app:
          </p>
          <SecretKey>
            {twoFA.twoFASecret}
          </SecretKey>
        </div>
        
        <FormGroup style={{ width: '100%', maxWidth: '300px' }}>
          <Label>Verification Code</Label>
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
            style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem' }}
          />
        </FormGroup>
        
        <Button
          onClick={handleVerify2FA}
          disabled={isLoading || verificationCode.length !== 6}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
      <Title>Welcome Back</Title>
      <Subtitle>Sign in to access your secure passwords</Subtitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Username</Label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </FormGroup>
        <FormGroup>
          <Label>2FA Code</Label>
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </Form>
      <p style={{ textAlign: 'center', marginTop: '2rem', color: '#b8b8b8' }}>
        Don't have an account?{' '}
        <SecondaryButton 
          onClick={() => navigate('/register')}
          style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          Create Account
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
  const [showPassword, setShowPassword] = useState(false);
  const { auth, logout, showToast } = React.useContext(AuthContext);

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
      showToast('Password saved successfully!', 'success');
    } catch (error) {
      setError('Failed to save password');
      showToast('Failed to save password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 'none', percentage: 0 };
    
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    
    if (score <= 25) return { strength: 'weak', percentage: score };
    if (score <= 50) return { strength: 'medium', percentage: score };
    return { strength: 'strong', percentage: score };
  };

  const passwordStrength = getPasswordStrength(newPassword.password);

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <WelcomeText>
          <h1>Welcome back, {auth.username}!</h1>
          <p>Manage your secure passwords</p>
        </WelcomeText>
        <LogoutButton 
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Out
        </LogoutButton>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Subtitle>Your Passwords</Subtitle>
      {isLoading ? (
        <LoadingSpinner />
      ) : passwords.length === 0 ? (
        <EmptyState>
          <h3>No passwords yet</h3>
          <p>Start by adding your first password below to keep it secure and organized.</p>
        </EmptyState>
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
                <PasswordContent>
                  <PasswordInfo>
                    <SiteName>{item.site}</SiteName>
                    <Username>Username: {item.username}</Username>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Password onClick={() => copyToClipboard(item.password)}>
                        Password: {item.password}
                      </Password>
                      <CopyButton onClick={() => copyToClipboard(item.password)}>
                        Copy
                      </CopyButton>
                    </div>
                  </PasswordInfo>
                </PasswordContent>
              </PasswordItem>
            ))}
          </AnimatePresence>
        </PasswordList>
      )}
      
      <Subtitle>Add New Password</Subtitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Website/Service</Label>
          <Input
            type="text"
            name="site"
            value={newPassword.site}
            onChange={handleChange}
            required
            placeholder="e.g., github.com, gmail.com"
          />
        </FormGroup>
        <FormGroup>
          <Label>Username/Email</Label>
          <Input
            type="text"
            name="username"
            value={newPassword.username}
            onChange={handleChange}
            required
            placeholder="Enter username or email"
          />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <PasswordInputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={newPassword.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{ paddingRight: '3rem' }}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </PasswordToggle>
          </PasswordInputWrapper>
          {newPassword.password && (
            <PasswordStrength strength={passwordStrength.strength}>
              Password strength: {passwordStrength.strength}
              <StrengthBar strength={passwordStrength.percentage} />
            </PasswordStrength>
          )}
        </FormGroup>
        <Button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Saving...' : 'Save Password'}
        </Button>
      </Form>
    </Container>
  );
}

export default App;