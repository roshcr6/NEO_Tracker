/**
 * Person 3: 3D Orbit Visualization using Three.js
 * Shows asteroid orbit around the Sun and approach to Earth
 * Features: Pause/Play, Clickable planets, Highlighted selected asteroid
 */
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import './Orbit3D.css';

// Sun component
function Sun({ onClick, isPaused }) {
  const sunRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (sunRef.current && !isPaused) {
      sunRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <mesh 
      ref={sunRef} 
      position={[0, 0, 0]}
      onClick={() => onClick({
        name: 'Sun',
        type: 'Star',
        diameter: '1,391,000 km',
        mass: '1.989 × 10³⁰ kg',
        temperature: '5,778 K',
        description: 'The Sun is the star at the center of our Solar System'
      })}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial 
        emissive="#FDB813" 
        emissiveIntensity={hovered ? 3 : 2.5}
        color="#FDB813"
      />
      <pointLight intensity={3} distance={150} decay={1} />
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontSize: '12px'
          }}>
            Sun (Click for details)
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Mercury component
function Mercury({ orbitRadius, isPaused, onClick }) {
  const [angle, setAngle] = useState(0);
  const mercuryRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (!isPaused) {
      setAngle(prev => prev + 0.8 * delta);
    }
    if (mercuryRef.current && !isPaused) {
      mercuryRef.current.rotation.y += 0.005;
    }
  });
  
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  
  return (
    <mesh 
      ref={mercuryRef} 
      position={[x, 0, z]}
      onClick={() => onClick({
        name: 'Mercury',
        type: 'Planet',
        diameter: '4,879 km',
        mass: '3.285 × 10²³ kg',
        orbitalPeriod: '88 days',
        description: 'Smallest planet and closest to the Sun'
      })}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial 
        color="#8C7853" 
        roughness={0.9}
        emissive={hovered ? "#8C7853" : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontSize: '12px'
          }}>
            Mercury
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Venus component
function Venus({ orbitRadius, isPaused, onClick }) {
  const [angle, setAngle] = useState(0);
  const venusRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (!isPaused) {
      setAngle(prev => prev + 0.6 * delta);
    }
    if (venusRef.current && !isPaused) {
      venusRef.current.rotation.y += 0.003;
    }
  });
  
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  
  return (
    <mesh 
      ref={venusRef} 
      position={[x, 0, z]}
      onClick={() => onClick({
        name: 'Venus',
        type: 'Planet',
        diameter: '12,104 km',
        mass: '4.867 × 10²⁴ kg',
        orbitalPeriod: '225 days',
        description: 'Hottest planet with thick atmosphere'
      })}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial 
        color="#FFC649"
        emissive={hovered ? "#FFC649" : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontSize: '12px'
          }}>
            Venus
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Earth component
function Earth({ orbitRadius, isPaused, onClick }) {
  const [angle, setAngle] = useState(0);
  const earthRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (!isPaused) {
      setAngle(prev => prev + 0.5 * delta);
    }
    if (earthRef.current && !isPaused) {
      earthRef.current.rotation.y += 0.01;
    }
  });
  
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  
  return (
    <group position={[x, 0, z]}>
      <mesh 
        ref={earthRef}
        onClick={() => onClick({
          name: 'Earth',
          type: 'Planet',
          diameter: '12,742 km',
          mass: '5.972 × 10²⁴ kg',
          orbitalPeriod: '365 days',
          description: 'Our home planet, the only known planet with life'
        })}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial 
          color="#2E86AB"
          emissive={hovered ? "#2E86AB" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      {/* Moon */}
      <mesh position={[1.5, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#AAAAAA" />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontSize: '12px'
          }}>
            Earth + Moon
          </div>
        </Html>
      )}
    </group>
  );
}

