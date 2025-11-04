# Changelog

All notable changes to this project will be documented in this file.

## [1.4.2] - 2025-11-04

### Fixed
- **Interactive Prop Bug**: Fixed issue where particles were still interactible even when `interactive={false}`
  - `useInteractiveRotation` hook now properly respects the `interactive` flag
  - Pointer events are completely disabled when interactive is false
  - Momentum effects are disabled when interactive is false
  - Auto-rotation still works as expected when interactive is disabled

## [1.4.1] - 2025-11-04

### Added
- **Camera-Relative Rotation**: Interactive rotation now works relative to the camera's perspective
  - Drag direction always matches visual movement regardless of camera angle
  - Uses quaternion-based rotation for smooth, natural motion
  - Enhanced momentum with velocity smoothing for better feel
  
- **Initial Rotation Configuration**: Set starting rotation for your particle system
  - New `rotation.x`, `rotation.y`, `rotation.z` props for initial rotation in radians
  - Particles start at the exact angle you specify
  
- **Per-Axis Auto-Rotation**: Fine control over automatic rotation
  - New `rotation.autoRotate.speed` object with `x`, `y`, `z` properties
  - Set different rotation speeds for each axis independently
  - Create complex spinning effects (e.g., tumbling, spinning on multiple axes)
  
- **Interactive Toggle**: New `interactive` prop to enable/disable user interaction
  - Default: `false` (non-interactive)
  - Set to `true` to allow drag-to-rotate
  - Cursor automatically changes to grab/grabbing when enabled
  
- **Particle Glow Effect**: Random pulsing glow on particles
  - New `glow` configuration object
  - `intensity`: Controls glow brightness (default: 1.5)
  - `frequency`: Controls pulse speed (default: 1.0)
  - `coverage`: Percentage of particles that glow, 0-1 (default: 0.25)
  - Each particle has unique random glow phase and speed
  - Exponential glow halo extends beyond particle core
  - Glowing particles are 50% larger for better visibility

### Changed (Breaking Changes)
- **Rotation API Restructured**: The rotation configuration has been completely redesigned
  - `rotation.enabled` is **removed** → Use `interactive` prop instead
  - `rotation.dampingFactor` → `rotation.autoRotate.dampingFactor`
  - `rotation.autoRotateSpeed` → `rotation.autoRotate.speed` (object with x, y, z)
  - Added `rotation.x`, `rotation.y`, `rotation.z` for initial rotation
  
### Migration Guide
```tsx
// OLD (v1.x)
<ParticleMorph
  rotation={{
    enabled: true,
    dampingFactor: 0.08,
    autoRotateSpeed: 0.001
  }}
/>

// NEW (v2.0)
<ParticleMorph
  interactive={true}
  rotation={{
    x: 0,
    y: 0,
    z: 0,
    autoRotate: {
      enabled: true,
      dampingFactor: 0.05,
      speed: { x: 0, y: 0.001, z: 0 }
    }
  }}
/>
```

### Improved
- **Better Drag Behavior**: Quaternion-based rotation prevents gimbal lock
- **Smoother Momentum**: Velocity smoothing creates more natural deceleration
- **Auto-rotation Transition**: Seamless switch between momentum and auto-rotation
- **Shader Performance**: Glow effect calculated efficiently per-particle in GPU

### Technical Details
- Updated `useInteractiveRotation` hook with quaternion math
- Added fragment shader uniforms: `uGlowIntensity`, `uGlowFrequency`, `uGlowCoverage`
- Added vertex shader varying: `vGlowSeed` for per-particle randomness
- Enhanced fragment shader with exponential glow halo and brightness boost

## [1.3.0] - 2025-01-04

### Added
- **Default Particle Color**: New `particleColor` prop allows setting a default color for all stages
  - Individual stage colors take priority over the default
  - Simplifies color management for single-color effects
  - Defaults to white (#ffffff) when not specified

### Changed
- **Removed `segments` Parameter**: Simplified API by removing the unnecessary segments configuration
  - Now uses optimal default value of 32 segments internally
  - Reduces API complexity and boilerplate
  - **Breaking Change**: Remove `segments` from your shape configurations

### Improved
- **Explosion Effects**: Significantly enhanced explosion realism
  - Physics-based motion with exponential ease-out (fast burst that decelerates)
  - Realistic implosion with accelerating motion (gravity-like pull)
  - Variable particle speeds (some particles fly faster than others)
  - Added turbulence and rotational effects during explosion
  - More chaotic scattering (60% randomness vs 30% before)
  - Faster explosion trigger (immediate burst)

- **Sphere Particle Distribution**: Fixed grid pattern issue
  - Implemented Fibonacci sphere algorithm for uniform distribution
  - Eliminates visible latitude/longitude lines
  - Particles now spread naturally across sphere surface
  - No more grid patterns when particle animation is disabled

- **Major Performance Optimizations**:
  - Shader optimizations: reduced normalize() calls, pre-computed values
  - Scroll handler throttling (~120fps max) with requestAnimationFrame
  - Smart uniform updates (only update when progress changes > 0.001)
  - Reduced device pixel ratio from 2.0 to 1.5
  - Disabled antialiasing for better GPU performance
  - Medium precision shaders instead of high precision
  - Combined multiplication operations in shaders
  - Cleaner explosion calculations with cached values

### Technical Details
- Updated vertex shader with optimized explosion calculations
- Improved scroll handling with RAF batching and throttling
- Enhanced Canvas configuration for better performance
- Fixed color system to respect stage color priority
- Removed segments from all type definitions and utilities

## [1.2.0] - 2025-11-02

### Added
- **Per-Particle Damping Animation**: Each particle now has its own unique damping animation with individual movement patterns
  - New `particleAnimation` configuration prop on `ParticleMorph` component
  - Added `dampingFactor`: Controls overall animation intensity (0.0 to 1.0)
  - Added `driftSpeed`: Controls the speed of dust-like drift movement
  - Added `driftAmplitude`: Controls how far particles drift from their position
  - Particles create natural, organic dust-like floating effects
  - Animation fully rotates with the object while maintaining individual drift motion
  - Each particle uses unique random seeds for varied behavior
  - Animation is always visible (20% base) and increases when particles scatter

- **Random Particle Sizes**: Each particle now has a unique random size for more natural appearance
  - Particle sizes vary from 0.2x to 2.0x the base particle size by default
  - New `particleSizeRange` prop with configurable `min` and `max` values
  - Creates depth and visual interest with varied particle scales
  - Automatically applied to all particles
  - Full control over size variation range

### Changed
- Updated vertex shader to include time-based per-particle animation
- Enhanced `modelToParticles` utility to generate `animationSeed`, `dampingFactor`, and `particleScale` attributes
- Updated all TypeScript types to include new `ParticleAnimationConfig` interface
- Modified shader size calculation to use per-particle scale multiplier

### Technical Details
- Added new shader uniforms: `uTime`, `uAnimationEnabled`, `uDampingStrength`, `uDriftSpeed`, `uDriftAmplitude`
- Added new vertex attributes: `animationSeed` (vec3), `dampingFactor` (float), `particleScale` (float)
- Optimized shader with conditional branching for optional animation
- Animation scales with scroll progress for enhanced visual effects

## [1.1.1] - Previous Version

### Features
- Model particlization with GLTF support
- Smooth morphing transitions
- Interactive rotation with damping
- Scroll integration
- Glow effects
- Full TypeScript support

