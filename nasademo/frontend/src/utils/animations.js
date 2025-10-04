/**
 * Premium Animation Utilities
 * Inspired by: Porsche, Lay's, KitKat, Apple, Tesla
 * Reference: https://reactbits.dev/
 */

// Framer Motion Variants
export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.05, 0.01, 0.9], // Custom ease curve
    }
  }
};

export const fadeInLeft = {
  hidden: { 
    opacity: 0, 
    x: -100,
    filter: 'blur(10px)'
  },
  visible: { 
    opacity: 1, 
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const fadeInRight = {
  hidden: { 
    opacity: 0, 
    x: 100,
    filter: 'blur(10px)'
  },
  visible: { 
    opacity: 1, 
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const scaleIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    filter: 'blur(20px)'
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: [0.34, 1.56, 0.64, 1] // Elastic ease
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Hover Animations
export const hoverScale = {
  rest: { 
    scale: 1,
    transition: { duration: 0.3 }
  },
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const hoverLift = {
  rest: { 
    y: 0,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 }
  },
  hover: { 
    y: -8,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const buttonHover = {
  rest: { 
    scale: 1,
    filter: 'brightness(1)',
    transition: { duration: 0.2 }
  },
  hover: { 
    scale: 1.03,
    filter: 'brightness(1.2)',
    transition: { 
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Page Transitions
export const pageTransition = {
  initial: { 
    opacity: 0,
    scale: 0.98,
    filter: 'blur(10px)'
  },
  animate: { 
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.02,
    filter: 'blur(10px)',
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

// Magnetic Button Effect
export const magneticVariants = {
  rest: { 
    x: 0, 
    y: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 20 
    }
  }
};

// Text Reveal Animation
export const textReveal = {
  hidden: {
    opacity: 0,
    y: 100,
    rotateX: 90
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

// Parallax Scroll
export const parallaxScroll = (scrollY, offset = 0, factor = 0.5) => {
  return scrollY * factor + offset;
};

// Smooth Scroll
export const smoothScrollTo = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
};

// Cursor Follow Effect
export const cursorFollowVariants = {
  default: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 0.6
  }
};

// Loading Animation
export const loadingVariants = {
  start: {
    scale: 1,
    opacity: 1
  },
  end: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

// Reveal on Scroll
export const scrollReveal = {
  hidden: {
    opacity: 0,
    y: 75,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Card Flip
export const cardFlip = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6 }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6 }
  }
};

// Liquid Button Effect
export const liquidButton = {
  rest: {
    scale: 1
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  tap: {
    scale: 0.95
  }
};

// Elastic Scale
export const elasticScale = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
};

// Typewriter Effect Speed
export const typewriterSpeed = 50; // ms per character

// Shimmer Effect
export const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
`;

// Glow Pulse
export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(99, 102, 241, 0.5)',
      '0 0 60px rgba(99, 102, 241, 0.8)',
      '0 0 20px rgba(99, 102, 241, 0.5)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Morph Path Animation
export const morphPath = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2, ease: 'easeInOut' },
      opacity: { duration: 0.5 }
    }
  }
};

// Premium Easing Functions
export const easings = {
  porsche: [0.6, 0.05, 0.01, 0.9],
  apple: [0.43, 0.13, 0.23, 0.96],
  elastic: [0.34, 1.56, 0.64, 1],
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55]
};

// Magnetic Mouse Effect
export const calculateMagneticPosition = (e, ref, strength = 0.3) => {
  if (!ref.current) return { x: 0, y: 0 };
  
  const rect = ref.current.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const deltaX = (e.clientX - centerX) * strength;
  const deltaY = (e.clientY - centerY) * strength;
  
  return { x: deltaX, y: deltaY };
};

// 3D Tilt Effect
export const tiltOptions = {
  max: 25,
  speed: 400,
  glare: true,
  'max-glare': 0.5,
  scale: 1.05,
  perspective: 1000,
  transition: true,
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
};
