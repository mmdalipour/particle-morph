# particle-morph

A highly configurable React component library for creating stunning 3D particle morph effects with Three.js and React Three Fiber. Now refactored as a publishable npm package!

## 🎯 Features

- 🎨 **Model Particlization** - Convert any 3D GLTF model into interactive particles
- 🔷 **Shape Morphing** - Morph particles between geometric shapes (sphere, cube, torus, etc.)
- 🎭 **Smooth Morphing** - Seamless transitions between particle states
- ✨ **Dust-Like Animation** - Per-particle damping with unique movement patterns
- 🖱️ **Interactive Rotation** - Drag to rotate with inertia and smooth damping
- 📜 **Scroll Integration** - Animate particles based on scroll progress
- 💫 **Bloom Effects** - Beautiful glow effects with postprocessing
- ⚙️ **Highly Configurable** - Customize colors, sizes, behaviors, and more
- 🎯 **TypeScript** - Full TypeScript support with comprehensive types
- 📦 **Modular Architecture** - Use individual components and hooks as needed
- 🚀 **NPM Ready** - Structured for easy npm publishing

## 📦 Project Structure

This project is now structured as an npm package:

```
portfolio-web-app/
├── src/                          # Package source (publishable)
│   ├── components/               # React components
│   │   ├── ParticleMorph.tsx    # Main component
│   │   ├── ParticleModel.tsx    # Model particlization component
│   │   └── index.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── useInteractiveRotation.ts
│   │   ├── useScrollProgress.ts
│   │   ├── useParticleGeometry.ts
│   │   └── index.ts
│   ├── utils/                    # Utilities
│   │   └── modelToParticles.ts
│   ├── shaders/                  # GLSL shaders
│   │   ├── particleMorph.vert.glsl
│   │   └── particleMorph.frag.glsl
│   ├── types/                    # TypeScript types
│   │   └── index.ts
│   ├── index.ts                  # Main entry point
│   ├── package.json              # Package metadata
│   ├── tsconfig.json            # Package TypeScript config
│   ├── .npmignore               # NPM ignore rules
│   └── README.md                # Package documentation
├── app/                          # Demo app (Next.js)
│   ├── page.tsx                 # Demo page using the package
│   ├── layout.tsx
│   └── globals.css
├── components/                   # Old components (deprecated)
├── hooks/                        # Old hooks (deprecated)
├── config/                       # Old config (deprecated)
├── public/
│   └── models/                  # 3D model files
│       └── sphere.glb
├── package.json                 # Root project config
├── tsconfig.json               # Root TypeScript config
└── next.config.js              # Next.js config
```

## 🚀 Quick Start

### Using in the Demo App

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### Using as a Package

The package is located in the `src/` directory and can be used locally:

```tsx
import { ParticleMorph } from '../src';

function App() {
  return (
    <ParticleMorph
      modelPath="/models/sphere.glb"
      targetParticleCount={5000}
      colors={{
        primary: '#00ffff',
        secondary: '#0088ff'
      }}
    />
  );
}
```

## 📚 API Documentation

### ParticleMorph Component

The main component for creating particle morph effects.

```tsx
<ParticleMorph
  modelPath="/models/skull.glb"        // Required: Path to GLTF model
  targetParticleCount={5000}           // Optional: Number of particles
  dispersalRadius={40}                 // Optional: Particle spread distance
  colors={{                            // Optional: Colors
    primary: '#00ffff',
    secondary: '#0088ff'
  }}
  particleSize={3}                     // Optional: Particle size
  particleSizeRange={{                 // Optional: Random size variation
    min: 0.2,
    max: 2.0
  }}
  bloom={{                             // Optional: Bloom effect
    enabled: true,
    strength: 1.5,
    radius: 0.8,
    threshold: 0.1
  }}
  camera={{                            // Optional: Camera config
    position: [0, 0, 10],
    fov: 75
  }}
  rotation={{                          // Optional: Rotation config
    x: 0,
    y: 0,
    z: 0,
    autoRotate: {
      enabled: true,
      dampingFactor: 0.05,
      speed: { y: 0.001 }
    }
  }}
  scroll={{                            // Optional: Scroll config
    enabled: true,
    triggerHeight: 2
  }}
  particleAnimation={{                 // Optional: Per-particle animation
    enabled: true,
    dampingFactor: 0.5,
    driftSpeed: 0.5,
    driftAmplitude: 0.15
  }}
  background="#000000"                 // Optional: Background color
/>
```

### ParticleShapeMorph Component

Morph particles between geometric shapes instead of using 3D models.

```tsx
<ParticleShapeMorph
  shapeA={{ type: 'sphere', size: 5, segments: 32 }}
  shapeB={{ type: 'box', size: 5, segments: 32 }}
  targetParticleCount={5000}
  colors={{
    primary: '#00ffff',
    secondary: '#0088ff'
  }}
  scroll={{
    enabled: true,
    triggerHeight: 2
  }}
/>
```

**Available Shapes:**
- `sphere` - Spherical shape
- `box` - Cubic/box shape
- `torus` - Donut/ring shape
- `cone` - Conical shape
- `cylinder` - Cylindrical shape
- `dodecahedron` - 12-sided polyhedron
- `octahedron` - 8-sided polyhedron
- `tetrahedron` - 4-sided polyhedron

