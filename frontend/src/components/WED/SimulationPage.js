import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Navigation from './Navigation';
import './SimulationPage.css';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// Custom impact marker
const impactIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgc3Ryb2tlPSIjZmYwMDAwIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9InJnYmEoMjU1LDAsMCwwLjIpIi8+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iNiIgZmlsbD0iI2ZmMDAwMCIvPjwvc3ZnPg==',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

function LocationMarker({ position, onPositionChange, isLocked }) {
  useMapEvents({
    click(e) {
      // Only allow changing location if NOT locked (before launch or after reset)
      if (!isLocked) {
        onPositionChange(e.latlng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={impactIcon}>
      <Popup>
        <div className="impact-popup">
          <strong>Impact Location</strong>
          <p>Lat: {position.lat.toFixed(4)}°</p>
          <p>Lng: {position.lng.toFixed(4)}°</p>
        </div>
      </Popup>
    </Marker>
  );
}

function SimulationPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [asteroidData, setAsteroidData] = useState({
    diameter: 1000, // feet
    speed: 38000, // mph
    angle: 45, // degrees
    type: 'Rocky'
  });

  const [impactLocation, setImpactLocation] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [impactAnimating, setImpactAnimating] = useState(false);
  const [asteroidList, setAsteroidList] = useState([]);
  const [currentAsteroidIndex, setCurrentAsteroidIndex] = useState(0);
  const mapRef = useRef(null);

  const asteroidTypes = ['Rocky', 'Comet', 'Iron'];
  const densityMap = {
    'Rocky': 3000,
    'Comet': 1000,
    'Iron': 8000
  };

  // Page load animation
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Fetch NASA asteroids
  useEffect(() => {
    fetchAsteroids();
  }, []);

  const fetchAsteroids = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/asteroids`);
      if (response.data && response.data.asteroids && response.data.asteroids.length > 0) {
        setAsteroidList(response.data.asteroids);
      }
    } catch (error) {
      console.error('Error fetching asteroids:', error);
    }
  };

  const calculateImpactEffects = () => {
    const ft_to_m = 0.3048;
    const mph_to_ms = 0.44704;
    const megaton_J = 4.184e15;

    const d_m = asteroidData.diameter * ft_to_m;
    const r_m = d_m / 2;
    const v_ms = asteroidData.speed * mph_to_ms;
    const density = densityMap[asteroidData.type];

    // Mass calculation
    const volume = (4/3) * Math.PI * Math.pow(r_m, 3);
    const mass = density * volume;

    // Kinetic energy
    const E = 0.5 * mass * Math.pow(v_ms, 2);
    const E_megatons = E / megaton_J;

    // Crater diameter scaling
    const k = 1.8;
    const crater_m = k * Math.pow(d_m, 0.78) * Math.pow(v_ms, 0.44);
    const depth_m = crater_m * 0.3;

    // Additional effects
    const fireball_km = Math.pow(E_megatons, 0.4) * 0.5;
    const shockwave_km = Math.pow(E_megatons, 0.33) * 2;
    const seismic_magnitude = Math.log10(E) - 4.8;
    
    // Casualties calculation
    const vaporized = Math.floor(Math.PI * Math.pow(fireball_km * 1000, 2) * 0.1);
    const severe_injuries = Math.floor(Math.PI * Math.pow(shockwave_km * 1000, 2) * 0.05);
    const total_casualties = vaporized + severe_injuries;
    
    // Hazard assessment
    const thermal_radius_km = fireball_km * 1.5;
    const overpressure_radius_km = shockwave_km * 1.2;
    
    // Size comparison
    const asteroid_diameter_m = asteroidData.diameter * ft_to_m;

    return {
      mass_kg: mass,
      energy_megatons: E_megatons.toFixed(1),
      crater_miles: (crater_m / 1609.344).toFixed(2),
      crater_meters: crater_m.toFixed(0),
      crater_depth_meters: depth_m.toFixed(0),
      fireball_km: fireball_km.toFixed(2),
      shockwave_km: shockwave_km.toFixed(2),
      seismic_magnitude: seismic_magnitude.toFixed(1),
      vaporized: vaporized.toLocaleString(),
      severe_injuries: severe_injuries.toLocaleString(),
      total_casualties: total_casualties.toLocaleString(),
      thermal_radius_km: thermal_radius_km.toFixed(2),
      overpressure_radius_km: overpressure_radius_km.toFixed(2),
      asteroid_size_m: asteroid_diameter_m.toFixed(1),
      asteroid_size_ft: asteroidData.diameter.toLocaleString()
    };
  };

  const handleLaunch = async () => {
    if (!impactLocation || isLocked) return;

    setLoading(true);
    setIsLocked(true); // Lock the location immediately
    
    // Zoom to impact location for dramatic effect
    if (mapRef.current) {
      mapRef.current.flyTo(impactLocation, 8, {
        duration: 1.5,
        easeLinearity: 0.5
      });
    }
    
    // Start impact animation sequence
    setTimeout(() => {
      setImpactAnimating(true);
    }, 1500);

    try {
      // Convert units for backend API
      const ft_to_km = 0.0003048; // feet to km
      const mph_to_kmps = 0.00044704; // mph to km/s
      
      // Call backend API with accurate geocoding casualty calculator
      console.log('API URL:', API_URL);
      console.log('Calling API with data:', {
        diameter_km: asteroidData.diameter * ft_to_km,
        velocity_kmps: asteroidData.speed * mph_to_kmps,
        impact_lat: impactLocation.lat,
        impact_lon: impactLocation.lng,
        impact_angle: asteroidData.angle,
        density: densityMap[asteroidData.type]
      });
      
      const response = await axios.post(`${API_URL}/api/simulate-impact/`, {
        diameter_km: asteroidData.diameter * ft_to_km,
        velocity_kmps: asteroidData.speed * mph_to_kmps,
        impact_lat: impactLocation.lat,
        impact_lon: impactLocation.lng,
        impact_angle: asteroidData.angle,
        density: densityMap[asteroidData.type]
      });
      
      console.log('Backend response:', response.data);

      const backendResults = response.data;
      
      console.log('Backend response structure check:', {
        hasAsteroid: !!backendResults.asteroid,
        hasEnergy: !!backendResults.energy,
        hasCrater: !!backendResults.crater,
        hasBlastZones: !!backendResults.blast_zones,
        hasSeismicEffects: !!backendResults.seismic_effects,
        hasCasualties: !!backendResults.casualties
      });
      
      // Log detailed field values
      console.log('=== DETAILED FIELD CHECK ===');
      console.log('asteroid.mass_kg:', backendResults.asteroid?.mass_kg);
      console.log('energy.energy_megatons_tnt:', backendResults.energy?.energy_megatons_tnt);
      console.log('crater.crater_diameter_m:', backendResults.crater?.crater_diameter_m);
      console.log('crater.crater_depth_m:', backendResults.crater?.crater_depth_m);
      console.log('blast_zones.fireball_radius_km:', backendResults.blast_zones?.fireball_radius_km);
      console.log('blast_zones.total_destruction_radius_km:', backendResults.blast_zones?.total_destruction_radius_km);
      console.log('seismic_effects.richter_magnitude:', backendResults.seismic_effects?.richter_magnitude);
      console.log('casualties.estimated_deaths:', backendResults.casualties?.estimated_deaths);
      console.log('casualties.estimated_injuries:', backendResults.casualties?.estimated_injuries);
      console.log('=== END FIELD CHECK ===');
      
      // Validate response structure
      if (!backendResults.asteroid || !backendResults.energy || !backendResults.crater || 
          !backendResults.blast_zones || !backendResults.seismic_effects || !backendResults.casualties) {
        console.error('Missing fields! Response:', backendResults);
        throw new Error('Incomplete response from backend. Missing required fields.');
      }
      
      // Format results for UI - match backend response structure
      const effects = {
        mass_kg: backendResults.asteroid.mass_kg,
        energy_megatons: backendResults.energy.energy_megatons_tnt.toFixed(1),
        crater_miles: (backendResults.crater.crater_diameter_m / 1609.344).toFixed(2),
        crater_meters: backendResults.crater.crater_diameter_m.toFixed(0),
        crater_depth_meters: backendResults.crater.crater_depth_m.toFixed(0),
        fireball_km: backendResults.blast_zones.fireball_radius_km.toFixed(2),
        shockwave_km: backendResults.blast_zones.total_destruction_radius_km.toFixed(2),
        seismic_magnitude: backendResults.seismic_effects.richter_magnitude.toFixed(1),
        
        // Accurate casualty data from geocoding API
        location_name: backendResults.casualties.location_name,
        location_type: backendResults.casualties.location_type,
        vaporized: backendResults.casualties.estimated_deaths?.toLocaleString() || '0',
        severe_injuries: backendResults.casualties.estimated_injuries?.toLocaleString() || '0',
        total_casualties: ((backendResults.casualties.estimated_deaths || 0) + (backendResults.casualties.estimated_injuries || 0)).toLocaleString(),
        
        thermal_radius_km: (backendResults.blast_zones.fireball_radius_km * 1.5).toFixed(2),
        overpressure_radius_km: (backendResults.blast_zones.total_destruction_radius_km * 1.2).toFixed(2),
        asteroid_size_m: (asteroidData.diameter * 0.3048).toFixed(1),
        asteroid_size_ft: asteroidData.diameter.toLocaleString()
      };

      // Show results after animation
      setTimeout(() => {
        setResults(effects);
        setShowResults(true);
        setLoading(false);
        setImpactAnimating(false);
      }, 1500);
    } catch (error) {
      console.error('Error simulating impact:', error);
      console.error('Error details:', error.response?.data || error.message);
      console.error('Error status:', error.response?.status);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      alert(`Error calculating impact: ${errorMsg}\n\nPlease ensure:\n1. Backend server is running at ${API_URL}\n2. CORS is enabled\n3. Check browser console for details`);
      setLoading(false);
      setIsLocked(false);
      setImpactAnimating(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setResults(null);
    setImpactLocation(null);
    setIsLocked(false); // Unlock for new simulation
    setImpactAnimating(false);
    
    // Reset map view
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2.5, {
        duration: 1.0
      });
    }
  };

  const cycleAsteroid = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentAsteroidIndex + 1) % asteroidTypes.length
      : (currentAsteroidIndex - 1 + asteroidTypes.length) % asteroidTypes.length;
    
    setCurrentAsteroidIndex(newIndex);
    setAsteroidData(prev => ({ ...prev, type: asteroidTypes[newIndex] }));
  };

  return (
    <div className={`simulation-page ${isLoaded ? 'loaded' : ''}`}>
      {/* Premium Professional Navigation - Always Visible */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999 }}>
        <Navigation darkMode={true} />
      </div>

      {/* Left side - Map */}
      <div className={`map-section ${isLoaded ? 'map-loaded' : ''}`}>
        <MapContainer
          center={[20, 0]}
          zoom={2.5}
          minZoom={2.5}
          maxZoom={18}
          className="impact-map"
          ref={mapRef}
          zoomControl={true}
          worldCopyJump={false}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
          continuousWorld={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            noWrap={true}
            bounds={[[-90, -180], [90, 180]]}
          />
          <LocationMarker 
            position={impactLocation} 
            onPositionChange={setImpactLocation}
            isLocked={isLocked}
          />
          
          {/* Impact zones with animation */}
          {results && impactLocation && (
            <>
              {/* Crater - Brown center */}
              <Circle 
                center={impactLocation} 
                radius={parseFloat(results.crater_meters)}
                pathOptions={{ 
                  color: '#5c3317',
                  fillColor: '#8b4513',
                  fillOpacity: 0.7,
                  weight: 3,
                  dashArray: '5, 5'
                }}
              />
              {/* Fireball Zone - Red */}
              <Circle 
                center={impactLocation} 
                radius={parseFloat(results.fireball_km) * 1000}
                pathOptions={{ 
                  color: '#ff0000',
                  fillColor: '#ff0000',
                  fillOpacity: 0.3,
                  weight: 2
                }}
              />
              {/* Shockwave Zone - Orange */}
              <Circle 
                center={impactLocation} 
                radius={parseFloat(results.shockwave_km) * 1000}
                pathOptions={{ 
                  color: '#ff8c00',
                  fillColor: '#ff8c00',
                  fillOpacity: 0.2,
                  weight: 2
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* Right side - Control Panel */}
      <div className={`control-panel ${isLoaded ? 'panel-loaded' : ''}`}>
        {!showResults ? (
          <div className="editor-view">
            <h1 className="panel-title">ASTEROID LAUNCHER</h1>
            
            {/* Asteroid Selector */}
            <div className="asteroid-selector">
              <button className="selector-arrow" onClick={() => cycleAsteroid('prev')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              <div className="asteroid-preview">
                <div className={`asteroid-image ${asteroidData.type.toLowerCase()}`}>
                  <div className="asteroid-glow"></div>
                </div>
                <span className="asteroid-label">{asteroidData.type}</span>
              </div>
              
              <button className="selector-arrow" onClick={() => cycleAsteroid('next')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Sliders */}
            <div className="slider-section">
              <div className="slider-row">
                <div className="slider-label">
                  <svg className="label-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="10" cy="10" r="3" fill="currentColor"/>
                  </svg>
                  <span>DIAMETER</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={asteroidData.diameter}
                  onChange={(e) => setAsteroidData({...asteroidData, diameter: parseInt(e.target.value)})}
                  className="slider"
                />
                <span className="slider-value">{asteroidData.diameter.toLocaleString()} ft</span>
              </div>

              <div className="slider-row">
                <div className="slider-label">
                  <svg className="label-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M11 2L4 12h6l-1 6 7-10h-6l1-6z" fill="currentColor"/>
                  </svg>
                  <span>SPEED</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="1000"
                  value={asteroidData.speed}
                  onChange={(e) => setAsteroidData({...asteroidData, speed: parseInt(e.target.value)})}
                  className="slider"
                />
                <span className="slider-value">{asteroidData.speed.toLocaleString()} mph</span>
              </div>

              <div className="slider-row">
                <div className="slider-label">
                  <svg className="label-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M14 6L6 14M14 6H8M14 6V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>IMPACT ANGLE</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="5"
                  value={asteroidData.angle}
                  onChange={(e) => setAsteroidData({...asteroidData, angle: parseInt(e.target.value)})}
                  className="slider"
                />
                <span className="slider-value">{asteroidData.angle}°</span>
              </div>
            </div>

            {/* Launch Button */}
            <button
              className={`launch-button ${!impactLocation || loading || isLocked ? 'disabled' : ''}`}
              onClick={handleLaunch}
              disabled={!impactLocation || loading || isLocked}
            >
              {loading ? 'CALCULATING IMPACT...' : 'LAUNCH ASTEROID'}
            </button>

            {!impactLocation && (
              <p className="hint-text">Click on the map to select an impact location</p>
            )}
          </div>
        ) : (
          <div className="results-view">
            <div className="results-header">
              <h2 className="crater-headline">
                {results.crater_miles}<br/>
                <span className="headline-unit">MILE WIDE CRATER</span>
              </h2>
              <p className="impact-summary">Complete impact analysis and affected zones</p>
              {results.location_name && (
                <div className="impact-location-badge">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{marginRight: '8px'}}>
                    <path d="M8 2C5.79 2 4 3.79 4 6c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4zm0 5.5c-.83 0-1.5-.67-1.5-1.5S7.17 4.5 8 4.5 9.5 5.17 9.5 6 8.83 7.5 8 7.5z" fill="currentColor"/>
                  </svg>
                  Impact Location: {results.location_name}
                </div>
              )}
            </div>

            <div className="results-list">
              {/* SECTION 1: IMPACT ZONES WITH ICONS */}
              <div className="results-section-title">PHYSICAL CHARACTERISTICS</div>
              
              {/* Asteroid Size */}
              <div className="result-item">
                <svg className="result-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="#9b59b6" strokeWidth="2" fill="none"/>
                  <circle cx="10" cy="10" r="4" fill="#9b59b6"/>
                </svg>
                <div className="result-text">
                  <div className="result-label">Asteroid Size</div>
                  <div className="result-value">
                    <span className="result-primary">{results.asteroid_size_ft} ft</span>
                    <span className="result-secondary">({results.asteroid_size_m} m diameter)</span>
                  </div>
                </div>
              </div>

              {/* Crater Details */}
              <div className="result-item">
                <svg className="result-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <ellipse cx="10" cy="10" rx="7" ry="3" fill="#8b4513" opacity="0.3"/>
                  <path d="M3 10Q10 16 17 10" stroke="#8b4513" strokeWidth="2" fill="none"/>
                  <line x1="10" y1="10" x2="10" y2="14" stroke="#8b4513" strokeWidth="2" strokeDasharray="2 1"/>
                </svg>
                <div className="result-text">
                  <div className="result-label">Crater Depth</div>
                  <div className="result-value">
                    <span className="result-primary">{results.crater_depth_meters} m</span>
                    <span className="result-secondary">({(results.crater_depth_meters * 3.28084).toFixed(0)} ft deep)</span>
                  </div>
                </div>
              </div>

              {/* Impact Energy */}
              <div className="result-item">
                <svg className="result-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" fill="#e74c3c"/>
                </svg>
                <div className="result-text">
                  <div className="result-label">Impact Energy</div>
                  <div className="result-value">
                    <span className="result-primary">{results.energy_megatons} MT</span>
                    <span className="result-secondary">(TNT equivalent)</span>
                  </div>
                </div>
              </div>

              <div className="results-section-title">AFFECTED ZONES</div>
              
              {/* Fireball Zone (Red) */}
              <div className="result-item">
                <svg className="result-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" fill="#ff0000" opacity="0.2"/>
                  <circle cx="10" cy="10" r="8" stroke="#ff0000" strokeWidth="2"/>
                </svg>
                <div className="result-text">
                  <div className="result-label">Fireball Zone <span className="zone-color">(Red)</span></div>
                  <div className="result-value">
                    <span className="result-primary">{results.fireball_km} km</span>
                    <span className="result-secondary">radius · Total vaporization</span>
                  </div>
                </div>
              </div>

              {/* Thermal Radiation Hazard */}
              <div className="result-item">
                <svg className="result-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C10 2 7 5 7 8C7 10 8.5 11.5 10 11.5C11.5 11.5 13 10 13 8C13 5 10 2 10 2Z" fill="#ff6b35"/>
                  <path d="M10 11.5C10 11.5 8 13.5 8 15C8 16.5 9 17.5 10 17.5C11 17.5 12 16.5 12 15C12 13.5 10 11.5 10 11.5Z" fill="#ff6b35"/>
                </svg>
                <div className="result-text">
                  <div className="result-label">Thermal Radiation</div>
                  <div className="result-value">
                    <span className="result-primary">{results.thermal_radius_km} km</span>
                    <span className="result-secondary">radius · 3rd degree burns</span>
                  </div>
                </div>
              </div>

              {/* Shockwave Zone (Orange) */}
              <div className="result-item">
                <svg className="result-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" fill="#ff8c00" opacity="0.2"/>
                  <circle cx="10" cy="10" r="8" stroke="#ff8c00" strokeWidth="2"/>
                  <circle cx="10" cy="10" r="4" stroke="#ff8c00" strokeWidth="1.5"/>
                </svg>
                <div className="result-text">
                  <div className="result-label">Shockwave Zone <span className="zone-color">(Orange)</span></div>
                  <div className="result-value">
                    <span className="result-primary">{results.shockwave_km} km</span>
                    <span className="result-secondary">radius · Building collapse</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: STATISTICS (NO ICONS) */}
              <div className="results-section-title">IMPACT STATISTICS</div>
              
              {/* Seismic Activity - No icon */}
              <div className="result-item-text">
                <div className="result-text">
                  <div className="result-label">Seismic Magnitude</div>
                  <div className="result-value">
                    <span className="result-primary">{results.seismic_magnitude}</span>
                    <span className="result-secondary">Richter scale</span>
                  </div>
                </div>
              </div>

              {/* Casualties - Text only */}
              <div className="result-item-text">
                <div className="result-text">
                  <div className="result-label">Instant Casualties</div>
                  <div className="result-value">
                    <span className="result-primary">{results.vaporized}</span>
                    <span className="result-secondary">vaporized instantly</span>
                  </div>
                </div>
              </div>

              <div className="result-item-text">
                <div className="result-text">
                  <div className="result-label">Severe Injuries</div>
                  <div className="result-value">
                    <span className="result-primary">{results.severe_injuries}</span>
                    <span className="result-secondary">critically injured</span>
                  </div>
                </div>
              </div>

              <div className="result-item-text">
                <div className="result-text">
                  <div className="result-label">Total Casualties</div>
                  <div className="result-value">
                    <span className="result-primary">{results.total_casualties}</span>
                    <span className="result-secondary">people affected</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="reset-button" onClick={handleReset}>
              LAUNCH ANOTHER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimulationPage;
