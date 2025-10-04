/**
 * Premium Card Component with Advanced Animations
 * Inspired by: Apple, Porsche, KitKat designs
 */

import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import './PremiumCard.css';

const PremiumCard = ({
  children,
  variant = 'glass', // glass, solid, gradient, neon
  tilt = true,
  glow = false,
  delay = 0,
  className = ''
}) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const hoverVariants = {
    rest: {
      scale: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const CardContent = (
    <motion.div
      className={`premium-card premium-card-${variant} ${glow ? 'premium-card-glow' : ''} ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover="hover"
    >
      {glow && <div className="card-glow-effect" />}
      <div className="card-content">
        {children}
      </div>
      <div className="card-shine" />
    </motion.div>
  );

  if (tilt) {
    return (
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        scale={1.02}
        transitionSpeed={400}
        glareEnable={true}
        glareMaxOpacity={0.2}
        glareColor="#ffffff"
        glarePosition="all"
        className="tilt-wrapper"
      >
        {CardContent}
      </Tilt>
    );
  }

  return CardContent;
};

export default PremiumCard;
