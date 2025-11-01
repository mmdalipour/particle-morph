import * as THREE from 'three';

export interface ParticleConfig {
  modelPath: string;
  targetParticleCount: number;
  dispersalRadius: number;
  colors: {
    primary: string;
    secondary: string;
  };
  particleSize: number;
  bloom: {
    strength: number;
    radius: number;
    threshold: number;
  };
  camera: {
    position: [number, number, number];
    fov: number;
  };
  rotation: {
    dampingFactor: number;
    autoRotateSpeed: number;
  };
}

export interface ParticleGeometryResult {
  geometry: THREE.BufferGeometry | null;
  isLoading: boolean;
  error: Error | null;
}
