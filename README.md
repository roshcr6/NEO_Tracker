# 🌠 Asteroid Impact Simulator

A full-stack web application that visualizes near-Earth asteroid orbits, simulates impact scenarios, and explores mitigation strategies. Built for Hackathon 2025.

![Asteroid Impact Simulator](https://img.shields.io/badge/Status-Hackathon%20Project-orange)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Django](https://img.shields.io/badge/Django-4.2-green)

## 🎯 Problem Statement

Near-Earth Asteroid "Impactor-2025" may threaten Earth. This tool helps scientists and the public understand:
- **Orbital mechanics** and asteroid trajectories
- **Impact consequences** including crater size, blast zones, and seismic effects
- **Mitigation strategies** like kinetic impactors and gravity tractors

## ✨ Features

### 1. **NASA API Integration** 🛰️
- Fetches live Near-Earth Object (NEO) data
- Real-time asteroid size, velocity, and trajectory information
- Filters potentially hazardous asteroids

### 2. **Physics Engine** 🔬
- Impact energy calculation: `E = 0.5 * m * v²`
- Crater size and depth estimation
- Blast radius zones (fireball, total destruction, severe/moderate damage)
- Seismic effects (Richter magnitude)
- TNT equivalent energy comparison

### 3. **3D Orbit Visualization** 🌌
- Interactive Three.js visualization
- Shows asteroid orbit around the Sun
- Earth position and relative distances
- Animated asteroid approach
- Real-time deflection effects

### 4. **Impact Map** 🗺️
- Interactive Leaflet.js map
- Click to set custom impact locations
- Crater visualization
- Color-coded damage zones
- Thermal radiation radius
- Seismic impact areas

### 5. **Mitigation Simulator** 🚀
- **Kinetic Impactor**: High-speed spacecraft collision
- **Gravity Tractor**: Slow gravitational deflection
- **Nuclear Deflection**: Last-resort option
- Real-time effectiveness calculations
- Dynamic orbit path updates

## 📦 Tech Stack

### Backend (Django + Python)
- **Django 4.2** - Web framework
- **Django REST Framework** - API endpoints
- **Requests** - NASA API integration
- **CORS Headers** - Cross-origin support

### Frontend (React + JavaScript)
- **React 18.2** - UI framework
- **Three.js** - 3D visualization
- **@react-three/fiber** - React Three.js renderer
- **@react-three/drei** - Three.js helpers
- **Leaflet.js** - Interactive maps
- **React-Leaflet** - React Leaflet bindings
- **Axios** - HTTP client

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
- Windows:
  ```bash
  venv\Scripts\activate
  ```
- macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Run migrations:**
```bash
python manage.py migrate
```

6. **Start Django server:**
```bash
python manage.py runserver
```

Backend will run on: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start React development server:**
```bash
npm start
```

Frontend will run on: `http://localhost:3000`

## 🌐 Deployment (FREE!)

Ready to deploy your app to the world? We've created comprehensive guides:

### 📚 Deployment Guides

1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete step-by-step deployment guide
   - Deploy backend on Render (free)
   - Deploy frontend on Vercel (free)
   - Environment variables setup
   - CORS configuration
   - Troubleshooting tips

2. **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - Quick 10-minute deployment checklist
   - Pre-deployment checks
   - Step-by-step tasks
   - Testing procedures

3. **[ENV_VARIABLES.md](./ENV_VARIABLES.md)** - Environment variables reference
   - All required variables
   - How to generate SECRET_KEY
   - Security best practices

4. **[ALTERNATIVE_HOSTING.md](./ALTERNATIVE_HOSTING.md)** - Other free hosting options
   - Netlify + Railway
   - GitHub Pages + PythonAnywhere
   - Cloudflare Pages + Fly.io
   - Comparison table

### 🚀 Quick Deploy

**Recommended:** Vercel (Frontend) + Render (Backend)
- **Total Cost:** $0 (FREE!)
- **Setup Time:** ~10 minutes
- **No Credit Card Required**

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy frontend: vercel.com
# 3. Deploy backend: render.com
# 4. Done! 🎉
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📂 Project Structure

```
asteroid-impact-simulator/
├── backend/                    # Django backend
│   ├── api/                   # API application
│   │   ├── nasa_api.py       # NASA NEO API integration
│   │   ├── physics.py        # Physics calculation engine
│   │   ├── views.py          # API endpoints
│   │   └── urls.py           # URL routing
│   ├── backend/              # Django settings
│   │   ├── settings.py       # Configuration
│   │   └── urls.py           # Main URL config
│   ├── manage.py             # Django management
│   └── requirements.txt      # Python dependencies
│
├── frontend/                  # React frontend
│   ├── public/               # Static files
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Orbit3D.js    # 3D orbit visualization
│   │   │   ├── ImpactMap.js  # Interactive impact map
│   │   │   └── MitigationUI.js # Deflection simulator
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # App styles
│   │   └── index.js          # Entry point
│   └── package.json          # Node dependencies
│
└── README.md                  # This file
```

## 🌐 API Endpoints

### Asteroids
- `GET /api/asteroids` - Fetch NEO feed
  - Query params: `start_date`, `end_date`, `hazardous_only`
- `GET /api/asteroids/<id>` - Get specific asteroid details

### Impact Simulation
- `POST /api/simulate-impact` - Calculate impact effects
  ```json
  {
    "diameter_km": 1.0,
    "velocity_kmps": 20,
    "impact_lat": 40.7128,
    "impact_lon": -74.0060,
    "impact_angle": 45
  }
  ```

- `POST /api/impact-from-asteroid` - Calculate impact from NASA asteroid
  ```json
  {
    "asteroid_id": "3542519",
    "impact_lat": 40.7128,
    "impact_lon": -74.0060
  }
  ```

### Deflection Simulation
- `POST /api/simulate-deflection` - Simulate deflection methods
  ```json
  {
    "original_velocity_kmps": 20,
    "method": "kinetic_impactor",
    "params": {
      "impactor_mass_kg": 500,
      "impactor_velocity_kmps": 10,
      "asteroid_mass_kg": 1e12
    }
  }
  ```

### Health Check
- `GET /api/health` - API health status

## 🔑 NASA API Configuration

The NASA API key is configured in `backend/backend/settings.py`:

```python
NASA_API_KEY = 'cXvyJSY51LQk5ElMYRGqUNotCpXn2fncclaKhnFm'
```

Get your own key at: https://api.nasa.gov

## 👥 Team Roles

| Person | Responsibility | Files |
|--------|---------------|-------|
| Person 1 | NASA API Integration | `api/nasa_api.py` |
| Person 2 | Physics Engine | `api/physics.py` |
| Person 3 | 3D Orbit Visualization | `components/Orbit3D.js` |
| Person 4 | Impact Map | `components/ImpactMap.js` |
| Person 5 | Mitigation Simulator | `components/MitigationUI.js` |

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🎓 Scientific References

- NASA Center for Near-Earth Object Studies (CNEOS)
- Impact crater scaling laws
- Nuclear weapon effects calculations
- DART mission (Double Asteroid Redirection Test)

## 🐛 Known Issues

- Leaflet marker icons require manual import fix in development
- Some NASA API responses may be slow during peak times
- Ocean impact effects are simplified (no tsunami simulation yet)

## 🚧 Future Enhancements

- [ ] Tsunami simulation for ocean impacts
- [ ] Multiple asteroid tracking
- [ ] Historical impact database
- [ ] VR/AR visualization support
- [ ] Social media sharing
- [ ] PDF report generation
- [ ] Multi-language support

## 📝 License

This project is created for educational and hackathon purposes.

## 🙏 Acknowledgments

- NASA for providing the Near-Earth Object API
- The DART mission team for inspiring asteroid deflection research
- Three.js and Leaflet.js communities for amazing visualization tools

## 📧 Contact

For questions or collaboration:
- GitHub Issues: [Create an issue](https://github.com/yourusername/asteroid-impact-simulator/issues)
- Email: your.email@example.com

---

**Built with ❤️ for Hackathon 2025**

*Protecting Earth, one simulation at a time* 🌍✨
