# 🚀 Deployment Checklist - Issues to Fix Before Hosting

## ⚠️ CRITICAL ISSUES TO FIX

### 1. ❌ **NASA API Key Exposed in render.yaml**
**PROBLEM**: Your NASA API key is hardcoded in `render.yaml` (public GitHub file!)
```yaml
# CURRENT (INSECURE):
- key: NASA_API_KEY
  value: 8Bzer5xzem5a4ZGqHrw4d9oR2KGdZ8f8gJeqscQC  # ❌ EXPOSED!
```

**SOLUTION**: Use Render dashboard to set environment variables
```yaml
# SHOULD BE:
- key: NASA_API_KEY
  sync: false  # ✅ Set manually in Render dashboard
```

**Action Required**:
1. Remove the hardcoded API key from `render.yaml`
2. Set it manually in Render.com dashboard → Environment Variables
3. Regenerate a new NASA API key at https://api.nasa.gov/

---

### 2. ❌ **ALLOWED_HOSTS Not Configured for Production**
**PROBLEM**: Settings.py only allows localhost
```python
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())
```

**SOLUTION**: Add your production domain
```python
# In render.yaml or environment variables:
ALLOWED_HOSTS=yourdomain.onrender.com,localhost,127.0.0.1
```

---

### 3. ⚠️ **DEBUG Mode Still Enabled by Default**
**PROBLEM**: `DEBUG = True` exposes error details in production
```python
DEBUG = config('DEBUG', default=True, cast=bool)  # ❌ Default True!
```

**SOLUTION**: Set in environment variables
```yaml
- key: DEBUG
  value: False  # ✅ Already set in render.yaml
```

---

### 4. ⚠️ **Secret Key Has Default Fallback**
**PROBLEM**: Weak default secret key in settings.py
```python
SECRET_KEY = config('SECRET_KEY', default='django-insecure-asteroid-impact-simulator-2025-hackathon-key')
```

**SOLUTION**: Generate strong secret key
```bash
# Generate new secret key:
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Set in Render dashboard environment variables (render.yaml already has `generateValue: true` ✅)

---

### 5. ⚠️ **CORS Configuration May Block Frontend**
**PROBLEM**: CORS allows all origins in development
```python
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True  # ❌ Insecure for production
```

**SOLUTION**: Already configured, but verify `FRONTEND_URL` environment variable is set
```python
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:3000')
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    FRONTEND_URL,  # ✅ Add your production frontend URL
]
```

---

### 6. ⚠️ **Static Files Path Configuration**
**PROBLEM**: Need to ensure STATICFILES_DIRS won't conflict in production

**Current Setup**:
```python
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
```

**SOLUTION**: This is fine, but ensure `collectstatic` runs successfully:
```bash
python manage.py collectstatic --no-input
```

---

### 7. ℹ️ **Database - SQLite Not Ideal for Production**
**CURRENT**: Using SQLite (file-based database)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

**RECOMMENDATION**: For production, consider PostgreSQL
```python
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///' + str(BASE_DIR / 'db.sqlite3'),
        conn_max_age=600
    )
}
```

Add to `requirements.txt`:
```
dj-database-url>=2.1.0
psycopg2-binary>=2.9.9  # For PostgreSQL
```

---

### 8. ℹ️ **Frontend React App Not Included in Backend Deploy**
**CURRENT**: React app runs separately on port 3000

**OPTIONS**:

**Option A: Deploy React Separately (Recommended)**
- Deploy React to Vercel/Netlify
- Backend on Render.com
- Update CORS settings to allow frontend domain

**Option B: Serve React Build from Django**
1. Build React app: `npm run build`
2. Copy build files to Django static folder
3. Add route to serve React index.html

---

## ✅ FIXES TO APPLY NOW

### Step 1: Update render.yaml (Remove Exposed API Key)
```yaml
services:
  - type: web
    name: asteroid-backend
    env: python
    region: oregon
    plan: free
    branch: main
    buildCommand: "./build.sh"
    startCommand: "gunicorn backend.wsgi:application"
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: False
      - key: NASA_API_KEY
        sync: false  # ✅ Set manually in dashboard
      - key: PYTHON_VERSION
        value: 3.11.5
      - key: ALLOWED_HOSTS
        value: your-app-name.onrender.com
      - key: FRONTEND_URL
        value: https://your-frontend-domain.com
