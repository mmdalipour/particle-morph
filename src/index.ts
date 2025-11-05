// Main component
export { ParticleMorph } from './components/ParticleMorph';

// Hooks
export { 
  useInteractiveRotation, 
  useScrollProgress, 
  useMultiShapeMorphGeometry,
  useResponsive,
  resolveResponsiveValue
} from './hooks';

// Utils
export { generateShapeParticles } from './utils/shapeToParticles';
export { generateMultiShapeParticles } from './utils/multiShapeToParticles';
export type { ShapeType, ShapeConfig as ShapeConfigUtil } from './utils/shapeToParticles';
export type { ResolvedShapeStage } from './utils/multiShapeToParticles';

// Types
export type {
  ParticleMorphConfig,
  ParticleGeometryResult,
  UseInteractiveRotationReturn,
  RotationConfig,
  ParticleAnimationConfig,
  ResponsiveValue,
  ShapeConfig,
  ShapeStage
} from './types';

