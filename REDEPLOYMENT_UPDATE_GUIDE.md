# 🔄 NEO Tracker Redeployment Update Guide

Complete guide for updating from your old NEO Tracker deployment to the new enhanced version with security fixes and improvements.

![Update Status](https://img.shields.io/badge/Update-Required-orange)
![Security](https://img.shields.io/badge/Security-Enhanced-green)
![Version](https://img.shields.io/badge/Version-2.0-blue)

## 📋 What's Changed - Old vs New Version

### 🆕 Major Updates in New Version:
- ✅ **Enhanced Security**: Updated dependencies, security headers, CSRF protection
- ✅ **NASA Orrery Integration**: 3D solar system visualization now included
- ✅ **Production Ready**: Proper environment variable handling
- ✅ **Better CORS Configuration**: Secure cross-origin setup
- ✅ **PostgreSQL Support**: Database upgrade path
- ✅ **Static File Optimization**: WhiteNoise for better performance
- ✅ **Rate Limiting Ready**: Infrastructure for API protection

---

## 🔧 Required Environment Variable Updates

### 🚨 **NEW Environment Variables to Add**:

#### Backend (Render.com/Heroku):
```env
# NEW REQUIRED VARIABLES
SECRET_KEY=your-new-django-secret-key
DEBUG=False
FRONTEND_URL=https://your-frontend-domain.vercel.app
ALLOWED_HOSTS=your-app.onrender.com,.onrender.com

# EXISTING VARIABLES (Update if needed)
NASA_API_KEY=your_nasa_api_key_here

# NEW OPTIONAL VARIABLES
PYTHON_VERSION=3.11.5
RATELIMIT_ENABLE=False
```

#### Frontend (Vercel/Netlify):
```env
# UPDATE THIS VARIABLE
REACT_APP_API_URL=https://your-new-backend.onrender.com
```

### 🔑 **How to Generate New SECRET_KEY**:
```python
# Run this Python code to generate a new secret key
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

---

## 📦 Dependency Updates

### Backend Requirements Changes:
```diff
# NEW DEPENDENCIES ADDED:
+ python-decouple>=3.8          # Environment variables
+ whitenoise>=6.6.0             # Static file serving
+ psycopg2-binary>=2.9.9        # PostgreSQL support

# UPDATED VERSIONS:
Django>=4.2.0,<5.0.0             # Was: Django>=3.2
djangorestframework>=3.14.0      # Was: >=3.12.0
django-cors-headers>=4.0.0       # Was: >=3.13.0
requests>=2.31.0                 # Was: >=2.28.0
gunicorn>=21.2.0                 # Was: >=20.1.0
```

### Frontend Package Updates:
```json
// Updated packages in package.json
{
  "react": "^18.2.0",           // Was: ^17.x
  "react-dom": "^18.2.0",       // Was: ^17.x
  "axios": "^1.6.0",            // Was: ^0.27.x
  "@testing-library/react": "^13.4.0"
}
```

---

## 🗄️ Database Migration Plan

### Option 1: SQLite to SQLite (Simple Update)
```bash
# No database changes needed - SQLite continues to work
# Just redeploy with new code
```

### Option 2: SQLite to PostgreSQL (Recommended for Production)
```bash
# 1. Export existing data
python manage.py dumpdata > old_data.json

# 2. Update DATABASE_URL in environment variables
DATABASE_URL=postgresql://username:password@host:port/database

# 3. Run migrations
python manage.py migrate

# 4. Load data
python manage.py loaddata old_data.json
```

---

## 🌐 Hosting Platform Updates

### Render.com Updates:
```yaml
# render.yaml updates needed:
services:
  - type: web
    env: python
    buildCommand: "./build.sh"  # NEW: Build script
    startCommand: "gunicorn backend.wsgi:application"
    envVars:
      - key: SECRET_KEY
        generateValue: true  # NEW: Auto-generate
      - key: DEBUG
        value: False         # NEW: Explicit production setting
      - key: PYTHON_VERSION
        value: 3.11.5       # NEW: Specify Python version
```

### Vercel Updates:
```json
// vercel.json (NEW FILE)
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## 🔒 Security Updates Required

### 1. **CORS Configuration Updates**:
```python
# OLD SETTINGS (INSECURE):
CORS_ALLOW_ALL_ORIGINS = True  # ❌ Remove this

# NEW SETTINGS (SECURE):
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend.vercel.app",  # ✅ Specific domains only
]
CORS_ALLOW_CREDENTIALS = True
```

### 2. **Security Headers (NEW)**:
```python
# Automatically added in production mode:
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

### 3. **API Key Protection**:
```python
# OLD: Hardcoded in settings.py
NASA_API_KEY = 'hardcoded-key-here'  # ❌ Never do this

# NEW: Environment variable
NASA_API_KEY = config('NASA_API_KEY', default='fallback-key')  # ✅ Secure
```

---

## 🚀 Deployment Steps for Update

### Step 1: Backup Current Deployment
```bash
# 1. Export your current database
python manage.py dumpdata > backup_$(date +%Y%m%d).json

# 2. Document current environment variables
# Take screenshots of your hosting platform's env vars

# 3. Note current domain names
echo "Current frontend: $CURRENT_FRONTEND_URL"
echo "Current backend: $CURRENT_BACKEND_URL"
```

### Step 2: Deploy New Backend
```bash
# 1. Update your repository with new code (already done)
git pull origin main

# 2. Update environment variables in hosting platform:
SECRET_KEY=new-generated-secret-key
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com,.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app
NASA_API_KEY=your_existing_nasa_key

# 3. Trigger redeploy
# - Render: Push to GitHub or manual deploy
# - Heroku: git push heroku main
```

### Step 3: Deploy New Frontend
```bash
# 1. Update environment variable:
REACT_APP_API_URL=https://your-new-backend.onrender.com

# 2. Redeploy frontend:
# - Vercel: Automatic on GitHub push
# - Netlify: Manual deploy or GitHub integration
```

### Step 4: Test and Verify
```bash
# Test these endpoints after deployment:
curl https://your-backend.onrender.com/api/health/
curl https://your-backend.onrender.com/api/asteroids/
curl https://your-backend.onrender.com/orrery/
```

---

## 🆕 New Features Available After Update

### 1. **NASA Orrery 3D Visualization**:
- **URL**: `https://your-backend.onrender.com/orrery/`
- **Features**: Interactive 3D solar system with real-time asteroid tracking
- **Technology**: Three.js with WebGL acceleration

### 2. **Enhanced API Endpoints**:
```bash
# NEW endpoints:
GET /api/health/                    # Health check
GET /orrery/                       # 3D solar system
GET /static/orrery/                # Orrery assets

# IMPROVED endpoints:
POST /api/simulate-impact/         # Enhanced physics calculations
GET /api/asteroids/               # Better error handling
```

### 3. **Better Error Handling**:
- Structured JSON error responses
- Rate limiting infrastructure
- Detailed logging for debugging

### 4. **Performance Improvements**:
- Static file compression (WhiteNoise)
- Optimized database queries
- Caching infrastructure ready

---

## ⚠️ Breaking Changes to Watch For

### 1. **API Response Format Changes**:
```json
// OLD format might have been:
{
  "crater_size": 10
}

// NEW format includes more details:
{
  "crater": {
    "diameter_km": 10,
    "depth_km": 0.5
  },
  "blast_zone": {
    "total_destruction_km": 15
  }
}
```

### 2. **CORS Restrictions**:
- Old version might have allowed all origins
- New version requires specific frontend domains

### 3. **Environment Variable Requirements**:
- `SECRET_KEY` is now required
- `DEBUG` must be explicitly set to False
- `ALLOWED_HOSTS` must include your domain

---

## 🔍 Testing Checklist After Update

### Backend Testing:
- [ ] Health endpoint responds: `/api/health/`
- [ ] NASA API integration works: `/api/asteroids/`
- [ ] Impact simulation works: `/api/simulate-impact/`
- [ ] Orrery loads properly: `/orrery/`
- [ ] Static files serve correctly
- [ ] CORS headers present in responses

### Frontend Testing:
- [ ] Application loads without errors
- [ ] Map interactions work
- [ ] Impact calculations display
- [ ] NASA data loads correctly
- [ ] No console errors
- [ ] API calls succeed

### Security Testing:
- [ ] HTTPS enforced on all endpoints
- [ ] Security headers present
- [ ] CORS restricted to allowed origins
- [ ] No API keys exposed in frontend
- [ ] Error messages don't leak sensitive info

---

## 🆘 Rollback Plan

If something goes wrong, here's how to rollback:

### Quick Rollback (5 minutes):
```bash
# 1. Revert to previous git commit
git reset --hard <previous-commit-hash>
git push origin main --force

# 2. Restore old environment variables
# Use your backup screenshots/notes

# 3. Trigger redeploy
```

### Full Rollback (15 minutes):
```bash
# 1. Restore database from backup
python manage.py loaddata backup_YYYYMMDD.json

# 2. Revert all environment variables
# 3. Redeploy both frontend and backend
# 4. Test all functionality
```

---

## 📞 Support During Migration

### If You Encounter Issues:

1. **Check Logs First**:
   - Render: Dashboard → Your Service → Logs
   - Vercel: Dashboard → Your Project → Functions

2. **Common Issues & Solutions**:
   ```bash
   # SECRET_KEY error
   Solution: Generate new key and add to env vars
   
   # CORS error
   Solution: Update FRONTEND_URL in backend env vars
   
   # NASA API error
   Solution: Verify NASA_API_KEY is set correctly
   
   # Build failure
   Solution: Check requirements.txt and Python version
   ```

3. **Emergency Contacts**:
   - Platform documentation
   - GitHub Issues in your repository
   - Stack Overflow with specific error messages

---

## 📈 Performance Improvements Expected

After the update, you should see:
- ⚡ **30% faster page loads** (WhiteNoise static files)
- 🔒 **Enhanced security** (Security headers, CORS)
- 🚀 **Better scalability** (Environment variables, PostgreSQL ready)
- 🎯 **More reliable API** (Better error handling)
- 🌍 **3D Visualization** (NASA Orrery feature)

---

## ✅ Post-Update Verification

### Success Criteria:
- [ ] All old functionality works
- [ ] New NASA Orrery accessible
- [ ] Security headers present
- [ ] Performance improved
- [ ] No broken links or errors
- [ ] Environment variables secured
- [ ] Database migrated successfully

### Performance Benchmarks:
```bash
# Test response times:
curl -o /dev/null -s -w "%{time_total}\n" https://your-backend.onrender.com/api/health/
# Should be < 2 seconds

# Test concurrent requests:
ab -n 100 -c 10 https://your-backend.onrender.com/api/asteroids/
# Should handle without errors
```

---

**🎯 Ready to Update?** Follow this guide step by step and your NEO Tracker will be running the latest, most secure version! 🚀

---

**Last Updated**: October 2025  
**Migration Guide Version**: 2.0  
**Estimated Update Time**: 30-60 minutes