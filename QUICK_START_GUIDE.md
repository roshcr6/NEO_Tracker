# 🚀 Quick Start Guide - NEO Tracker Applications

## Two Ways to Access the Application

Your NEO Tracker project now has **TWO entry points**:

---

## 1. 🌍 Main NEO Tracker (React Frontend)

**URL**: `http://localhost:3000/`

**Features**:
- Interactive world map
- Asteroid impact simulator
- Real-time casualty calculations
- Geocoding with location names
- Seismic and blast zone analysis

**To Run**:
```bash
# Terminal 1: Start Django Backend
cd backend
python manage.py runserver

# Terminal 2: Start React Frontend  
cd frontend
npm start
```

**Access**: http://localhost:3000/

---

## 2. 🪐 NASA Live Orrery (Backend-Served)

**URL**: `http://localhost:8000/orrery/`

**Features**:
- 3D Solar System with 8 planets
- 121 Near-Earth Objects from NASA
- 1,000 Main Asteroid Belt asteroids
- 16 Meteor Showers with orbital paths
- Real planet textures (2K resolution)
- Time controls (speed up, pause, jump)
- AstroBot AI chatbot
- Interactive camera (pan, zoom, rotate)

**To Run**:
```bash
# Terminal 1: Start Django Backend ONLY
cd backend
python manage.py runserver
```

**Access**: http://localhost:8000/orrery/

**✅ Benefits**:
- No React frontend needed!
- All served from Django backend
- API keys hidden and secure
- No CORS issues
- Ready for production deployment

---

## 🔐 Security Architecture

### Before Migration:
```
Frontend (React) → NASA API (exposed keys)
                ↓
            Backend API
```

### After Migration:
```
Browser → Django Backend → NASA API (secure keys)
         ↓
    Serves HTML/JS/CSS
```

**All API keys are now hidden in Django environment variables!**

---

## 📊 Comparison

| Feature | React Frontend | Backend Orrery |
|---------|---------------|----------------|
| **Port** | :3000 | :8000/orrery/ |
| **Server Required** | React + Django | Django only |
| **API Keys** | Environment | Django (secure) |
| **CORS** | Yes | No |
| **Deployment** | Two servers | One server |
| **Best For** | Impact simulator | Solar system viewer |

---

## 🎯 Recommended Workflow

### Development:
```bash
# Run both for full functionality:
Terminal 1: cd backend && python manage.py runserver
Terminal 2: cd frontend && npm start

# Access:
- React App: http://localhost:3000/
- Orrery: http://localhost:8000/orrery/
```

### Production:
```bash
# Single server deployment:
cd backend
python manage.py collectstatic --noinput
gunicorn backend.wsgi:application

# Access:
- React Build: http://yourdomain.com/
- Orrery: http://yourdomain.com/orrery/
```

---

## 🌐 API Endpoints

Both applications use the same Django backend API:

| Endpoint | Description |
|----------|-------------|
| `/api/simulate-impact/` | Calculate asteroid impact physics |
| `/api/asteroids` | Get Near-Earth Objects from NASA |
| `/api/asteroids/{id}` | Get specific asteroid details |
| `/api/earth-imagery` | Get NASA EPIC Earth images |
| `/api/planetary-imagery` | Get planetary images |

---

## 🚀 Quick Test

**Test NEO Tracker (React):**
```bash
cd backend && python manage.py runserver
# New terminal:
cd frontend && npm start
# Visit: http://localhost:3000/
```

**Test NASA Orrery (Backend):**
```bash
cd backend && python manage.py runserver
# Visit: http://localhost:8000/orrery/
```

---

## 📖 Documentation

- `README.md` - Main project documentation
- `BACKEND_MIGRATION_COMPLETE.md` - Orrery migration details
- `ORRERY_BACKEND_DEPLOYMENT.md` - Architecture guide

---

## ✅ Status

- ✅ React Frontend: Working
- ✅ Django Backend: Running
- ✅ NASA Orrery: Backend-integrated
- ✅ API Security: Enhanced
- ✅ Production Ready: Yes

---

**Choose your entry point and enjoy! 🎉**
