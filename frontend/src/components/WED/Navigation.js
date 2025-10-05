/**
 * Universal Premium Navigation Bar
 * Inspired by: Porsche, Lay's, KitKat, Apple, Tesla
 * Features: Glassmorphism, Smooth Transitions, Micro-interactions, Magnetic Hover
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Navigation.css';

function Navigation({ transparent = false, darkMode = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.9, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [10, 20]);

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsLoaded(true), 100);

    // Advanced scroll detection
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { 
      path: '/', 
      label: 'Home',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    },
    { 
      path: '/discover', 
      label: 'Discover',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"></polygon>
      </svg>
    },
    { 
      path: '/impact', 
      label: 'Simulator',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
        <circle cx="12" cy="12" r="5"></circle>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    },
    { 
      path: '/about', 
      label: 'About',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    }
  ];

  // Mini Game button (right side)
  const launchButton = {
    path: '/mini-game',
    label: 'Mini Game',
    icon: <svg width="26" height="14" viewBox="0 0 36 18" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="9" r="2" fill="#ffffff"></circle>
      <circle cx="18" cy="9" r="7"></circle>
      <path d="M18 1v1.2M18 15.8v1.2M7 3.5l0.8 0.8M29 13.7l0.8 0.8M2 9h1.5M32.5 9h1.5M7 14.5l0.8-0.8M29 4.3l0.8-0.8"></path>
    </svg>
  };

  const isActive = (path) => location.pathname === path;

  const getNavClass = () => {
    let classes = 'premium-navigation';
    if (isLoaded) classes += ' nav-loaded';
    if (scrolled) classes += ' nav-scrolled';
    if (transparent) classes += ' nav-transparent';
    if (darkMode) classes += ' nav-dark';
    if (!isVisible) classes += ' nav-hidden';
    return classes;
  };

  const navItemVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.05, 
      y: -2,
      transition: { 
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.nav 
      className={getNavClass()}
      style={{
        opacity: navOpacity,
        backdropFilter: `blur(${navBlur}px)`,
        WebkitBackdropFilter: `blur(${navBlur}px)`
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Background Blur Layer */}
      <div className="nav-backdrop"></div>

      {/* Navigation Content */}
      <div className="nav-container">
        
        {/* Logo Section - Left */}
        <motion.div 
          className="nav-logo"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="logo-icon-wrapper">
            <svg className="logo-icon" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="16" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.3"/>
              <circle cx="18" cy="18" r="12" stroke="url(#logoGradient)" strokeWidth="2.5"/>
              <circle cx="18" cy="18" r="7" fill="url(#logoGradient)"/>
              <circle cx="18" cy="18" r="3" fill="#ffffff"/>
              {/* Orbiting particles */}
              <circle cx="30" cy="18" r="2" fill="#00d4ff" opacity="0.6">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="6" cy="18" r="1.5" fill="#0066ff" opacity="0.4">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="180 18 18"
                  to="540 18 18"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">NEO</span>
            <span className="logo-subtitle">TRACKER</span>
          </div>
        </motion.div>

        {/* Navigation Links - Center */}
        <div className="nav-links">
          {navItems.map((item, index) => (
            <motion.button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              variants={navItemVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              
              {/* Active Indicator */}
              {isActive(item.path) && (
                <motion.div 
                  className="nav-active-indicator"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="indicator-dot"></div>
                  <div className="indicator-line"></div>
                </motion.div>
              )}
              
              {/* Hover Effect */}
              {hoveredItem === item.path && !isActive(item.path) && (
                <motion.div 
                  className="nav-hover-indicator"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="nav-actions" style={{ transitionDelay: '0.6s' }}>
          {/* Status Badge */}
          <motion.div 
            className="status-badge"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="status-pulse"></div>
            <span className="status-text">Live</span>
          </motion.div>

          {/* Mini Game Button */}
          <motion.button 
            className="nav-cta nav-launch-btn"
            onClick={() => navigate(launchButton.path)}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0, 212, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="nav-icon">{launchButton.icon}</span>
            <span>{launchButton.label}</span>
          </motion.button>
        </div>
      </div>

      {/* Ambient Glow Effect */}
      <motion.div 
        className="nav-ambient-glow"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.nav>
  );
}

export default Navigation;
