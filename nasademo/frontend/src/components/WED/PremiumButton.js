/**
 * Premium Button Component
 * Inspired by: Porsche, Lay's, KitKat, Apple
 * Features: Magnetic effect, Ripple, Shimmer, 3D transform
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './PremiumButton.css';

const PremiumButton = ({ 
  children, 
  onClick, 
  variant = 'primary', // primary, secondary, ghost, glass
  size = 'medium', // small, medium, large
  icon,
  magnetic = true,
  shimmer = true,
  fullWidth = false,
  disabled = false,
  className = ''
}) => {
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!magnetic || disabled) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    
    setMagneticPos({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMagneticPos({ x: 0, y: 0 });
  };

  const handleClick = (e) => {
    if (disabled) return;
    
    // Ripple effect
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now()
    };
    
    setRipples([...ripples, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prevRipples => prevRipples.filter(r => r.id !== newRipple.id));
    }, 600);
    
    if (onClick) onClick(e);
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      } 
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`premium-btn premium-btn-${variant} premium-btn-${size} ${fullWidth ? 'premium-btn-full' : ''} ${disabled ? 'premium-btn-disabled' : ''} ${className}`}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate={{
        x: magneticPos.x,
        y: magneticPos.y
      }}
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 20 },
        y: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Shimmer Effect */}
      {shimmer && !disabled && <div className="btn-shimmer" />}
      
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="btn-ripple"
          style={{
            left: ripple.x,
            top: ripple.y
          }}
        />
      ))}
      
      {/* Button Content */}
      <span className="btn-content">
        {icon && <span className="btn-icon">{icon}</span>}
        <span className="btn-text">{children}</span>
      </span>
      
      {/* Glow Effect */}
      <div className="btn-glow" />
    </motion.button>
  );
};

export default PremiumButton;