```

---

### Step 2: Update settings.py Security Settings
```python
# Security Settings for Production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    
    # HTTPS/Proxy Headers (for Render.com)
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
```

---

### Step 3: Add Missing Dependencies (Optional but Recommended)
```txt
# Add to requirements.txt:
dj-database-url>=2.1.0
psycopg2-binary>=2.9.9
```

---

### Step 4: Update ALLOWED_HOSTS Properly
**In settings.py**, make it more flexible:
```python
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

# Add wildcard for Render preview deployments (optional)
if not DEBUG:
    ALLOWED_HOSTS += ['.onrender.com']
```

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] **Remove NASA API key from render.yaml**
- [ ] **Generate new NASA API key** (old one is exposed)
- [ ] **Set NASA_API_KEY in Render dashboard**
- [ ] **Update ALLOWED_HOSTS environment variable**
- [ ] **Set FRONTEND_URL environment variable**
- [ ] **Add SECURE_PROXY_SSL_HEADER to settings.py**
- [ ] **Test collectstatic locally**: `python manage.py collectstatic`
- [ ] **Test migrations locally**: `python manage.py migrate`
- [ ] **Verify requirements.txt has all dependencies**
- [ ] **Test the Orrery works**: http://localhost:8000/orrery/
- [ ] **Commit changes to Git**
- [ ] **Push to GitHub**
- [ ] **Deploy to Render.com**

---

## 🚀 DEPLOYMENT STEPS (After Fixes)

### 1. Get New NASA API Key
```
Visit: https://api.nasa.gov/
Generate new API key (old one compromised)
Save it securely
```

### 2. Update Files
```bash
# Remove API key from render.yaml (see Step 1 above)
# Add security settings to settings.py (see Step 2 above)
```

### 3. Commit and Push
```bash
git add .
git commit -m "Fix: Secure deployment configuration"
git push origin main
```

### 4. Deploy on Render.com
```
1. Go to https://render.com/
2. Connect your GitHub repository
3. Create new Web Service
4. Use render.yaml for configuration
5. Add environment variables in dashboard:
   - NASA_API_KEY: <your-new-key>
   - ALLOWED_HOSTS: <your-app>.onrender.com
   - FRONTEND_URL: <your-frontend-domain>
6. Deploy!
```

### 5. Access Your Deployed App
```
Backend API: https://your-app.onrender.com/api/
NASA Orrery: https://your-app.onrender.com/orrery/
Admin Panel: https://your-app.onrender.com/admin/
```

---

## 🔒 SECURITY BEST PRACTICES

1. **Never commit API keys to Git**
2. **Always use environment variables for secrets**
3. **Enable HTTPS in production (DEBUG=False)**
4. **Use strong SECRET_KEY**
5. **Restrict ALLOWED_HOSTS to your domain**
6. **Set proper CORS origins**
7. **Use PostgreSQL instead of SQLite for production**
8. **Regularly update dependencies**

---

## 📊 SUMMARY

| Issue | Severity | Status | Action |
|-------|----------|--------|--------|
| NASA API Key Exposed | 🔴 CRITICAL | ❌ Fix Now | Remove from render.yaml |
| ALLOWED_HOSTS | 🟡 HIGH | ⚠️ Configure | Set environment variable |
| DEBUG Mode | 🟡 HIGH | ✅ Fixed | Already False in render.yaml |
| Secret Key | 🟡 HIGH | ✅ Fixed | Auto-generated by Render |
| CORS Settings | 🟡 MEDIUM | ⚠️ Check | Set FRONTEND_URL |
| Static Files | 🟢 LOW | ✅ Working | collectstatic configured |
| Database | 🟢 LOW | ℹ️ Consider | Upgrade to PostgreSQL |
| React Frontend | 🟢 LOW | ℹ️ Optional | Deploy separately |

---

## ✅ ONCE FIXES ARE APPLIED

Your site will be **fully ready** for hosting with:
- ✅ Secure API key management
- ✅ Production-ready configuration
- ✅ HTTPS enabled
- ✅ Static files served correctly
- ✅ NASA Orrery working at `/orrery/`
- ✅ Backend API at `/api/`

---

**Next Steps**: Apply the fixes above, then deploy! 🚀