// Mars component
function Mars({ orbitRadius, isPaused, onClick }) {
  const [angle, setAngle] = useState(0);
  const marsRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (!isPaused) {
      setAngle(prev => prev + 0.4 * delta);
    }
    if (marsRef.current && !isPaused) {
      marsRef.current.rotation.y += 0.009;
    }
  });
  
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  
  return (
    <mesh 
      ref={marsRef} 
      position={[x, 0, z]}
      onClick={() => onClick({
        name: 'Mars',
        type: 'Planet',
        diameter: '6,779 km',
        mass: '6.39 × 10²³ kg',
        orbitalPeriod: '687 days',
        description: 'The Red Planet, potential future human colony'
      })}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial 
        color="#CD5C5C"
        emissive={hovered ? "#CD5C5C" : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontSize: '12px'
          }}>
            Mars
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Jupiter component
function Jupiter({ orbitRadius, isPaused, onClick }) {
  const [angle, setAngle] = useState(0);
  const jupiterRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (!isPaused) {
      setAngle(prev => prev + 0.15 * delta);
    }
    if (jupiterRef.current && !isPaused) {
      jupiterRef.current.rotation.y += 0.02;
    }
  });
  
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  
  return (
    <mesh 
      ref={jupiterRef} 
      position={[x, 0, z]}
      onClick={() => onClick({
        name: 'Jupiter',
        type: 'Planet',
        diameter: '139,820 km',
        mass: '1.898 × 10²⁷ kg',
        orbitalPeriod: '12 years',
        description: 'Largest planet with Great Red Spot storm'
      })}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial 
        color="#C88B3A"
        emissive={hovered ? "#C88B3A" : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontSize: '12px'
          }}>
            Jupiter
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Saturn component
function Saturn({ orbitRadius, isPaused, onClick }) {
  const [angle, setAngle] = useState(0);
  const saturnRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (!isPaused) {
      setAngle(prev => prev + 0.1 * delta);
    }
    if (saturnRef.current && !isPaused) {
      saturnRef.current.rotation.y += 0.018;
    }
  });
  
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  
  return (
    <group position={[x, 0, z]}>
      <mesh 
        ref={saturnRef}
        onClick={() => onClick({
          name: 'Saturn',
          type: 'Planet',
          diameter: '116,460 km',
          mass: '5.683 × 10²⁶ kg',
          orbitalPeriod: '29 years',
          description: 'Famous for its beautiful ring system'
        })}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial 
          color="#FAD5A5"
          emissive={hovered ? "#FAD5A5" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      {/* Saturn's rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 2.0, 64]} />
        <meshStandardMaterial color="#C9B999" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontSize: '12px'
          }}>
            Saturn
          </div>
        </Html>
      )}
    </group>
  );
}

// Asteroid component
function Asteroid({ position, scale, color, label, onClick, isSelected }) {
  const asteroidRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.x += 0.02;
      asteroidRef.current.rotation.y += 0.03;
    }
  });
  
  return (
    <group position={position}>
      <mesh 
        ref={asteroidRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={(hovered || isSelected) ? 1.3 : 1}
      >
        <dodecahedronGeometry args={[scale, 0]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.8}
          metalness={0.2}
          emissive={isSelected ? "#ffaa00" : "#000000"}
          emissiveIntensity={isSelected ? 0.8 : 0}
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontSize: '12px',
            border: isSelected ? '2px solid #ffaa00' : 'none'
          }}>
            {label} {isSelected ? '(Selected)' : ''}
          </div>
        </Html>
      )}
    </group>
  );
}

// Orbit path component
function OrbitPath({ radius, segments = 128, color = "#ffffff", opacity = 0.3 }) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    );
  }
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

// Animated asteroid along orbit
function AnimatedAsteroid({ 
  orbitRadius, 
  speed, 
  scale, 
  color, 
  label,
  deflection = { active: false, deltaV: 0 },
  isPaused,
  onClick,
  isSelected
}) {
  const [angle, setAngle] = useState(0);
  
  useFrame((state, delta) => {
    if (!isPaused) {
      const effectiveSpeed = deflection.active 
        ? speed * (1 + deflection.deltaV / 100)
        : speed;
      
      setAngle(prev => prev + effectiveSpeed * delta);
    }
  });
  
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  
  return <Asteroid 
    position={[x, 0, z]} 
    scale={scale} 
    color={color} 
    label={label} 
    onClick={onClick}
    isSelected={isSelected}
  />;
}

// Main 3D Scene
function Scene({ asteroidData, deflectionData, isPaused, onBodyClick, selectedBodyName }) {
  const mercuryOrbit = 5;
  const venusOrbit = 8;
  const earthOrbitRadius = 12;
  const marsOrbit = 16;
  const jupiterOrbit = 35;
  const saturnOrbit = 50;
  const asteroidOrbitRadius = asteroidData?.orbitRadius || 22;
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <Stars radius={200} depth={60} count={8000} factor={5} fade speed={1} />
      
      {/* Sun at center */}
      <Sun isPaused={isPaused} onClick={onBodyClick} />
      
      {/* Inner Planets */}
      <OrbitPath radius={mercuryOrbit} color="#8C7853" opacity={0.3} />
      <Mercury orbitRadius={mercuryOrbit} isPaused={isPaused} onClick={onBodyClick} />
      
      <OrbitPath radius={venusOrbit} color="#FFC649" opacity={0.3} />
      <Venus orbitRadius={venusOrbit} isPaused={isPaused} onClick={onBodyClick} />
      
      <OrbitPath radius={earthOrbitRadius} color="#2E86AB" opacity={0.4} />
      <Earth orbitRadius={earthOrbitRadius} isPaused={isPaused} onClick={onBodyClick} />
      
      <OrbitPath radius={marsOrbit} color="#CD5C5C" opacity={0.3} />
      <Mars orbitRadius={marsOrbit} isPaused={isPaused} onClick={onBodyClick} />
      
      {/* Outer Planets */}
      <OrbitPath radius={jupiterOrbit} color="#C88B3A" opacity={0.2} />
      <Jupiter orbitRadius={jupiterOrbit} isPaused={isPaused} onClick={onBodyClick} />
      
      <OrbitPath radius={saturnOrbit} color="#FAD5A5" opacity={0.2} />
      <Saturn orbitRadius={saturnOrbit} isPaused={isPaused} onClick={onBodyClick} />
      
      {/* Asteroid Belt (visual representation) */}
      {Array.from({ length: 100 }).map((_, i) => {
        const angle = (i / 100) * Math.PI * 2;
        const radius = 20 + Math.random() * 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 2;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05 + Math.random() * 0.1, 8, 8]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        );
      })}
      
      {/* Target Asteroid orbit and object */}
      <OrbitPath radius={asteroidOrbitRadius} color="#FF6B6B" opacity={0.6} />
      <AnimatedAsteroid 
        orbitRadius={asteroidOrbitRadius}
        speed={asteroidData?.speed || 0.2}
        scale={asteroidData?.scale || 0.3}
        color={asteroidData?.isHazardous ? "#FF0000" : "#FF6B6B"}
        label={asteroidData?.name || "Impactor-2025"}
        deflection={deflectionData}
        isPaused={isPaused}
        onClick={() => onBodyClick({
          name: asteroidData?.name || "Impactor-2025",
          type: 'Near-Earth Object',
          diameter: asteroidData?.diameter ? `${asteroidData.diameter} km` : 'Unknown',
          velocity: asteroidData?.velocity ? `${asteroidData.velocity} km/s` : 'Unknown',
          hazardous: asteroidData?.isHazardous ? 'Yes - Potentially Hazardous' : 'No',
          description: asteroidData?.isHazardous 
            ? 'This asteroid poses a potential threat to Earth' 
            : 'This asteroid does not pose a significant threat'
        })}
        isSelected={selectedBodyName === (asteroidData?.name || "Impactor-2025")}
      />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={150}
      />
    </>
  );
}

