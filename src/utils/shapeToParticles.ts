import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type ShapeType = 'sphere' | 'box' | 'torus' | 'cone' | 'cylinder' | 'dodecahedron' | 'octahedron' | 'tetrahedron' | 'model';

export interface ShapeConfig {
  type: ShapeType;
  size?: number;
  modelPath?: string;
}

/**
 * Loads a 3D model from a file
 * @param modelPath - Path to the 3D model file
 * @returns Promise that resolves to the loaded model group
 */
async function loadModel(modelPath: string): Promise<THREE.Group> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      (gltf) => resolve(gltf.scene),
      undefined,
      (error) => reject(error)
    );
  });
}

/**
 * Extracts positions from a loaded 3D model
 * @param model - The loaded model group
 * @param targetSize - Target size for normalization
 * @returns Array of positions
 */
function extractModelPositions(model: THREE.Group, targetSize: number = 5): Float32Array {
  const tempPositions: number[] = [];
  const modelCenter = new THREE.Vector3();
  const boundingBox = new THREE.Box3();

  boundingBox.setFromObject(model);
  boundingBox.getCenter(modelCenter);
  
  const modelSize = boundingBox.getSize(new THREE.Vector3());
  const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
  const scale = targetSize / maxDimension;
  
  const centerX = modelCenter.x;
  const centerY = modelCenter.y;
  const centerZ = modelCenter.z;

  const vertex = new THREE.Vector3();
  const worldMatrix = new THREE.Matrix4();

  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry;
      if (!geometry.attributes.position) return;
      
      const nonIndexedGeometry = geometry.index 
        ? geometry.toNonIndexed() 
        : geometry;
      
      const positionAttribute = nonIndexedGeometry.attributes.position;

      if (positionAttribute) {
        worldMatrix.copy(child.matrixWorld);
        const array = positionAttribute.array;
        
        for (let i = 0; i < positionAttribute.count; i++) {
          const i3 = i * 3;
          vertex.set(array[i3], array[i3 + 1], array[i3 + 2]);
          vertex.applyMatrix4(worldMatrix);
          
          const x = (vertex.x - centerX) * scale;
          const y = (vertex.y - centerY) * scale;
          const z = (vertex.z - centerZ) * scale;
          
          tempPositions.push(x, y, z);
        }
      }
      
      if (geometry.index && nonIndexedGeometry !== geometry) {
        nonIndexedGeometry.dispose();
      }
    }
  });

  return new Float32Array(tempPositions);
}

/**
 * Generates particle positions from basic geometric shapes or 3D models
 * @param config - Shape configuration
 * @param particleCount - Number of particles to generate
 * @param sizeRangeMin - Minimum particle size multiplier
 * @param sizeRangeMax - Maximum particle size multiplier
 * @returns Promise that resolves to object with positions, animationSeeds, dampingFactors, and particleScales
 */
