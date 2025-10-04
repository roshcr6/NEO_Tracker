/**
 * Performance Optimization Configuration
 * Ensures 60 FPS smooth animations
 */

// Enable React Concurrent Mode features
export const reactConfig = {
  // Use concurrent rendering
  mode: 'concurrent',
  // Enable automatic batching
  unstable_batchedUpdates: true
};

// Animation performance settings
export const animationConfig = {
  // Use hardware acceleration
  useGPU: true,
  
  // Optimal timing for 60 FPS
  fps: 60,
  frameTime: 1000 / 60, // ~16.67ms per frame
  
  // Easing curves for premium feel
  easings: {
    porsche: [0.6, 0.05, 0.01, 0.9],
    apple: [0.43, 0.13, 0.23, 0.96],
    smooth: [0.25, 0.46, 0.45, 0.94],
    elastic: [0.34, 1.56, 0.64, 1],
    bounce: [0.68, -0.55, 0.265, 1.55]
  },
  
  // Duration settings (in seconds)
  durations: {
    instant: 0.1,
    fast: 0.2,
    medium: 0.3,
    slow: 0.5,
    verySlow: 0.8
  }
};

// Intersection Observer settings for scroll animations
export const observerConfig = {
  threshold: [0, 0.25, 0.5, 0.75, 1],
  rootMargin: '0px 0px -100px 0px',
  triggerOnce: true
};

// Lazy loading configuration
export const lazyLoadConfig = {
  threshold: 0.1,
  rootMargin: '50px'
};

// Debounce settings for performance
export const debounceConfig = {
  scroll: 16, // ~60 FPS
  resize: 100,
  input: 300
};

// Performance monitoring
export const performanceConfig = {
  // Enable performance monitoring in development
  enableMonitoring: process.env.NODE_ENV === 'development',
  
  // Log slow renders
  logSlowRenders: true,
  slowRenderThreshold: 16, // ms (60 FPS threshold)
  
  // Track FPS
  trackFPS: true,
  targetFPS: 60,
  
  // Memory optimization
  gcInterval: 30000 // Run garbage collection hints every 30s
};

// Prefetch settings
export const prefetchConfig = {
  // Prefetch on hover after delay
  hoverDelay: 100,
  
  // Prefetch on viewport
  viewportMargin: '100px',
  
  // Max concurrent prefetches
  maxConcurrent: 3
};

// Image optimization
export const imageConfig = {
  // Use WebP when available
  preferWebP: true,
  
  // Lazy load images
  lazyLoad: true,
  
  // Placeholder strategy
  placeholder: 'blur',
  
  // Quality settings
  quality: {
    thumbnail: 60,
    preview: 75,
    full: 90
  }
};

// Bundle optimization hints
export const bundleConfig = {
  // Code splitting routes
  splitRoutes: true,
  
  // Preload critical chunks
  preloadCritical: true,
  
  // Defer non-critical
  deferNonCritical: true,
  
  // Chunk size limits (KB)
  maxChunkSize: 200,
  minChunkSize: 20
};

// Cache configuration
export const cacheConfig = {
  // Enable service worker
  enableServiceWorker: true,
  
  // Cache strategies
  strategies: {
    images: 'cache-first',
    api: 'network-first',
    static: 'cache-first',
    dynamic: 'network-first'
  },
  
  // Cache duration (ms)
  duration: {
    images: 7 * 24 * 60 * 60 * 1000, // 7 days
    api: 5 * 60 * 1000, // 5 minutes
    static: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
};

// Touch optimization
export const touchConfig = {
  // Reduce animation duration on touch
  reduceDuration: true,
  touchDurationMultiplier: 0.7,
  
  // Disable hover effects on touch
  disableHoverOnTouch: true,
  
  // Touch feedback
  enableTouchFeedback: true,
  touchFeedbackDuration: 100
};

// Responsive breakpoints
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
  ultrawide: 1920
};

// Performance utilities
export const performanceUtils = {
  // Check if device is high performance
  isHighPerformance: () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return !connection || connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g';
  },
  
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Check if on low-end device
  isLowEndDevice: () => {
    return navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
  },
  
  // Get optimal animation duration based on device
  getOptimalDuration: (baseDuration) => {
    if (performanceUtils.prefersReducedMotion()) return 0.01;
    if (performanceUtils.isLowEndDevice()) return baseDuration * 0.7;
    return baseDuration;
  },
  
  // Request idle callback polyfill
  requestIdleCallback: (callback) => {
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback);
    }
    return setTimeout(callback, 1);
  },
  
  // Cancel idle callback polyfill
  cancelIdleCallback: (id) => {
    if ('cancelIdleCallback' in window) {
      return window.cancelIdleCallback(id);
    }
    return clearTimeout(id);
  }
};

// Export all configs
export default {
  react: reactConfig,
  animation: animationConfig,
  observer: observerConfig,
  lazyLoad: lazyLoadConfig,
  debounce: debounceConfig,
  performance: performanceConfig,
  prefetch: prefetchConfig,
  image: imageConfig,
  bundle: bundleConfig,
  cache: cacheConfig,
  touch: touchConfig,
  breakpoints,
  utils: performanceUtils
};
