# Custom 3D Model Example

This example demonstrates how to use your own 3D models in the particle morph system.

## How to Use Custom Models

### 1. Prepare Your 3D Model

**Supported Formats:**
- GLTF (`.gltf`)
- GLB (`.glb`) - Binary GLTF (recommended)

**Optimization Tips:**
- Keep model complexity reasonable (1,000-10,000 vertices recommended)
- Clean up unnecessary geometry
- Ensure proper scaling (models will be automatically centered)

### 2. Add Model to Project

Place your model file in the `public/models/` directory:

```
public/
  models/
    your-model.glb
    sphere.glb (example)
```

### 3. Configure in ParticleMorph

Use the `"model"` shape type with `modelPath`:

```tsx
{
  shape: { 
    type: "model", 
    modelPath: "/models/your-model.glb" 
  },
  scrollStart: 0,
  scrollEnd: 0.5,
  color: "#00ffff",
}
```

## Example Configuration

```tsx
<ParticleMorph
  stages={[
    {
      // Start with your custom model
      shape: { 
        type: "model", 
        modelPath: "/models/skull.glb" 
      },
      scrollStart: 0,
      scrollEnd: 0.4,
      color: "#00ffff",
    },
    {
      // Morph to geometric shape
      shape: { type: "sphere", size: 5 },
      scrollStart: 0.4,
      scrollEnd: 0.7,
      color: "#ff00ff",
    },
    {
      // Final shape with explosion
      shape: { type: "box", size: 5 },
      scrollStart: 0.7,
      scrollEnd: 1.0,
      color: "#ffff00",
      explosion: {
        enabled: true,
        radius: 40
      }
    }
  ]}
  targetParticleCount={8000}
/>
```

## Model Sources

Where to find 3D models:

1. **Free Resources:**
   - [Sketchfab](https://sketchfab.com/) - Search with "downloadable" filter
   - [Poly Pizza](https://poly.pizza/) - Free low-poly models
   - [Quaternius](http://quaternius.com/) - Free ultimate models pack
   - [glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models)

2. **Create Your Own:**
   - [Blender](https://www.blender.org/) - Free 3D modeling software
   - Export as GLTF/GLB format

## Converting Models

If you have models in other formats (OBJ, FBX, etc.):

### Using Blender:
1. Import your model (File → Import)
2. Export as GLTF 2.0 (File → Export → glTF 2.0)
3. Choose "GLB" format
4. Enable "Apply Modifiers" if needed

### Online Converters:
- [glTF Viewer & Converter](https://gltf-viewer.donmccurdy.com/)
- [Blender Online](https://products.aspose.app/3d/conversion)

## Performance Considerations

### Model Complexity
| Vertices | Recommended Particles | Performance |
|----------|----------------------|-------------|
| 100-1,000 | 3,000-5,000 | Excellent |
| 1,000-5,000 | 5,000-8,000 | Good |
| 5,000-10,000 | 8,000-12,000 | Fair |
| 10,000+ | 10,000+ | Variable |

**Tips:**
- More complex models need more particles for detail
- Use `targetParticleCount` to match model complexity
- Test on target devices for performance

### Optimization
1. **Simplify Geometry:**
   - Reduce polygon count in Blender
   - Remove hidden/internal faces
   - Merge duplicate vertices

2. **Remove Unnecessary Data:**
   - Textures (not used in particle system)
   - Normals (can be recalculated)
   - Multiple materials (particles use single color)

## Troubleshooting

### Model Not Loading
- Check file path is correct (starts with `/`)
- Verify model is in `public/` directory
- Check browser console for errors
- Test model in glTF viewer first

### Model Too Small/Large
- Particles will distribute across model size
- Adjust `camera.position` z-value
- Scale model in Blender before export

### Weird Particle Distribution
- Ensure model has clean geometry
- Check for duplicate vertices
- Verify normals are correct

### Low FPS
- Reduce model vertex count
- Lower `targetParticleCount`
- Disable or reduce glow effects

## Advanced: Multiple Custom Models

Morph between multiple custom models:

```tsx
stages={[
  {
    shape: { type: "model", modelPath: "/models/head.glb" },
    scrollStart: 0,
    scrollEnd: 0.33,
    color: "#00ffff",
  },
  {
    shape: { type: "model", modelPath: "/models/hand.glb" },
    scrollStart: 0.33,
    scrollEnd: 0.66,
    color: "#ff00ff",
  },
  {
    shape: { type: "model", modelPath: "/models/heart.glb" },
    scrollStart: 0.66,
    scrollEnd: 1,
    color: "#ffff00",
  }
]}
```

## Example Use Cases

1. **Brand Logo Reveal** - Logo model → geometric shape
2. **Product Showcase** - Product model with rotation
3. **Character Transformation** - Character morphing
4. **Data Visualization** - Data-driven 3D models
5. **Interactive Art** - Abstract sculptures

## Resources

- [glTF Specification](https://www.khronos.org/gltf/)
- [Three.js GLTF Loader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [Blender to Three.js Workflow](https://threejs.org/docs/#manual/en/introduction/Loading-3D-models)

Happy morphing with custom models! 🎨✨

