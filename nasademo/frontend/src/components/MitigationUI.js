/**
 * Person 5: Mitigation Simulator
 * UI sliders for deflection methods (kinetic impactor, gravity tractor, nuclear)
 * Update asteroid path dynamically
 */
import React, { useState, useEffect } from 'react';
import './MitigationUI.css';

export default function MitigationUI({ asteroidData, onDeflectionChange }) {
  const [selectedMethod, setSelectedMethod] = useState('kinetic_impactor');
  const [isActive, setIsActive] = useState(false);
  
  // Kinetic Impactor parameters
  const [impactorMass, setImpactorMass] = useState(500);
  const [impactorVelocity, setImpactorVelocity] = useState(10);
  
  // Gravity Tractor parameters
  const [tractorDuration, setTractorDuration] = useState(365);
  const [spacecraftMass, setSpacecraftMass] = useState(1000);
  
  // Nuclear parameters
  const [nuclearYield, setNuclearYield] = useState(1);
  
  const [deflectionResult, setDeflectionResult] = useState(null);
  
  // Calculate deflection when parameters change
  useEffect(() => {
    if (isActive && asteroidData) {
      calculateDeflection();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMethod, impactorMass, impactorVelocity, tractorDuration, spacecraftMass, nuclearYield, isActive]);
  
  const calculateDeflection = () => {
    const asteroidMass = asteroidData.mass || 1e12; // Default mass
    const originalVelocity = asteroidData.velocity || 20;
    
    let result = {};
    
    switch (selectedMethod) {
      case 'kinetic_impactor':
        const deltaVKinetic = (impactorMass * impactorVelocity * 1000) / asteroidMass / 1000;
        result = {
          method: 'Kinetic Impactor',
          deltaV: deltaVKinetic,
          effectiveness: Math.min((Math.abs(deltaVKinetic) / originalVelocity) * 100, 100),
          description: 'High-speed spacecraft collision',
          newVelocity: originalVelocity + deltaVKinetic
        };
        break;
        
      case 'gravity_tractor':
        const deltaVTractor = 0.0001 * tractorDuration / 1000;
        result = {
          method: 'Gravity Tractor',
          deltaV: deltaVTractor,
          effectiveness: Math.min((Math.abs(deltaVTractor) / originalVelocity) * 100, 100),
          description: 'Slow continuous gravitational pull',
          newVelocity: originalVelocity + deltaVTractor
        };
        break;
        
      case 'nuclear':
        const deltaVNuclear = 0.001 * Math.sqrt(nuclearYield);
        result = {
          method: 'Nuclear Deflection',
          deltaV: deltaVNuclear,
          effectiveness: Math.min((Math.abs(deltaVNuclear) / originalVelocity) * 100, 100),
          description: 'Nuclear detonation near surface',
          newVelocity: originalVelocity + deltaVNuclear
        };
        break;
        
      default:
        break;
    }
    
    setDeflectionResult(result);
    
    if (onDeflectionChange) {
      onDeflectionChange({
        active: isActive,
        deltaV: result.deltaV,
        method: selectedMethod,
        result: result
      });
    }
  };
  
  const toggleActivation = () => {
    const newState = !isActive;
    setIsActive(newState);
    
    if (!newState) {
      setDeflectionResult(null);
      if (onDeflectionChange) {
        onDeflectionChange({ active: false, deltaV: 0 });
      }
    }
  };
  
  const getEffectivenessColor = (effectiveness) => {
    if (effectiveness > 5) return '#44ff44';
    if (effectiveness > 1) return '#ffaa00';
    return '#ff4444';
  };
  
  return (
    <div className="mitigation-container">
      <div className="mitigation-header">
        <h2>🛰️ Asteroid Deflection Simulator</h2>
        <p>Explore mitigation strategies to alter asteroid trajectory</p>
      </div>
      
      <div className="activation-control">
        <button 
          className={`activation-btn ${isActive ? 'active' : ''}`}
          onClick={toggleActivation}
        >
          {isActive ? '🟢 Deflection Active' : '⚪ Activate Deflection'}
        </button>
      </div>
      
      <div className="method-selector">
        <h3>Deflection Method</h3>
        <div className="method-buttons">
          <button
            className={`method-btn ${selectedMethod === 'kinetic_impactor' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('kinetic_impactor')}
          >
            <span className="method-icon">💥</span>
            <span>Kinetic Impactor</span>
          </button>
          <button
            className={`method-btn ${selectedMethod === 'gravity_tractor' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('gravity_tractor')}
          >
            <span className="method-icon">🛸</span>
            <span>Gravity Tractor</span>
          </button>
          <button
            className={`method-btn ${selectedMethod === 'nuclear' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('nuclear')}
          >
            <span className="method-icon">☢️</span>
            <span>Nuclear Deflection</span>
          </button>
        </div>
      </div>
      
      <div className="parameters-panel">
        <h3>Parameters</h3>
        
        {selectedMethod === 'kinetic_impactor' && (
          <div className="parameters">
            <div className="parameter">
              <label>
                Impactor Mass: {impactorMass} kg
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={impactorMass}
                onChange={(e) => setImpactorMass(Number(e.target.value))}
                disabled={!isActive}
              />
              <span className="param-range">100 - 2000 kg</span>
            </div>
            
            <div className="parameter">
              <label>
                Impactor Velocity: {impactorVelocity} km/s
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={impactorVelocity}
                onChange={(e) => setImpactorVelocity(Number(e.target.value))}
                disabled={!isActive}
              />
              <span className="param-range">5 - 30 km/s</span>
            </div>
            
            <div className="method-description">
              <p>
                <strong>How it works:</strong> A spacecraft impacts the asteroid at high speed,
                transferring momentum and changing its trajectory. This is the most proven method
                and was successfully tested by NASA's DART mission in 2022.
              </p>
            </div>
          </div>
        )}
        
        {selectedMethod === 'gravity_tractor' && (
          <div className="parameters">
            <div className="parameter">
              <label>
                Mission Duration: {tractorDuration} days
              </label>
              <input
                type="range"
                min="30"
                max="1825"
                step="30"
                value={tractorDuration}
                onChange={(e) => setTractorDuration(Number(e.target.value))}
                disabled={!isActive}
              />
              <span className="param-range">30 days - 5 years</span>
            </div>
            
            <div className="parameter">
              <label>
                Spacecraft Mass: {spacecraftMass} kg
              </label>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={spacecraftMass}
                onChange={(e) => setSpacecraftMass(Number(e.target.value))}
                disabled={!isActive}
              />
              <span className="param-range">500 - 5000 kg</span>
            </div>
            
            <div className="method-description">
              <p>
                <strong>How it works:</strong> A spacecraft flies alongside the asteroid,
                using its own gravity to slowly pull the asteroid off course over time.
                Requires long lead time but is very precise and predictable.
              </p>
            </div>
          </div>
        )}
        
        {selectedMethod === 'nuclear' && (
          <div className="parameters">
            <div className="parameter">
              <label>
                Nuclear Yield: {nuclearYield} megatons
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={nuclearYield}
                onChange={(e) => setNuclearYield(Number(e.target.value))}
                disabled={!isActive}
              />
              <span className="param-range">0.1 - 10 MT</span>
            </div>
            
            <div className="method-description">
              <p>
                <strong>How it works:</strong> A nuclear device is detonated near or on the
                asteroid surface, vaporizing material and creating thrust. This is a last-resort
                option for large asteroids detected late, but carries political and technical risks.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {isActive && deflectionResult && (
        <div className="results-panel">
          <h3>Deflection Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Method</span>
              <span className="result-value">{deflectionResult.method}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Velocity Change (ΔV)</span>
              <span className="result-value">{deflectionResult.deltaV.toFixed(6)} km/s</span>
            </div>
            <div className="result-item">
              <span className="result-label">Effectiveness</span>
              <span 
                className="result-value effectiveness" 
                style={{ color: getEffectivenessColor(deflectionResult.effectiveness) }}
              >
                {deflectionResult.effectiveness.toFixed(3)}%
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">New Velocity</span>
              <span className="result-value">{deflectionResult.newVelocity.toFixed(3)} km/s</span>
            </div>
          </div>
          
          <div className="effectiveness-bar">
            <div className="bar-label">Trajectory Modification</div>
            <div className="bar-container">
              <div 
                className="bar-fill" 
                style={{ 
                  width: `${Math.min(deflectionResult.effectiveness * 10, 100)}%`,
                  backgroundColor: getEffectivenessColor(deflectionResult.effectiveness)
                }}
              ></div>
            </div>
          </div>
          
          <div className="mission-assessment">
            <h4>Mission Assessment</h4>
            <p>
              {deflectionResult.effectiveness > 5 
                ? "✅ Highly effective deflection! Asteroid trajectory significantly altered."
                : deflectionResult.effectiveness > 1
                ? "⚠️ Moderate effectiveness. Multiple missions may be required."
                : "❌ Low effectiveness. Consider alternative methods or combined approach."}
            </p>
          </div>
        </div>
      )}
      
      <div className="info-box">
        <h4>💡 Did You Know?</h4>
        <p>
          NASA's DART mission successfully demonstrated kinetic impact deflection in 2022
          by changing the orbit of asteroid Dimorphos. Early detection is key - the earlier
          we detect a threat, the smaller the deflection needed!
        </p>
      </div>
    </div>
  );
}
