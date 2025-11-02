import * as THREE from 'three';

/**
 * Converts a GLTF model to a particle BufferGeometry
 * @param model - Loaded GLTF model
 * @param targetCount - Target number of particles (default: 5000)
 * @param dispersalRadius - How far particles spread when dispersed (default: 40)
 * @returns BufferGeometry with position, scatteredPosition, and randomFactor attributes
 */
export function convertModelToParticles(
  model: THREE.Group,
  targetCount: number = 5000,
  dispersalRadius: number = 40
): THREE.BufferGeometry {
  // Pre-allocate TypedArrays for better performance
  const tempPositions: number[] = [];
  const modelCenter = new THREE.Vector3();
  const boundingBox = new THREE.Box3();

  boundingBox.setFromObject(model);
  boundingBox.getCenter(modelCenter);
  
  const modelSize = boundingBox.getSize(new THREE.Vector3());
  const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
  const targetSize = 5;
  const scale = targetSize / maxDimension;
  
  const centerX = modelCenter.x;
  const centerY = modelCenter.y;
  const centerZ = modelCenter.z;

  // Reusable Vector3 to reduce allocations
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

        // Direct array access is faster than fromBufferAttribute
        const array = positionAttribute.array;
        for (let i = 0; i < positionAttribute.count; i++) {
          const i3 = i * 3;
          vertex.set(array[i3], array[i3 + 1], array[i3 + 2]);
          vertex.applyMatrix4(worldMatrix);
          
          // Inline subtraction and scaling for performance
          const x = (vertex.x - centerX) * scale;
          const y = (vertex.y - centerY) * scale;
          const z = (vertex.z - centerZ) * scale;
          
          tempPositions.push(x, y, z);
        }
      }
      
      // Dispose only if we created a new geometry
      if (geometry.index && nonIndexedGeometry !== geometry) {
        nonIndexedGeometry.dispose();
      }
    }
  });

  const vertexCount = tempPositions.length / 3;

  if (vertexCount === 0) {
    throw new Error('Model has no vertices');
  }

  // Use Float32Array for better GPU upload performance
  let finalPositions: Float32Array;

  if (vertexCount === targetCount) {
    finalPositions = new Float32Array(tempPositions);
  } else if (vertexCount > targetCount) {
    // Optimized sampling using Fisher-Yates shuffle approach
    finalPositions = new Float32Array(targetCount * 3);
    const indices = new Uint32Array(vertexCount);
    for (let i = 0; i < vertexCount; i++) indices[i] = i;
    
    // Partial shuffle - only shuffle what we need
    for (let i = 0; i < targetCount; i++) {
      const j = i + Math.floor(Math.random() * (vertexCount - i));
      const temp = indices[i];
      indices[i] = indices[j];
      indices[j] = temp;
      
      const srcIdx = indices[i] * 3;
      const dstIdx = i * 3;
      finalPositions[dstIdx] = tempPositions[srcIdx];
      finalPositions[dstIdx + 1] = tempPositions[srcIdx + 1];
      finalPositions[dstIdx + 2] = tempPositions[srcIdx + 2];
    }
  } else {
    // Need to generate additional particles
    finalPositions = new Float32Array(targetCount * 3);
    finalPositions.set(tempPositions);
    
    const additionalCount = targetCount - vertexCount;
    const meshes: THREE.Mesh[] = [];

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });

    // Reuse vectors for particle generation
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const v3 = new THREE.Vector3();
    const point = new THREE.Vector3();

    for (let i = 0; i < additionalCount; i++) {
      if (meshes.length > 0) {
        const mesh = meshes[Math.floor(Math.random() * meshes.length)];
        const geometry = mesh.geometry;
        
        const nonIndexedGeometry = geometry.index 
          ? geometry.toNonIndexed() 
          : geometry;
        
        const positionAttribute = nonIndexedGeometry.attributes.position;

        if (positionAttribute && positionAttribute.count >= 3) {
          const faceIndex = Math.floor(Math.random() * (positionAttribute.count / 3)) * 3;
          const array = positionAttribute.array;

          // Direct array access for performance
          const idx1 = faceIndex * 3;
          const idx2 = (faceIndex + 1) * 3;
          const idx3 = (faceIndex + 2) * 3;
          
          v1.set(array[idx1], array[idx1 + 1], array[idx1 + 2]);
          v2.set(array[idx2], array[idx2 + 1], array[idx2 + 2]);
          v3.set(array[idx3], array[idx3 + 1], array[idx3 + 2]);

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

          mesh.localToWorld(point);
          
          const dstIdx = (vertexCount + i) * 3;
          finalPositions[dstIdx] = (point.x - centerX) * scale;
          finalPositions[dstIdx + 1] = (point.y - centerY) * scale;
          finalPositions[dstIdx + 2] = (point.z - centerZ) * scale;
        }
        
        if (geometry.index && nonIndexedGeometry !== geometry) {
          nonIndexedGeometry.dispose();
        }
      }
    }
  }

  // Pre-allocate TypedArrays for scattered positions
  const particleCount = targetCount;
  const scatteredPositions = new Float32Array(particleCount * 3);
  const randomFactors = new Float32Array(particleCount);

  let maxDistanceSquared = 0;

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const x = finalPositions[i3];
    const y = finalPositions[i3 + 1];
    const z = finalPositions[i3 + 2];

    // Calculate direction and normalize inline for performance
    const length = Math.sqrt(x * x + y * y + z * z);
    const invLength = length > 0 ? 1 / length : 0;
    
    const randomFactor = 0.8 + Math.random() * 0.4;
    const offset = dispersalRadius * randomFactor;

    // Normalized direction multiplied by offset
    const dx = x * invLength * offset;
    const dy = y * invLength * offset;
    const dz = z * invLength * offset;

    // Calculate scattered position directly
    scatteredPositions[i3] = x + dx;
    scatteredPositions[i3 + 1] = y + dy;
    scatteredPositions[i3 + 2] = z + dz;
    
    randomFactors[i] = randomFactor;

    // Track max distance for both positions
    const formedDistSq = x * x + y * y + z * z;
    const scatteredDistSq = scatteredPositions[i3] * scatteredPositions[i3] + 
                            scatteredPositions[i3 + 1] * scatteredPositions[i3 + 1] + 
                            scatteredPositions[i3 + 2] * scatteredPositions[i3 + 2];
    maxDistanceSquared = Math.max(maxDistanceSquared, formedDistSq, scatteredDistSq);
  }

  const geometry = new THREE.BufferGeometry();

  // Use BufferAttribute directly with TypedArrays for better GPU performance
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(finalPositions, 3)
  );

  geometry.setAttribute(
    'scatteredPosition',
    new THREE.BufferAttribute(scatteredPositions, 3)
  );

  geometry.setAttribute(
    'randomFactor',
    new THREE.BufferAttribute(randomFactors, 1)
  );

  // Optimized bounding sphere calculation
  const maxRadius = Math.sqrt(maxDistanceSquared);
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), maxRadius * 1.5);
  
  // Compute bounding box for proper culling
  geometry.computeBoundingBox();

  return geometry;
}

