# Division Orderly - Deployment Guide

## 🚀 Deployment Setup

This guide will help you deploy the Division Orderly application to production.

### Architecture
- **Frontend**: Next.js deployed on Vercel
- **Backend**: FastAPI deployed on Railway
- **Database**: PostgreSQL on Railway
- **File Storage**: Railway file system (or AWS S3 for production)

## 📋 Prerequisites

1. **GitHub Account** - for code repository
2. **Vercel Account** - for frontend deployment
3. **Railway Account** - for backend deployment
4. **Anthropic API Key** - for Claude AI processing

## 🔧 Step 1: Frontend Deployment (Vercel)

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin deployment-prep
```

### 1.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `deployment-prep` branch
5. Configure environment variables:
   - `NEXT_PUBLIC_BACKEND_URL` = (will be set after backend deployment)

### 1.3 Environment Variables
Set these in Vercel dashboard:
```
NEXT_PUBLIC_BACKEND_URL=https://your-railway-backend.railway.app
```

## 🔧 Step 2: Backend Deployment (Railway)

### 2.1 Prepare Backend
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository and `deployment-prep` branch
5. Set root directory to `backend`

### 2.2 Environment Variables
Set these in Railway dashboard:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DATABASE_URL=postgresql://... (Railway will provide this)
```

### 2.3 Deploy Backend
1. Railway will automatically detect Python/FastAPI
2. It will install dependencies from `requirements.txt`
3. Deploy the application

### 2.4 Get Backend URL
1. Go to your Railway project
2. Copy the generated URL (e.g., `https://your-app.railway.app`)
3. Update Vercel environment variable:
   - `NEXT_PUBLIC_BACKEND_URL=https://your-app.railway.app`

## 🔧 Step 3: Database Setup

### 3.1 PostgreSQL on Railway
1. In Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will provide the `DATABASE_URL`
4. Add it to your backend environment variables

### 3.2 Run Migrations
```bash
# Connect to Railway backend
railway shell

# Run database migrations
python -c "from database import init_db; init_db()"
```

## 🔧 Step 4: Test Deployment

1. **Frontend**: Visit your Vercel URL
2. **Upload a PDF**: Test the full workflow
3. **Check Dashboard**: Verify records are saved
4. **Test Execute**: Click Execute button and verify PDF loads

## 🔧 Step 5: Production Optimizations

### 5.1 File Storage (Optional)
For production, consider using AWS S3 for PDF storage:
1. Create S3 bucket
2. Update backend to use S3 instead of local storage
3. Add AWS credentials to Railway environment variables

### 5.2 Custom Domain (Optional)
1. **Vercel**: Add custom domain in dashboard
2. **SSL**: Automatically handled by Vercel
3. **DNS**: Update your domain's DNS settings

## 🛠️ Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend URL is correct in Vercel
2. **PDF Loading**: Check Railway logs for file storage issues
3. **Database**: Verify DATABASE_URL is set correctly

### Logs
- **Vercel**: Check deployment logs in dashboard
- **Railway**: Check application logs in dashboard

## 🔄 Updates

To update the deployment:
1. Make changes in `deployment-prep` branch
2. Push to GitHub
3. Vercel and Railway will auto-deploy

## 📞 Support

If you encounter issues:
1. Check Vercel/Railway logs
2. Verify environment variables
3. Test locally first
4. Check this deployment guide

---

**Note**: This deployment setup keeps your main branch safe. All deployment changes are in the `deployment-prep` branch. 