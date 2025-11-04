# Particle Morph Examples

This directory contains various examples demonstrating different features and configurations of the particle-morph library.

## Examples Overview

### 01. Basic Morph
**File:** `01-basic-morph/page.tsx`  
Simple morphing between two shapes (sphere and box) with standard settings. Perfect starting point for understanding the library.

**Key Features:**
- Two-stage morphing
- Basic color transition
- Standard particle count (5,000)

### 02. Multi-Stage
**File:** `02-multi-stage/page.tsx`  
Advanced morphing through 4 different geometric shapes with color transitions.

**Key Features:**
- Four-stage morphing
- Multiple color transitions
- Enhanced particle animations
- Higher particle count (8,000)

### 03. Explosion Effect
**File:** `03-explosion-effect/page.tsx`  
Demonstrates the explosion feature where particles dramatically scatter.

**Key Features:**
- Explosion effect on second stage
- Large explosion radius (50)
- High particle count (10,000)
- Enhanced glow effects

### 04. Color Transitions
**File:** `04-color-transitions/page.tsx`  
Showcases smooth color transitions through a rainbow spectrum.

**Key Features:**
- Rainbow color scheme
- Four different shapes
- Balanced animation settings
- Strong glow effects

### 05. Geometric Shapes
**File:** `05-geometric-shapes/page.tsx`  
Complete showcase of all available geometric shapes in the library.

**Key Features:**
- 8 different geometric shapes
- Comprehensive shape library demo
- Balanced performance settings

### 06. Minimal
**File:** `06-minimal/page.tsx`  
The simplest possible configuration using default settings.

**Key Features:**
- Minimal configuration
- Default values showcase
- Perfect for quick start

### 07. High Particle Count
**File:** `07-high-particle-count/page.tsx`  
Performance test with 15,000 particles.

**Key Features:**
- 15,000 particles
- Performance benchmark
- Optimized settings for high count

### 08. Custom Animations
**File:** `08-custom-animations/page.tsx`  
Demonstrates various particle animation configurations.

**Key Features:**
- High damping factor (3.0)
- Fast drift speed (4.0)
- Large drift amplitude (1.2)
- Energetic dust-like effect

### 09. Custom 3D Model
**File:** `09-with-custom-model/page.tsx`  
Shows how to use your own GLTF/GLB 3D models in particle morphing.

**Key Features:**
- Custom 3D model loading
- Model to shape morphing
- Comprehensive model guide in subfolder README
- Example with explosion effect

## Running Examples

### In Next.js App
1. Copy the example code from any `page.tsx` file
2. Replace the content in `app/page.tsx` with the example
3. Run `npm run dev` or `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000)

### As Standalone Components
Each example can be used as a standalone component in your React application:

```tsx
import BasicMorphExample from './examples/01-basic-morph/page';

function App() {
  return <BasicMorphExample />;
}
```

## Configuration Guide

### Essential Props

#### `stages` (required)
Array of shape configurations with scroll triggers:
```tsx
stages={[
  {
    shape: { type: "sphere", size: 5, segments: 32 },
    scrollStart: 0,
    scrollEnd: 0.5,
    color: "#00ffff",
    explosion: {
      enabled: true,
      radius: 40
    }
  }
]}
```

#### `targetParticleCount`
Number of particles to render (default: 5000)
- Low: 3,000-5,000 (better performance)
- Medium: 5,000-10,000 (balanced)
- High: 10,000-20,000 (visual quality)

#### `particleSize`
Base size of each particle (default: 3)

#### `particleSizeRange`
Random size variation for particles:
```tsx
particleSizeRange={{
  min: 0.1,  // Minimum multiplier
  max: 2.0   // Maximum multiplier
}}
```

### Visual Effects

#### `glow`
Particle glow effect:
```tsx
glow={{
  enabled: true,
  intensity: 1.5,   // Glow brightness multiplier
  frequency: 1.0,   // Glow pulse speed
  coverage: 0.25    // Percentage of particles that glow (0-1)
}}
```

#### `rotation`
Interactive rotation controls:
```tsx
rotation={{
  x: 0,                      // Initial rotation on X axis (radians)
  y: 0,                      // Initial rotation on Y axis (radians)
  z: 0,                      // Initial rotation on Z axis (radians)
  autoRotate: {
    enabled: true,           // Enable auto-rotation
    dampingFactor: 0.05,     // Auto-rotation smoothness (0-1)
    speed: {
      x: 0,                  // Auto-rotation speed on X axis
      y: 0.001,              // Auto-rotation speed on Y axis
      z: 0                   // Auto-rotation speed on Z axis
    }
  }
}}
```

#### `particleAnimation`
Per-particle drift animation:
```tsx
particleAnimation={{
  enabled: true,
  dampingFactor: 0.5,    // Animation intensity (0-5)
  driftSpeed: 0.5,        // Movement speed
  driftAmplitude: 0.15    // Movement range
}}
```

### Available Shapes

- `sphere` - Spherical shape
- `box` - Cubic shape
- `torus` - Donut/ring shape
- `cone` - Conical shape
- `cylinder` - Cylindrical shape
- `dodecahedron` - 12-sided polyhedron
- `octahedron` - 8-sided polyhedron
- `tetrahedron` - 4-sided polyhedron

## Performance Tips

1. **Particle Count**: Start with 5,000 and adjust based on target devices
2. **Glow Effects**: Disable or reduce intensity on lower-end devices
3. **Particle Animations**: Reduce dampingFactor and driftSpeed for better performance
4. **Segments**: Lower segment count for geometric shapes (16-32 is usually sufficient)

## Best Practices

1. **Scroll Ranges**: Ensure scroll ranges don't overlap for smooth transitions
2. **Color Contrast**: Use contrasting colors for better visual effect
3. **Glow Coverage**: Adjust based on particle colors and desired visual effect
4. **Camera Position**: Adjust z-position based on shape size and desired perspective
5. **Mobile**: Add viewport detection for responsive experiences

## Contributing

Feel free to add more examples! Each example should:
- Be self-contained in its own directory
- Include clear comments explaining the configuration
- Demonstrate a specific feature or use case
- Follow the existing naming convention

## License

MIT

