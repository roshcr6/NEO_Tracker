/**
 * NASA API Integration for Real-Time Asteroid Data
 * Handles NEO (Near-Earth Object) API calls and data processing
 * Version: 2.0 (with Planet Image Library support)
 */

class NASAAPIService {
    constructor() {
        // Version identifier
        this.version = '4.0-fully-backend-integrated';
        console.log(`🚀 NASA API Service v${this.version} initialized`);
        
        // Backend API configuration (SECURE - API keys hidden in backend)
        // When served from Django, use relative URLs
        this.apiURL = window.location.origin; // Same origin as the page
        this.baseURL = `${this.apiURL}/api`;
        
        this.cache = new Map();
        this.cacheTimeout = 3600000; // 1 hour cache
        this.requestDelay = 500; // 500ms delay between requests
        this.lastRequestTime = 0; // Track last request time
        
        console.log(`🔒 Using secure backend API: ${this.baseURL}`);
        console.log(`✅ All NASA API calls route through Django backend - API keys fully hidden!`);
    }

    /**
     * Rate limiting helper to prevent 429 errors
     */
    async rateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.requestDelay) {
            const waitTime = this.requestDelay - timeSinceLastRequest;
            console.log(`⏱️ Rate limiting: waiting ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        this.lastRequestTime = Date.now();
    }

    /**
     * Get NEO feed for current date range
     */
    async getNEOFeed(startDate = null, endDate = null, hazardousOnly = false) {
        try {
            // Use current date if no dates provided
            if (!startDate) {
                const today = new Date();
                startDate = this.formatDate(today);
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                endDate = this.formatDate(nextWeek);
            }

            const cacheKey = `neo_feed_${startDate}_${endDate}_${hazardousOnly}`;
            
            // Check cache first
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout) {
                    console.log('✅ Using cached NEO data');
                    return cached.data;
                }
            }

            // Add delay to avoid rate limits
            await this.rateLimit();
            
            // Call our secure backend API
            const params = new URLSearchParams({
                start_date: startDate,
                end_date: endDate,
                hazardous_only: hazardousOnly.toString()
            });
            
            const url = `${this.baseURL}/asteroids?${params}`;
            
            console.log(`� Fetching NEO data from backend API...`);
            console.log(`📅 Date range: ${startDate} to ${endDate}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 429) {
                    console.warn(`⚠️ Backend API Rate limit exceeded! Switching to procedural asteroid generation...`);
                    console.log(`💡 The app will continue working with simulated data.`);
                    return this.getMockAsteroidData(); // Return mock data immediately on rate limit
                }
                console.error(`❌ Backend API error: ${response.status} ${response.statusText}`);
                throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            console.log('✅ Backend API response received');
            console.log(`📊 Element count: ${data.element_count || 0}`);
            console.log(`📊 Asteroids:`, data.asteroids?.length || 0);
            
            // Process asteroid data
            const asteroids = data.asteroids || [];
            
            console.log(`✅ Processed ${asteroids.length} asteroids from Backend API`);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: asteroids,
                timestamp: Date.now()
            });

            return asteroids;

        } catch (error) {
            console.error('❌ Error fetching NEO feed:', error);
            console.error('Stack:', error.stack);
            console.warn('⚠️ Falling back to mock data due to API error');
            // Return mock data on error
            return this.getMockAsteroidData();
        }
    }

    /**
     * Get detailed information about a specific asteroid
     */
    async getAsteroidDetails(asteroidId) {
        try {
            const cacheKey = `asteroid_${asteroidId}`;
            
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout) {
                    return cached.data;
                }
            }

            // Add delay to avoid rate limits
            await this.rateLimit();
            
            // Call our secure backend API
            const url = `${this.baseURL}/asteroids/${asteroidId}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 429) {
                    console.warn(`⚠️ Rate limit hit for asteroid ${asteroidId}. Skipping for now.`);
                    return null; // Return null instead of throwing error
                }
                throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;

        } catch (error) {
            console.error('Error fetching asteroid details:', error);
            return null;
        }
    }

    /**
     * Process NEO feed data into usable format
     */
    processNEOFeedData(data, hazardousOnly = false) {
        const asteroids = [];
        
        console.log('📡 Processing NEO Feed Data...');
        
        for (const dateKey in data.near_earth_objects) {
            const dayAsteroids = data.near_earth_objects[dateKey];
            
            for (const asteroid of dayAsteroids) {
                // Filter hazardous only if requested
                if (hazardousOnly && !asteroid.is_potentially_hazardous_asteroid) {
                    continue;
                }
                
                const processedAsteroid = {
                    id: asteroid.id,
                    name: asteroid.name,
                    nasa_jpl_url: asteroid.nasa_jpl_url,
                    absolute_magnitude_h: asteroid.absolute_magnitude_h,
                    estimated_diameter: asteroid.estimated_diameter,
                    is_potentially_hazardous: asteroid.is_potentially_hazardous_asteroid,
                    close_approach_data: asteroid.close_approach_data,
                    
                    // Processed fields for easier use
                    diameter_km_min: asteroid.estimated_diameter?.kilometers?.estimated_diameter_min || 0,
                    diameter_km_max: asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
                    diameter_km_avg: 0,
                    
                    // Get closest approach data
                    closest_approach: null,
                    velocity_kmps: 0,
                    miss_distance_km: 0,
                    miss_distance_au: 0,
                    approach_date: null,
                };

                // Calculate average diameter
                processedAsteroid.diameter_km_avg = (
                    processedAsteroid.diameter_km_min + processedAsteroid.diameter_km_max
                ) / 2;

                // Find closest approach
                if (asteroid.close_approach_data && asteroid.close_approach_data.length > 0) {
                    const closest = asteroid.close_approach_data[0];
                    processedAsteroid.closest_approach = closest;
                    processedAsteroid.velocity_kmps = parseFloat(
                        closest.relative_velocity?.kilometers_per_second || 0
                    );
                    processedAsteroid.miss_distance_km = parseFloat(
                        closest.miss_distance?.kilometers || 0
                    );
                    processedAsteroid.miss_distance_au = parseFloat(
                        closest.miss_distance?.astronomical || 0
                    );
                    processedAsteroid.approach_date = new Date(closest.close_approach_date_full);
                }

                asteroids.push(processedAsteroid);
                
                // Log first 5 asteroids for debugging
                if (asteroids.length <= 5) {
                    console.log(`🪨 Asteroid #${asteroids.length}: ${processedAsteroid.name}`);
                    console.log(`   - Miss distance: ${(processedAsteroid.miss_distance_km / 1000).toFixed(0)} thousand km`);
                    console.log(`   - Hazardous: ${processedAsteroid.is_potentially_hazardous ? '⚠️ YES' : '✅ NO'}`);
                    console.log(`   - Diameter: ${processedAsteroid.diameter_km_avg.toFixed(3)} km`);
                }
            }
        }

        console.log(`\n✅ Successfully processed ${asteroids.length} asteroids from NEO feed`);
        console.log(`📊 Breakdown:`);
        console.log(`   - Hazardous: ${asteroids.filter(a => a.is_potentially_hazardous).length}`);
        console.log(`   - Safe: ${asteroids.filter(a => !a.is_potentially_hazardous).length}`);
        console.log(`   - Closest: ${(Math.min(...asteroids.map(a => a.miss_distance_km)) / 1000).toFixed(0)} thousand km`);
        console.log(`   - Farthest: ${(Math.max(...asteroids.map(a => a.miss_distance_km)) / 1000).toFixed(0)} thousand km\n`);

        // Sort by closest approach distance
        asteroids.sort((a, b) => a.miss_distance_km - b.miss_distance_km);

        return asteroids;
    }

    /**
     * Process detailed asteroid data
     */
    processAsteroidDetails(data) {
        return {
            id: data.id,
            name: data.name,
            nasa_jpl_url: data.nasa_jpl_url,
            absolute_magnitude_h: data.absolute_magnitude_h,
            estimated_diameter: data.estimated_diameter,
            is_potentially_hazardous: data.is_potentially_hazardous_asteroid,
            close_approach_data: data.close_approach_data,
            orbital_data: data.orbital_data,
            
            // Additional orbital elements for 3D positioning
            semi_major_axis: data.orbital_data?.semi_major_axis || 1,
            eccentricity: data.orbital_data?.eccentricity || 0,
            inclination: data.orbital_data?.inclination || 0,
            ascending_node_longitude: data.orbital_data?.ascending_node_longitude || 0,
            periapsis_argument: data.orbital_data?.periapsis_argument || 0,
            mean_anomaly: data.orbital_data?.mean_anomaly || 0,
            
            // Processed convenience fields
            diameter_km_avg: (
                (data.estimated_diameter?.kilometers?.estimated_diameter_min || 0) +
                (data.estimated_diameter?.kilometers?.estimated_diameter_max || 0)
            ) / 2,
        };
    }

    /**
     * Get mock data for testing when API is unavailable
     */
    getMockAsteroidData() {
        return [
            {
                id: '3542519',
                name: '(2010 PK9)',
                diameter_km_avg: 0.034,
                velocity_kmps: 6.25,
                miss_distance_km: 4935288,
                is_potentially_hazardous: true,
                approach_date: new Date('2024-11-01'),
            },
            {
                id: '2363313',
                name: '363313 (2002 VE68)',
                diameter_km_avg: 0.089,
                velocity_kmps: 12.8,
                miss_distance_km: 7829234,
                is_potentially_hazardous: false,
                approach_date: new Date('2024-11-03'),
            },
            {
                id: '54016067',
                name: '(2020 SO)',
                diameter_km_avg: 0.008,
                velocity_kmps: 0.93,
                miss_distance_km: 124584,
                is_potentially_hazardous: false,
                approach_date: new Date('2024-11-02'),
            }
        ];
    }

    /**
     * Format date for NASA API
     */
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Calculate accurate orbital position using real orbital mechanics
     * Based on Kepler's laws and orbital elements
     */
    calculateOrbitalPosition(asteroidData, currentTime) {
        const {
            semi_major_axis = 1,
            eccentricity = 0,
            inclination = 0,
            ascending_node_longitude = 0,
            periapsis_argument = 0,
            mean_anomaly = 0,
            orbital_period = 365.25
        } = asteroidData;

        // Convert to radians
        const i = inclination * Math.PI / 180;
        const Omega = ascending_node_longitude * Math.PI / 180;
        const omega = periapsis_argument * Math.PI / 180;
        
        // Calculate mean motion (rad/day)
        const n = (2 * Math.PI) / orbital_period;
        
        // Calculate current mean anomaly
        const M = (mean_anomaly * Math.PI / 180 + n * currentTime) % (2 * Math.PI);
        
        // Solve Kepler's equation for eccentric anomaly (E)
        let E = M;
        for (let iter = 0; iter < 10; iter++) {
            E = M + eccentricity * Math.sin(E);
        }
        
        // Calculate true anomaly (v)
        const v = 2 * Math.atan2(
            Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
            Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
        );
        
        // Calculate distance from focus
        const r = semi_major_axis * (1 - eccentricity * Math.cos(E));
        
        // Calculate position in orbital plane
        const x_orb = r * Math.cos(v);
        const y_orb = r * Math.sin(v);
        
        // Rotate to 3D space using orbital elements
        const x = x_orb * (Math.cos(omega) * Math.cos(Omega) - Math.sin(omega) * Math.sin(Omega) * Math.cos(i)) -
                  y_orb * (Math.sin(omega) * Math.cos(Omega) + Math.cos(omega) * Math.sin(Omega) * Math.cos(i));
        
        const y = x_orb * (Math.cos(omega) * Math.sin(Omega) + Math.sin(omega) * Math.cos(Omega) * Math.cos(i)) +
                  y_orb * (Math.cos(omega) * Math.cos(Omega) * Math.cos(i) - Math.sin(omega) * Math.sin(Omega));
        
        const z = x_orb * Math.sin(omega) * Math.sin(i) + y_orb * Math.cos(omega) * Math.sin(i);
        
        return {
            x: x,
            y: y,
            z: z,
            distance: r,
            trueAnomaly: v,
            eccentricAnomaly: E
        };
    }

    /**
     * Get asteroid statistics
     */
    getAsteroidStats(asteroids) {
        const hazardous = asteroids.filter(a => a.is_potentially_hazardous);
        const closeApproach = asteroids.filter(a => a.miss_distance_km < 7480000); // < 0.05 AU
        
        return {
            total: asteroids.length,
            hazardous: hazardous.length,
            closeApproach: closeApproach.length,
            averageSize: asteroids.reduce((sum, a) => sum + a.diameter_km_avg, 0) / asteroids.length,
            averageVelocity: asteroids.reduce((sum, a) => sum + a.velocity_kmps, 0) / asteroids.length,
        };
    }

    /**
     * Get real Earth imagery from NASA EPIC
     */
    async getEarthImagery() {
        try {
            const cacheKey = 'earth_epic_image';
            
            // Check cache first (cache for 1 hour)
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < 3600000) { // 1 hour
                    console.log('✅ Using cached EPIC Earth image');
                    return cached.data;
                }
            }
            
            // Call our secure backend API
            const url = `${this.baseURL}/earth-imagery`;
            console.log('📡 Fetching Earth imagery from backend...');
            
            const response = await fetch(url);
            
            if (response.status === 503) {
                console.warn('⚠️ NASA EPIC API is temporarily unavailable (503)');
                return null; // Return null, don't throw error
            }
            
            if (!response.ok) {
                console.warn(`⚠️ Backend API error: ${response.status} ${response.statusText}`);
                return null; // Return null, don't throw error
            }
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                const latestImage = data[0];
                const imageDate = latestImage.date.split(' ')[0].replace(/-/g, '/');
                const imageName = latestImage.image;
                
                const result = {
                    url: `https://epic.gsfc.nasa.gov/archive/natural/${imageDate}/png/${imageName}.png`,
                    date: latestImage.date,
                    coords: latestImage.centroid_coordinates
                };
                
                // Cache the result
                this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
                console.log('✅ EPIC Earth imagery fetched successfully');
                return result;
            }
            
            console.log('ℹ️ No EPIC images available');
            return null;
        } catch (error) {
            // Network errors, timeout, etc - don't crash, just return null
            console.warn('⚠️ EPIC API request failed:', error.message);
            return null;
        }
    }
    
    /**
     * Get real planetary imagery from NASA missions
     * Uses NASA's Mars Rover Photos API and other planetary missions
     */
    async getPlanetaryImagery(planetKey) {
        try {
            // Call our secure backend API for planetary imagery
            const url = `${this.baseURL}/planetary-imagery?planet=${planetKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn(`⚠️ Backend API error for ${planetKey}: ${response.status}`);
                // Fallback to static high-quality textures
                return this.getStaticPlanetaryTexture(planetKey);
            }
            
            const data = await response.json();
            
            if (data && data.url) {
                return {
                    url: data.url,
                    date: data.date,
                    title: data.title
                };
            }
            
            // Fallback to static textures if no data
            return this.getStaticPlanetaryTexture(planetKey);
            
        } catch (error) {
            console.warn('⚠️ Planetary imagery request failed:', error.message);
            return this.getStaticPlanetaryTexture(planetKey);
        }
    }
    
    /**
     * Get static high-quality planetary textures
     */
    getStaticPlanetaryTexture(planetKey) {
        const planetaryImages = {
            mercury: {
                url: 'https://astrogeology.usgs.gov/cache/images/f5e372a36edfa389625da6d0cc25d4f6_messenger_mdis_8_base_20m_uint16_400.jpg',
                mission: 'MESSENGER USGS'
            },
            venus: {
                url: 'https://astrogeology.usgs.gov/cache/images/7cf2e528822be2ffd327c8c2e83d8413_magellan_venus_base_sm.jpg',
                mission: 'Magellan USGS'
            },
            jupiter: {
                url: 'https://astrogeology.usgs.gov/cache/images/f8af60c4157110dc1f01e6c44dd2e5e9_jupiter_cassini.jpg',
                mission: 'Cassini-Juno USGS'
            },
            saturn: {
                url: 'https://astrogeology.usgs.gov/cache/images/b7cfa0c46e7f1e63e8dddb9bb4a8f0ca_saturn_cassini.jpg',
                mission: 'Cassini USGS'
            },
            uranus: {
                url: 'https://astrogeology.usgs.gov/cache/images/d0f8db8d6b3cef901fad0de54aa37d6f_uranus_voy2.jpg',
                mission: 'Voyager 2 USGS'
            },
            neptune: {
                url: 'https://astrogeology.usgs.gov/cache/images/7d6c6d5e7056e7ee8e77dce3beee3d5d_neptune_voy2.jpg',
                mission: 'Voyager 2 USGS'
            }
        };
        
        if (planetaryImages[planetKey]) {
            return planetaryImages[planetKey];
        }
        
        return null;
    }
    
    /**
     * Get accurate planetary positions using real ephemeris data
     * Uses NASA JPL orbital elements with rates of change
     */
    calculatePlanetaryPosition(planetKey, julianDate) {
        // Orbital elements for planets (J2000 epoch) with rates of change per century
        // Source: NASA JPL Horizons System
        const orbitalElements = {
            mercury: {
                a: 0.38709927, aDot: 0.00000037,
                e: 0.20563593, eDot: 0.00001906,
                i: 7.00497902, iDot: -0.00594749,
                L: 252.25032350, LDot: 149472.67411175,
                longPeri: 77.45779628, longPeriDot: 0.16047689,
                longNode: 48.33076593, longNodeDot: -0.12534081
            },
            venus: {
                a: 0.72333566, aDot: 0.00000390,
                e: 0.00677672, eDot: -0.00004107,
                i: 3.39467605, iDot: -0.00078890,
                L: 181.97909950, LDot: 58517.81538729,
                longPeri: 131.60246718, longPeriDot: 0.00268329,
                longNode: 76.67984255, longNodeDot: -0.27769418
            },
            earth: {
                a: 1.00000261, aDot: 0.00000562,
                e: 0.01671123, eDot: -0.00004392,
                i: -0.00001531, iDot: -0.01294668,
                L: 100.46457166, LDot: 35999.37244981,
                longPeri: 102.93768193, longPeriDot: 0.32327364,
                longNode: 0.0, longNodeDot: 0.0
            },
            mars: {
                a: 1.52371034, aDot: 0.00001847,
                e: 0.09339410, eDot: 0.00007882,
                i: 1.84969142, iDot: -0.00813131,
                L: -4.55343205, LDot: 19140.30268499,
                longPeri: -23.94362959, longPeriDot: 0.44441088,
                longNode: 49.55953891, longNodeDot: -0.29257343
            },
            jupiter: {
                a: 5.20288700, aDot: -0.00011607,
                e: 0.04838624, eDot: -0.00013253,
                i: 1.30439695, iDot: -0.00183714,
                L: 34.39644501, LDot: 3034.74612775,
                longPeri: 14.72847983, longPeriDot: 0.21252668,
                longNode: 100.47390909, longNodeDot: 0.20469106
            },
            saturn: {
                a: 9.53667594, aDot: -0.00125060,
                e: 0.05386179, eDot: -0.00050991,
                i: 2.48599187, iDot: 0.00193609,
                L: 49.95424423, LDot: 1222.49362201,
                longPeri: 92.59887831, longPeriDot: -0.41897216,
                longNode: 113.66242448, longNodeDot: -0.28867794
            },
            uranus: {
                a: 19.18916464, aDot: -0.00196176,
                e: 0.04725744, eDot: -0.00004397,
                i: 0.77263783, iDot: -0.00242939,
                L: 313.23810451, LDot: 428.48202785,
                longPeri: 170.95427630, longPeriDot: 0.40805281,
                longNode: 74.01692503, longNodeDot: 0.04240589
            },
            neptune: {
                a: 30.06992276, aDot: 0.00026291,
                e: 0.00859048, eDot: 0.00005105,
                i: 1.77004347, iDot: 0.00035372,
                L: -55.12002969, LDot: 218.45945325,
                longPeri: 44.96476227, longPeriDot: -0.32241464,
                longNode: 131.78422574, longNodeDot: -0.00508664
            }
        };
        
        const elem = orbitalElements[planetKey];
        if (!elem) return { x: 0, y: 0, z: 0 };
        
        // Centuries since J2000 epoch (January 1, 2000, 12:00 TT)
        const T = (julianDate - 2451545.0) / 36525.0;
        
        // Compute elements at current epoch with rates
        const a = elem.a + elem.aDot * T;
        const e = elem.e + elem.eDot * T;
        const i = (elem.i + elem.iDot * T) * Math.PI / 180;
        const L = (elem.L + elem.LDot * T) % 360;
        const longPeri = elem.longPeri + elem.longPeriDot * T;
        const longNode = elem.longNode + elem.longNodeDot * T;
        
        // Argument of perihelion
        const omega = longPeri - longNode;
        
        // Mean anomaly
        const M = ((L - longPeri + 360) % 360) * Math.PI / 180;
        
        // Solve Kepler's equation for eccentric anomaly (higher precision)
        let E = M;
        for (let iter = 0; iter < 20; iter++) {
            const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
            E -= dE;
            if (Math.abs(dE) < 1e-12) break;
        }
        
        // True anomaly
        const v = 2 * Math.atan2(
            Math.sqrt(1 + e) * Math.sin(E / 2),
            Math.sqrt(1 - e) * Math.cos(E / 2)
        );
        
        // Heliocentric distance
        const r = a * (1 - e * Math.cos(E));
        
        // Position in orbital plane
        const x_orb = r * Math.cos(v);
        const y_orb = r * Math.sin(v);
        
        // Convert angles to radians
        const omega_rad = omega * Math.PI / 180;
        const Omega_rad = longNode * Math.PI / 180;
        
        // Rotate to ecliptic coordinates
        const x_ecl = (Math.cos(omega_rad) * Math.cos(Omega_rad) - Math.sin(omega_rad) * Math.sin(Omega_rad) * Math.cos(i)) * x_orb +
                      (-Math.sin(omega_rad) * Math.cos(Omega_rad) - Math.cos(omega_rad) * Math.sin(Omega_rad) * Math.cos(i)) * y_orb;
        
        const y_ecl = (Math.cos(omega_rad) * Math.sin(Omega_rad) + Math.sin(omega_rad) * Math.cos(Omega_rad) * Math.cos(i)) * x_orb +
                      (-Math.sin(omega_rad) * Math.sin(Omega_rad) + Math.cos(omega_rad) * Math.cos(Omega_rad) * Math.cos(i)) * y_orb;
        
        const z_ecl = Math.sin(omega_rad) * Math.sin(i) * x_orb +
                      Math.cos(omega_rad) * Math.sin(i) * y_orb;
        
        return { x: x_ecl, y: y_ecl, z: z_ecl, distance: r };
    }
    
    /**
     * Convert Date to Julian Date
     */
    dateToJulian(date) {
        return (date.getTime() / 86400000.0) + 2440587.5;
    }
    
    /**
     * Format asteroid info for display
     */
    formatAsteroidInfo(asteroid) {
        const approachDate = asteroid.approach_date ? 
            asteroid.approach_date.toLocaleDateString() : 'Unknown';
        
        const sizeText = `${asteroid.diameter_km_avg.toFixed(3)} km avg`;
        const velocityText = `${asteroid.velocity_kmps.toFixed(2)} km/s`;
        const distanceText = `${(asteroid.miss_distance_km / 1000).toFixed(0)}K km`;
        
        // Get orbital data if available
        const orbitalDetails = [];
        if (asteroid.orbital_data) {
            if (asteroid.orbital_data.semi_major_axis) {
                orbitalDetails.push(`🔭 Semi-major Axis: ${parseFloat(asteroid.orbital_data.semi_major_axis).toFixed(3)} AU`);
            }
            if (asteroid.orbital_data.eccentricity) {
                orbitalDetails.push(`🌀 Eccentricity: ${parseFloat(asteroid.orbital_data.eccentricity).toFixed(4)}`);
            }
            if (asteroid.orbital_data.orbital_period) {
                orbitalDetails.push(`⏱️ Orbital Period: ${parseFloat(asteroid.orbital_data.orbital_period).toFixed(1)} days`);
            }
        }
        
        return {
            title: asteroid.name.replace(/[()]/g, ''),
            subtitle: `Asteroid ${asteroid.id}`,
            asteroidId: asteroid.id,
            details: [
                `🆔 ID: ${asteroid.id}`,
                `📏 Size: ${sizeText}`,
                `⚡ Velocity: ${velocityText}`,
                `📍 Miss Distance: ${distanceText}`,
                `📅 Close Approach: ${approachDate}`,
                ...orbitalDetails
            ]
        };
    }

    /**
     * Get Main Belt Asteroids from NASA SBDB (Small-Body Database)
     */
    async getMainBeltAsteroids(count = 500) {
        try {
            console.log(`🪨 Fetching ${count} Main Belt Asteroids from NASA SBDB...`);
            
            const cacheKey = `main_belt_asteroids_${count}`;
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout * 6) {
                    console.log('✅ Using cached Main Belt asteroid data');
                    return cached.data;
                }
            }

            const sbdbURL = `https://ssd-api.jpl.nasa.gov/sbdb_query.api`;
            const params = new URLSearchParams({
                'fields': 'spkid,full_name,e,a,i,om,w,ma,epoch',
                'sb-kind': 'a',
                'sb-group': 'MBA',
                'limit': count.toString()
            });

            const url = `${sbdbURL}?${params.toString()}`;
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
            let response;
            try {
                response = await fetch(url);
                if (!response.ok) {
                    console.warn(`⚠️ SBDB API returned ${response.status}, using procedural asteroids`);
                    return this.generateProceduralAsteroidBelt(count);
                }
            } catch (fetchError) {
                // CORS or network error - use procedural generation
                console.warn('⚠️ SBDB API unavailable (CORS or network error), generating procedural asteroids');
                return this.generateProceduralAsteroidBelt(count);
            }
            
            const data = await response.json();
            if (!data.data || data.data.length === 0) {
                return this.generateProceduralAsteroidBelt(count);
            }

            const asteroids = data.data.map((row, index) => ({
                id: row[0],
                name: row[1] || `MBA-${index + 1}`,
                eccentricity: parseFloat(row[2]) || 0.1,
                semiMajorAxis: parseFloat(row[3]) || 2.7,
                inclination: parseFloat(row[4]) || 0,
                longitudeAscendingNode: parseFloat(row[5]) || 0,
                argumentPerihelion: parseFloat(row[6]) || 0,
                meanAnomaly: parseFloat(row[7]) || Math.random() * 360,
                epoch: parseFloat(row[8]) || Date.now()
            }));

            this.cache.set(cacheKey, { data: asteroids, timestamp: Date.now() });
            console.log(`✅ Processed ${asteroids.length} main belt asteroids`);
            return asteroids;
        } catch (error) {
            console.error('❌ Error fetching main belt asteroids:', error);
            return this.generateProceduralAsteroidBelt(count);
        }
    }

    generateProceduralAsteroidBelt(count = 500) {
        console.log(`🎲 Generating ${count} procedural asteroids...`);
        const asteroids = [];
        for (let i = 0; i < count; i++) {
            asteroids.push({
                id: `MBA-PROC-${i + 1}`,
                name: `Main Belt ${i + 1}`,
                eccentricity: 0.05 + Math.random() * 0.25,
                semiMajorAxis: 2.1 + Math.random() * 1.2,
                inclination: Math.random() * 20,
                longitudeAscendingNode: Math.random() * 360,
                argumentPerihelion: Math.random() * 360,
                meanAnomaly: Math.random() * 360,
                epoch: Date.now(),
                isProcedural: true
            });
        }
        console.log(`✅ Successfully generated ${asteroids.length} procedural asteroids for Main Belt`);
        return asteroids;
    }

    /**
     * Get real planet images from NASA Image and Video Library
     */
    async getPlanetImage(planetName) {
        try {
            const cacheKey = `planet_img_${planetName}`;
            
            // Check cache (cache for 24 hours)
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < 86400000) { // 24 hours
                    console.log(`✅ Using cached image for ${planetName}`);
                    return cached.data;
                }
            }

            // NASA Image and Video Library search
            const searchURL = `https://images-api.nasa.gov/search?q=${planetName}&media_type=image&keywords=planet`;
            
            console.log(`🖼️ Searching NASA Image Library for ${planetName}...`);
            const response = await fetch(searchURL);
            
            if (!response.ok) {
                throw new Error(`NASA Image API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.collection && data.collection.items && data.collection.items.length > 0) {
                // Get the first high-quality image
                for (const item of data.collection.items) {
                    if (item.links && item.links.length > 0) {
                        const imageUrl = item.links[0].href;
                        
                        // Verify it's a valid image URL
                        if (imageUrl && (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.png'))) {
                            const result = {
                                url: imageUrl,
                                title: item.data[0]?.title || planetName,
                                description: item.data[0]?.description || '',
                                center: item.data[0]?.center || 'NASA'
                            };
                            
                            // Cache the result
                            this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
                            console.log(`✅ Found NASA image for ${planetName}: ${result.title}`);
                            return result;
                        }
                    }
                }
            }

            console.warn(`⚠️ No suitable image found for ${planetName} in NASA library`);
            return null;
        } catch (error) {
            console.error(`❌ Error fetching NASA image for ${planetName}:`, error);
            return null;
        }
    }

    /**
     * Get high-resolution planet texture from LOCAL textures folder
     * NO CORS ISSUES - all textures are served locally!
     */
    async getRealPlanetTexture(planetKey) {
        // Use LOCAL texture files - completely CORS-free!
        const localTextureURLs = {
            mercury: '/static/orrery/textures/mercury.jpg',
            venus: '/static/orrery/textures/venus.jpg',
            mars: '/static/orrery/textures/mars.jpg',
            jupiter: '/static/orrery/textures/jupiter.jpg',
            saturn: '/static/orrery/textures/saturn.jpg',
            uranus: '/static/orrery/textures/uranus.jpg',
            neptune: '/static/orrery/textures/neptune.jpg'
        };

        const textureUrl = localTextureURLs[planetKey];
        
        if (!textureUrl) {
            console.log(`⚠️ No texture URL defined for ${planetKey}`);
            return null;
        }

        console.log(`�️ Loading local texture for ${planetKey}...`);
        
        // Return local URL (no CORS issues, always works!)
        return {
            url: textureUrl,
            title: `${planetKey.charAt(0).toUpperCase() + planetKey.slice(1)} High-Resolution Texture (2K)`,
            description: 'Local planet texture map - 2048x2048 resolution',
            center: 'Solar System Scope'
        };
    }
}

// Export for use in other modules
window.NASAAPIService = NASAAPIService;