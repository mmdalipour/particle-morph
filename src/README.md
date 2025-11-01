# particle-morph

A highly configurable React component for creating stunning 3D particle morph effects with Three.js and React Three Fiber.

## Features

- 🎨 **Model Particlization** - Convert any 3D GLTF model into interactive particles
- 🎭 **Smooth Morphing** - Seamless transitions between particle states
- 🖱️ **Interactive Rotation** - Drag to rotate with inertia and smooth damping
- 📜 **Scroll Integration** - Animate particles based on scroll progress
- 💫 **Bloom Effects** - Beautiful glow effects with postprocessing
- ⚙️ **Highly Configurable** - Customize colors, sizes, behaviors, and more
- 🎯 **TypeScript** - Full TypeScript support with comprehensive types
- 📦 **Modular** - Use individual components and hooks as needed

## Installation

```bash
npm install particle-morph
# or
yarn add particle-morph
# or
pnpm add particle-morph
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install react react-dom three @react-three/fiber @react-three/drei @react-three/postprocessing gsap postprocessing
```

## Quick Start

```tsx
import { ParticleMorph } from 'particle-morph';

function App() {
  return (
    <ParticleMorph
      modelPath="/models/your-model.glb"
      targetParticleCount={5000}
      colors={{
        primary: '#00ffff',
        secondary: '#0088ff'
      }}
    />
  );
}
```

## API Reference

### ParticleMorph Component

The main component for creating particle morph effects.

#### Props

```typescript
interface ParticleMorphConfig {
  modelPath: string;                    // Path to GLTF model (required)
  targetParticleCount?: number;         // Number of particles (default: 5000)
  dispersalRadius?: number;             // Particle spread distance (default: 40)
  colors?: {
    primary?: string;                   // Primary color (default: '#00ffff')
    secondary?: string;                 // Secondary color (default: '#0088ff')
  };
  particleSize?: number;                // Particle size (default: 3)
  bloom?: {
    enabled?: boolean;                  // Enable bloom effect (default: true)
    strength?: number;                  // Bloom intensity (default: 1.5)
    radius?: number;                    // Bloom radius (default: 0.8)
    threshold?: number;                 // Bloom threshold (default: 0.1)
  };
  camera?: {
    position?: [number, number, number]; // Camera position (default: [0, 0, 10])
    fov?: number;                       // Field of view (default: 75)
  };
  rotation?: {
    enabled?: boolean;                  // Enable rotation (default: true)
    dampingFactor?: number;             // Rotation smoothness (default: 0.08)
    autoRotateSpeed?: number;           // Auto-rotation speed (default: 0.001)
  };
  scroll?: {
    enabled?: boolean;                  // Enable scroll animation (default: true)
    triggerHeight?: number;             // Viewports to scroll (default: 2)
  };
  background?: string;                  // Background color (default: '#000000')
  className?: string;                   // CSS class name
  style?: React.CSSProperties;          // Inline styles
}
```

### ParticleModel Component

Lower-level component for rendering particles without the Canvas wrapper.

```tsx
import { Canvas } from '@react-three/fiber';
import { ParticleModel } from 'particle-morph';

function CustomScene() {
  return (
    <Canvas>
      <ParticleModel
        modelPath="/models/your-model.glb"
        targetParticleCount={5000}
        colors={{ primary: '#00ffff', secondary: '#0088ff' }}
        scrollProgress={0.5}
      />
    </Canvas>
  );
}
```

### Hooks

#### useParticleGeometry

Load and convert a GLTF model to particle geometry.

```tsx
import { useParticleGeometry } from 'particle-morph';

const { geometry, isLoading, error } = useParticleGeometry(
  '/models/your-model.glb',
  5000,  // particle count
  40     // dispersal radius
);
```

#### useInteractiveRotation

Add interactive rotation with damping and inertia.

```tsx
import { useInteractiveRotation } from 'particle-morph';

const { rotation, onPointerDown, onPointerMove, onPointerUp, isDragging } = 
  useInteractiveRotation(0.08, 0.001);
```

#### useScrollProgress

Track scroll position as a smooth 0-1 progress value.

```tsx
import { useScrollProgress } from 'particle-morph';

const progress = useScrollProgress(2); // 2 viewport heights
```

### Utils

#### convertModelToParticles

Utility function to convert a Three.js Group to particle BufferGeometry.

```tsx
import { convertModelToParticles } from 'particle-morph';
import * as THREE from 'three';

const geometry = convertModelToParticles(model, 5000, 40);
```

#### preloadModel

Preload a GLTF model for better performance.

```tsx
import { preloadModel } from 'particle-morph';

preloadModel('/models/your-model.glb');
```

## Examples

### Basic Usage

```tsx
import { ParticleMorph } from 'particle-morph';

export default function Hero() {
  return (
    <ParticleMorph
      modelPath="/models/your-model.glb"
      targetParticleCount={5000}
    />
  );
}
```

### Custom Colors and Effects

```tsx
<ParticleMorph
  modelPath="/models/your-model.glb"
  colors={{
    primary: '#ff00ff',
    secondary: '#00ff00'
  }}
  bloom={{
    strength: 2.0,
    radius: 1.0
  }}
  particleSize={4}
/>
```

### Without Scroll Animation

```tsx
<ParticleMorph
  modelPath="/models/your-model.glb"
  scroll={{ enabled: false }}
  rotation={{ autoRotateSpeed: 0.005 }}
/>
```

### Custom Camera Position

```tsx
<ParticleMorph
  modelPath="/models/your-model.glb"
  camera={{
    position: [5, 5, 15],
    fov: 60
  }}
/>
```

### Using Individual Components

```tsx
import { Canvas } from '@react-three/fiber';
import { ParticleModel, useScrollProgress } from 'particle-morph';

function CustomScene() {
  const progress = useScrollProgress(2);

  return (
    <Canvas>
      <ParticleModel
        modelPath="/models/your-model.glb"
        scrollProgress={progress}
        colors={{ primary: '#00ffff', secondary: '#0088ff' }}
      />
      {/* Add your own lights, other objects, etc. */}
    </Canvas>
  );
}
```

## Requirements

- React 18+
- Three.js 0.160+
- React Three Fiber 8+
- Modern browser with WebGL support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

