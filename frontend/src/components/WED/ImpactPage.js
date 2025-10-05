import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import metroidImage from './metroid.jpg.png';
import sunTexture from './8k_sun.jpg';
import './ImpactPage.css';

function ImpactPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1000);
  }, []);

  return (
    <div className="impact-page">
      {/* Premium Navigation Bar - Universal */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999999 }}>
        <Navigation darkMode={true} />
      </div>

      {/* Side Elements - Sun left, Earth right */}
      <div className="side-elements">
        {/* Sun on Left */}
        <div className="element-left sun-element">
          <div className="sun-container-impact">
            <div className="sun-glow-impact"></div>
            <div className="sun-spline-wrapper-impact">
              <spline-viewer 
                url="https://prod.spline.design/1GaosfP3pIaT5dn0/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="sun-spline-overlay-impact"></div>
            </div>
          </div>
        </div>

        {/* Earth Spline on Right */}
        <div className="element-right earth-spline-impact">
          <div className="spline-container-impact">
            <div className="spline-wrapper-impact">
              <spline-viewer 
                url="https://prod.spline.design/WcinsGqPO0WD4ts1/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="spline-overlay-impact"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`impact-content ${isLoaded ? 'fade-in' : ''}`}>
        <div className="impact-hero">
          {/* Main Title */}
          <h1 className="impact-main-title">
            IMPACT OF
            <br />
            METROIDS
          </h1>

          {/* Divider */}
          <div className="impact-title-divider"></div>

          {/* Description */}
          <p className="impact-main-description">
            Explore the devastating effects of meteoroid impacts on Earth.
            <br />
            Analyze real NASA asteroid data and predict impact scenarios.
            <br />
            Learn about detection, prediction, and planetary defense strategies.
          </p>

          {/* Action Buttons */}
          <div className="impact-buttons-container">
            <button 
              className="impact-get-started-btn"
              onClick={() => navigate('/simulate')}
            >
              CUSTOM SIMULATOR
            </button>
            
            <button 
              className="impact-secondary-btn"
              onClick={() => navigate('/neo-analysis')}
            >
              NASA NEO ANALYSIS
            </button>
          </div>

          {/* Metroid in Center */}
          <div className="metroid-center-container">
            <img 
              src={metroidImage}
              alt="Metroid"
              className="metroid-center-image"
            />
          </div>
        </div>
      </div>

      {/* Animated Stars Background */}
      <div className="impact-stars">
        {[...Array(200)].map((_, i) => (
          <div 
            key={i} 
            className="impact-star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ImpactPage;
