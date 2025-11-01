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
  const positions: number[] = [];
  const modelCenter = new THREE.Vector3();
  const boundingBox = new THREE.Box3();

  boundingBox.setFromObject(model);
  boundingBox.getCenter(modelCenter);
  
  const modelSize = boundingBox.getSize(new THREE.Vector3());
  const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
  const targetSize = 5;
  const scale = targetSize / maxDimension;
  
  const originalCenter = modelCenter.clone();

  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry;
      const clonedGeometry = geometry.clone();
      if (!clonedGeometry.attributes.position) return;
      
      const nonIndexedGeometry = clonedGeometry.index 
        ? clonedGeometry.toNonIndexed() 
        : clonedGeometry;
      
      const positionAttribute = nonIndexedGeometry.attributes.position;

      if (positionAttribute) {
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
          vertex.fromBufferAttribute(positionAttribute, i);
          child.localToWorld(vertex);
          vertex.sub(originalCenter).multiplyScalar(scale);
          positions.push(vertex.x, vertex.y, vertex.z);
        }
      }
      
      clonedGeometry.dispose();
    }
  });

  const vertexCount = positions.length / 3;

  if (vertexCount === 0) {
    throw new Error('Model has no vertices');
  }

  let finalPositions: number[] = [];

  if (vertexCount === targetCount) {
    finalPositions = positions;
  } else if (vertexCount > targetCount) {
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
    finalPositions = [...positions];
    const additionalCount = targetCount - vertexCount;
    const meshes: THREE.Mesh[] = [];

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });

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

          const v1 = new THREE.Vector3().fromBufferAttribute(positionAttribute, faceIndex);
          const v2 = new THREE.Vector3().fromBufferAttribute(positionAttribute, faceIndex + 1);
          const v3 = new THREE.Vector3().fromBufferAttribute(positionAttribute, faceIndex + 2);

          let r1 = Math.random();
          let r2 = Math.random();

          if (r1 + r2 > 1) {
            r1 = 1 - r1;
            r2 = 1 - r2;
          }

          const r3 = 1 - r1 - r2;

          const point = new THREE.Vector3()
            .addScaledVector(v1, r1)
            .addScaledVector(v2, r2)
            .addScaledVector(v3, r3);

          mesh.localToWorld(point);
          point.sub(originalCenter).multiplyScalar(scale);
          finalPositions.push(point.x, point.y, point.z);
        }
        
        if (geometry.index && nonIndexedGeometry !== geometry) {
          nonIndexedGeometry.dispose();
        }
      }
    }
  }

  const scatteredPositions: number[] = [];
  const randomFactors: number[] = [];

  for (let i = 0; i < finalPositions.length; i += 3) {
    const formedPos = new THREE.Vector3(
      finalPositions[i],
      finalPositions[i + 1],
      finalPositions[i + 2]
    );

    const direction = formedPos.clone().normalize();
    const randomFactor = 0.8 + Math.random() * 0.4;

    const scatteredPos = formedPos
      .clone()
      .add(direction.multiplyScalar(dispersalRadius * randomFactor));

    scatteredPositions.push(scatteredPos.x, scatteredPos.y, scatteredPos.z);
    randomFactors.push(randomFactor);
  }

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

  const allPositions: number[] = [...finalPositions, ...scatteredPositions];
  const tempBox = new THREE.Box3();
  
  for (let i = 0; i < allPositions.length; i += 3) {
    tempBox.expandByPoint(
      new THREE.Vector3(allPositions[i], allPositions[i + 1], allPositions[i + 2])
    );
  }
  
  const center = new THREE.Vector3();
  tempBox.getCenter(center);
  const maxRadius = tempBox.getSize(new THREE.Vector3()).length() / 2;
  
  geometry.boundingSphere = new THREE.Sphere(center, maxRadius * 1.2);
  geometry.boundingBox = tempBox;

  return geometry;
}

