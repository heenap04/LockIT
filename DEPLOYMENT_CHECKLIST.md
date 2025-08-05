# 🚀 LockIT Deployment Checklist

## Phase 1: Backend Deployment (Render)
- [ ] Go to [Render.com](https://render.com) and sign in
- [ ] Create New Web Service
- [ ] Connect GitHub repository: LockIT
- [ ] Configure service:
  - Name: `lockit-backend`
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Set Environment Variables:
  ```
  MONGO_URI=mongodb+srv://heenapawriya229:harshguleri04@cluster0.lmt0qyc.mongodb.net/password-manager
  JWT_SECRET=1639a46df122620c1ac073ced80d1209c5b2c9a18801f01df7275977b8866000736d69391a0e2ccd9a3bbf1ad8eb05ca4ad96ebd8bb701ea4b6394df8f77942a
  PORT=5000
  NODE_ENV=production
  FRONTEND_URL=(leave empty for now)
  ```
- [ ] Deploy and wait for completion
- [ ] Copy backend URL (e.g., https://lockit-backend-xyz.onrender.com)
- [ ] Test backend health: `your-backend-url/api/health`

## Phase 2: Frontend Configuration
- [ ] Update `frontend/.env` file:
  ```
  REACT_APP_API_URL=https://your-backend-url.onrender.com/api
  ```
- [ ] Commit and push changes to GitHub

## Phase 3: Frontend Deployment (Netlify)
- [ ] Go to [Netlify.com](https://netlify.com) and sign in
- [ ] Create New Site from Git
- [ ] Connect GitHub repository: LockIT
- [ ] Configure build settings:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `build`
- [ ] Set Environment Variables:
  ```
  REACT_APP_API_URL=https://your-backend-url.onrender.com/api
  ```
- [ ] Deploy and wait for completion
- [ ] Copy frontend URL (e.g., https://amazing-app-xyz.netlify.app)

## Phase 4: Final Configuration
- [ ] Update backend FRONTEND_URL in Render:
  ```
  FRONTEND_URL=https://your-frontend-url.netlify.app
  ```
- [ ] Redeploy backend service
- [ ] Test complete application:
  - [ ] Registration works
  - [ ] 2FA setup works
  - [ ] Login works
  - [ ] Password management works

## 🎉 Deployment Complete!
Your LockIT Password Manager is now live and accessible worldwide!

## Troubleshooting
- If login fails: Check CORS configuration (FRONTEND_URL)
- If API calls fail: Check REACT_APP_API_URL in frontend
- If database fails: Check MONGO_URI connection string
