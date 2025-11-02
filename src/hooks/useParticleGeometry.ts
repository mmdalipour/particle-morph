'use client';

import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { convertModelToParticles } from '../utils/modelToParticles';
import { ParticleGeometryResult } from '../types';

/**
 * Hook to load GLTF model and convert to particle geometry
 * @param modelPath - Path to GLTF model
 * @param targetCount - Target number of particles (default: 5000)
 * @param dispersalRadius - How far particles spread (default: 40)
 */
export function useParticleGeometry(
  modelPath: string,
  targetCount: number = 5000,
  dispersalRadius: number = 40
): ParticleGeometryResult {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const gltf = useGLTF(modelPath);

  useEffect(() => {
    let currentGeometry: THREE.BufferGeometry | null = null;

    try {
      setIsLoading(true);
      setError(null);

      if (!gltf || !gltf.scene) {
        throw new Error('Failed to load GLTF model');
      }

      currentGeometry = convertModelToParticles(
        gltf.scene,
        targetCount,
        dispersalRadius
      );

      setGeometry(currentGeometry);
      setIsLoading(false);
    } catch (err) {
      console.error('Error creating particle geometry:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
    }

    // Cleanup function to dispose geometry and prevent memory leaks
    return () => {
      if (currentGeometry) {
        currentGeometry.dispose();
      }
    };
  }, [gltf, targetCount, dispersalRadius]);

  return { geometry, isLoading, error };
}

/**
 * Preload a GLTF model
 * @param modelPath - Path to GLTF model to preload
 */
export function preloadModel(modelPath: string): void {
  useGLTF.preload(modelPath);
}

