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
   - Render will automatically detect the root-level `render.yaml` and configure the service
   - **Important:** After the service is created, go to **Settings** → **Root Directory** and set it to `backend`
   - Alternatively, the build commands in `render.yaml` use `cd backend` to navigate to the correct directory

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

### Option 2: Manual Setup (Recommended if render.yaml doesn't work)

1. **Create a Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **New** → **Web Service**
   - Connect your Git repository
   - **CRITICAL:** Before clicking "Create Web Service", scroll down to **Advanced Settings**
   - Set **Root Directory** to `backend` (this is essential!)
   - This tells Render to run all commands from the backend folder

2. **Configure Build Settings:**
   - **Environment:** Python 3
   - **Root Directory:** Set to `backend` (CRITICAL - this must be set before other settings)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Important:** Make sure to clear any auto-detected start commands (like gunicorn) and use the uvicorn command above
   
   **Note:** If Root Directory is set to `backend`, all commands run from that folder automatically.

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
- **"gunicorn: command not found" error:** 
  - Render is auto-detecting Django/Flask instead of FastAPI
  - Go to your service → **Settings** → **Start Command**
  - Clear any auto-detected commands (like `gunicorn your_application.wsgi`)
  - Manually set: `uvicorn main:app --host 0.0.0.0 --port $PORT`
  - Make sure **Root Directory** is set to `backend`

