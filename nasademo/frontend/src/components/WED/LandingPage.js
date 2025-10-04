import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import Navigation from './Navigation';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  return (
    <div className="landing-page">
      {/* Premium Navigation Bar - Universal */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999999 }}>
        <Navigation darkMode={true} transparent={true} />
      </div>

      {/* Main Content */}
      <div className={`landing-content ${isLoaded ? 'fade-in' : ''}`}>
        {/* Left Side - Text Content */}
        <div className="landing-left">
          <h1 className="landing-title">
            NEO
            <br />
            TRACKER
          </h1>
          <p className="landing-description">
            Welcome to the Asteroid Impact Simulator, a captivating web application that allows you to explore the fascinating world of celestial
          </p>
        </div>

        {/* Right Side - Spline 3D Earth */}
        <div className="landing-right">
          {!splineError ? (
            <div className="spline-earth-container">
              <Spline 
                scene="https://prod.spline.design/vTp1uApannrgByyf/scene.splinecode"
                onLoad={() => console.log('✅ Spline Earth loaded!')}
                onError={() => {
                  console.error('❌ Spline Earth failed to load');
                  setSplineError(true);
                }}
              />
            </div>
          ) : (
            /* Fallback to planet image if Spline fails */
            <div className="planet-container">
              <div className="planet-glow"></div>
              <img 
                src="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=800&fit=crop" 
                alt="Moon"
                className="planet-image"
              />
              {/* Floating asteroids */}
              <div className="asteroid asteroid-1">☄️</div>
              <div className="asteroid asteroid-2">💫</div>
              <div className="asteroid asteroid-3">⭐</div>
            </div>
          )}
        </div>
      </div>

      {/* Starfield Background */}
      <div className="landing-stars">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="landing-star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="floating-buttons">
        <button 
          className="explore-btn"
          onClick={() => navigate('/discover')}
        >
          Discover
        </button>
        <button 
          className="simulate-btn"
          onClick={() => navigate('/impact')}
        >
          Impact
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
