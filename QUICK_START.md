# 🚀 NASA NEO Tracker - Quick Start Guide

## ⚡ ONE-CLICK STARTUP

### Windows Users (Easiest Method)
Simply double-click:
```
START.bat
```

This will automatically:
1. ✅ Check Python & Node.js installation
2. ✅ Create virtual environment (if needed)
3. ✅ Install all dependencies
4. ✅ Set up database
5. ✅ Start backend server (Django on port 8000)
6. ✅ Start frontend server (React on port 3000)
7. ✅ Open your browser to http://localhost:3000

---

## 🛑 STOPPING THE SERVERS

### Option 1: Quick Stop
Double-click:
```
STOP.bat
```

### Option 2: Manual Stop
Close the two terminal windows that opened:
- "NASA NEO Tracker - Backend (Django)"
- "NASA NEO Tracker - Frontend (React)"

### Option 3: Terminal Stop
Press `Ctrl+C` in each of the server terminal windows

---

## 🔧 MANUAL STARTUP (Advanced Users)

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher

### Backend (Django)
```bash
cd backend
python -m venv ../.venv
../.venv/Scripts/pip install -r requirements.txt
../.venv/Scripts/python manage.py migrate
../.venv/Scripts/python manage.py runserver
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

---

## 🌐 ACCESSING THE APPLICATION

Once started, access the application at:

- **Main Website:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **3D Orrery:** http://localhost:8000/orrery
- **Admin Panel:** http://localhost:8000/admin

---

## 🔒 SECURITY FEATURES

✅ **0 npm vulnerabilities** - All dependencies secure  
✅ **Rate limiting** - API protected from abuse  
✅ **CORS protection** - Only trusted domains allowed  
✅ **Environment variables** - Sensitive data secured  

### Rate Limits (per IP address):
- GET asteroids: 100 requests/hour
- GET asteroid detail: 200 requests/hour
- POST simulate impact: 50 requests/hour

---

## 📁 PROJECT STRUCTURE

```
NEO/
├── START.bat              # One-click startup script
├── STOP.bat               # One-click stop script
├── backend/               # Django API
│   ├── api/              # API endpoints
│   ├── backend/          # Django settings
│   ├── manage.py         # Django management
│   ├── requirements.txt  # Python dependencies
│   └── .env              # Environment variables (do not commit!)
├── frontend/             # React application
│   ├── src/             # Source code
│   ├── public/          # Static files
│   └── package.json     # npm dependencies
└── .venv/               # Python virtual environment
```

---

## ⚙️ ENVIRONMENT VARIABLES

The backend uses environment variables stored in `backend/.env`:

```bash
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# NASA API
NASA_API_KEY=your-nasa-api-key
```

**⚠️ IMPORTANT:** Never commit the `.env` file to version control!

---

## 🐛 TROUBLESHOOTING

### Problem: "Python not found"
**Solution:** Install Python from https://www.python.org/downloads/

### Problem: "Node.js not found"
**Solution:** Install Node.js from https://nodejs.org/

### Problem: Port 3000 or 8000 already in use
**Solution:** 
1. Run `STOP.bat` to stop any running servers
2. Or manually kill processes:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <process_id> /F
   ```

### Problem: Virtual environment corrupted
**Solution:**
```bash
# Delete and recreate
rmdir /s .venv
python -m venv .venv
START.bat
```

### Problem: npm install fails
**Solution:**
```bash
cd frontend
rmdir /s node_modules
npm install
```

### Problem: Database errors
**Solution:**
```bash
cd backend
del db.sqlite3
..\.venv\Scripts\python manage.py migrate
```

---

## 🔄 UPDATING THE APPLICATION

### Update from Git
```bash
git pull origin main
START.bat
```

The START.bat script will automatically:
- Update Python dependencies
- Update npm packages
- Run database migrations

---

## 📊 FEATURES

### 🌍 Near-Earth Object Tracking
- Real-time asteroid data from NASA API
- Filter by hazardous asteroids
- Detailed asteroid information

### 💥 Impact Simulator
- Interactive map for impact location selection
- Physics-based calculations
- Casualty estimates
- Blast radius visualization

### 🌌 3D Solar System Orrery
- Interactive 3D visualization
- Real-time planetary positions
- Asteroid orbits

### 📈 Analytics & Deflection
- Deflection mission planning
- Cost analysis
- Timeline visualization

---

## 🚀 DEPLOYMENT (Production)

### Before deploying to production:

1. **Update environment variables** in hosting platform:
   ```bash
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com
   SECRET_KEY=generate-new-secure-key
   ```

2. **Use PostgreSQL** instead of SQLite:
   ```bash
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Collect static files**:
   ```bash
   python manage.py collectstatic
   ```

4. **Build React app**:
   ```bash
   cd frontend
   npm run build
   ```

---

## 📝 DOCUMENTATION

- `SECURITY_AUDIT_REPORT.md` - Complete security analysis
- `SECURITY_FIXES_APPLIED.md` - What was fixed
- `ALL_ISSUES_RESOLVED.md` - Resolution summary
- `README.md` - This file

---

## 🆘 SUPPORT

### Logs Location
- **Django:** Terminal window output
- **React:** Terminal window output
- **Django errors:** Console or `backend/logs/` (if configured)

### Check Server Status
```bash
# Windows
netstat -ano | findstr ":3000 :8000"
```

### Test Backend
```bash
curl http://localhost:8000/api/
```

### Test Frontend
Open http://localhost:3000 in browser

---

## 📜 LICENSE

This project uses the NASA API under the NASA Open API terms.

---

## 🎯 VERSION INFO

- **Django:** 4.2.25 (LTS)
- **React:** 18.2.0
- **Node.js:** 16+
- **Python:** 3.8+

---

## ✨ CREDITS

Built for NASA Space Apps Challenge 2025

**Features:**
- NASA Near-Earth Object API integration
- Physics-based impact calculations
- Interactive 3D visualizations
- Real-time asteroid tracking

---

**Last Updated:** October 7, 2025  
**Security Status:** ✅ 0 Known Vulnerabilities
