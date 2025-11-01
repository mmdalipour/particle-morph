/**
 * Custom Colors Example
 * 
 * This example demonstrates how to customize particle colors
 */

import { ParticleMorph } from '../src';

export default function CustomColorsExample() {
  return (
    <ParticleMorph
      modelPath="/models/sphere.glb"
      targetParticleCount={5000}
      colors={{
        primary: '#ff00ff',    // Magenta
        secondary: '#00ff00'   // Green
      }}
      bloom={{
        enabled: true,
        strength: 2.0,
        radius: 1.0
      }}
    />
  );
}

