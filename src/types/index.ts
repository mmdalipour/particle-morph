import * as THREE from 'three';

// Particle geometry result
export interface ParticleGeometryResult {
  geometry: THREE.BufferGeometry | null;
  isLoading: boolean;
  error: Error | null;
}

// Interactive rotation hook return type
export interface UseInteractiveRotationReturn {
  rotation: THREE.Euler;
  onPointerDown: (event: any) => void;
  onPointerMove: (event: any) => void;
  onPointerUp: () => void;
  isDragging: boolean;
}

// Rotation config
export interface RotationConfig {
  enabled?: boolean;
  dampingFactor?: number;
  autoRotateSpeed?: number;
}

// Particle animation config
export interface ParticleAnimationConfig {
  enabled?: boolean;
  dampingFactor?: number;
  driftSpeed?: number;
  driftAmplitude?: number;
}

// Shape configuration for geometric morphing
export interface ShapeConfig {
  type: 'sphere' | 'box' | 'torus' | 'cone' | 'cylinder' | 'dodecahedron' | 'octahedron' | 'tetrahedron' | 'model';
  size?: number;
  segments?: number;
  modelPath?: string; // Path to 3D model file (required when type is 'model')
}

// Multi-stage shape morphing
export interface ShapeStage {
  shape: ShapeConfig;
  scrollStart: number; // 0 to 1
  scrollEnd: number;   // 0 to 1
  explosion?: {
    enabled: boolean;
    radius: number;
  };
}

// Core particle morph configuration
export interface ParticleMorphConfig {
  stages: ShapeStage[];
  targetParticleCount?: number;
  colors?: {
    primary?: string;
    secondary?: string;
  };
  particleSize?: number;
  particleSizeRange?: {
    min?: number;
    max?: number;
  };
  bloom?: {
    enabled?: boolean;
    strength?: number;
    radius?: number;
    threshold?: number;
  };
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  rotation?: {
    enabled?: boolean;
    dampingFactor?: number;
    autoRotateSpeed?: number;
  };
  particleAnimation?: {
    enabled?: boolean;
    dampingFactor?: number;
    driftSpeed?: number;
    driftAmplitude?: number;
  };
  background?: string;
  className?: string;
  style?: React.CSSProperties;
}

