# Complete Deployment Guide: Backend (Render) + Frontend (Vercel)

## 🎯 Overview

This guide will deploy:
- **Backend (Django)** → Render.com
- **Frontend (React)** → Vercel.com

---

## 📋 Prerequisites

1. GitHub account (code must be pushed to GitHub)
2. Render.com account (free tier available)
3. Vercel.com account (free tier available)
4. NASA API Key (get from https://api.nasa.gov/)

---

## 🔐 PART 1: Environment Variables Setup

### Backend Environment Variables (Render)

Create these in Render dashboard:

```bash
# Django Settings
SECRET_KEY=your-super-secret-django-key-here-minimum-50-chars
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com,localhost,127.0.0.1

# Database (Render provides PostgreSQL)
DATABASE_URL=postgres://user:password@host:5432/dbname
# Note: Render auto-provides this, don't set manually

# Frontend URL (will be your Vercel URL)
FRONTEND_URL=https://your-frontend-app.vercel.app

# NASA API
NASA_API_KEY=your-nasa-api-key-from-nasa-website

# Security Settings (only for production)
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Frontend Environment Variables (Vercel)

Create these in Vercel dashboard:

```bash
# Backend API URL (will be your Render URL)
REACT_APP_API_URL=https://your-backend-app.onrender.com

# Optional: If you want to call NASA API directly from frontend
REACT_APP_NASA_API_KEY=your-nasa-api-key
```

---

## 🚀 PART 2: Backend Deployment (Render)

### Step 1: Prepare Backend Files

First, ensure these files exist in your `backend/` directory:

#### 1. Create `backend/requirements.txt` (if not exists)

```txt
Django==4.2.26
djangorestframework==3.14.0
django-cors-headers==4.3.1
python-decouple==3.8
requests==2.31.0
gunicorn==21.2.0
whitenoise==6.6.0
psycopg2-binary==2.9.9
dj-database-url==2.1.0
```

#### 2. Create `backend/build.sh` (Render build script)

```bash
#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate
```

Make it executable:
```bash
chmod +x backend/build.sh
```

#### 3. Update `backend/backend/settings.py`

Add/modify these sections:

```python
import os
import dj_database_url
from decouple import config, Csv

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-this-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

# Database Configuration
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default='sqlite:///db.sqlite3'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# CORS Configuration
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:3000')
FRONTEND_URL = FRONTEND_URL.rstrip('/')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    FRONTEND_URL,
]

# Add Vercel preview deployments
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
]

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

# Allow custom headers for cache control
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'cache-control',
    'pragma',
    'expires',
]

# NASA API Configuration
NASA_API_KEY = config('NASA_API_KEY', default='DEMO_KEY')

# Static files configuration for Render
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Security Settings for Production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
```

#### 4. Create `backend/runtime.txt` (Python version)

```txt
python-3.11.7
```

### Step 2: Deploy to Render

1. **Push Code to GitHub**
   ```bash
   cd C:\Users\lenovo\OneDrive\Desktop\nasapls\NEO_Tracker
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Go to Render Dashboard**
   - Visit https://render.com
   - Click "New +" → "Web Service"

3. **Connect GitHub Repository**
   - Connect your GitHub account
   - Select the `NEO_Tracker` repository
   - Click "Connect"

4. **Configure Web Service**
   ```
   Name: neo-tracker-backend (or your choice)
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: ./build.sh
   Start Command: gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
   Instance Type: Free (or paid for better performance)
   ```

5. **Add Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add all variables from "Backend Environment Variables" section above
   - **IMPORTANT:** Generate a strong SECRET_KEY:
     ```python
     # Run this in Python to generate a secure key:
     from django.core.management.utils import get_random_secret_key
     print(get_random_secret_key())
     ```

6. **Add PostgreSQL Database** (Recommended for production)
   - In Render dashboard, click "New +" → "PostgreSQL"
   - Name: `neo-tracker-db`
   - Region: Same as your web service
   - Create database
   - Copy the "Internal Database URL"
   - Add it as `DATABASE_URL` environment variable in your web service

7. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for initial deployment
   - Your backend will be at: `https://neo-tracker-backend.onrender.com`

8. **Verify Backend**
   - Visit: `https://your-app-name.onrender.com/api/asteroids`
   - Should return JSON data

---

## 🎨 PART 3: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend Files

#### 1. Create `frontend/.env.production`

```bash
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

#### 2. Update `frontend/package.json` (verify these scripts exist)

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

#### 3. Create `vercel.json` in root directory

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Deploy to Vercel

1. **Push Changes to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Click "New Project"

3. **Import Repository**
   - Click "Import Git Repository"
   - Select your GitHub account
   - Choose `NEO_Tracker` repository
   - Click "Import"

4. **Configure Project**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     Key: REACT_APP_API_URL
     Value: https://your-backend-app.onrender.com
     ```
   - Apply to: Production, Preview, and Development

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your frontend will be at: `https://your-app-name.vercel.app`

