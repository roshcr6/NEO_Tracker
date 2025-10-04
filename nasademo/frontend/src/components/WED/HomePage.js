import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navigation from './Navigation';
import PremiumButton from './PremiumButton';
import PremiumCard from './PremiumCard';
import { 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  staggerContainer, 
  staggerItem,
  pageTransition,
  elasticScale
} from '../../utils/animations';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [splineError, setSplineError] = useState(false);
  const heroRef = useRef(null);
  
  // Smooth scroll animations
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  // Intersection observers for scroll animations
  const [heroRef2, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.5, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setTimeout(() => setIsLoaded(true), 500);
    
    // Suppress Spline viewer errors
    const handleError = (event) => {
      if (event.message && (event.message.includes('message port') || event.message.includes('buffer'))) {
        event.preventDefault();
      }
    };
    
    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleError, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleError, true);
    };
  }, []);

  return (
    <motion.div 
      className="home-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {/* Premium Navigation Bar - Universal */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999999 }}>
        <Navigation darkMode={true} />
      </div>

      {/* Spline 3D Earth Background */}
      {!splineError ? (
        <motion.div 
          className="spline-background"
          style={{ y: y1 }}
        >
          <spline-viewer
            url="https://prod.spline.design/vTp1uApannrgByyf/scene.splinecode"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: "auto",
              cursor: "grab"
            }}
            onLoad={() => {
              console.log('✅ Spline Earth loaded via <spline-viewer>!');
            }}
            onError={(error) => {
              console.error('❌ Spline viewer error:', error);
              setSplineError(true);
            }}
          ></spline-viewer>
        </motion.div>
      ) : (
        /* Fallback Animated Background if Spline fails */
        <motion.div 
          className="animated-background"
          style={{ y: y1 }}
        >
          <div className="stars-container">
            {[...Array(100)].map((_, i) => (
              <motion.div 
                key={i} 
                className="star-point"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          <motion.div 
            className="earth-gradient"
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </motion.div>
      )}

      {/* Overlay Gradient */}
      <div className="gradient-overlay"></div>

      {/* Navigation */}
      <nav className={`navbar ${isLoaded ? 'fade-in' : ''}`}>
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">💧</span>
          <span className="logo-text">NEO TRACKER</span>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/')} className="nav-link">Home</button>
          <button onClick={() => navigate('/about')} className="nav-link">About</button>
          <button onClick={() => navigate('/create')} className="nav-link">Features</button>
          <button onClick={() => navigate('/simulator')} className="nav-link">Partners</button>
          <button onClick={() => navigate('/about')} className="cta-button">
            Contact
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        ref={heroRef2}
        className={`hero-section ${isLoaded ? 'slide-up' : ''}`}
        style={{ opacity, scale }}
        variants={staggerContainer}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
      >
        <div className="hero-content">
          {/* Team Badge */}
          <motion.div 
            className="team-badge accent-caps"
            variants={elasticScale}
          >
            <span className="badge-icon">🚀</span>
            <span>NEO Trackers</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="hero-title display-hero"
            variants={fadeInUp}
          >
            Step into the
            <br />
            <motion.span 
              className="gradient-text text-gradient-gold"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              future
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="hero-subtitle text-large text-light"
            variants={fadeInUp}
          >
            Experience immersive asteroid tracking, impact simulation,
            <br />
            and planetary defense through cutting-edge 3D visualization
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="hero-buttons"
            variants={staggerItem}
          >
            <PremiumButton
              variant="primary"
              size="large"
              onClick={() => navigate('/discover')}
              magnetic={true}
              shimmer={true}
              icon="→"
            >
              Discover
            </PremiumButton>
            <PremiumButton
              variant="glass"
              size="large"
              onClick={() => navigate('/create')}
              magnetic={true}
              icon="✨"
            >
              Create Meteoroid
            </PremiumButton>
          </motion.div>

          {/* Stats */}
          <motion.div 
            ref={statsRef}
            className="stats-container"
            variants={staggerContainer}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            <motion.div className="stat-item" variants={staggerItem}>
              <motion.div 
                className="stat-number"
                initial={{ opacity: 0, scale: 0 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                500K+
              </motion.div>
              <div className="stat-label">Near-Earth Objects</div>
            </motion.div>
            <div className="stat-divider"></div>
            <motion.div className="stat-item" variants={staggerItem}>
              <motion.div 
                className="stat-number"
                initial={{ opacity: 0, scale: 0 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                20+
              </motion.div>
              <div className="stat-label">Live Asteroids</div>
            </motion.div>
            <div className="stat-divider"></div>
            <motion.div className="stat-item" variants={staggerItem}>
              <motion.div 
                className="stat-number"
                initial={{ opacity: 0, scale: 0 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Real-Time
              </motion.div>
              <div className="stat-label">NASA Data</div>
            </motion.div>
          </motion.div>

          {/* User Avatars */}
          <motion.div 
            className="users-section"
            variants={fadeInUp}
          >
            <div className="user-avatars">
              {['🧑‍🚀', '👩‍🚀', '👨‍🚀', '👩‍💻'].map((emoji, i) => (
                <motion.div
                  key={i}
                  className={`avatar avatar-${i + 1}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 10,
                    transition: { duration: 0.2 }
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
            <p className="users-text">Join thousands exploring the cosmos</p>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          {['⭐', '🌟', '✨', '💫'].map((emoji, i) => (
            <motion.div
              key={i}
              className={`float-element element-${i + 1}`}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div 
          className="scroll-mouse"
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <p>Scroll to explore</p>
      </motion.div>
    </motion.div>
  );
}

export default HomePage;
