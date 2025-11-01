import * as THREE from 'three';

/**
 * Converts a GLTF model to a particle BufferGeometry
 * @param model - Loaded GLTF model
 * @param targetCount - Target number of particles
 * @param dispersalRadius - How far particles spread when dispersed
 * @returns BufferGeometry with position, scatteredPosition, and randomFactor attributes
 */
export function convertModelToParticles(
  model: THREE.Group,
  targetCount: number,
  dispersalRadius: number
): THREE.BufferGeometry {
  // Step 1: Extract all vertices from the model
  const positions: number[] = [];
  const modelCenter = new THREE.Vector3();
  const boundingBox = new THREE.Box3();

  // Calculate bounding box to find model center
  boundingBox.setFromObject(model);
  boundingBox.getCenter(modelCenter);

  // Traverse model and extract vertex positions
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry;
      
      // Clone and compute if needed
      const clonedGeometry = geometry.clone();
      if (!clonedGeometry.attributes.position) return;
      
      // Convert indexed geometry to non-indexed to properly extract vertices
      const nonIndexedGeometry = clonedGeometry.index 
        ? clonedGeometry.toNonIndexed() 
        : clonedGeometry;
      
      const positionAttribute = nonIndexedGeometry.attributes.position;

      if (positionAttribute) {
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
          vertex.fromBufferAttribute(positionAttribute, i);

          // Apply world transformation
          child.localToWorld(vertex);

          positions.push(vertex.x, vertex.y, vertex.z);
        }
      }
      
      // Clean up cloned geometry
      clonedGeometry.dispose();
    }
  });

  const vertexCount = positions.length / 3;

  if (vertexCount === 0) {
    throw new Error('Model has no vertices');
  }

  // Step 2: Adjust particle count to match target
  let finalPositions: number[] = [];

  if (vertexCount === targetCount) {
    finalPositions = positions;
  } else if (vertexCount > targetCount) {
    // Decimate: randomly sample vertices
    const indices = new Set<number>();
    while (indices.size < targetCount) {
      indices.add(Math.floor(Math.random() * vertexCount));
    }

    Array.from(indices).forEach(index => {
      finalPositions.push(
        positions[index * 3],
        positions[index * 3 + 1],
        positions[index * 3 + 2]
      );
    });
  } else {
    // Need more particles - sample additional points on mesh surfaces
    finalPositions = [...positions];

    const additionalCount = targetCount - vertexCount;
    const meshes: THREE.Mesh[] = [];

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });

    // Sample random points on faces
    for (let i = 0; i < additionalCount; i++) {
      if (meshes.length > 0) {
        const mesh = meshes[Math.floor(Math.random() * meshes.length)];
        const geometry = mesh.geometry;
        
        // Convert to non-indexed geometry for proper face sampling
        const nonIndexedGeometry = geometry.index 
          ? geometry.toNonIndexed() 
          : geometry;
        
        const positionAttribute = nonIndexedGeometry.attributes.position;

        if (positionAttribute && positionAttribute.count >= 3) {
          // Pick random triangle
          const faceIndex = Math.floor(Math.random() * (positionAttribute.count / 3)) * 3;

          // Get triangle vertices
          const v1 = new THREE.Vector3().fromBufferAttribute(positionAttribute, faceIndex);
          const v2 = new THREE.Vector3().fromBufferAttribute(positionAttribute, faceIndex + 1);
          const v3 = new THREE.Vector3().fromBufferAttribute(positionAttribute, faceIndex + 2);

          // Random barycentric coordinates
          let r1 = Math.random();
          let r2 = Math.random();

          if (r1 + r2 > 1) {
            r1 = 1 - r1;
            r2 = 1 - r2;
          }

          const r3 = 1 - r1 - r2;

          // Calculate point on triangle
          const point = new THREE.Vector3()
            .addScaledVector(v1, r1)
            .addScaledVector(v2, r2)
            .addScaledVector(v3, r3);

          // Apply world transformation
          mesh.localToWorld(point);

          finalPositions.push(point.x, point.y, point.z);
        }
        
        // Clean up if we created a new geometry
        if (geometry.index && nonIndexedGeometry !== geometry) {
          nonIndexedGeometry.dispose();
        }
      }
    }
  }

  // Step 3: Calculate scattered positions and random factors
  const scatteredPositions: number[] = [];
  const randomFactors: number[] = [];

  for (let i = 0; i < finalPositions.length; i += 3) {
    const formedPos = new THREE.Vector3(
      finalPositions[i],
      finalPositions[i + 1],
      finalPositions[i + 2]
    );

    // Calculate direction from model center
    const direction = formedPos.clone().sub(modelCenter).normalize();

    // Generate random factor (0.8 to 1.2)
    const randomFactor = 0.8 + Math.random() * 0.4;

    // Calculate scattered position
    const scatteredPos = formedPos
      .clone()
      .add(direction.multiplyScalar(dispersalRadius * randomFactor));

    scatteredPositions.push(scatteredPos.x, scatteredPos.y, scatteredPos.z);
    randomFactors.push(randomFactor);
  }

  // Step 4: Create BufferGeometry with attributes
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(finalPositions, 3)
  );

  geometry.setAttribute(
    'scatteredPosition',
    new THREE.Float32BufferAttribute(scatteredPositions, 3)
  );

  geometry.setAttribute(
    'randomFactor',
    new THREE.Float32BufferAttribute(randomFactors, 1)
  );

  return geometry;
}
