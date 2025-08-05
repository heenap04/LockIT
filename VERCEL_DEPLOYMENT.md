# 🚀 LockIT Frontend Deployment on Vercel

## Step-by-Step Vercel Deployment

### 1. Update Frontend Configuration
Update `frontend/.env` file:
```env
REACT_APP_API_URL=https://lockit-backend-jqji.onrender.com/api
```

### 2. Commit and Push Changes
```bash
git add .
git commit -m "Update API URL for production deployment"
git push origin main
```

### 3. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select `LockIT` repository
5. Configure settings:
   - **Framework**: Create React App (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://lockit-backend-jqji.onrender.com/api`
7. Click "Deploy"

### 4. Final Backend Configuration
After frontend deployment:
1. Copy your Vercel URL (e.g., `https://lockit-xyz.vercel.app`)
2. Go to Render dashboard
3. Update backend environment variable:
   - `FRONTEND_URL=https://your-vercel-url.vercel.app`
4. Redeploy backend service

### 5. Test Complete Application
- ✅ Registration
- ✅ 2FA Setup
- ✅ Login
- ✅ Password Management

## Vercel Advantages
- ✅ Faster deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Perfect for React apps
- ✅ Easy environment variable management

## Troubleshooting
- **Build fails**: Check if `frontend/.env` has correct API URL
- **API calls fail**: Verify `REACT_APP_API_URL` environment variable
- **CORS errors**: Update `FRONTEND_URL` in backend (Render dashboard)
