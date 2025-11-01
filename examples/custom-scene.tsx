/**
 * Custom Scene Example
 * 
 * This example shows how to use ParticleModel in a custom Three.js scene
 * with your own lighting, camera controls, and other objects
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ParticleModel, useScrollProgress } from '../src';

export default function CustomSceneExample() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        {/* Custom lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Particle Model */}
        <ParticleModelWithScroll />
        
        {/* Camera controls */}
        <OrbitControls enableZoom={true} enablePan={true} />
        
        {/* Other 3D objects can go here */}
      </Canvas>
    </div>
  );
}

function ParticleModelWithScroll() {
  const scrollProgress = useScrollProgress(2);
  
  return (
    <ParticleModel
      modelPath="/models/sphere.glb"
      targetParticleCount={5000}
      scrollProgress={scrollProgress}
      colors={{
        primary: '#00ffff',
        secondary: '#0088ff'
      }}
      rotationConfig={{
        enabled: false  // Disabled because we're using OrbitControls
      }}
    />
  );
}

