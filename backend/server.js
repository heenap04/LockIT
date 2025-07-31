require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();

// Environment variable validation
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI environment variable is required');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is required');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twoFASecret: { type: String },
  twoFAEnabled: { type: Boolean, default: false },
  passwords: [{
    site: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model('User', userSchema);

// JWT Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Access token required' });
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Password Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate 2FA secret
    const twoFASecret = speakeasy.generateSecret({ 
      length: 20,
      name: `SecurePass:${username}`,
      issuer: 'SecurePass'
    });
    
    // Create user
    const user = new User({
      username,
      password: hashedPassword,
      twoFASecret: twoFASecret.base32,
      twoFAEnabled: false,
      passwords: []
    });
    
    await user.save();
    
    // Generate QR code
    const otpauthUrl = twoFASecret.otpauth_url;
    
    res.status(201).json({
      message: 'User registered successfully. Please setup 2FA.',
      twoFASecret: twoFASecret.base32,
      otpauthUrl,
      manualEntryCode: twoFASecret.base32
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2FA verification endpoint for registration
app.post('/api/verify-2fa', async (req, res) => {
  try {
    const { username, token } = req.body;
    
    if (!username || !token) {
      return res.status(400).json({ error: 'Username and token are required' });
    }
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify 2FA token
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token,
      window: 1
    });
    
    if (!verified) {
      return res.status(400).json({ error: 'Invalid 2FA token' });
    }
    
    // Enable 2FA for the user
    user.twoFAEnabled = true;
    await user.save();
    
    res.json({ 
      message: '2FA setup completed successfully',
      username: user.username
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password, token } = req.body;
    
    if (!username || !password || !token) {
      return res.status(400).json({ error: 'Username, password, and 2FA token are required' });
    }
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify 2FA token
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token,
      window: 1
    });
    
    if (!verified) {
      return res.status(401).json({ error: 'Invalid 2FA token' });
    }
    
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      accessToken,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Password routes
app.get('/api/passwords', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.passwords);
  } catch (error) {
    console.error('Get passwords error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/passwords', authenticateJWT, async (req, res) => {
  try {
    const { site, username, password } = req.body;
    
    if (!site || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.passwords.push({ site, username, password });
    await user.save();
    
    res.status(201).json({ 
      message: 'Password saved successfully',
      password: { site, username, password }
    });
  } catch (error) {
    console.error('Save password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete password endpoint
app.delete('/api/passwords/:passwordId', authenticateJWT, async (req, res) => {
  try {
    const { passwordId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.passwords = user.passwords.filter(pwd => pwd._id.toString() !== passwordId);
    await user.save();
    
    res.json({ message: 'Password deleted successfully' });
  } catch (error) {
    console.error('Delete password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should be running on http://localhost:3000`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
});