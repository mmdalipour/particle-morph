# @mmdalipour/particle-morph

A highly configurable React component for creating stunning 3D particle morph effects with Three.js and React Three Fiber.

## Features

- 🎭 **Multi-Stage Morphing** - Seamlessly morph between multiple geometric shapes
- 💥 **Explosion Effects** - Realistic particle explosions with physics-based motion
- 🎨 **Custom 3D Models** - Convert any GLTF model into interactive particles
- 🌈 **Color Transitions** - Smooth color transitions between stages
- 🖱️ **Interactive Rotation** - Drag to rotate with inertia and smooth damping
- 📜 **Scroll Integration** - Animate based on scroll progress with smooth interpolation
- 💫 **Bloom Effects** - Beautiful glow effects with postprocessing
- ⚡ **Optimized Performance** - Highly optimized shaders and rendering pipeline
- 🎯 **TypeScript** - Full TypeScript support with comprehensive types
- 📦 **Tree-shakeable** - Modular exports for optimal bundle size

## Installation

```bash
npm install @mmdalipour/particle-morph
# or
yarn add @mmdalipour/particle-morph
# or
pnpm add @mmdalipour/particle-morph
```

### Peer Dependencies

```bash
npm install react react-dom three @react-three/fiber @react-three/drei @react-three/postprocessing gsap postprocessing
```

## Quick Start

```tsx
import { ParticleMorph } from '@mmdalipour/particle-morph';

function App() {
  return (
    <ParticleMorph
      stages={[
        {
          shape: { type: 'sphere', size: 5 },
          scrollStart: 0,
          scrollEnd: 0.5,
          color: '#00ffff',
        },
        {
          shape: { type: 'box', size: 5 },
          scrollStart: 0.5,
          scrollEnd: 1,
          color: '#ff00ff',
        },
      ]}
      targetParticleCount={5000}
      particleColor="#00ffff"
    />
  );
}
```

## API Reference

### ParticleMorph Component

#### Props

```typescript
interface ParticleMorphConfig {
  // Required
  stages: ShapeStage[];                // Array of shape stages to morph through

  // Optional
  targetParticleCount?: number;        // Number of particles (default: 5000)
  particleColor?: string;              // Default color for all stages (default: '#ffffff')
  particleSize?: number;               // Base particle size (default: 3)
  particleSizeRange?: {
    min?: number;                      // Min size multiplier (default: 0.2)
    max?: number;                      // Max size multiplier (default: 2.0)
  };
  bloom?: {
    enabled?: boolean;                 // Enable bloom (default: true)
    strength?: number;                 // Bloom intensity (default: 1.5)
    radius?: number;                   // Bloom radius (default: 0.8)
    threshold?: number;                // Bloom threshold (default: 0.1)
  };
  camera?: {
    position?: [number, number, number]; // Camera position (default: [0, 0, 10])
    fov?: number;                      // Field of view (default: 75)
  };
  rotation?: {
    x?: number;                        // Initial rotation X in radians (default: 0)
    y?: number;                        // Initial rotation Y in radians (default: 0)
    z?: number;                        // Initial rotation Z in radians (default: 0)
    autoRotate?: {
      enabled?: boolean;               // Enable auto-rotation (default: true)
      dampingFactor?: number;          // Auto-rotation smoothness (default: 0.05)
      speed?: {
        x?: number;                    // Auto-rotate X speed (default: 0)
        y?: number;                    // Auto-rotate Y speed (default: 0)
        z?: number;                    // Auto-rotate Z speed (default: 0)
      };
    };
  };
  particleAnimation?: {
    enabled?: boolean;                 // Enable drift animation (default: true)
    dampingFactor?: number;            // Animation strength (default: 0.5)
    driftSpeed?: number;               // Drift speed (default: 0.5)
    driftAmplitude?: number;           // Drift amount (default: 0.15)
  };
  className?: string;                  // CSS class
  style?: React.CSSProperties;         // Inline styles
}

interface ShapeStage {
  shape: ShapeConfig;                  // Shape configuration
  scrollStart: number;                 // Start scroll position (0-1)
  scrollEnd: number;                   // End scroll position (0-1)
  color?: string;                      // Stage color (overrides particleColor)
  explosion?: {
    enabled: boolean;                  // Enable explosion effect
    radius: number;                    // Explosion radius
  };
}

interface ShapeConfig {
  type: 'sphere' | 'box' | 'torus' | 'cone' | 'cylinder' | 
        'dodecahedron' | 'octahedron' | 'tetrahedron' | 'model';
  size?: number;                       // Shape size (default: 5)
  modelPath?: string;                  // Required when type is 'model'
}
```

