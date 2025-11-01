# 3D Particle Morphing Portfolio

Advanced 3D particle effect for portfolio landing page where a 3D object is rendered as particles that disperse on scroll and gather back when scrolling to the original position.

## Features

- **Scroll-Driven Animation**: Particles disperse as you scroll down (over 2 viewport heights) and gather back when scrolling up
- **Custom 3D Models**: Support for any GLTF/GLB 3D model - easily swap models via configuration
- **Smooth Animations**: GSAP-powered smooth scrolling with no jitter
- **Desktop-Only**: Optimized for desktop with mobile fallback for performance
- **Ethereal Glow**: Cyan/blue particles with bloom post-processing effect
- **~5000 Particles**: High-quality particle system with optimal performance

## Tech Stack

- **Next.js 14** (App Router)
- **React Three Fiber** (@react-three/fiber)
- **Three.js** (3D rendering)
- **GSAP** (Smooth animations)
- **TypeScript**
- **Custom GLSL Shaders** (Particle morphing)
- **@react-three/postprocessing** (Bloom effects)

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the particle effect.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
portfolio-web-app/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ParticleHero.tsx  # Main component (viewport detection)
│   ├── ParticleScene.tsx # Canvas + post-processing setup
│   ├── ParticleSystem.tsx # Core particle rendering
│   └── HeroFallback.tsx  # Mobile fallback
├── hooks/                 # Custom React hooks
│   ├── useScrollProgress.ts    # Scroll tracking
│   └── useParticleGeometry.ts  # Model loading
├── utils/                 # Utility functions
│   └── modelToParticles.ts    # Model conversion logic
├── shaders/               # GLSL shaders
│   ├── particleMorph.vert.glsl # Vertex shader
│   └── particleMorph.frag.glsl # Fragment shader
├── config/                # Configuration
│   └── particle-scene.config.ts # Scene settings
├── types/                 # TypeScript types
│   ├── particle.types.ts
│   └── glsl.d.ts
└── public/
    └── models/            # 3D models
        └── low-poly-circle.gltf
```

## How to Swap 3D Models

The system is designed to work with any 3D model. To use your own model (like a 3D face):

### Step 1: Prepare Your 3D Model

1. Export your model as `.glb` or `.gltf` format from Blender, Maya, or other 3D software
2. Recommended vertex count: 2,000-10,000 vertices (for good particle distribution)
3. Ensure the model is:
   - Centered at origin (0, 0, 0)
   - Appropriately scaled (fits comfortably in viewport)
   - Front-facing if it's a face/character

### Step 2: Add Model to Project

Place your model file in `public/models/`:

```bash
public/models/
├── low-poly-circle.gltf  # Default model
└── your-model.glb        # Your new model
```

### Step 3: Update Configuration

Edit `config/particle-scene.config.ts`:

```typescript
export const particleSceneConfig: ParticleConfig = {
  modelPath: '/models/your-model.glb',  // Update this path
  targetParticleCount: 5000,
  dispersalRadius: 20,  // Adjust if needed
  // ... other settings
};
```

### Step 4: Adjust Settings (Optional)

Depending on your model's size and complexity, you may want to tune:

- **dispersalRadius**: How far particles spread (try 15-25)
- **particleSize**: Size of individual particles (try 2-4)
- **camera.position**: Camera distance (default: [0, 0, 10])
- **targetParticleCount**: Number of particles (5000 recommended)

### Step 5: Refresh

```bash
npm run dev
```

Your new model will now be rendered as particles!

## Configuration Options

All settings are in `config/particle-scene.config.ts`:

```typescript
{
  modelPath: '/models/low-poly-circle.gltf',  // Path to 3D model
  targetParticleCount: 5000,                  // Number of particles
  dispersalRadius: 20,                        // Spread distance
  colors: {
    primary: '#00ffff',                       // Cyan glow
    secondary: '#0088ff'                      // Blue glow
  },
  particleSize: 3,                           // Particle size
  bloom: {
    strength: 1.5,                           // Bloom intensity
    radius: 0.8,                             // Bloom radius
    threshold: 0.1                           // Bloom threshold
  },
  camera: {
    position: [0, 0, 10],                    // Camera position
    fov: 75                                  // Field of view
  }
}
```

## How It Works

1. **Model Loading**: GLTF model is loaded and vertices are extracted
2. **Particle Generation**: Each vertex becomes a particle; additional particles are sampled on mesh surfaces if needed
3. **Scattered Positions**: For each particle, a "scattered" position is calculated radially from the model center
4. **Shader Morphing**: Custom GLSL shaders interpolate between "formed" and "scattered" positions based on scroll progress
5. **Scroll Tracking**: GSAP smooths scroll position and converts it to 0-1 progress value
6. **Post-Processing**: Bloom effect adds ethereal glow to particles

## Performance

- **Target**: 60 FPS on mid-range GPUs (GTX 1660 or equivalent)
- **Desktop-Only**: Automatically shows fallback on mobile/tablet (< 1024px width)
- **~5000 Particles**: Balanced for visual quality and performance
- **GPU Acceleration**: All particle calculations run on GPU via shaders

## Browser Support

- Chrome/Edge (Chromium) - ✅ Fully supported
- Firefox - ✅ Fully supported
- Safari - ✅ Fully supported (WebGL required)
- Mobile - ⚠️ Shows static fallback (by design)

## Troubleshooting

### Particles don't appear
- Check browser console for errors
- Verify model path is correct in config
- Ensure model file exists in `public/models/`

### Model looks wrong
- Check model is centered at origin in 3D software
- Adjust camera position in config
- Verify model scale (should fit in viewport)

### Performance issues
- Reduce `targetParticleCount` (try 3000)
- Lower bloom strength
- Check if GPU acceleration is enabled in browser

### Model too spread out / too tight
- Adjust `dispersalRadius` in config
- Smaller values = tighter grouping
- Larger values = more dramatic spread

## Credits

Built with [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), and [GSAP](https://greensock.com/gsap/).

Inspired by advanced particle effects like those on [ompfinex.com](https://www.ompfinex.com).

## License

MIT
