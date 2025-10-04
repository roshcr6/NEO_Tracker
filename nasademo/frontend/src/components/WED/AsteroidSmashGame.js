import React, { useEffect, useRef } from 'react';
import Navigation from './Navigation';
import './AsteroidSmashGame.css';

function AsteroidSmashGame() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="asteroid-game-page">
      {/* Navigation Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999999 }}>
        <Navigation darkMode={true} />
      </div>

      {/* Game Container */}
      <div className="game-container">
        <iframe
          ref={iframeRef}
          src="/AsteroidSmash/index.html"
          className="game-iframe"
          title="AsteroidSmash Game"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default AsteroidSmashGame;