## Examples

### Basic Morph

```tsx
<ParticleMorph
  stages={[
    {
      shape: { type: 'sphere', size: 5 },
      scrollStart: 0,
      scrollEnd: 0.5,
      color: '#00ffff',
    },
    {
      shape: { type: 'box', size: 5 },
      scrollStart: 0.5,
      scrollEnd: 1,
      color: '#ff00ff',
    },
  ]}
  targetParticleCount={5000}
/>
```

### Explosion Effect

```tsx
<ParticleMorph
  stages={[
    {
      shape: { type: 'box', size: 5 },
      scrollStart: 0,
      scrollEnd: 0.5,
      color: '#00ffff',
    },
    {
      shape: { type: 'sphere', size: 5 },
      scrollStart: 0.5,
      scrollEnd: 1,
      color: '#ff00ff',
      explosion: {
        enabled: true,
        radius: 50,
      },
    },
  ]}
  targetParticleCount={10000}
/>
```

### Multi-Stage Morphing

```tsx
<ParticleMorph
  stages={[
    { shape: { type: 'sphere', size: 5 }, scrollStart: 0, scrollEnd: 0.25, color: '#00ffff' },
    { shape: { type: 'torus', size: 3 }, scrollStart: 0.25, scrollEnd: 0.5, color: '#0088ff' },
    { shape: { type: 'dodecahedron', size: 5 }, scrollStart: 0.5, scrollEnd: 0.75, color: '#ff00ff' },
    { shape: { type: 'octahedron', size: 5 }, scrollStart: 0.75, scrollEnd: 1, color: '#ffff00' },
  ]}
  targetParticleCount={8000}
  particleAnimation={{
    enabled: true,
    dampingFactor: 0.8,
    driftSpeed: 1.0,
    driftAmplitude: 0.3,
  }}
/>
```

### Custom 3D Model

```tsx
<ParticleMorph
  stages={[
    {
      shape: { type: 'model', modelPath: '/models/your-model.glb' },
      scrollStart: 0,
      scrollEnd: 0.5,
      color: '#00ffff',
    },
    {
      shape: { type: 'sphere', size: 5 },
      scrollStart: 0.5,
      scrollEnd: 1,
      color: '#ff00ff',
      explosion: { enabled: true, radius: 40 },
    },
  ]}
  targetParticleCount={8000}
/>
```

### High Performance Settings

```tsx
<ParticleMorph
  stages={[...]}
  targetParticleCount={5000}
  bloom={{
    enabled: true,
    strength: 1.2,
    threshold: 0.2,
  }}
  particleAnimation={{
    enabled: true,
    dampingFactor: 0.4,
  }}
/>
```

## Available Shapes

- `sphere` - Perfect sphere with uniform particle distribution
- `box` - Cubic shape
- `torus` - Donut shape
- `cone` - Cone shape
- `cylinder` - Cylindrical shape
- `dodecahedron` - 12-faced polyhedron
- `octahedron` - 8-faced polyhedron
- `tetrahedron` - 4-faced polyhedron
- `model` - Custom GLTF/GLB 3D model

## Performance Tips

1. **Particle Count**: Start with 5000-8000 particles. Adjust based on device performance
2. **Bloom**: Reduce bloom strength or disable on lower-end devices
3. **Particle Animation**: Disable or reduce drift for better performance
4. **Stage Count**: Limit to 4 stages maximum for optimal performance

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Requires WebGL 2.0 support

## Version History

### 1.3.0
- ✨ Added `particleColor` prop for default particle color
- 🎨 Removed `segments` parameter (now uses optimal defaults)
- 💥 Improved explosion physics with realistic motion
- ⚡ Major performance optimizations (shader improvements, throttled scroll, reduced DPR)
- 🌐 Fixed sphere particle distribution with Fibonacci algorithm
- 🔧 Better scroll handling with requestAnimationFrame

### 1.2.0
- Multi-stage morphing support
- Explosion effects
- Color transitions

### 1.1.0
- Interactive rotation
- Bloom effects
- Performance improvements

### 1.0.0
- Initial release

## License

MIT © [Mohammad Alipour](https://github.com/mmdalipour)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [GitHub Repository](https://github.com/mmdalipour/particle-morph)
- [Report Issues](https://github.com/mmdalipour/particle-morph/issues)
- [npm Package](https://www.npmjs.com/package/@mmdalipour/particle-morph)
