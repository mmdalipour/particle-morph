'use client';

import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { convertModelToParticles } from '@/utils/modelToParticles';
import { ParticleGeometryResult } from '@/types/particle.types';
import { particleSceneConfig } from '@/config/particle-scene.config';

/**
 * Hook to load GLTF model and convert to particle geometry
 * @param modelPath - Path to GLTF model
 * @param targetCount - Target number of particles
 * @param dispersalRadius - How far particles spread
 */
export function useParticleGeometry(
  modelPath: string,
  targetCount: number,
  dispersalRadius: number
): ParticleGeometryResult {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load GLTF model
  const gltf = useGLTF(modelPath);
  

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      if (!gltf || !gltf.scene) {
        throw new Error('Failed to load GLTF model');
      }

      // Convert model to particle geometry
      const particleGeometry = convertModelToParticles(
        gltf.scene,
        targetCount,
        dispersalRadius
      );

      setGeometry(particleGeometry);
      setIsLoading(false);
    } catch (err) {
      console.error('Error creating particle geometry:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
    }
  }, [gltf, targetCount, dispersalRadius]);

  return { geometry, isLoading, error };
}

// Preload model from config
useGLTF.preload(particleSceneConfig.modelPath);