export async function generateShapeParticles(
  config: ShapeConfig,
  particleCount: number = 5000,
  sizeRangeMin: number = 0.2,
  sizeRangeMax: number = 2.0
): Promise<{
  positions: Float32Array;
  animationSeeds: Float32Array;
  dampingFactors: Float32Array;
  particleScales: Float32Array;
}> {
  const size = config.size ?? 5;
  const SEGMENTS = 32; // Fixed mesh resolution
  
  let geometry: THREE.BufferGeometry;
  let sourcePositions: Float32Array;

  if (config.type === 'model') {
    if (!config.modelPath) {
      throw new Error('modelPath is required when type is "model"');
    }
    const model = await loadModel(config.modelPath);
    sourcePositions = extractModelPositions(model, size);
  } else if (config.type === 'sphere') {
    // Use Fibonacci sphere distribution for uniform particle spread
    // This avoids the grid pattern that THREE.SphereGeometry creates
    const radius = size / 2;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;
    
    const tempPositions: number[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;
      
      const x = radius * Math.sin(inclination) * Math.cos(azimuth);
      const y = radius * Math.sin(inclination) * Math.sin(azimuth);
      const z = radius * Math.cos(inclination);
      
      tempPositions.push(x, y, z);
    }
    
    sourcePositions = new Float32Array(tempPositions);
  } else {
    switch (config.type) {
      case 'box':
        geometry = new THREE.BoxGeometry(size, size, size, SEGMENTS, SEGMENTS, SEGMENTS);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(size / 2, size / 6, SEGMENTS / 2, SEGMENTS);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(size / 2, size, SEGMENTS);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(size / 2, size / 2, size, SEGMENTS);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(size / 2, 0);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(size / 2, 0);
        break;
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(size / 2, 0);
        break;
      default:
        geometry = new THREE.SphereGeometry(size / 2, SEGMENTS, SEGMENTS);
    }

    // Convert indexed geometry to non-indexed for easier sampling
    const nonIndexedGeometry = geometry!.index ? geometry!.toNonIndexed() : geometry!;
    const positionAttribute = nonIndexedGeometry.attributes.position;
    sourcePositions = new Float32Array(positionAttribute.array);
    
    // Dispose temporary geometry
    nonIndexedGeometry.dispose();
    if (geometry !== nonIndexedGeometry) {
      geometry!.dispose();
    }
  }

  const vertexCount = sourcePositions.length / 3;
  const positions = new Float32Array(particleCount * 3);
  const animationSeeds = new Float32Array(particleCount * 3);
  const dampingFactors = new Float32Array(particleCount);
  const particleScales = new Float32Array(particleCount);

  // For Fibonacci sphere, positions are already generated at the target count
  if (config.type === 'sphere') {
    positions.set(sourcePositions);
  } else if (vertexCount === particleCount) {
    // Exact match, use all vertices
    positions.set(sourcePositions);
  } else if (vertexCount > particleCount) {
    // Sample random vertices
    const indices = new Uint32Array(vertexCount);
    for (let i = 0; i < vertexCount; i++) indices[i] = i;
    
    // Partial shuffle
    for (let i = 0; i < particleCount; i++) {
      const j = i + Math.floor(Math.random() * (vertexCount - i));
      const temp = indices[i];
      indices[i] = indices[j];
      indices[j] = temp;
      
      const srcIdx = indices[i] * 3;
      const dstIdx = i * 3;
      positions[dstIdx] = sourcePositions[srcIdx];
      positions[dstIdx + 1] = sourcePositions[srcIdx + 1];
      positions[dstIdx + 2] = sourcePositions[srcIdx + 2];
    }
  } else {
    // Generate additional particles by sampling triangles
    positions.set(sourcePositions);
    
    const additionalCount = particleCount - vertexCount;
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const v3 = new THREE.Vector3();
    const point = new THREE.Vector3();

    for (let i = 0; i < additionalCount; i++) {
      // Pick a random triangle
      const faceIndex = Math.floor(Math.random() * (vertexCount / 3)) * 3;

      const idx1 = faceIndex * 3;
      const idx2 = (faceIndex + 1) * 3;
      const idx3 = (faceIndex + 2) * 3;
      
      v1.set(sourcePositions[idx1], sourcePositions[idx1 + 1], sourcePositions[idx1 + 2]);
      v2.set(sourcePositions[idx2], sourcePositions[idx2 + 1], sourcePositions[idx2 + 2]);
      v3.set(sourcePositions[idx3], sourcePositions[idx3 + 1], sourcePositions[idx3 + 2]);

      // Random point on triangle using barycentric coordinates
      let r1 = Math.random();
      let r2 = Math.random();

      if (r1 + r2 > 1) {
        r1 = 1 - r1;
        r2 = 1 - r2;
      }

      const r3 = 1 - r1 - r2;

      point.set(0, 0, 0)
        .addScaledVector(v1, r1)
        .addScaledVector(v2, r2)
        .addScaledVector(v3, r3);

      const dstIdx = (vertexCount + i) * 3;
      positions[dstIdx] = point.x;
      positions[dstIdx + 1] = point.y;
      positions[dstIdx + 2] = point.z;
    }
  }

  // Generate per-particle attributes
  const sizeRange = sizeRangeMax - sizeRangeMin;
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Animation seeds for drift
    animationSeeds[i3] = Math.random() * Math.PI * 2;
    animationSeeds[i3 + 1] = Math.random() * Math.PI * 2;
    animationSeeds[i3 + 2] = Math.random() * Math.PI * 2;

    // Per-particle damping factor
    dampingFactors[i] = 0.5 + Math.random() * 0.5;

    // Random size scale
    particleScales[i] = sizeRangeMin + Math.random() * sizeRange;
  }

  return {
    positions,
    animationSeeds,
    dampingFactors,
    particleScales
  };
}

