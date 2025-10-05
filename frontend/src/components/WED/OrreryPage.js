import React, { useEffect, useRef } from 'react';
import Navigation from './Navigation';
import './OrreryPage.css';

function OrreryPage() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="orrery-page">
      {/* Navigation Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999999 }}>
        <Navigation darkMode={true} />
      </div>

      {/* Orrery Container */}
      <div className="orrery-container">
        <iframe
          ref={iframeRef}
          src="/NASA-Live-Orrery/index.html"
          className="orrery-iframe"
          title="NASA Live Solar System Orrery"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default OrreryPage;
