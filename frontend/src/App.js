/**
 * Main App Component with Routing
 * Ultra-optimized for smooth 60 FPS transitions
 */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import './App.css';
import './styles/premium-typography.css';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./components/WED/LandingPage'));
const HomePage = lazy(() => import('./components/WED/HomePage'));
const DiscoverPage = lazy(() => import('./components/WED/DiscoverPage'));
const ImpactPage = lazy(() => import('./components/WED/ImpactPage'));
const SimulationPage = lazy(() => import('./components/WED/SimulationPage'));
const NEOAnalysis = lazy(() => import('./components/WED/NEOAnalysis'));
const About = lazy(() => import('./components/WED/About'));
const CustomMeteoroid = lazy(() => import('./components/WED/CustomMeteoroid'));
const OrreryPage = lazy(() => import('./components/WED/OrreryPage'));
const AsteroidSmashGame = lazy(() => import('./components/WED/AsteroidSmashGame'));
const Orbit3D = lazy(() => import('./components/Orbit3D'));
const MitigationUI = lazy(() => import('./components/MitigationUI'));

// Premium Loading Component
const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      zIndex: 9999
    }}
  >
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        width: 60,
        height: 60,
        border: '3px solid rgba(102, 126, 234, 0.3)',
        borderTop: '3px solid #667eea',
        borderRadius: '50%'
      }}
    />
  </motion.div>
);

const API_BASE_URL = 'http://localhost:8000/api';

