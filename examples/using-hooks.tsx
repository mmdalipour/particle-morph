/**
 * Using Hooks Example
 * 
 * This example demonstrates how to use individual hooks
 * for building custom particle effects
 */

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  useParticleGeometry, 
  useInteractiveRotation,
  useScrollProgress 
} from '../src';

export default function UsingHooksExample() {
  return (
    <div style={{ width: '100vw', height: '300vh' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
        <Canvas camera={{ position: [0, 0, 10] }}>
          <CustomParticles />
        </Canvas>
      </div>
    </div>
  );
}

function CustomParticles() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Use individual hooks
  const { geometry, isLoading } = useParticleGeometry(
    '/models/sphere.glb',
    3000,
    30
  );
  
  const { rotation, onPointerDown, onPointerMove, onPointerUp } = 
    useInteractiveRotation(0.08, 0.001);
  
  const scrollProgress = useScrollProgress(2);
  
  // Custom material
  const material = new THREE.PointsMaterial({
    color: new THREE.Color('#00ffff'),
    size: 0.05,
    transparent: true,
    opacity: 0.8
  });
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.copy(rotation);
    }
  });
  
  if (isLoading || !geometry) return null;
  
  return (
    <group ref={groupRef}>
      <points geometry={geometry} material={material} />
      <mesh
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

