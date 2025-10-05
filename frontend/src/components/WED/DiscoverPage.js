import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import metroidImage from './metroid.jpg.png';
import './DiscoverPage.css';

function DiscoverPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay to create smooth transition effect
    setTimeout(() => setIsLoaded(true), 1000);
  }, []);

  // Handle Get Started button click - Navigate to NASA Live Orrery
  const handleGetStarted = () => {
    // Navigate to the Orrery page within the same website
    navigate('/orrery');
  };

  return (
    <div className="discover-page">
      {/* Premium Navigation Bar - Universal */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999999 }}>
        <Navigation darkMode={true} />
      </div>

      {/* Planets on sides */}
      <div className="side-planets">
        <div className="planet-left earth-spline">
          <div className="spline-container">
            <div className="spline-wrapper">
              <spline-viewer 
                url="https://prod.spline.design/WcinsGqPO0WD4ts1/scene.splinecode"
                loading="eager"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            {/* Overlay to block mouse events */}
            <div className="spline-overlay"></div>
          </div>
        </div>
        <div className="planet-right meteor">
          <img 
            src={metroidImage}
            alt="Metroid"
            className="meteor-image"
          />
          <div className="meteor-trail"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`discover-content ${isLoaded ? 'slide-in-right' : ''}`}>
        <div className="discover-hero">
          {/* Small heading - Removed */}

          {/* Main Title */}
          <h1 className="discover-main-title">
            DISCOVER
            <br />
            SOLAR SYSTEM
          </h1>

          {/* Divider */}
          <div className="title-divider"></div>

          {/* Description */}
          <p className="discover-main-description">
            Explore the fascinating visuals of our solar system through interactive 3D models.
            <br />
            Witness the beauty of planets, asteroids, and celestial bodies in stunning detail.
            <br />
            Journey through space and discover the wonders of our cosmic neighborhood.
          </p>

          {/* Get Started Button */}
          <button 
            className="get-started-btn"
            onClick={handleGetStarted}
          >
            GET STARTED
          </button>

          {/* Sun - Spline 3D Model */}
          <div className="earth-container">
            <div className="earth-glow"></div>
            <div className="sun-spline-wrapper">
              <spline-viewer 
                url="https://prod.spline.design/1GaosfP3pIaT5dn0/scene.splinecode"
                loading="eager"
                style={{ width: '100%', height: '100%' }}
              />
              {/* Overlay to block mouse interaction */}
              <div className="sun-spline-overlay"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Stars Background */}
      <div className="discover-stars">
        {[...Array(200)].map((_, i) => (
          <div 
            key={i} 
            className="discover-star"
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

export default DiscoverPage;
