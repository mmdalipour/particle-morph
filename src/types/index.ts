import * as THREE from 'three';

// Core particle configuration
export interface ParticleMorphConfig {
  modelPath: string;
  targetParticleCount?: number;
  dispersalRadius?: number;
  colors?: {
    primary?: string;
    secondary?: string;
  };
  particleSize?: number;
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
  scroll?: {
    enabled?: boolean;
    triggerHeight?: number;
  };
  background?: string;
  className?: string;
  style?: React.CSSProperties;
}

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

// Scroll config
export interface ScrollConfig {
  enabled?: boolean;
  triggerHeight?: number;
}

// Particle model props
export interface ParticleModelProps {
  modelPath: string;
  targetParticleCount?: number;
  dispersalRadius?: number;
  colors?: {
    primary?: string;
    secondary?: string;
  };
  particleSize?: number;
  scrollProgress?: number;
  rotationConfig?: RotationConfig;
  onDraggingChange?: (isDragging: boolean) => void;
}

