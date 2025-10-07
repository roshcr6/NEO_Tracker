# 🌍 NEO Tracker - Near-Earth Object Impact Simulator# 🌍 NEO Tracker - Near-Earth Object Impact Simulator# 🌍 NEO Tracker - Near-Earth Object Impact Simulator



A full-stack web application for simulating asteroid impacts on Earth with real-time NASA data, accurate physics calculations, and a 3D solar system visualization.



![Version](https://img.shields.io/badge/version-4.0-blue)A full-stack web application for simulating asteroid impacts on Earth with real-time NASA data, accurate physics calculations, and a 3D solar system visualization.A full-stack web application for simulating asteroid impacts on Earth with real-time NASA data, accurate physics calculations, and a 3D solar system visualization.

![Python](https://img.shields.io/badge/python-3.11-green)

![Django](https://img.shields.io/badge/django-4.2-green)

![React](https://img.shields.io/badge/react-18.x-blue)

![Status](https://img.shields.io/badge/status-production%20ready-success)![Version](https://img.shields.io/badge/version-4.0-blue)![Version](https://img.shields.io/badge/version-4.0-blue)



---![Python](https://img.shields.io/badge/python-3.11-green)![Python](https://img.shields.io/badge/python-3.11-green)



## 🚀 Features![Django](https://img.shields.io/badge/django-4.2-green)![Django](https://img.shields.io/badge/django-4.2-green)



### 🌍 **Main NEO Tracker (React Frontend)**![React](https://img.shields.io/badge/react-18.x-blue)![React](https://img.shields.io/badge/react-18.x-blue)

- **Interactive World Map**: Click anywhere to simulate asteroid impacts

- **Real-Time Geocoding**: Automatically identifies cities, countries, and bodies of water![Status](https://img.shields.io/badge/status-production%20ready-success)![License](https://img.shields.io/badge/license-MIT-blue)

- **Accurate Physics Engine**: 

  - Energy calculations (kinetic energy, TNT equivalent)![Status](https://img.shields.io/badge/status-production%20ready-success)

  - Crater size and depth predictions

  - Blast zone radius analysis---

  - Seismic effects (Richter magnitude)

- **Population-Based Casualty Estimates**: Real population density data---

- **Beautiful Visualizations**: Leaflet maps with impact zones

## 🚀 Features

### 🪐 **NASA Live Orrery (3D Solar System)**

- **8 Planets + Sun**: Real orbital mechanics with accurate positioning## 🚀 Features

- **121 Near-Earth Objects**: Live data from NASA API

- **1,000 Asteroid Belt Objects**: Main belt between Mars and Jupiter### 🌍 **Main NEO Tracker (React Frontend)**

- **16 Meteor Showers**: With 3D orbital paths and parent comet info

- **High-Resolution Textures**: 2K planet textures- **Interactive World Map**: Click anywhere to simulate asteroid impacts### 🌍 **Main NEO Tracker (React Frontend)**

- **Time Controls**: Speed up, pause, jump to dates

- **AstroBot AI Chatbot**: Ask questions about asteroids and space- **Real-Time Geocoding**: Automatically identifies cities, countries, and bodies of water- **Interactive World Map**: Click anywhere to simulate asteroid impacts

- **Interactive Camera**: Pan, zoom, rotate to explore

- **Accurate Physics Engine**: - **Real-Time Geocoding**: Automatically identifies cities, countries, and bodies of water

---

  - Energy calculations (kinetic energy, TNT equivalent)- **Accurate Physics Engine**: 

## 📂 Project Structure

  - Crater size and depth predictions  - Energy calculations (kinetic energy, TNT equivalent)

```

NEO_Tracker/  - Blast zone radius analysis  - Crater size and depth predictions

├── backend/                    # Django REST API

│   ├── api/                    # API endpoints  - Seismic effects (Richter magnitude)  - Blast zone radius analysis

│   │   ├── views.py            # Impact simulation, NASA proxy

│   │   ├── physics.py          # Physics calculations- **Population-Based Casualty Estimates**: Real population density data  - Seismic effects (Richter magnitude)

│   │   ├── casualty_calculator.py  # Population-based casualties

│   │   └── nasa_api.py         # NASA API integration- **Beautiful Visualizations**: Leaflet maps with impact zones- **Population-Based Casualty Estimates**: Real population density data

│   ├── backend/                # Django settings

│   │   ├── settings.py         # Configuration- **Beautiful Visualizations**: Leaflet maps with impact zones

│   │   └── urls.py             # URL routing

│   ├── static/orrery/          # NASA Live Orrery (3D Solar System)### 🪐 **NASA Live Orrery (3D Solar System)**

│   │   ├── index.html          # Orrery HTML

│   │   ├── app.js              # Application logic- **8 Planets + Sun**: Real orbital mechanics with accurate positioning### 🪐 **NASA Live Orrery (3D Solar System)**

│   │   ├── solar-system.js     # 3D rendering

│   │   ├── nasa-api.js         # API client- **121 Near-Earth Objects**: Live data from NASA API- **8 Planets + Sun**: Real orbital mechanics with accurate positioning

│   │   └── textures/           # Planet textures

│   ├── requirements.txt        # Python dependencies- **1,000 Asteroid Belt Objects**: Main belt between Mars and Jupiter- **121 Near-Earth Objects**: Live data from NASA API

│   ├── Procfile                # Render.com deployment

│   └── build.sh                # Build script- **16 Meteor Showers**: With 3D orbital paths and parent comet info- **1,000 Asteroid Belt Objects**: Main belt between Mars and Jupiter

│

├── frontend/                   # React Application- **High-Resolution Textures**: 2K planet textures- **16 Meteor Showers**: With 3D orbital paths and parent comet info

│   ├── src/

│   │   ├── components/- **Time Controls**: Speed up, pause, jump to dates- **High-Resolution Textures**: 2K planet textures

│   │   │   └── WED/

│   │   │       ├── NEOAnalysis.js      # NASA data analysis- **AstroBot AI Chatbot**: Ask questions about asteroids and space- **Time Controls**: Speed up, pause, jump to dates

│   │   │       ├── SimulationPage.js   # Impact simulator

│   │   │       └── MapView.js          # Interactive map- **Interactive Camera**: Pan, zoom, rotate to explore- **AstroBot AI Chatbot**: Ask questions about asteroids and space

│   │   ├── App.js              # Main React component

│   │   └── index.js            # Entry point- **Interactive Camera**: Pan, zoom, rotate to explore

│   └── package.json            # Node dependencies

│---

├── START_NEO_TRACKER.bat       # 🎯 Windows: Start Full App

├── START_ORRERY_ONLY.bat       # 🎯 Windows: Start Orrery Only---

├── STOP_NEO_TRACKER.bat        # 🎯 Windows: Stop All Servers

├── render.yaml                 # Render.com deployment config## 📂 Project Structure

├── README.md                   # This file

├── QUICK_START_GUIDE.md        # Detailed setup guide## � Project Structure

├── DEPLOYMENT_CHECKLIST.md     # Pre-deployment tasks

├── HOSTING_READINESS_REPORT.md # Security & deployment summary```

└── ORRERY_BACKEND_DEPLOYMENT.md # Orrery architecture details

```NEO_Tracker/```



---├── backend/                    # Django REST APINEO_Tracker/



## 🛠️ Tech Stack│   ├── api/                    # API endpoints├── backend/                    # Django REST API



### **Backend**│   │   ├── views.py            # Impact simulation, NASA proxy│   ├── api/                    # API endpoints

- **Django 4.2** - Python web framework

- **Django REST Framework** - API development│   │   ├── physics.py          # Physics calculations│   │   ├── views.py            # Impact simulation, NASA proxy

- **Gunicorn** - Production WSGI server

- **WhiteNoise** - Static file serving│   │   ├── casualty_calculator.py  # Population-based casualties│   │   ├── physics.py          # Physics calculations

- **Python 3.11** - Core language

│   │   └── nasa_api.py         # NASA API integration│   │   ├── casualty_calculator.py  # Population-based casualties

### **Frontend**

- **React 18** - UI framework│   ├── backend/                # Django settings│   │   └── nasa_api.py         # NASA API integration

- **Leaflet** - Interactive maps

- **Axios** - HTTP client│   │   ├── settings.py         # Configuration│   ├── backend/                # Django settings

- **React Hooks** - State management

│   │   └── urls.py             # URL routing│   │   ├── settings.py         # Configuration

### **3D Visualization**

- **Three.js** - 3D rendering│   ├── static/orrery/          # NASA Live Orrery (3D Solar System)│   │   └── urls.py             # URL routing

- **WebGL** - Hardware acceleration

│   │   ├── index.html          # Orrery HTML│   ├── static/orrery/          # NASA Live Orrery (3D Solar System)

### **APIs & Data**

- **NASA NEO API** - Near-Earth Object data│   │   ├── app.js              # Application logic│   │   ├── index.html          # Orrery HTML

- **OpenStreetMap Nominatim** - Geocoding service

│   │   ├── solar-system.js     # 3D rendering│   │   ├── app.js              # Application logic

---

│   │   ├── nasa-api.js         # API client│   │   ├── solar-system.js     # 3D rendering

## 🚀 Quick Start

│   │   └── textures/           # Planet textures│   │   ├── nasa-api.js         # API client

### **Prerequisites**

- Python 3.11+│   ├── requirements.txt        # Python dependencies│   │   └── textures/           # Planet textures

- Node.js 18+

- npm or yarn│   ├── Procfile                # Render.com deployment│   ├── requirements.txt        # Python dependencies



### **🎯 Easy Launch (Windows - Recommended)**│   └── build.sh                # Build script│   ├── Procfile                # Render.com deployment



**Option 1: Full Application (Backend + Frontend)**││   └── build.sh                # Build script

```bash

# Just double-click this file:├── frontend/                   # React Application│

START_NEO_TRACKER.bat

```│   ├── src/├── frontend/                   # React Application

- ✅ Auto-checks and installs dependencies

- ✅ Starts Django backend (Port 8000)│   │   ├── components/│   ├── src/

- ✅ Starts React frontend (Port 3000)

- ✅ Opens browser automatically│   │   │   └── WED/│   │   ├── components/

- Access: http://localhost:3000/

│   │   │       ├── NEOAnalysis.js      # NASA data analysis│   │   │   └── WED/

**Option 2: NASA Orrery Only (Backend Only)**

```bash│   │   │       ├── SimulationPage.js   # Impact simulator│   │   │       ├── NEOAnalysis.js      # NASA data analysis

# Just double-click this file:

START_ORRERY_ONLY.bat│   │   │       └── MapView.js          # Interactive map│   │   │       ├── SimulationPage.js   # Impact simulator

```

- ✅ Starts backend only│   │   ├── App.js              # Main React component│   │   │       └── MapView.js          # Interactive map

- ✅ Opens Orrery in browser

- Access: http://localhost:8000/orrery/│   │   └── index.js            # Entry point│   │   ├── App.js              # Main React component



**Stop All Servers**│   └── package.json            # Node dependencies│   │   └── index.js            # Entry point

```bash

# Just double-click this file:││   └── package.json            # Node dependencies

STOP_NEO_TRACKER.bat

```├── render.yaml                 # Render.com deployment config│

- ✅ Stops all running servers

- ✅ Cleans up processes├── README.md                   # This file├── render.yaml                 # Render.com deployment config



### **💻 Manual Launch (All Platforms)**├── QUICK_START_GUIDE.md        # How to run locally├── README.md                   # This file



**Option 1: Run Both Applications**├── DEPLOYMENT_CHECKLIST.md     # Pre-deployment tasks├── QUICK_START_GUIDE.md        # How to run locally



```bash├── HOSTING_READINESS_REPORT.md # Security & deployment summary├── DEPLOYMENT_CHECKLIST.md     # Pre-deployment tasks

# Terminal 1: Start Django Backend

cd backend└── ORRERY_BACKEND_DEPLOYMENT.md # Orrery architecture details├── HOSTING_READINESS_REPORT.md # Security & deployment summary

pip install -r requirements.txt

python manage.py migrate```└── ORRERY_BACKEND_DEPLOYMENT.md # Orrery architecture details

python manage.py runserver

```

# Terminal 2: Start React Frontend

cd frontend---

npm install

npm start---

```

## 🛠️ Tech Stack

**Access**:

- React App: http://localhost:3000/## �️ Tech Stack

- NASA Orrery: http://localhost:8000/orrery/

- Backend API: http://localhost:8000/api/### **Backend**



**Option 2: Run Backend Only (Orrery Only)**- **Django 4.2** - Python web framework### **Backend**



```bash- **Django REST Framework** - API development- **Django 4.2** - Python web framework

cd backend

pip install -r requirements.txt- **Gunicorn** - Production WSGI server- **Django REST Framework** - API development

python manage.py migrate

python manage.py runserver- **WhiteNoise** - Static file serving- **Gunicorn** - Production WSGI server

```

- **Python 3.11** - Core language- **WhiteNoise** - Static file serving

**Access**:

- NASA Orrery: http://localhost:8000/orrery/- **Python 3.11** - Core language



---### **Frontend**



## 🔧 Configuration- **React 18** - UI framework### **Frontend**



### **Backend Environment Variables**- **Leaflet** - Interactive maps- **React 18** - UI framework



Create a `.env` file in `backend/` directory (optional, has defaults):- **Axios** - HTTP client- **Leaflet** - Interactive maps



```env- **React Hooks** - State management- **Axios** - HTTP client

# Security

SECRET_KEY=your-secret-key-here- **React Hooks** - State management

DEBUG=True

### **3D Visualization**

# API Keys (get from https://api.nasa.gov/)

NASA_API_KEY=your-nasa-api-key- **Three.js** - 3D rendering### **3D Visualization**



# CORS- **WebGL** - Hardware acceleration- **Three.js** - 3D rendering

FRONTEND_URL=http://localhost:3000

ALLOWED_HOSTS=localhost,127.0.0.1- **WebGL** - Hardware acceleration

```

### **APIs & Data**

### **Frontend Environment Variables**

- **NASA NEO API** - Near-Earth Object data### **APIs & Data**

Create `.env` file in `frontend/` directory:

- **OpenStreetMap Nominatim** - Geocoding service- **NASA NEO API** - Near-Earth Object data

```env

REACT_APP_API_URL=http://localhost:8000- **NASA EPIC** - Earth imagery (optional)- **OpenStreetMap Nominatim** - Geocoding service

```

- **NASA EPIC** - Earth imagery (optional)

---

---

## 📊 API Endpoints

---

| Endpoint | Method | Description |

|----------|--------|-------------|## 🚀 Quick Start

| `/api/simulate-impact/` | POST | Calculate asteroid impact physics |

| `/api/asteroids` | GET | Get Near-Earth Objects from NASA |## 🚀 Quick Start

| `/api/asteroids/{id}` | GET | Get specific asteroid details |

| `/orrery/` | GET | Access NASA Live Orrery (3D Solar System) |### **Prerequisites**



### **Example: Impact Simulation**- Python 3.11+### **Prerequisites**



```bash- Node.js 18+- Python 3.11+

curl -X POST http://localhost:8000/api/simulate-impact/ \

  -H "Content-Type: application/json" \- npm or yarn- Node.js 18+

  -d '{

    "diameter_km": 0.5,- npm or yarn

    "velocity_kmps": 20,

    "impact_lat": 40.7128,### **Option 1: Run Both Applications (Full Experience)**

    "impact_lon": -74.0060,

    "impact_angle": 45### **Option 1: Run Both Applications (Full Experience)**

  }'

``````bash



**Response**:# Terminal 1: Start Django Backend```bash

```json

{cd backend# Terminal 1: Start Django Backend

  "asteroid": {

    "diameter_km": 0.5,pip install -r requirements.txtcd backend

    "mass_kg": 1.3089969389957472e+11,

    "velocity_kmps": 20python manage.py migratepip install -r requirements.txt

  },

  "energy": {python manage.py runserverpython manage.py migrate

    "joules": 2.6179938779914945e+16,

    "megatons_tnt": 6255.6python manage.py runserver

  },

  "crater": {# Terminal 2: Start React Frontend

    "diameter_km": 8.6,

    "depth_km": 0.3cd frontend# Terminal 2: Start React Frontend

  },

  "casualties": {npm installcd frontend

    "location_name": "New York, United States",

    "estimated_deaths": 8500000,npm startnpm install

    "estimated_injuries": 4250000

  },```npm start

  "seismic_effects": {

    "richter_magnitude": 6.2```

  }

}**Access**:

```

- React App: http://localhost:3000/**Access**:

---

- NASA Orrery: http://localhost:8000/orrery/- React App: http://localhost:3000/

## 🚀 Deployment

- Backend API: http://localhost:8000/api/- NASA Orrery: http://localhost:8000/orrery/

### **Deploy to Render.com (Recommended)**

- Backend API: http://localhost:8000/api/

1. **Push to GitHub**:

   ```bash### **Option 2: Run Backend Only (Orrery Only)**

   git add .

   git commit -m "Ready for deployment"### **Option 2: Run Backend Only (Orrery Only)**

   git push origin main

   ``````bash



2. **Create Render Account**: https://render.com/cd backend```bash



3. **Create New Web Service**:pip install -r requirements.txtcd backend

   - Connect your GitHub repository

   - Render auto-detects `render.yaml`python manage.py migratepip install -r requirements.txt



4. **Set Environment Variables** in Render Dashboard:python manage.py runserverpython manage.py migrate

   - `NASA_API_KEY` - Get from https://api.nasa.gov/

   - `ALLOWED_HOSTS` - Your Render domain```python manage.py runserver

   - `FRONTEND_URL` - Your frontend domain (if separate)

```

5. **Deploy**: Click "Create Web Service"

**Access**:

6. **Access Your App**:

   ```- NASA Orrery: http://localhost:8000/orrery/**Access**:

   https://your-app.onrender.com/orrery/  ← NASA Orrery

   https://your-app.onrender.com/api/     ← Backend API- NASA Orrery: http://localhost:8000/orrery/ ✨

   ```

---

### **Frontend Deployment (React)**

---

**Option A: Vercel** (Recommended)

```bash## 🔧 Configuration

cd frontend

npm install -g vercel## 🔧 Configuration

vercel

```### **Backend Environment Variables**



**Option B: Netlify**### **Backend Environment Variables**

```bash

cd frontendCreate a `.env` file in `backend/` directory (optional, has defaults):

npm run build

# Upload build/ folder to NetlifyCreate a `.env` file in `backend/` directory (optional, has defaults):

```

```env

**See**: `DEPLOYMENT_CHECKLIST.md` for detailed pre-deployment tasks

# Security```env

---

SECRET_KEY=your-secret-key-here# Security

## 🔒 Security

DEBUG=TrueSECRET_KEY=your-secret-key-here

### **✅ Security Features**

- NASA API keys hidden in backend (never exposed to frontend)DEBUG=True

- HTTPS/SSL enforced in production

- CORS properly configured# API Keys (get from https://api.nasa.gov/)

- CSRF protection enabled

- SQL injection protection (Django ORM)NASA_API_KEY=your-nasa-api-key# API Keys (get from https://api.nasa.gov/)

- XSS protection headers

- Secure cookie settingsNASA_API_KEY=your-nasa-api-key



### **⚠️ Important**# CORS

- **Never commit API keys to Git!**

- Use environment variables for all secretsFRONTEND_URL=http://localhost:3000# CORS

- Get new NASA API key from https://api.nasa.gov/

ALLOWED_HOSTS=localhost,127.0.0.1FRONTEND_URL=http://localhost:3000

**See**: `HOSTING_READINESS_REPORT.md` for security checklist

```ALLOWED_HOSTS=localhost,127.0.0.1

---



## 📚 Documentation

### **Frontend Environment Variables**# Database (SQLite by default)

- **`README.md`** - This file (overview)

- **`QUICK_START_GUIDE.md`** - Detailed setup instructions# Add PostgreSQL config for production

- **`DEPLOYMENT_CHECKLIST.md`** - Pre-deployment tasks

- **`HOSTING_READINESS_REPORT.md`** - Security & deployment summaryCreate `.env` file in `frontend/` directory:```

- **`ORRERY_BACKEND_DEPLOYMENT.md`** - Orrery architecture details



---

```env### **Frontend Environment Variables**

## 🎯 Use Cases

REACT_APP_API_URL=http://localhost:8000

1. **Educational**: Teach students about asteroid impacts and solar system dynamics

2. **Research**: Analyze potential asteroid threat scenarios```Create `.env` file in `frontend/` directory:

3. **Public Awareness**: Visualize asteroid dangers for general audience

4. **Space Exploration**: Explore real NASA asteroid data interactively

5. **Science Communication**: Demonstrate physics of impacts with real calculations

---```env

---

REACT_APP_API_URL=http://localhost:8000

## 🧪 Testing

## 📊 API Endpoints```

### **Test Impact Simulation**

```bash

# From NEO_Tracker root:

cd backend| Endpoint | Method | Description |---

python manage.py shell

```|----------|--------|-------------|



```python| `/api/simulate-impact/` | POST | Calculate asteroid impact physics |## 📊 API Endpoints

from api.physics import ImpactPhysics

from api.casualty_calculator import CasualtyCalculator| `/api/asteroids` | GET | Get Near-Earth Objects from NASA |



# Create impact physics calculator| `/api/asteroids/{id}` | GET | Get specific asteroid details || Endpoint | Method | Description |

physics = ImpactPhysics(

    diameter_km=1.0,| `/orrery/` | GET | Access NASA Live Orrery (3D Solar System) ||----------|--------|-------------|

    velocity_kmps=25,

    impact_lat=40.7128,| `/api/simulate-impact/` | POST | Calculate asteroid impact physics |

    impact_lon=-74.0060,

    impact_angle=45### **Example: Impact Simulation**| `/api/asteroids` | GET | Get Near-Earth Objects from NASA |

)

| `/api/asteroids/{id}` | GET | Get specific asteroid details |

# Calculate results

results = physics.calculate_all()```bash| `/api/earth-imagery` | GET | Get NASA EPIC Earth images |

print(results)

curl -X POST http://localhost:8000/api/simulate-impact/ \| `/orrery/` | GET | Access NASA Live Orrery (3D Solar System) |

# Test geocoding

calc = CasualtyCalculator()  -H "Content-Type: application/json" \

location = calc.get_location_name(40.7128, -74.0060)

print(location)  # Should show "New York, United States"  -d '{### **Example: Impact Simulation**

```

    "diameter_km": 0.5,

### **Test NASA API**

```bash    "velocity_kmps": 20,```bash

curl http://localhost:8000/api/asteroids?start_date=2025-01-01&end_date=2025-01-07

```    "impact_lat": 40.7128,curl -X POST http://localhost:8000/api/simulate-impact/ \



---    "impact_lon": -74.0060,  -H "Content-Type: application/json" \



## 🤝 Contributing    "impact_angle": 45  -d '{



Contributions welcome! Please follow these steps:  }'    "diameter_km": 0.5,



1. Fork the repository```    "velocity_kmps": 20,

2. Create a feature branch: `git checkout -b feature/amazing-feature`

3. Commit changes: `git commit -m 'Add amazing feature'`    "impact_lat": 40.7128,

4. Push to branch: `git push origin feature/amazing-feature`

5. Open a Pull Request**Response**:    "impact_lon": -74.0060,



---```json    "impact_angle": 45



## 📝 License{  }'



This project is licensed under the MIT License - see the LICENSE file for details.  "asteroid": {```



---    "diameter_km": 0.5,



## 🙏 Acknowledgments    "mass_kg": 1.3089969389957472e+11,**Response**:



- **NASA** - Near-Earth Object data and EPIC imagery    "velocity_kmps": 20```json

- **OpenStreetMap** - Nominatim geocoding service

- **Three.js** - 3D rendering library  },{

- **React** & **Django** - Framework foundations

- **Solar System Scope** - Planet texture resources  "energy": {  "asteroid": {



---    "joules": 2.6179938779914945e+16,    "diameter_km": 0.5,



## 📞 Support    "megatons_tnt": 6255.6    "mass_kg": 1.3089969389957472e+11,



- **Issues**: Open an issue on GitHub  },    "velocity_kmps": 20

- **Documentation**: See documentation files

- **NASA API**: https://api.nasa.gov/  "crater": {  },



---    "diameter_km": 8.6,  "energy": {



## 🌟 Star History    "depth_km": 0.3    "joules": 2.6179938779914945e+16,



If you find this project useful, please give it a star! ⭐  },    "megatons_tnt": 6255.6



---  "casualties": {  },



**Built with ❤️ for space exploration and planetary defense**    "location_name": "New York, United States",  "crater": {



🚀 **Happy Asteroid Hunting!** 🌍☄️    "estimated_deaths": 8500000,    "diameter_km": 8.6,



---    "estimated_injuries": 4250000    "depth_km": 0.3



**Version**: 4.0 - Fully Backend-Integrated    },  },

**Last Updated**: October 2025  

**Status**: ✅ Production Ready  "seismic_effects": {  "casualties": {


    "richter_magnitude": 6.2    "location_name": "New York, United States",

  }    "estimated_deaths": 8500000,

}    "estimated_injuries": 4250000

```  },

  "seismic_effects": {

---    "richter_magnitude": 6.2

  }

## 🚀 Deployment}

```

### **Deploy to Render.com (Recommended)**

---

1. **Push to GitHub**:

   ```bash## 🚀 Deployment

   git add .

   git commit -m "Ready for deployment"### **Deploy to Render.com (Recommended)**

   git push origin main

   ```1. **Push to GitHub**:

   ```bash

2. **Create Render Account**: https://render.com/   git add .

   git commit -m "Ready for deployment"

3. **Create New Web Service**:   git push origin main

   - Connect your GitHub repository   ```

   - Render auto-detects `render.yaml`

2. **Create Render Account**: https://render.com/

4. **Set Environment Variables** in Render Dashboard:

   - `NASA_API_KEY` - Get from https://api.nasa.gov/3. **Create New Web Service**:

   - `ALLOWED_HOSTS` - Your Render domain   - Connect your GitHub repository

   - `FRONTEND_URL` - Your frontend domain (if separate)   - Render auto-detects `render.yaml`



5. **Deploy**: Click "Create Web Service"4. **Set Environment Variables** in Render Dashboard:

   - `NASA_API_KEY` - Get from https://api.nasa.gov/

6. **Access Your App**:   - `ALLOWED_HOSTS` - Your Render domain

   ```   - `FRONTEND_URL` - Your frontend domain (if separate)

   https://your-app.onrender.com/orrery/  ← NASA Orrery

   https://your-app.onrender.com/api/     ← Backend API5. **Deploy**: Click "Create Web Service"

   ```

6. **Access Your App**:

### **Frontend Deployment (React)**   ```

   https://your-app.onrender.com/orrery/  ← NASA Orrery

**Option A: Vercel** (Recommended)   https://your-app.onrender.com/api/     ← Backend API

```bash   ```

cd frontend

npm install -g vercel### **Deploy to Heroku**

vercel

``````bash

cd backend

**Option B: Netlify**heroku create your-app-name

```bashheroku config:set NASA_API_KEY=your-key

cd frontendgit push heroku main

npm run build```

# Upload build/ folder to Netlify

```### **Frontend Deployment (React)**



**See**: `DEPLOYMENT_CHECKLIST.md` for detailed pre-deployment tasks**Option A: Vercel** (Recommended)

```bash

---cd frontend

npm install -g vercel

## 🔒 Securityvercel

```

### **✅ Security Features**

- NASA API keys hidden in backend (never exposed to frontend)**Option B: Netlify**

- HTTPS/SSL enforced in production```bash

- CORS properly configuredcd frontend

- CSRF protection enablednpm run build

- SQL injection protection (Django ORM)# Upload build/ folder to Netlify

- XSS protection headers```

- Secure cookie settings

**See**: `DEPLOYMENT_CHECKLIST.md` for detailed pre-deployment tasks

### **⚠️ Important**

- **Never commit API keys to Git!**---

- Use environment variables for all secrets

- Get new NASA API key from https://api.nasa.gov/## 🔒 Security



**See**: `HOSTING_READINESS_REPORT.md` for security checklist### **✅ Security Features**

- NASA API keys hidden in backend (never exposed to frontend)

---- HTTPS/SSL enforced in production

- CORS properly configured

## 📚 Documentation- CSRF protection enabled

- SQL injection protection (Django ORM)

- **`README.md`** - This file (overview)- XSS protection headers

- **`QUICK_START_GUIDE.md`** - Detailed setup instructions- Secure cookie settings

- **`DEPLOYMENT_CHECKLIST.md`** - Pre-deployment tasks

- **`HOSTING_READINESS_REPORT.md`** - Security & deployment summary### **⚠️ Important**

- **`ORRERY_BACKEND_DEPLOYMENT.md`** - Orrery architecture details- **Never commit API keys to Git!**

- Use environment variables for all secrets

---- Get new NASA API key from https://api.nasa.gov/



## 🎯 Use Cases**See**: `HOSTING_READINESS_REPORT.md` for security checklist



1. **Educational**: Teach students about asteroid impacts and solar system dynamics---

2. **Research**: Analyze potential asteroid threat scenarios

3. **Public Awareness**: Visualize asteroid dangers for general audience## � Documentation

4. **Space Exploration**: Explore real NASA asteroid data interactively

5. **Science Communication**: Demonstrate physics of impacts with real calculations- **`README.md`** - This file (overview)

- **`QUICK_START_GUIDE.md`** - Detailed setup instructions

---- **`DEPLOYMENT_CHECKLIST.md`** - Pre-deployment tasks

- **`HOSTING_READINESS_REPORT.md`** - Security & deployment summary

## 🧪 Testing- **`ORRERY_BACKEND_DEPLOYMENT.md`** - Orrery architecture details



### **Test Impact Simulation**---

```bash

# From NEO_Tracker root:## 📝 License

cd backend

python manage.py shellThis project is created for educational and hackathon purposes.

```

## 🙏 Acknowledgments

```python

from api.physics import ImpactPhysics- NASA for providing the Near-Earth Object API

from api.casualty_calculator import CasualtyCalculator- The DART mission team for inspiring asteroid deflection research

- Three.js and Leaflet.js communities for amazing visualization tools

# Create impact physics calculator

physics = ImpactPhysics(## 📧 Contact

    diameter_km=1.0,

    velocity_kmps=25,For questions or collaboration:

    impact_lat=40.7128,- GitHub Issues: [Create an issue](https://github.com/yourusername/asteroid-impact-simulator/issues)

    impact_lon=-74.0060,- Email: your.email@example.com

    impact_angle=45

)---



# Calculate results**Built with ❤️ for Hackathon 2025**

results = physics.calculate_all()

print(results)*Protecting Earth, one simulation at a time* 🌍✨


# Test geocoding
calc = CasualtyCalculator()
location = calc.get_location_name(40.7128, -74.0060)
print(location)  # Should show "New York, United States"
```

### **Test NASA API**
```bash
curl http://localhost:8000/api/asteroids?start_date=2025-01-01&end_date=2025-01-07
```

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **NASA** - Near-Earth Object data and EPIC imagery
- **OpenStreetMap** - Nominatim geocoding service
- **Three.js** - 3D rendering library
- **React** & **Django** - Framework foundations
- **Solar System Scope** - Planet texture resources

---

## 📞 Support

- **Issues**: Open an issue on GitHub
- **Documentation**: See documentation files
- **NASA API**: https://api.nasa.gov/

---

## 🌟 Star History

If you find this project useful, please give it a star! ⭐

---

**Built with ❤️ for space exploration and planetary defense**

🚀 **Happy Asteroid Hunting!** 🌍☄️

---

**Version**: 4.0 - Fully Backend-Integrated  
**Last Updated**: January 2025  
**Status**: ✅ Production Ready