function Simulator() {
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [asteroidList, setAsteroidList] = useState([]);
  const [impactLocation, setImpactLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [impactData, setImpactData] = useState(null);
  const [deflectionData, setDeflectionData] = useState({ active: false, deltaV: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAsteroids, setFilteredAsteroids] = useState([]);
  
  // Default asteroid data for demonstration
  const defaultAsteroid = {
    name: 'Impactor-2025',
    diameter: 1.0,
    velocity: 20,
    mass: 1.5e12,
    isHazardous: true,
    orbitRadius: 20,
    speed: 0.2,
    scale: 0.3
  };
  
  // Fetch asteroids on component mount
  useEffect(() => {
    fetchAsteroids();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Calculate impact when asteroid or location changes
  useEffect(() => {
    if (selectedAsteroid) {
      calculateImpact();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsteroid, impactLocation]);
  
  const fetchAsteroids = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/asteroids`, {
        params: { hazardous_only: false }
      });
      
      if (response.data.asteroids && response.data.asteroids.length > 0) {
        setAsteroidList(response.data.asteroids);
        setFilteredAsteroids(response.data.asteroids);
        
        // Set first asteroid as selected
        const firstAsteroid = response.data.asteroids[0];
        setSelectedAsteroid({
          name: firstAsteroid.name,
          diameter: firstAsteroid.diameter_km,
          velocity: firstAsteroid.velocity_kmps,
          mass: calculateMass(firstAsteroid.diameter_km),
          isHazardous: firstAsteroid.is_potentially_hazardous,
          orbitRadius: 15 + (Math.random() * 15), // Random orbit between 15-30
          speed: 0.15 + (Math.random() * 0.2), // Random speed 0.15-0.35
          scale: Math.min(firstAsteroid.diameter_km * 0.3, 0.5)
        });
      } else {
        // Use default asteroid if API fails
        setSelectedAsteroid(defaultAsteroid);
      }
    } catch (err) {
      console.error('Error fetching asteroids:', err);
      setError('Failed to fetch NASA data. Using default asteroid.');
      setSelectedAsteroid(defaultAsteroid);
    } finally {
      setLoading(false);
    }
  };
  
  const calculateMass = (diameterKm) => {
    const density = 3000; // kg/m^3
    const radiusM = (diameterKm * 1000) / 2;
    const volumeM3 = (4/3) * Math.PI * Math.pow(radiusM, 3);
    return volumeM3 * density;
  };
  
  const calculateImpact = async () => {
    if (!selectedAsteroid) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/simulate-impact`, {
        diameter_km: selectedAsteroid.diameter,
        velocity_kmps: selectedAsteroid.velocity,
        impact_lat: impactLocation.lat,
        impact_lon: impactLocation.lng,
        impact_angle: 45
      });
      
      setImpactData(response.data);
    } catch (err) {
      console.error('Error calculating impact:', err);
      setError('Failed to calculate impact simulation.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLocationChange = (newLocation) => {
    setImpactLocation(newLocation);
  };
  
  const handleDeflectionChange = (deflection) => {
    setDeflectionData(deflection);
  };
  
  const handleAsteroidSelect = (asteroid) => {
    setSelectedAsteroid(asteroid);
    setShowSidebar(false);
  };
  
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === '') {
      setFilteredAsteroids(asteroidList);
    } else {
      const filtered = asteroidList.filter(asteroid => 
        asteroid.name.toLowerCase().includes(query) ||
        asteroid.id.includes(query)
      );
      setFilteredAsteroids(filtered);
    }
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>☄️ Asteroid Impact Simulator</h1>
          <p className="subtitle">Near-Earth Asteroid "Impactor-2025" Threat Analysis</p>
        </div>
        <button 
          className="menu-btn"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? '✕' : '☰'}
        </button>
      </header>
      
      {showSidebar && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>🔍 Asteroid Search</h2>
            <button className="close-btn" onClick={() => setShowSidebar(false)}>✕</button>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <span className="search-icon">🔎</span>
          </div>
          
          <div className="asteroid-count">
            {filteredAsteroids.length} asteroid{filteredAsteroids.length !== 1 ? 's' : ''} found
          </div>
          
          <div className="asteroid-list">
            {loading ? (
              <p className="loading-text">Loading asteroids...</p>
            ) : filteredAsteroids.length > 0 ? (
              filteredAsteroids.slice(0, 20).map((asteroid, index) => (
                <div 
                  key={index}
                  className={`asteroid-item ${selectedAsteroid?.name === asteroid.name ? 'selected' : ''}`}
                  onClick={() => handleAsteroidSelect({
                    name: asteroid.name,
                    diameter: asteroid.diameter_km,
                    velocity: asteroid.velocity_kmps,
                    mass: calculateMass(asteroid.diameter_km),
                    isHazardous: asteroid.is_potentially_hazardous,
                    orbitRadius: 15 + (index * 1.2 % 15), // Varied orbits based on index (15-30)
                    speed: 0.15 + ((index * 0.03) % 0.2), // Varied speeds based on index (0.15-0.35)
                    scale: Math.min(asteroid.diameter_km * 0.3, 0.5)
                  })}
                >
                  <div className="asteroid-name">{asteroid.name}</div>
                  <div className="asteroid-info">
                    <span>⌀ {asteroid.diameter_km.toFixed(2)} km</span>
                    <span>🚀 {asteroid.velocity_kmps.toFixed(1)} km/s</span>
                  </div>
                  {asteroid.is_potentially_hazardous && (
                    <span className="hazard-badge">⚠️ Hazardous</span>
                  )}
                </div>
              ))
            ) : searchQuery ? (
              <div className="no-results">
                <p>No asteroids found matching "{searchQuery}"</p>
                <button className="clear-search-btn" onClick={() => {setSearchQuery(''); setFilteredAsteroids(asteroidList);}}>
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="asteroid-item" onClick={() => handleAsteroidSelect(defaultAsteroid)}>
                <div className="asteroid-name">Impactor-2025 (Demo)</div>
                <div className="asteroid-info">
                  <span>⌀ 1.0 km</span>
                  <span>🚀 20 km/s</span>
                </div>
                <span className="hazard-badge">⚠️ Hazardous</span>
              </div>
            )}
          </div>
        </aside>
      )}
      
      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}
      
      <main className="app-main">
        <div className="grid-container">
          <div className="grid-item orbit">
            <Orbit3D 
              asteroidData={selectedAsteroid} 
              deflectionData={deflectionData}
            />
          </div>
          
          <div className="grid-item map">
            <div className="map-placeholder">
              <h3>🗺️ Impact Location Map</h3>
              <p>Lat: {impactLocation.lat.toFixed(4)}, Lng: {impactLocation.lng.toFixed(4)}</p>
              {impactData && (
                <div className="impact-summary">
                  <p><strong>Crater Diameter:</strong> {impactData.crater_diameter_km?.toFixed(2)} km</p>
                  <p><strong>Energy Released:</strong> {impactData.energy_megatons?.toFixed(1)} MT</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid-item mitigation">
            <MitigationUI 
              asteroidData={selectedAsteroid}
              onDeflectionChange={handleDeflectionChange}
            />
          </div>
        </div>
        
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Calculating impact simulation...</p>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>
          Data Source: NASA Near Earth Object API | 
          Created for Hackathon 2025 | 
          Team: Asteroid Impact Simulator
        </p>
        <div className="footer-links">
          <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer">NASA API</a>
          <span>•</span>
          <a href="https://cneos.jpl.nasa.gov" target="_blank" rel="noopener noreferrer">CNEOS</a>
          <span>•</span>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

// Animated Routes Wrapper with smooth transitions
function AnimatedRoutes() {
  const location = useLocation();
  
  // Ultra-smooth page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.96,
      y: 20,
      filter: 'blur(10px)'
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)'
    },
    out: {
      opacity: 0,
      scale: 1.04,
      y: -20,
      filter: 'blur(10px)'
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: [0.6, 0.05, 0.01, 0.9], // Porsche curve for luxury feel
    duration: 0.5
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <LandingPage />
            </motion.div>
          </Suspense>
        } />
        <Route path="/home" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <HomePage />
            </motion.div>
          </Suspense>
        } />
        <Route path="/discover" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <DiscoverPage />
            </motion.div>
          </Suspense>
        } />
        <Route path="/impact" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ImpactPage />
            </motion.div>
          </Suspense>
        } />
        <Route path="/simulate" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SimulationPage />
            </motion.div>
          </Suspense>
        } />
        <Route path="/neo-analysis" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NEOAnalysis />
            </motion.div>
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <About />
            </motion.div>
          </Suspense>
        } />
        <Route path="/simulator" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Simulator />
            </motion.div>
          </Suspense>
        } />
        <Route path="/create" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <CustomMeteoroid />
            </motion.div>
          </Suspense>
        } />
        <Route path="/orrery" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <OrreryPage />
            </motion.div>
          </Suspense>
        } />
        <Route path="/mini-game" element={
          <Suspense fallback={<LoadingScreen />}>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <AsteroidSmashGame />
            </motion.div>
          </Suspense>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
