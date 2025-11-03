import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { generateMultiShapeParticles } from '../utils/multiShapeToParticles';
import { ParticleGeometryResult, ShapeStage } from '../types';

/**
 * Hook to generate particle geometry from multiple shapes for multi-stage morphing
 * @param stages - Array of shape/explosion stages with scroll ranges
 * @param particleCount - Number of particles to generate
 * @param sizeRangeMin - Minimum particle size multiplier
 * @param sizeRangeMax - Maximum particle size multiplier
 * @returns Geometry with position0-3 and other particle attributes
 */
export function useMultiShapeMorphGeometry(
  stages: ShapeStage[],
  particleCount: number = 5000,
  sizeRangeMin: number = 0.2,
  sizeRangeMax: number = 2.0
): ParticleGeometryResult {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let currentGeometry: THREE.BufferGeometry | null = null;

    const generateGeometry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (stages.length === 0 || stages.length > 4) {
          throw new Error('Must have between 1 and 4 shape stages');
        }

        // Generate particles for all stages
        const result = await generateMultiShapeParticles(
          stages,
          particleCount,
          sizeRangeMin,
          sizeRangeMax
        );

        if (isCancelled) return;

        const newGeometry = new THREE.BufferGeometry();

        // Set position attribute (required by Three.js Points)
        newGeometry.setAttribute(
          'position',
          new THREE.BufferAttribute(result.stagePositions[0], 3)
        );

        // Set position attributes for each stage (pad with last position if needed)
        for (let i = 0; i < 4; i++) {
          const positionData = i < result.stagePositions.length 
            ? result.stagePositions[i] 
            : result.stagePositions[result.stagePositions.length - 1];
          
          newGeometry.setAttribute(
            `position${i}`,
            new THREE.BufferAttribute(positionData, 3)
          );
        }

        // Set animation attributes
        newGeometry.setAttribute(
          'animationSeed',
          new THREE.BufferAttribute(result.animationSeeds, 3)
        );

        newGeometry.setAttribute(
          'dampingFactor',
          new THREE.BufferAttribute(result.dampingFactors, 1)
        );

        newGeometry.setAttribute(
          'particleScale',
          new THREE.BufferAttribute(result.particleScales, 1)
        );

        // Calculate bounding sphere that encompasses all shapes
        let maxDistanceSquared = 0;
        for (const positions of result.stagePositions) {
          for (let i = 0; i < particleCount * 3; i += 3) {
            const dist = positions[i] * positions[i] + 
                        positions[i + 1] * positions[i + 1] + 
                        positions[i + 2] * positions[i + 2];
            maxDistanceSquared = Math.max(maxDistanceSquared, dist);
          }
        }

        const maxRadius = Math.sqrt(maxDistanceSquared);
        newGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), maxRadius * 1.5);
        newGeometry.computeBoundingBox();

        if (isCancelled) {
          newGeometry.dispose();
          return;
        }

        currentGeometry = newGeometry;
        setGeometry(newGeometry);
        setIsLoading(false);
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to generate multi-shape geometry'));
          setIsLoading(false);
        }
      }
    };

    generateGeometry();

    return () => {
      isCancelled = true;
      if (currentGeometry) {
        currentGeometry.dispose();
      }
    };
  }, [
    JSON.stringify(stages.map(s => ({
      shape: s.shape.type,
      size: s.shape.size,
      segments: s.shape.segments,
      modelPath: s.shape.modelPath,
      start: s.scrollStart,
      end: s.scrollEnd,
      explosion: s.explosion
    }))),
    particleCount,
    sizeRangeMin,
    sizeRangeMax
  ]);

  return { geometry, isLoading, error };
}

