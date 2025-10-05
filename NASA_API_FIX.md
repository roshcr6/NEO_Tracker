# 🔧 NASA API Troubleshooting Guide

## Issue: NEO Analysis Page Not Loading Asteroid Data

### ✅ **FIXED!**

The NASA NEO API wasn't reading data because the frontend was using a hardcoded `localhost` URL instead of the environment variable.

---

## 🐛 What Was Wrong

### The Problem:
In `frontend/src/App.js`, the API endpoint was hardcoded:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';  // ❌ Wrong!
```

This meant:
- ✅ **Local development** worked fine
- ❌ **Production deployment** failed (no backend at localhost)
- ❌ **NEO Analysis page** couldn't fetch asteroid data

---

## ✅ How It Was Fixed

### The Solution:
Updated `frontend/src/App.js` to use environment variables:

```javascript
// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_ENDPOINT = `${API_BASE_URL}/api`;
```

Now the API endpoint:
- ✅ Uses `REACT_APP_API_URL` from Vercel environment variables in production
- ✅ Falls back to `localhost:8000` for local development
- ✅ Works correctly on both local and deployed versions

---

## 🔑 Environment Variable Setup

### **For Vercel (Production):**

Make sure you have this environment variable set:

```
Name: REACT_APP_API_URL
Value: https://your-backend.onrender.com
```

**Important:** 
- ⚠️ Do NOT include `/api` at the end
- ⚠️ Do NOT include a trailing slash

### **For Local Development:**

The `.env.local` file is now created with:
```
REACT_APP_API_URL=http://localhost:8000
```

---

## 🧪 Testing the Fix

### **1. Test Locally:**

```bash
cd frontend
npm start
```

The app should connect to `http://localhost:8000/api/asteroids`

### **2. Test in Production:**

After deploying to Vercel:
1. Visit your Vercel URL
2. Go to NEO Analysis page
3. Asteroids should load from your Render backend

### **3. Check Browser Console:**

Open DevTools (F12) and check:
```javascript
console.log(process.env.REACT_APP_API_URL)
```

Should show:
- **Local:** `http://localhost:8000`
- **Vercel:** `https://your-backend.onrender.com`

---

## 📊 API Endpoints Used

### **GET /api/asteroids**
Fetches Near Earth Objects from NASA API

**Parameters:**
- `hazardous_only` (optional): `true` or `false`
- `start_date` (optional): `YYYY-MM-DD`
- `end_date` (optional): `YYYY-MM-DD`

**Example:**
```javascript
axios.get(`${API_ENDPOINT}/asteroids`, {
  params: { hazardous_only: false }
})
```

### **POST /api/simulate-impact**
Simulates asteroid impact effects

**Body:**
```json
{
  "diameter_km": 1.0,
  "velocity_kmps": 20,
  "impact_lat": 40.7128,
  "impact_lon": -74.0060,
  "impact_angle": 45
}
```

---

## 🔍 Debugging Steps

### **If NASA API Still Not Working:**

#### 1. Check Backend is Running

Visit your backend URL directly:
```
https://your-backend.onrender.com/api/asteroids/
```

You should see JSON data with asteroids.

#### 2. Check Frontend Environment Variable

In Vercel dashboard:
- **Settings** → **Environment Variables**
- Verify `REACT_APP_API_URL` is set correctly
- Redeploy if you just added/changed it

#### 3. Check Browser Network Tab

Open DevTools (F12) → Network tab:
- Look for request to `/api/asteroids`
- Check the full URL being called
- Check response status (should be 200)
- Check response data

#### 4. Check CORS Settings

In your backend `settings.py`, verify:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://your-frontend.vercel.app",  # Your actual Vercel URL
]
```

#### 5. Check NASA API Key

In Render environment variables:
```
NASA_API_KEY = 8Bzer5xzem5a4ZGqHrw4d9oR2KGdZ8f8gJeqscQC
```

Test the key directly:
```bash
curl "https://api.nasa.gov/neo/rest/v1/feed?api_key=8Bzer5xzem5a4ZGqHrw4d9oR2KGdZ8f8gJeqscQC"
```

---

## 🚨 Common Errors & Solutions

### **Error: "Network Error" or "Failed to fetch"**

**Cause:** CORS issue or wrong backend URL

**Solution:**
1. Check `FRONTEND_URL` in Render matches your Vercel URL
2. Check `REACT_APP_API_URL` in Vercel matches your Render URL
3. No trailing slashes!

### **Error: "Cannot read property 'asteroids' of undefined"**

**Cause:** API response format issue

**Solution:**
Check the API response structure:
```javascript
response.data.asteroids  // Array of asteroids
response.data.element_count  // Number of asteroids
```

### **Error: "NASA API request failed"**

**Cause:** NASA API key invalid or rate limit exceeded

**Solution:**
1. Verify NASA API key is correct
2. Check NASA API status: https://api.nasa.gov
3. Wait if rate limited (30 requests/hour for demo key)
4. Get your own API key: https://api.nasa.gov (free, instant, 1000 requests/hour)

### **Error: Spinner keeps loading, no data**

**Cause:** API endpoint not responding or timeout

**Solution:**
1. Check backend logs in Render dashboard
2. Verify backend is not sleeping (free tier spins down after 15 min)
3. Wait 30-60 seconds for cold start
4. Check Network tab for failed requests

---

## 📝 Code Changes Summary

### **Files Modified:**

1. **`frontend/src/App.js`**
   - Changed hardcoded URL to environment variable
   - Added proper fallback for local development
   - Updated all API calls to use new endpoint

2. **`frontend/.env.local`** (Created)
   - Added local development environment variable

3. **`frontend/.env.example`** (Already existed)
   - Template for environment variables

---

## ✅ Verification Checklist

After deploying, verify:

- [ ] Backend is deployed and accessible at Render URL
- [ ] Frontend is deployed and accessible at Vercel URL
- [ ] `REACT_APP_API_URL` environment variable is set in Vercel
- [ ] `FRONTEND_URL` environment variable is set in Render
- [ ] `ALLOWED_HOSTS` includes your Render domain
- [ ] Visiting Render backend URL shows JSON data
- [ ] NEO Analysis page loads asteroids
- [ ] Impact simulation works
- [ ] No CORS errors in browser console

---

## 🎉 Expected Behavior

### **NEO Analysis Page Should:**
1. Show loading spinner initially
2. Fetch ~20 asteroids from NASA API
3. Display asteroid list with:
   - Name
   - Diameter
   - Velocity
   - Hazard status
4. Allow clicking asteroids to see details
5. Update 3D visualization
6. Calculate impact scenarios

---

## 📞 Need More Help?

### Check These Files:
- `DEPLOYMENT_GUIDE.md` - Full deployment instructions
- `ENV_VARIABLES.md` - Environment variable reference
- `ALTERNATIVE_HOSTING.md` - Other hosting options

### Debug Logs:
- **Frontend:** Browser console (F12)
- **Backend:** Render dashboard → Logs
- **Network:** DevTools → Network tab

---

## 🔄 Redeploying After Fix

The fix has been pushed to GitHub. Your deployments will auto-update:

1. **Vercel:** Rebuilds automatically (2-3 min)
2. **Render:** Rebuilds automatically (3-5 min)

Or manually redeploy:
- **Vercel:** Deployments → Redeploy
- **Render:** Manual Deploy → Deploy latest commit

---

**Fixed on:** October 5, 2025
**Commit:** `31e63cc - Fix API endpoint to use environment variable for NASA NEO data`

🎊 **Your NEO Analysis page should now work perfectly!** 🎊