// Main Orbit3D Component
export default function Orbit3D({ asteroidData, deflectionData }) {
  const [cameraPosition] = useState([30, 20, 30]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedBody, setSelectedBody] = useState(null);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleBodyClick = (bodyInfo) => {
    setSelectedBody(bodyInfo);
  };
  
  return (
    <div className="orbit3d-container">
      {/* Detail Panel */}
      {selectedBody && (
        <div className="body-detail-panel">
          <button className="close-detail-btn" onClick={() => setSelectedBody(null)}>✕</button>
          <h3>{selectedBody.name}</h3>
          <div className="detail-content">
            <p><strong>Type:</strong> {selectedBody.type}</p>
            <p><strong>Diameter:</strong> {selectedBody.diameter}</p>
            {selectedBody.mass && <p><strong>Mass:</strong> {selectedBody.mass}</p>}
            {selectedBody.velocity && <p><strong>Velocity:</strong> {selectedBody.velocity}</p>}
            {selectedBody.orbitalPeriod && <p><strong>Orbital Period:</strong> {selectedBody.orbitalPeriod}</p>}
            {selectedBody.temperature && <p><strong>Temperature:</strong> {selectedBody.temperature}</p>}
            {selectedBody.hazardous && (
              <p className={selectedBody.hazardous.includes('Yes') ? 'hazardous-warning' : ''}>
                <strong>Hazardous:</strong> {selectedBody.hazardous}
              </p>
            )}
            <p className="detail-description">{selectedBody.description}</p>
          </div>
        </div>
      )}

      {/* Pause/Play Button */}
      <button className="pause-play-btn" onClick={togglePause} title={isPaused ? 'Resume Animation' : 'Pause Animation'}>
        {isPaused ? '▶' : '⏸'}
      </button>

      <div className="orbit3d-header">
        <h2>🌌 3D Orbit Visualization</h2>
        <p>Asteroid trajectory around the Sun {isPaused && <span style={{color: '#ffaa00'}}>(Paused)</span>}</p>
      </div>
      
      <div className="orbit3d-canvas">
        <Canvas
          camera={{ 
            position: cameraPosition, 
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(window.devicePixelRatio);
            gl.setClearColor('#000000', 1);
          }}
          gl={{ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance'
          }}
        >
          <Scene 
            asteroidData={asteroidData} 
            deflectionData={deflectionData} 
            isPaused={isPaused}
            onBodyClick={handleBodyClick}
            selectedBodyName={selectedBody?.name}
          />
        </Canvas>
      </div>
      
      <div className="orbit3d-info">
        <div className="info-item">
          <span className="label">Asteroid:</span>
          <span className="value">{asteroidData?.name || "Impactor-2025"}</span>
        </div>
        <div className="info-item">
          <span className="label">Diameter:</span>
          <span className="value">{asteroidData?.diameter || "1.0"} km</span>
        </div>
        <div className="info-item">
          <span className="label">Velocity:</span>
          <span className="value">{asteroidData?.velocity || "20"} km/s</span>
        </div>
        <div className="info-item">
          <span className="label">Status:</span>
          <span className={`value ${asteroidData?.isHazardous ? 'hazardous' : 'safe'}`}>
            {asteroidData?.isHazardous ? "⚠️ Potentially Hazardous" : "✓ Safe"}
          </span>
        </div>
      </div>
      
      <div className="orbit3d-legend">
        <div className="legend-item">
          <div className="legend-color sun"></div>
          <span>Sun</span>
        </div>
        <div className="legend-item">
          <div className="legend-color mercury"></div>
          <span>Mercury</span>
        </div>
        <div className="legend-item">
          <div className="legend-color venus"></div>
          <span>Venus</span>
        </div>
        <div className="legend-item">
          <div className="legend-color earth"></div>
          <span>Earth</span>
        </div>
        <div className="legend-item">
          <div className="legend-color mars"></div>
          <span>Mars</span>
        </div>
        <div className="legend-item">
          <div className="legend-color jupiter"></div>
          <span>Jupiter</span>
        </div>
        <div className="legend-item">
          <div className="legend-color saturn"></div>
          <span>Saturn</span>
        </div>
        <div className="legend-item">
          <div className="legend-color asteroid"></div>
          <span>Target Asteroid</span>
        </div>
      </div>
    </div>
  );
}
