/**
 * Premium About Page
 * World-Class Design Inspired by: Apple, Porsche, Tesla, Stripe, Linear, ReactBits
 * Features: Premium text animations, word-by-word reveals, character animations
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

  // Professional SVG Icons
  const UserIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    </svg>
  );

  const CodeIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );

  const AtomIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z"/>
      <path d="M3.8 3.8c-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5 2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5z"/>
    </svg>
  );

  const PaletteIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="8" cy="10" r="1" fill="currentColor"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
      <circle cx="16" cy="10" r="1" fill="currentColor"/>
      <circle cx="10" cy="14" r="1" fill="currentColor"/>
      <circle cx="14" cy="14" r="1" fill="currentColor"/>
    </svg>
  );

  // Team members data with professional icons
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Lead Astrophysicist",
      icon: <UserIcon />,
      bio: "15+ years studying near-Earth objects and planetary defense systems.",
      expertise: ["NEO Detection", "Orbital Mechanics", "Impact Modeling"]
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Architect",
      icon: <CodeIcon />,
      bio: "Former NASA engineer specializing in real-time data visualization.",
      expertise: ["Data Science", "3D Simulation", "API Integration"]
    },
    {
      name: "Dr. Yuki Tanaka",
      role: "Physics Simulation Lead",
      icon: <AtomIcon />,
      bio: "PhD in Computational Physics, expert in impact crater modeling.",
      expertise: ["Impact Physics", "Thermal Dynamics", "Shock Waves"]
    },
    {
      name: "Emma Williams",
      role: "UX/UI Designer",
      icon: <PaletteIcon />,
      bio: "Award-winning designer creating intuitive scientific interfaces.",
      expertise: ["User Experience", "3D Graphics", "Interactive Design"]
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -15 }}
              >
                <div className="team-card-inner">
                  <div className="team-avatar-icon">{member.icon}</div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                  <div className="team-expertise">
                    {member.expertise.map((skill, idx) => (
                      <span key={idx} className="expertise-tag">{skill}</span>
                    ))}
                  </div>
                </div>
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
