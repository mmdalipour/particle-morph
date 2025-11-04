# Quick Start Guide

## Running Examples

### Method 1: Replace Main Demo (Recommended)
1. Choose an example from `01-basic-morph` to `08-custom-animations`
2. Copy the content from the example's `page.tsx` file
3. Paste it into `/app/page.tsx` (replace existing content)
4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

### Method 2: Create New Route
1. Create a new folder in `app/` (e.g., `app/example1/`)
2. Copy the example's `page.tsx` to your new folder
3. Navigate to `http://localhost:3000/example1`

### Method 3: Browse Examples Index
1. Open `examples/index.html` in a web browser
2. Click on any example card to see instructions

## Example Categories

### 🎯 Beginner
- **06-minimal** - Start here! Simplest configuration
- **01-basic-morph** - Two-shape morphing with standard settings

### 🎨 Visual Effects
- **03-explosion-effect** - Dramatic particle scattering
- **04-color-transitions** - Rainbow color morphing
- **08-custom-animations** - Energetic dust-like effects

### 🚀 Advanced
- **02-multi-stage** - Four-stage morphing sequence
- **05-geometric-shapes** - All available shapes showcase
- **07-high-particle-count** - Performance stress test (15K particles)
- **09-with-custom-model** - Using your own 3D models (GLTF/GLB)

## Configuration Cheat Sheet

### Basic Props
```tsx
<ParticleMorph
  stages={[...]}              // Required: Shape configurations
  targetParticleCount={5000}  // Number of particles
  particleSize={3}            // Base size of particles
/>
```

### Visual Enhancements
```tsx
particleSizeRange={{
  min: 0.1,  // Size variation
  max: 2.0
}}

glow={{
  enabled: true,
  intensity: 1.5,   // Glow brightness multiplier
  frequency: 1.0,   // Glow pulse speed
  coverage: 0.25    // Percentage of particles that glow (0-1)
}}
```

### Interactivity
```tsx
rotation={{
  x: 0,                   // Initial rotation X (radians)
  y: 0,                   // Initial rotation Y (radians)
  z: 0,                   // Initial rotation Z (radians)
  autoRotate: {
    enabled: true,
    dampingFactor: 0.05,  // Auto-rotation smoothness
    speed: {
      y: 0.001            // Auto-spin on Y axis
    }
  }
}}

particleAnimation={{
  enabled: true,
  dampingFactor: 0.5,   // Animation intensity
  driftSpeed: 0.5,       // Movement speed
  driftAmplitude: 0.15   // Movement range
}}
```

### Shape Definition
```tsx
stages={[
  {
    shape: { 
      type: "sphere",  // sphere, box, torus, cone, etc.
      size: 5, 
      segments: 32 
    },
    scrollStart: 0,
    scrollEnd: 0.5,
    color: "#00ffff",
    explosion: {      // Optional
      enabled: true,
      radius: 40
    }
  }
]}
```

## Performance Tips

| Particle Count | Use Case | Performance |
|---------------|----------|-------------|
| 3,000-5,000 | Mobile, lower-end | Excellent |
| 5,000-8,000 | Desktop, standard | Good |
| 8,000-12,000 | High-end desktop | Fair |
| 12,000+ | Performance test | Variable |

**Optimization:**
- Lower `segments` (16-32 is sufficient)
- Reduce `glow.intensity` or disable
- Lower `particleAnimation` values
- Fewer stages in morph sequence

## Troubleshooting

### Low FPS
- Reduce `targetParticleCount`
- Disable or reduce `glow` effects
- Lower `particleAnimation` values

### Particles not visible
- Check `particleSize` (increase if too small)
- Adjust `camera.position` z-value
- Verify `color` values are not too dark

### Morphing not smooth
- Ensure scroll ranges don't overlap
- Increase particle count for complex shapes
- Check browser console for errors

## Next Steps

1. Try the minimal example first (`06-minimal`)
2. Experiment with the basic morph (`01-basic-morph`)
3. Add explosion effects (`03-explosion-effect`)
4. Create your own custom configuration
5. Check the main README for full API documentation

## Resources

- **Full Documentation**: `/README.md`
- **Detailed Examples Guide**: `/examples/README.md`
- **Type Definitions**: `/src/types/index.ts`
- **Example Browser**: `/examples/index.html`

Happy morphing! 🎨✨

