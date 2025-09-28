# 🚀 Botanic Defenders - Vercel Deployment Guide

This guide will help you deploy both the frontend and backend of Botanic Defenders to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: For repository hosting
3. **Google Gemini API Key**: Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🔧 Backend Deployment

### Step 1: Prepare Backend Repository

1. Create a new GitHub repository for the backend
2. Copy the `backend` folder contents to the new repository
3. Make sure these files are present:
   - `api/index.py` (main FastAPI application)
   - `vercel.json` (Vercel configuration)
   - `requirements.txt` (Python dependencies)

### Step 2: Deploy Backend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your backend GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root of repository)
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements.txt`

5. Add Environment Variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key

6. Click "Deploy"

### Step 3: Get Backend URL

After deployment, Vercel will provide a URL like:
```
https://your-backend-project.vercel.app
```

Save this URL for the frontend configuration.

## 🌐 Frontend Deployment

### Step 1: Prepare Frontend Repository

1. Create a new GitHub repository for the frontend
2. Copy the `frontend` folder contents to the new repository
3. Make sure these files are present:
   - All Next.js files and folders
   - `vercel.json` (Vercel configuration)
   - `package.json` (Node.js dependencies)

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your frontend GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (root of repository)
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `BACKEND_URL`: Your backend Vercel URL (from Step 3 above)

6. Click "Deploy"

## 🔗 Connecting Frontend and Backend

### Update Frontend API Route

The frontend API route at `app/api/plant-health/predict/route.ts` will automatically use the `BACKEND_URL` environment variable to connect to your deployed backend.

### Test the Connection

1. Visit your frontend URL
2. Go to the Plant Health page
3. Upload a plant image
4. Check that the analysis works

## 🌍 Environment Variables

### Backend Environment Variables
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Environment Variables
```bash
BACKEND_URL=https://your-backend-project.vercel.app
```

## 📁 Project Structure for Deployment

### Backend Repository Structure
```
backend-repo/
├── api/
│   └── index.py          # Main FastAPI application
├── vercel.json           # Vercel configuration
└── requirements.txt      # Python dependencies
```

### Frontend Repository Structure
```
frontend-repo/
├── app/                  # Next.js app directory
├── components/           # React components
├── lib/                  # Utilities
├── public/               # Static assets
├── vercel.json           # Vercel configuration
├── package.json          # Node.js dependencies
└── ...                   # Other Next.js files
```

## 🚨 Important Notes

1. **Model Loading**: The first request to the backend may take longer as the AI model loads
2. **Cold Starts**: Vercel functions may have cold starts, especially for the backend
3. **File Size Limits**: Vercel has limits on function size and execution time
4. **Environment Variables**: Make sure to set all required environment variables in Vercel dashboard

## 🔧 Troubleshooting

### Backend Issues
- Check Vercel function logs for errors
- Ensure all dependencies are in `requirements.txt`
- Verify environment variables are set correctly

### Frontend Issues
- Check build logs for compilation errors
- Verify `BACKEND_URL` environment variable is set
- Check browser console for API errors

### Connection Issues
- Test backend health endpoint: `https://your-backend.vercel.app/health`
- Check CORS configuration in backend
- Verify API routes are working

## 📊 Monitoring

1. **Vercel Analytics**: Monitor performance and usage
2. **Function Logs**: Check Vercel dashboard for error logs
3. **API Health**: Use the `/health` endpoint to monitor backend status

## 🔄 Updates and Redeployment

- **Automatic**: Vercel automatically redeploys when you push to your main branch
- **Manual**: You can trigger redeployments from the Vercel dashboard
- **Environment Variables**: Update them in the Vercel dashboard as needed

## 🎉 Success!

Once deployed, your Botanic Defenders application will be available at:
- **Frontend**: `https://your-frontend-project.vercel.app`
- **Backend**: `https://your-backend-project.vercel.app`

Users can now:
- Access the crop yield dashboard
- Upload plant images for disease detection
- Get AI-powered agricultural insights
- Use the application from anywhere in the world!

---

**Need Help?** Check the Vercel documentation or create an issue in your repository.
