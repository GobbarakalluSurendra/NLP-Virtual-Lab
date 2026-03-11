---
description: How to deploy the NLP Virtual Lab frontend and backend
---

# Deployment Guide for NLP Virtual Lab

This project consists of a FastAPI backend and a React (Vite) frontend. The recommended approach is to deploy the backend as a Web Service on Render (or Railway/Heroku) and the frontend on Vercel or Netlify.

## 1. Deploying the FastAPI Backend (e.g., on Render)

1. Create a [Render](https://render.com/) account and connect it to your GitHub repository.
2. Click **New +** and select **Web Service**.
3. Choose the repository containing this project.
4. Set the following details:
   - **Name**: `nlp-virtual-lab-backend` (or similar)
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.
6. Once deployed, copy the assigned URL (e.g., `https://nlp-virtual-lab.onrender.com`).

## 2. Deploying the React Frontend (e.g., on Vercel)

1. Create a [Vercel](https://vercel.com/) account and connect it to your GitHub repository.
2. Click **Add New...** -> **Project**.
3. Import the repository containing this project.
4. Set the following details:
   - **Project Name**: `nlp-virtual-lab-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - Add a new variable for your backend API URL. Make sure it matches what your Vite frontend expects (e.g., `VITE_API_URL` or similar).
   - Set the Value to the URL from Step 1 (e.g., `https://nlp-virtual-lab.onrender.com`).
6. Click **Deploy**.

## 3. Update CORS Configuration

Don't forget to update the CORS settings in your backend's `main.py` (`backend/main.py`) to allow requests from your newly deployed frontend URL once you have the Vercel link!

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.vercel.app"], # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
