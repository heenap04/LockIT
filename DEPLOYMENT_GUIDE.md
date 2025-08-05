# 🚀 LockIT Password Manager - Deployment Guide

## 🔧 Pre-Deployment Setup

### 1. Backend Configuration
1. **Environment Variables**: Create `.env` file in `/backend` with:
   ```env
   MONGO_URI=your-production-mongodb-uri
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **MongoDB Setup**: 
   - Use MongoDB Atlas for production
   - Get connection string from MongoDB Atlas dashboard
   - Replace `MONGO_URI` with your Atlas connection string

### 2. Frontend Configuration
1. **Environment Variables**: Create `.env` file in `/frontend` with:
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

## 🌐 Deployment Options

### Option A: Netlify (Frontend) + Railway/Render (Backend)

#### Backend Deployment (Railway/Render):
1. Push code to GitHub
2. Connect Railway/Render to your GitHub repo
3. Set environment variables in dashboard:
   - `MONGO_URI`
   - `JWT_SECRET` 
   - `FRONTEND_URL`
4. Deploy from `/backend` folder

#### Frontend Deployment (Netlify):
1. Build command: `npm run build`
2. Publish directory: `build`
3. Set environment variable: `REACT_APP_API_URL`

### Option B: Vercel (Full Stack)
1. Deploy backend as Vercel Function
2. Deploy frontend as static site
3. Configure environment variables

### Option C: Heroku (Full Stack)
1. Create two Heroku apps (frontend & backend)
2. Configure buildpacks and environment variables
3. Deploy using Git

## ⚠️ Common Deployment Issues & Solutions

### 1. CORS Errors
- **Problem**: Frontend can't connect to backend
- **Solution**: Ensure `FRONTEND_URL` is set correctly in backend

### 2. Environment Variables Not Loading
- **Problem**: API calls fail with localhost URLs
- **Solution**: Verify `.env` files are created and variables are set

### 3. MongoDB Connection Issues
- **Problem**: Database connection fails
- **Solution**: Use MongoDB Atlas and whitelist all IPs (0.0.0.0/0)

### 4. 2FA QR Code Not Loading
- **Problem**: QR codes don't display
- **Solution**: Ensure backend is accessible and CORS is configured

## 🧪 Testing Deployment

1. **Local Testing with Production Config**:
   ```bash
   # Backend
   cd backend
   NODE_ENV=production npm start
   
   # Frontend  
   cd frontend
   REACT_APP_API_URL=your-backend-url npm start
   ```

2. **Production Testing**:
   - Test user registration
   - Test 2FA setup
   - Test login functionality
   - Test password management

## 📝 Deployment Checklist

- [ ] MongoDB Atlas database created
- [ ] Backend environment variables configured
- [ ] Frontend environment variables configured
- [ ] CORS origins updated
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Registration/login tested
- [ ] 2FA functionality tested
- [ ] Password management tested
