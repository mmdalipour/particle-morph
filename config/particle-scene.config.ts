import { ParticleConfig } from '@/types/particle.types';

export const particleSceneConfig: ParticleConfig = {
  modelPath: '/models/sphere.glb',
  targetParticleCount: 5000,
  dispersalRadius: 20,
  colors: {
    primary: '#00ffff',
    secondary: '#0088ff'
  },
  particleSize: 3,
  bloom: {
    strength: 1.5,
    radius: 0.8,
    threshold: 0.1
  },
  camera: {
    position: [0, 0, 10],
    fov: 75
  },
  rotation: {
    dampingFactor: 0.08,
    autoRotateSpeed: 0.001
  }
};
