// Main components
export { ParticleMorph } from './components/ParticleMorph';
export { ParticleModel } from './components/ParticleModel';

// Hooks
export { 
  useInteractiveRotation, 
  useScrollProgress, 
  useParticleGeometry,
  preloadModel 
} from './hooks';

// Utils
export { convertModelToParticles } from './utils/modelToParticles';

// Types
export type {
  ParticleMorphConfig,
  ParticleGeometryResult,
  UseInteractiveRotationReturn,
  RotationConfig,
  ScrollConfig,
  ParticleModelProps
} from './types';

