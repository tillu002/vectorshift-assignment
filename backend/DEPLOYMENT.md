# Render.com Deployment Guide

This guide explains how to deploy the FastAPI backend to Render.com.

## Prerequisites

- A Render.com account (free tier available)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push your code to Git** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push
   ```

2. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **New** → **Blueprint**
   - Connect your Git repository
   - Render will automatically detect `render.yaml` and configure the service

3. **Set Environment Variables:**
   - In the Render dashboard, go to your service → **Environment**
   - Add `ALLOWED_ORIGINS` with your frontend URL(s), e.g.:
     ```
     ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
     ```
   - Optionally add `FRONTEND_URL` with your frontend URL

4. **Deploy:**
   - Render will automatically build and deploy
   - Your backend will be available at: `https://your-service-name.onrender.com`

### Option 2: Manual Setup

1. **Create a Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **New** → **Web Service**
   - Connect your Git repository
   - Select the `backend` directory as the root directory

2. **Configure Build Settings:**
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables:**
   - `ALLOWED_ORIGINS`: Your frontend URL(s), comma-separated
   - `FRONTEND_URL`: (Optional) Your frontend URL

4. **Deploy:**
   - Click **Create Web Service**
   - Render will build and deploy your application

## Environment Variables

Set these in the Render dashboard under **Environment**:

- **ALLOWED_ORIGINS**: Comma-separated list of allowed CORS origins
  - Example: `http://localhost:3000,https://your-frontend.vercel.app`
  
- **FRONTEND_URL**: (Optional) Your frontend URL
  - Example: `https://your-frontend.vercel.app`

**Note:** `RENDER_EXTERNAL_URL` is automatically set by Render and doesn't need to be configured.

## Updating Frontend Configuration

After deployment, update your frontend `.env` file:

```env
REACT_APP_API_URL=https://your-service-name.onrender.com
```

Or set this in your frontend deployment platform (Vercel, etc.) as an environment variable.

## Local Testing

To test locally with the same setup as Render:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Troubleshooting

- **Build fails:** Check that `requirements.txt` includes all dependencies
- **CORS errors:** Verify `ALLOWED_ORIGINS` includes your frontend URL
- **Port binding:** Ensure the start command uses `$PORT` (Render sets this automatically)

