// Main component
export { ParticleMorph } from './components/ParticleMorph';

// Hooks
export { 
  useInteractiveRotation, 
  useScrollProgress, 
  useMultiShapeMorphGeometry
} from './hooks';

// Utils
export { generateShapeParticles } from './utils/shapeToParticles';
export { generateMultiShapeParticles } from './utils/multiShapeToParticles';
export type { ShapeType, ShapeConfig as ShapeConfigUtil } from './utils/shapeToParticles';

// Types
export type {
  ParticleMorphConfig,
  ParticleGeometryResult,
  UseInteractiveRotationReturn,
  RotationConfig,
  ParticleAnimationConfig,
  ShapeConfig,
  ShapeStage
} from './types';

