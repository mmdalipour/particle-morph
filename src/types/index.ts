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
  x?: number; // Initial rotation on X axis in radians (default: 0)
  y?: number; // Initial rotation on Y axis in radians (default: 0)
  z?: number; // Initial rotation on Z axis in radians (default: 0)
  autoRotate?: {
    enabled?: boolean; // Enable auto-rotation when stopped (default: true)
    dampingFactor?: number; // Controls auto-rotation smoothness (default: 0.05)
    speed?: {
      x?: number; // Auto-rotation speed on X axis in radians/frame (default: 0)
      y?: number; // Auto-rotation speed on Y axis in radians/frame (default: 0)
      z?: number; // Auto-rotation speed on Z axis in radians/frame (default: 0)
    };
  };
}

// Particle animation config
export interface ParticleAnimationConfig {
  enabled?: boolean;
  dampingFactor?: number;
  driftSpeed?: number;
  driftAmplitude?: number;
}

// Responsive value type - can be a direct value or object with pixel breakpoints as keys
// This union type allows both the original value type T and responsive breakpoint objects
// Examples:
//   ResponsiveValue<number> accepts: 5000 OR { 0: 3000, 768: 6000, 1024: 10000 }
//   ResponsiveValue<[number, number, number]> accepts: [0, 0, 10] OR { 0: [0, 0, 15], 1024: [0, 0, 10] }
export type ResponsiveValue<T> = T | { [breakpoint: number]: T }

// Shape configuration for geometric morphing
export interface ShapeConfig {
  type: 'sphere' | 'box' | 'torus' | 'cone' | 'cylinder' | 'dodecahedron' | 'octahedron' | 'tetrahedron' | 'model';
  size?: ResponsiveValue<number>; // Size of the shape (default: 5) - can be responsive
  modelPath?: string; // Path to 3D model file (required when type is 'model')
}

// Multi-stage shape morphing
export interface ShapeStage {
  shape: ShapeConfig;
  scrollStart: number; // 0 to 1
  scrollEnd: number;   // 0 to 1
  color?: string; // Color for this stage (hex or CSS color)
  explosion?: {
    enabled: boolean;
    radius: ResponsiveValue<number>; // Explosion radius - can be responsive
  };
}

// Core particle morph configuration
export interface ParticleMorphConfig {
  stages: ShapeStage[];
  targetParticleCount?: ResponsiveValue<number>;
  particleColor?: string; // Default color for all stages (can be overridden per stage)
  particleSize?: ResponsiveValue<number>;
  particleSizeRange?: {
    min?: number;
    max?: number;
  };
  camera?: {
    position?: ResponsiveValue<[number, number, number]>;
    fov?: ResponsiveValue<number>;
  };
  interactive?: boolean; // Enable user interaction (drag to rotate), default: false
  rotation?: RotationConfig;
  particleAnimation?: ParticleAnimationConfig;
  glow?: {
    enabled?: boolean;
    intensity?: number; // Glow brightness multiplier (default: 1.5)
    frequency?: number; // Glow pulse speed (default: 1.0)
    coverage?: number; // Percentage of particles that glow 0-1 (default: 0.25 = 25%)
  };
  className?: string;
  style?: React.CSSProperties;
}

