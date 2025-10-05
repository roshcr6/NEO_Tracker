/**
 * Premium About Page
 * World-Class Design Inspired by: Apple, Porsche, Tesla, Stripe, Linear, ReactBits
 * Features: Premium text animations, word-by-word reveals, character animations
 */

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import './About.css';

function About() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  // ReactBits-style text animation function
  const AnimatedText = ({ text, className, delay = 0 }) => {
    const words = text.split(' ');
    
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: delay }
      })
    };

    const child = {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100
        }
      },
      hidden: {
        opacity: 0,
        y: 20,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100
        }
      }
    };

    return (
      <motion.div
        className={className}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {words.map((word, index) => (
          <span key={index} style={{ display: 'inline-block', marginRight: '0.25em' }}>
            <motion.span
              variants={child}
              style={{ display: 'inline-block' }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.div>
    );
  };

  // Character-by-character animation for special text
  const AnimatedCharacters = ({ text, className, delay = 0 }) => {
    const characters = text.split('');
    
    const container = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: delay }
      }
    };

    const child = {
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 200
        }
      },
      hidden: {
        opacity: 0,
        y: 10,
        scale: 0.8,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 200
        }
      }
    };

    return (
      <motion.div
        className={className}
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ display: 'inline-block' }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            variants={child}
            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  // Team members data with actual team photos
  const teamMembers = [
    {
      name: "Sanjay Varghese",
      role: "Lead Developer",
      image: require('./resources/Sanjay Varghese.png'),
      bio: "Full-stack developer specializing in real-time data visualization and API integration.",
      expertise: ["React", "Django", "3D Graphics"]
    },
    {
      name: "Riyan Raz",
      role: "Backend Developer",
      image: require('./resources/Riyan Raz.png'),
      bio: "Expert in backend architecture and NASA API integration systems.",
      expertise: ["Python", "API Design", "Data Processing"]
    },
    {
      name: "Roshith Robert",
      role: "Frontend Developer",
      image: require('./resources/Roshith Robert.png'),
      bio: "Specialized in creating intuitive user interfaces and interactive experiences.",
      expertise: ["React", "UI/UX", "Animation"]
    },
    {
      name: "Shwethin Nikesh Kumar",
      role: "Physics Simulation Developer",
      image: require('./resources/Shwethin Nikesh Kumar.png'),
      bio: "Expert in computational physics and impact simulation modeling.",
      expertise: ["Physics Engine", "3D Math", "Simulation"]
    },
    {
      name: "Zakiel Chungath",
      role: "Designer & Developer",
      image: require('./resources/Zakiel Chungath.png'),
      bio: "Creating beautiful interfaces with seamless user experiences.",
      expertise: ["UI Design", "Frontend", "Graphics"]
    }
  ];

  // Statistics
  const stats = [
    { number: "30,000+", label: "NEOs Tracked", suffix: "" },
    { number: "1M+", label: "Simulations Run", suffix: "" },
    { number: "99.9%", label: "Accuracy Rate", suffix: "" },
    { number: "150+", label: "Countries Reached", suffix: "" }
  ];

  // Logo Loop Animation Component
  const LogoLoop = () => {
    const logos = [
      { name: "React 18", category: "Frontend" },
      { name: "Three.js", category: "3D Graphics" },
      { name: "NASA API", category: "Data Source" },
      { name: "Django", category: "Backend" },
      { name: "Framer Motion", category: "Animation" },
      { name: "Leaflet", category: "Maps" }
    ];

    return (
      <div className="logo-loop-container">
        <motion.div
          className="logo-loop-track"
          animate={{
            x: [0, -1680],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {/* Render logos twice for seamless loop */}
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div key={index} className="logo-loop-item">
              <div className="logo-loop-card">
                <div className="logo-loop-name">{logo.name}</div>
                <div className="logo-loop-category">{logo.category}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="about-page" ref={containerRef}>
      {/* Navigation */}
      <Navigation darkMode={true} />

      {/* Hero Section with Parallax & Animated Text */}
      <motion.section 
        className="about-hero"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <div className="about-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-badge"
          >
            <span className="badge-dot"></span>
            <AnimatedCharacters text="ABOUT NEO TRACKER" delay={0.5} />
          </motion.div>

          <h1 className="about-hero-title">
            <AnimatedText text="Protecting Earth" delay={0.6} />
            <br />
            <span className="gradient-text">
              <AnimatedText text="One Simulation at a Time" delay={0.9} />
            </span>
          </h1>

          <AnimatedText 
            text="We're building the most advanced asteroid impact simulator to help humanity understand and prepare for near-Earth object threats."
            className="about-hero-description"
            delay={1.2}
          />

          <motion.div
            className="hero-stats-grid"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="hero-stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Animated background */}
        <div className="hero-bg-animation">
          <div className="orbit-ring orbit-1"></div>
          <div className="orbit-ring orbit-2"></div>
          <div className="orbit-ring orbit-3"></div>
        </div>
      </motion.section>

      {/* Team Section with Animated Titles */}
      <section className="about-section team-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              <AnimatedText text="Meet the Team" />
            </h2>
            <AnimatedText 
              text="Expert scientists and engineers dedicated to planetary defense"
              className="section-subtitle"
              delay={0.3}
            />
          </motion.div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  y: 60,
                  rotateX: 15,
                  filter: "blur(10px)"
                }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1,
                  y: 0,
                  rotateX: 0,
                  filter: "blur(0px)"
                }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.25, 0.4, 0.25, 1],
                  scale: {
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                  }
                }}
                whileHover={{ 
                  y: -20,
                  scale: 1.03,
                  transition: {
                    type: "spring",
                    damping: 15,
                    stiffness: 300
                  }
                }}
              >
                <motion.div 
                  className="team-card-inner"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="team-avatar"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.2 + 0.3,
                      duration: 0.6,
                      type: "spring",
                      damping: 12,
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.15,
                      rotate: 5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <img src={member.image} alt={member.name} className="team-avatar-img" />
                  </motion.div>
                  
                  <motion.h3 
                    className="team-name"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.4, duration: 0.5 }}
                  >
                    {member.name}
                  </motion.h3>
                  
                  <motion.p 
                    className="team-role"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  >
                    {member.role}
                  </motion.p>
                  
                  <motion.p 
                    className="team-bio"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.6, duration: 0.5 }}
                  >
                    {member.bio}
                  </motion.p>
                  
                  <motion.div 
                    className="team-expertise"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.7, duration: 0.5 }}
                  >
                    {member.expertise.map((skill, idx) => (
                      <motion.span 
                        key={idx} 
                        className="expertise-tag"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: index * 0.2 + 0.8 + idx * 0.1,
                          type: "spring",
                          damping: 15,
                          stiffness: 200
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          backgroundColor: "rgba(0, 212, 255, 0.2)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section with Logo Loop Animation */}
      <section className="about-section tech-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              <AnimatedText text="Powered by Innovation" />
            </h2>
            <AnimatedText 
              text="Built with cutting-edge technologies for maximum performance"
              className="section-subtitle"
              delay={0.3}
            />
          </motion.div>

          {/* Infinite Logo Loop */}
          <LogoLoop />
        </div>
      </section>

      {/* Impact Story Section with Animated Text */}
      <section className="about-section story-section">
        <div className="section-container">
          <motion.div
            className="story-content-simple"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="story-text-center">
              <motion.h2 
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <AnimatedCharacters text="Why We Built This" />
              </motion.h2>
              <div className="story-divider"></div>
              
              <AnimatedText
                text="In 2013, the Chelyabinsk meteor exploded over Russia with the force of 30 atomic bombs, injuring over 1,500 people. It came from the sun's direction—and we never saw it coming."
                className="story-paragraph-pro"
                delay={0.2}
              />
              
              <AnimatedText
                text="NASA now tracks over 30,000 near-Earth objects, but understanding their potential impact requires complex physics calculations that remain inaccessible to most."
                className="story-paragraph-pro"
                delay={0.4}
              />
              
              <AnimatedText
                text="NEO Tracker bridges this gap. By combining real NASA data with scientifically accurate simulations, we enable everyone to understand asteroid threats and their consequences."
                className="story-paragraph-pro"
                delay={0.6}
              />
              
              <motion.p 
                className="story-highlight-pro"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <AnimatedCharacters text="Preparedness starts with understanding." delay={0.9} />
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="cta-title">Ready to Explore?</h2>
          <p className="cta-description">
            Start simulating asteroid impacts and discover the science of planetary defense
          </p>
          <div className="cta-buttons">
            <motion.button
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/impact'}
            >
              Launch Simulator
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.button>
            <motion.button
              className="cta-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/discover'}
            >
              Explore NEOs
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default About;
