import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomMeteoroid.css';

function CustomMeteoroid() {
  const navigate = useNavigate();
  const [meteoroid, setMeteoroid] = useState({
    name: '',
    diameter: 100,
    velocity: 20,
    composition: 'rocky',
    angle: 45,
    targetLat: 40.7128,
    targetLng: -74.0060,
    impactEnergy: 0
  });
  
  const [impactResult, setImpactResult] = useState(null);

  const compositions = [
    { value: 'rocky', label: '🪨 Rocky', description: 'Stone-based asteroids', density: 2.5 },
    { value: 'metallic', label: '⚙️ Metallic', description: 'Iron-nickel composition', density: 7.8 },
    { value: 'carbonaceous', label: '⚫ Carbonaceous', description: 'Carbon-rich material', density: 1.5 },
    { value: 'icy', label: '❄️ Icy', description: 'Water ice and frozen gases', density: 0.9 }
  ];

  const handleInputChange = (field, value) => {
    const updatedMeteoroid = { ...meteoroid, [field]: value };
    
    // Calculate impact energy (simplified formula)
    const selectedComp = compositions.find(c => c.value === updatedMeteoroid.composition);
    const density = selectedComp ? selectedComp.density : 2.5;
    const mass = (4/3) * Math.PI * Math.pow(updatedMeteoroid.diameter / 2, 3) * density;
    const energy = 0.5 * mass * Math.pow(updatedMeteoroid.velocity * 1000, 2) / 1e15; // Convert to megatons
    
    updatedMeteoroid.impactEnergy = energy.toFixed(2);
    setMeteoroid(updatedMeteoroid);
  };

  const handleSimulate = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/simulate-impact/', {
        diameter: meteoroid.diameter,
        velocity: meteoroid.velocity,
        angle: meteoroid.angle,
        density: compositions.find(c => c.value === meteoroid.composition).density,
        latitude: meteoroid.targetLat,
        longitude: meteoroid.targetLng
      });
      setImpactResult(response.data);
    } catch (error) {
      console.error('Simulation error:', error);
      alert('Failed to simulate impact. Please try again.');
    }
  };

  const handleSaveAndView = () => {
    navigate('/simulator', { state: { customMeteoroid: meteoroid } });
  };

  return (
    <div className="custom-meteoroid-page">
      {/* Navigation Bar */}
      <nav className="landing-navbar">
        <div className="landing-logo">
          <span className="logo-icon">💧</span>
          <span className="logo-text">METROD RIZZLERS</span>
        </div>
        <div className="landing-nav-links">
          <button onClick={() => navigate('/')} className="landing-nav-link">Home</button>
          <button onClick={() => navigate('/about')} className="landing-nav-link">About</button>
          <button onClick={() => navigate('/create')} className="landing-nav-link active">Features</button>
          <button onClick={() => navigate('/about')} className="landing-nav-link">Partners</button>
          <button onClick={() => navigate('/about')} className="contact-button">Contact</button>
        </div>
      </nav>
      
      {/* Background */}
      <div className="creator-background">
        <div className="orbit-ring ring-1"></div>
        <div className="orbit-ring ring-2"></div>
        <div className="orbit-ring ring-3"></div>
      </div>

      {/* Main Content */}
      <div className="creator-container">
        {/* Header */}
        <div className="creator-header">
          <div className="header-badge">
            <span>✨</span>
            <span>Custom Meteoroid Creator</span>
          </div>
          <h1 className="creator-title">
            Design Your <span className="gradient-text">Meteoroid</span>
          </h1>
          <p className="creator-subtitle">
            Customize properties and simulate impact scenarios
          </p>
        </div>

        {/* Creator Grid */}
        <div className="creator-grid">
          {/* Left Panel - Form */}
          <div className="creator-form">
            {/* Name Input */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🏷️</span>
                Meteoroid Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Apophis II"
                value={meteoroid.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            {/* Diameter Slider */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📏</span>
                Diameter: <span className="value-highlight">{meteoroid.diameter}m</span>
              </label>
              <input
                type="range"
                className="form-slider"
                min="10"
                max="1000"
                step="10"
                value={meteoroid.diameter}
                onChange={(e) => handleInputChange('diameter', parseFloat(e.target.value))}
              />
              <div className="slider-labels">
                <span>10m</span>
                <span>500m</span>
                <span>1000m</span>
              </div>
            </div>

            {/* Velocity Slider */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⚡</span>
                Velocity: <span className="value-highlight">{meteoroid.velocity} km/s</span>
              </label>
              <input
                type="range"
                className="form-slider"
                min="5"
                max="70"
                step="1"
                value={meteoroid.velocity}
                onChange={(e) => handleInputChange('velocity', parseFloat(e.target.value))}
              />
              <div className="slider-labels">
                <span>5 km/s</span>
                <span>35 km/s</span>
                <span>70 km/s</span>
              </div>
            </div>

            {/* Composition Selection */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔬</span>
                Composition
              </label>
              <div className="composition-grid">
                {compositions.map((comp) => (
                  <div
                    key={comp.value}
                    className={`composition-card ${meteoroid.composition === comp.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange('composition', comp.value)}
                  >
                    <div className="comp-icon">{comp.label.split(' ')[0]}</div>
                    <div className="comp-name">{comp.label.split(' ')[1]}</div>
                    <div className="comp-desc">{comp.description}</div>
                    <div className="comp-density">ρ = {comp.density} g/cm³</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Angle */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📐</span>
                Impact Angle: <span className="value-highlight">{meteoroid.angle}°</span>
              </label>
              <input
                type="range"
                className="form-slider"
                min="15"
                max="90"
                step="5"
                value={meteoroid.angle}
                onChange={(e) => handleInputChange('angle', parseFloat(e.target.value))}
              />
              <div className="slider-labels">
                <span>15° (Grazing)</span>
                <span>45° (Moderate)</span>
                <span>90° (Vertical)</span>
              </div>
            </div>

            {/* Target Location */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎯</span>
                Target Coordinates
              </label>
              <div className="coord-inputs">
                <div className="coord-input-group">
                  <label>Latitude</label>
                  <input
                    type="number"
                    className="coord-input"
                    placeholder="40.7128"
                    value={meteoroid.targetLat}
                    onChange={(e) => handleInputChange('targetLat', parseFloat(e.target.value))}
                    step="0.0001"
                  />
                </div>
                <div className="coord-input-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    className="coord-input"
                    placeholder="-74.0060"
                    value={meteoroid.targetLng}
                    onChange={(e) => handleInputChange('targetLng', parseFloat(e.target.value))}
                    step="0.0001"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button className="simulate-btn" onClick={handleSimulate}>
                <span>🔥</span>
                Simulate Impact
              </button>
              <button className="save-btn" onClick={handleSaveAndView}>
                <span>💾</span>
                Save & View in 3D
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="creator-preview">
            <div className="preview-card">
              <h3 className="preview-title">
                <span>📊</span>
                Impact Analysis
              </h3>
              
              {/* Energy Display */}
              <div className="energy-display">
                <div className="energy-value">{meteoroid.impactEnergy}</div>
                <div className="energy-unit">Megatons TNT</div>
                <div className="energy-comparison">
                  {meteoroid.impactEnergy > 1000 
                    ? "🌋 Extinction-level event"
                    : meteoroid.impactEnergy > 100
                    ? "💥 Regional devastation"
                    : meteoroid.impactEnergy > 10
                    ? "🔥 City-wide destruction"
                    : "⚠️ Local impact"}
                </div>
              </div>

              {/* Properties Grid */}
              <div className="properties-grid">
                <div className="property-item">
                  <div className="property-icon">📏</div>
                  <div className="property-label">Size</div>
                  <div className="property-value">{meteoroid.diameter}m</div>
                </div>
                <div className="property-item">
                  <div className="property-icon">⚡</div>
                  <div className="property-label">Speed</div>
                  <div className="property-value">{meteoroid.velocity} km/s</div>
                </div>
                <div className="property-item">
                  <div className="property-icon">📐</div>
                  <div className="property-label">Angle</div>
                  <div className="property-value">{meteoroid.angle}°</div>
                </div>
                <div className="property-item">
                  <div className="property-icon">🔬</div>
                  <div className="property-label">Type</div>
                  <div className="property-value">{meteoroid.composition}</div>
                </div>
              </div>

              {/* Impact Result */}
              {impactResult && (
                <div className="impact-results">
                  <h4>Simulation Results</h4>
                  <div className="result-item">
                    <span className="result-label">Crater Diameter:</span>
                    <span className="result-value">{impactResult.crater_diameter?.toFixed(1)} km</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Fireball Radius:</span>
                    <span className="result-value">{impactResult.fireball_radius?.toFixed(1)} km</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Affected Area:</span>
                    <span className="result-value">{(impactResult.crater_diameter * 5)?.toFixed(0)} km radius</span>
                  </div>
                </div>
              )}

              {/* Visual Preview */}
              <div className="visual-preview">
                <div 
                  className="meteoroid-visual"
                  style={{
                    width: `${Math.min(meteoroid.diameter / 5, 100)}px`,
                    height: `${Math.min(meteoroid.diameter / 5, 100)}px`,
                  }}
                >
                  ☄️
                </div>
                <div className="impact-waves">
                  <div className="wave wave-1"></div>
                  <div className="wave wave-2"></div>
                  <div className="wave wave-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomMeteoroid;
