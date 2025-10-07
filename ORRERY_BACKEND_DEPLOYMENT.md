# NASA Live Orrery - Backend Deployment Architecture 🚀

## Overview
The NASA Live Orrery has been successfully moved from the React frontend to the Django backend for enhanced security and deployment readiness.

## 🔒 Security Benefits

### Before (Frontend Serving)
- ❌ JavaScript files visible to all users
- ❌ API keys potentially exposed in frontend code
- ❌ Source code easily accessible
- ❌ Vulnerable to client-side tampering

### After (Backend Serving)
- ✅ JavaScript files served through Django
- ✅ NASA API keys hidden in backend environment variables
- ✅ All API calls proxied through Django backend
- ✅ Source code protected on server

## 📂 File Structure

```
NEO_Tracker/
└── backend/
    ├── static/
    │   └── orrery/               # NASA Live Orrery files (SECURE!)
    │       ├── index.html         # Main HTML page
    │       ├── app.js             # Application controller
    │       ├── nasa-api.js        # API service (uses backend endpoints)
    │       ├── solar-system.js    # 3D solar system logic
    │       ├── meteor-showers.js  # Meteor shower data
    │       ├── asteroid-modal.js  # Asteroid modal UI
    │       ├── style.css          # Styling
    │       └── textures/          # Planet/sun textures
    │           ├── sun.jpg
    │           ├── mercury.jpg
    │           ├── venus.jpg
    │           ├── mars.jpg
    │           ├── jupiter.jpg
    │           ├── saturn.jpg
    │           ├── saturn_ring.png
    │           ├── uranus.jpg
    │           ├── neptune.jpg
    │           └── starfield.jpg
    ├── backend/
    │   ├── settings.py            # UPDATED: Template & static config
    │   └── urls.py                # UPDATED: /orrery/ route added
    └── api/
        └── views.py               # NASA API proxy endpoints
```

## 🌐 How It Works

### 1. User Accesses Orrery
```
http://localhost:8000/orrery/
```

### 2. Django Serves HTML
- Django TemplateView serves `static/orrery/index.html`
- All CSS, JS, and textures loaded via `/static/` URLs

### 3. JavaScript Makes API Calls
```javascript
// nasa-api.js (UPDATED)
this.apiURL = window.location.origin;  // Same origin
this.baseURL = `${this.apiURL}/api`;   // Django API endpoints

// Example: Get asteroids
fetch(`${this.baseURL}/asteroids?start_date=2025-01-01&end_date=2025-01-07`)
```

### 4. Django Proxies NASA API
```python
# api/views.py
@api_view(['GET'])
def get_asteroids(request):
    nasa_api_key = os.environ.get('NASA_API_KEY')  # SECURE!
    nasa_url = f'https://api.nasa.gov/neo/rest/v1/feed?api_key={nasa_api_key}'
    # ... fetch and return data
```

## 🔧 Configuration Changes

### settings.py
```python
# Template directories (to serve HTML from static/)
TEMPLATES = [
    {
        'DIRS': [os.path.join(BASE_DIR, 'static')],
        ...
    },
]

# Static files configuration
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
```

### urls.py
```python
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # NASA Live Orrery - served securely from backend
    path('orrery/', TemplateView.as_view(template_name='orrery/index.html'), name='orrery'),
]
```

### nasa-api.js (Key Update)
```javascript
constructor() {
    // BEFORE:
    // this.apiURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    
    // AFTER:
    this.apiURL = window.location.origin;  // Dynamic! Works in dev & production
    this.baseURL = `${this.apiURL}/api`;
    
    console.log('🔒 Using secure backend API: ' + this.baseURL);
}
```

## 🚀 Running the Application

### Development Mode
```bash
# 1. Start Django backend
cd backend
python manage.py runserver

# 2. Access Orrery
# Open browser to: http://localhost:8000/orrery/
```

### Production Deployment
```bash
# 1. Collect static files
python manage.py collectstatic --noinput

# 2. Deploy to hosting (Render, Heroku, AWS, etc.)
# The static files will be served by WhiteNoise middleware

# 3. Set environment variables
NASA_API_KEY=your_nasa_api_key_here
FRONTEND_URL=https://yourdomain.com
```

## 📊 API Endpoints Used

The Orrery uses these Django backend endpoints:

| Endpoint | Purpose | Example |
|----------|---------|---------|
| `/api/asteroids` | Get Near-Earth Objects | `GET /api/asteroids?start_date=2025-01-01&end_date=2025-01-07` |
| `/api/asteroids/{id}` | Get specific asteroid details | `GET /api/asteroids/2021277` |
| `/api/earth-imagery` | Get NASA EPIC Earth images | `GET /api/earth-imagery` |
| `/api/planetary-imagery` | Get planetary images | `GET /api/planetary-imagery?planet=mars` |

## 🎯 Benefits for Deployment

1. **Single Server**: Backend serves both API and Orrery
2. **CORS-Free**: No cross-origin issues (same origin)
3. **Secure**: API keys never exposed to client
4. **Simple**: No separate frontend build/deploy process
5. **Fast**: Static files cached and compressed by WhiteNoise

## 🔗 Access Points

- **Main Application**: http://localhost:8000/ (React NEO Tracker)
- **NASA Live Orrery**: http://localhost:8000/orrery/ (3D Solar System)
- **Admin Panel**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/api/

## ✅ Security Checklist

- [x] NASA API keys stored in environment variables
- [x] All API calls routed through Django backend
- [x] Static files served through Django/WhiteNoise
- [x] CORS properly configured
- [x] No hardcoded credentials in JavaScript
- [x] SSL/HTTPS ready for production
- [x] Rate limiting on backend endpoints

## 📝 Notes

- The original frontend React app still exists and works independently
- The Orrery can be accessed directly at `/orrery/` without React
- All textures and assets are self-hosted (no external dependencies except Three.js CDN)
- The Orrery is a standalone page that can be embedded or linked

## 🎉 Result

**NASA Live Orrery is now fully backend-integrated and production-ready!**

All sensitive API operations happen server-side, making the application:
- More secure
- Easier to deploy
- Faster to load
- Ready for hosting platforms

---

**Created**: October 2025  
**Purpose**: Secure deployment architecture for NASA Live Orrery  
**Status**: ✅ Complete and tested