### ParticleModel Component

Lower-level component for custom scenes.

```tsx
import { Canvas } from '@react-three/fiber';
import { ParticleModel } from '../src';

function CustomScene() {
  return (
    <Canvas>
      <ParticleModel
        modelPath="/models/sphere.glb"
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

```tsx
import { useParticleGeometry } from '../src';

const { geometry, isLoading, error } = useParticleGeometry(
  '/models/sphere.glb',
  5000,  // particle count
  40     // dispersal radius
);
```

#### useInteractiveRotation

```tsx
import { useInteractiveRotation } from '../src';

const { rotation, onPointerDown, onPointerMove, onPointerUp, isDragging } = 
  useInteractiveRotation(0.08, 0.001);
```

#### useScrollProgress

```tsx
import { useScrollProgress } from '../src';

const progress = useScrollProgress(2); // 2 viewport heights
```

## 🎨 Customization Examples

### Shape Morphing

Morph between different geometric shapes:

```tsx
// Sphere to Cube
<ParticleShapeMorph
  shapeA={{ type: 'sphere', size: 5 }}
  shapeB={{ type: 'box', size: 5 }}
  targetParticleCount={5000}
/>

// Torus to Cone
<ParticleShapeMorph
  shapeA={{ type: 'torus', size: 5 }}
  shapeB={{ type: 'cone', size: 5 }}
  colors={{
    primary: '#ff00ff',
    secondary: '#8800ff'
  }}
/>
```

### Custom Colors

```tsx
<ParticleMorph
  modelPath="/models/sphere.glb"
  colors={{
    primary: '#ff00ff',
    secondary: '#00ff00'
  }}
/>
```

### Disable Scroll Animation

```tsx
<ParticleMorph
  modelPath="/models/sphere.glb"
  scroll={{ enabled: false }}
  rotation={{
    x: 0,
    y: 0,
    z: 0,
    autoRotate: {
      enabled: true,
      dampingFactor: 0.05,
      speed: { y: 0.005 }
    }
  }}
/>
```

### Custom Camera

```tsx
<ParticleMorph
  modelPath="/models/sphere.glb"
  camera={{
    position: [5, 5, 15],
    fov: 60
  }}
/>
```

### Dust-Like Particle Animation

Each particle has its own damping animation with unique random seeds, creating a natural dust-like floating effect:

```tsx
<ParticleMorph
  modelPath="/models/sphere.glb"
  particleAnimation={{
    enabled: true,
    dampingFactor: 0.7,      // 0.0 to 1.0 - controls overall animation intensity
    driftSpeed: 0.5,          // Speed of the dust-like drift movement
    driftAmplitude: 0.15      // How far particles drift from their position
  }}
/>
```

- **dampingFactor**: Controls the overall intensity of per-particle animation (0.0 = no animation, 1.0 = full animation)
- **driftSpeed**: Speed at which particles drift (lower = slower, smoother movement)
- **driftAmplitude**: Maximum distance particles can drift from their base position
- Each particle has unique movement patterns for a natural, organic look
- Particles rotate with the object while maintaining their individual drift motion

### Custom Particle Size Range

Control the variation in particle sizes for more natural or dramatic effects:

```tsx
<ParticleMorph
  modelPath="/models/sphere.glb"
  particleSize={3}              // Base particle size
  particleSizeRange={{
    min: 0.5,                    // Minimum size multiplier (0.5x base size)
    max: 1.5                     // Maximum size multiplier (1.5x base size)
  }}
/>
```

- **min**: Minimum size multiplier (default: 0.2) - smaller values create tinier particles
- **max**: Maximum size multiplier (default: 2.0) - larger values create bigger particles
- Creates depth and visual interest with varied particle scales
- Each particle gets a unique random size within the specified range

## 📦 Publishing to NPM

To publish this package to npm:

1. Navigate to the `src/` directory:
```bash
cd src
```

2. Build the package (you'll need to set up a build process):
```bash
# Add build script to src/package.json
npm run build
```

3. Update version in `src/package.json`

4. Publish:
```bash
npm publish --access public
```

5. Install in other projects:
```bash
npm install particle-morph
```

## 🔧 How It Works

1. **Model Loading**: GLTF model loaded and vertices extracted
2. **Particle Generation**: Each vertex becomes a particle
3. **Scattered Positions**: Radial dispersion calculated for each particle
4. **Shader Morphing**: GLSL shaders interpolate between states
5. **Scroll Tracking**: GSAP smooths scroll to 0-1 progress
6. **Post-Processing**: Bloom effect adds glow

## 🎯 Use Cases

- Portfolio landing pages
- Product showcases
- Interactive art installations
- Data visualizations
- Creative web experiences

## 🔨 Tech Stack

- **React 18** + **TypeScript**
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers
- **@react-three/postprocessing** - Post-processing effects
- **GSAP** - Smooth animations
- **Custom GLSL Shaders** - Particle morphing

## 🌐 Browser Support

- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- WebGL required

## ⚡ Performance

- Optimized for 60 FPS
- GPU-accelerated particle rendering
- ~5000 particles with high performance
- Desktop optimized (with mobile detection)

## 📝 License

MIT

## 👤 Author

Mohammad

## 🤝 Contributing

Contributions welcome! This is structured for easy npm publishing and modular usage.