7. **Update Backend CORS**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` environment variable to your Vercel URL:
     ```
     FRONTEND_URL=https://your-app-name.vercel.app
     ```
   - Render will automatically redeploy

---

## 🔒 PART 4: Security Checklist

### Backend Security (Render)

- ✅ Set `DEBUG=False` in production
- ✅ Use strong `SECRET_KEY` (50+ characters, random)
- ✅ Enable PostgreSQL database (not SQLite)
- ✅ Set correct `ALLOWED_HOSTS`
- ✅ Enable HTTPS redirects
- ✅ Set secure cookie flags
- ✅ Configure CORS properly
- ✅ Keep `NASA_API_KEY` secret
- ✅ Enable HSTS headers
- ✅ Set X-Frame-Options

### Frontend Security (Vercel)

- ✅ Use environment variables for API URL
- ✅ Never commit `.env` files
- ✅ Use HTTPS only (Vercel provides free SSL)
- ✅ Keep dependencies updated

---

## 🧪 PART 5: Testing Deployment

### Test Backend

1. **Health Check**
   ```bash
   curl https://your-backend-app.onrender.com/api/asteroids
   ```
   Should return JSON data

2. **CORS Check**
   - Open browser console on Vercel frontend
   - Check for CORS errors (should be none)

### Test Frontend

1. **Visit Your Site**
   ```
   https://your-app-name.vercel.app
   ```

2. **Test Features**
   - ✅ NASA Live Orrery loads asteroids
   - ✅ Impact Simulator loads and calculates
   - ✅ No console errors
   - ✅ Data loads from backend

---

## 🔄 PART 6: Continuous Deployment

### Auto-Deploy on Git Push

**Backend (Render):**
- Automatically redeploys on every push to `main` branch
- Build logs available in Render dashboard

**Frontend (Vercel):**
- Automatically redeploys on every push to `main` branch
- Creates preview deployments for pull requests
- Build logs available in Vercel dashboard

### Manual Redeploy

**Render:**
- Dashboard → Your Service → "Manual Deploy" → "Deploy latest commit"

**Vercel:**
- Dashboard → Your Project → "Deployments" → "Redeploy"

---

## 🐛 PART 7: Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem:** Frontend can't access backend API
**Solution:**
- Check `FRONTEND_URL` matches your Vercel URL exactly
- Verify CORS headers are set in Django settings
- Check browser console for specific CORS error

#### 2. 502 Bad Gateway (Render)
**Problem:** Backend won't start
**Solution:**
- Check Render logs for errors
- Verify `build.sh` ran successfully
- Check `DATABASE_URL` is set correctly
- Ensure all requirements in `requirements.txt`

#### 3. Build Failed (Vercel)
**Problem:** Frontend build fails
**Solution:**
- Check Vercel build logs
- Verify `package.json` has correct scripts
- Check for missing dependencies
- Ensure `REACT_APP_API_URL` is set

#### 4. NASA API Rate Limiting
**Problem:** Too many API requests
**Solution:**
- localStorage caching is already implemented
- Use your own NASA API key (not DEMO_KEY)
- Consider backend caching with Redis (paid tier)

#### 5. Database Errors
**Problem:** Django can't connect to database
**Solution:**
- Verify PostgreSQL is running (Render dashboard)
- Check `DATABASE_URL` environment variable
- Run migrations: Add `python manage.py migrate` to build.sh

---

## 📊 PART 8: Monitoring & Maintenance

### Monitor Performance

**Render:**
- Dashboard shows CPU/Memory usage
- View logs for errors
- Set up alerts for downtime

**Vercel:**
- Analytics tab shows traffic
- Function logs for errors
- Web Vitals monitoring

### Update Dependencies

**Backend:**
```bash
pip install --upgrade django djangorestframework
pip freeze > backend/requirements.txt
git commit -am "Update backend dependencies"
git push
```

**Frontend:**
```bash
cd frontend
npm update
npm audit fix
git commit -am "Update frontend dependencies"
git push
```

---

## 💰 PART 9: Cost Breakdown

### Free Tier Limits

**Render (Free):**
- ✅ 750 hours/month
- ✅ Spins down after 15 min inactivity (30-60s wake time)
- ✅ PostgreSQL: 90 days then deleted
- ⚠️ Slow for production use

**Vercel (Free):**
- ✅ Unlimited bandwidth
- ✅ 100 deployments/day
- ✅ Always on (no spin-down)
- ✅ Perfect for frontend

### Paid Options (Recommended for Production)

**Render:**
- Starter: $7/month (always on, no spin-down)
- PostgreSQL: $7/month (persistent database)

**Vercel:**
- Pro: $20/month (team features, analytics)

---

## ✅ PART 10: Final Checklist

Before going live:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] PostgreSQL database set up (paid)
- [ ] All environment variables configured
- [ ] `DEBUG=False` on backend
- [ ] CORS configured correctly
- [ ] NASA API key set (not DEMO_KEY)
- [ ] SSL/HTTPS working (automatic)
- [ ] Test all features working
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Monitor first 24 hours for issues

---

## 🎉 You're Done!

Your NEO Tracker is now live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com

### Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/4.2/howto/deployment/

---

## 📝 Quick Reference

### Environment Variables Summary

**Render (Backend):**
```
SECRET_KEY=<generate-random-50-char-string>
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com
FRONTEND_URL=https://your-app.vercel.app
NASA_API_KEY=<your-nasa-key>
```

**Vercel (Frontend):**
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

### Important URLs

- NASA API Key: https://api.nasa.gov/
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub: https://github.com/roshcr6/NEO_Tracker

---

**Last Updated:** November 16, 2025
**Version:** 1.0
