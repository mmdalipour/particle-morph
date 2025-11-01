/**
 * Without Scroll Animation Example
 * 
 * This example shows particles without scroll-based animation
 * Useful for static headers or backgrounds
 */

import { ParticleMorph } from '../src';

export default function WithoutScrollExample() {
  return (
    <ParticleMorph
      modelPath="/models/sphere.glb"
      targetParticleCount={5000}
      scroll={{ enabled: false }}
      rotation={{
        enabled: true,
        autoRotateSpeed: 0.005  // Faster auto-rotation
      }}
      colors={{
        primary: '#00ffff',
        secondary: '#0088ff'
      }}
    />
  );
}

