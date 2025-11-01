/**
 * Basic Usage Example
 * 
 * This example shows the simplest way to use ParticleMorph
 */

import { ParticleMorph } from '../src';

export default function BasicExample() {
  return (
    <ParticleMorph
      modelPath="/models/sphere.glb"
      targetParticleCount={5000}
    />
  );
}

