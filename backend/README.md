# Password Manager Backend

A secure backend API for the password manager with two-factor authentication (2FA).

## Features

- 🔐 JWT-based authentication
- 🔒 Two-factor authentication (TOTP)
- 🗄️ MongoDB database integration
- 🔑 Password CRUD operations
- 🛡️ Password hashing with bcrypt
- 🌐 CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` file with your actual values:

```env
MONGO_URI=mongodb://localhost:27017/password-manager
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

**Important:** Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Database Setup

Make sure MongoDB is running. For local development:
```bash
# Start MongoDB (if installed locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your Atlas connection string
```

### 4. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/verify-2fa` - Verify 2FA setup
- `POST /api/login` - User login

### Passwords
- `GET /api/passwords` - Get user passwords
- `POST /api/passwords` - Save new password
- `DELETE /api/passwords/:id` - Delete password

### Health Check
- `GET /api/health` - API health status

## API Documentation

### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword123"
}
```

### Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword123",
  "token": "123456"
}
```

### Save Password
```http
POST /api/passwords
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "site": "github.com",
  "username": "user@example.com",
  "password": "mypassword123"
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **2FA Support**: Time-based One-Time Password (TOTP) authentication
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data exposure

## Development

### Project Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (create from env.example)
├── env.example       # Environment template
└── README.md         # This file
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your MONGO_URI in .env
   - Verify network connectivity

2. **JWT Secret Error**
   - Generate a new JWT secret
   - Ensure it's at least 32 characters long

3. **Port Already in Use**
   - Change PORT in .env
   - Or kill the process using the port

### Logs
The server provides detailed console logs for debugging:
- ✅ Successful operations
- ❌ Error messages
- 🔗 Connection status

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Use HTTPS
6. Consider rate limiting
7. Set up monitoring and logging

## License

ISC 