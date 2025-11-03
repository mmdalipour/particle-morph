import * as THREE from 'three';
import { ShapeConfig, generateShapeParticles } from './shapeToParticles';
import { ShapeStage } from '../types';

/**
 * Generates particle positions for multiple shape stages
 * @param stages - Array of shape stages with optional explosion effects
 * @param particleCount - Number of particles
 * @param sizeRangeMin - Minimum particle size multiplier
 * @param sizeRangeMax - Maximum particle size multiplier
 * @returns Promise that resolves to object with positions for each stage and particle attributes
 */
export async function generateMultiShapeParticles(
  stages: ShapeStage[],
  particleCount: number = 5000,
  sizeRangeMin: number = 0.2,
  sizeRangeMax: number = 2.0
): Promise<{
  stagePositions: Float32Array[];
  hasExplosion: boolean[];
  animationSeeds: Float32Array;
  dampingFactors: Float32Array;
  particleScales: Float32Array;
}> {
  const stagePositions: Float32Array[] = [];
  const hasExplosion: boolean[] = [];
  
  // Generate particles for each stage (with async support for models)
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const particles = await generateShapeParticles(stage.shape, particleCount, sizeRangeMin, sizeRangeMax);
    
    // Keep the shape positions as-is, explosion will be handled in the shader
    hasExplosion.push(stage.explosion?.enabled || false);
    stagePositions.push(particles.positions);
  }

  // Get animation attributes from the first stage
  const firstStageParticles = await generateShapeParticles(stages[0].shape, particleCount, sizeRangeMin, sizeRangeMax);

  return {
    stagePositions,
    hasExplosion,
    animationSeeds: firstStageParticles.animationSeeds,
    dampingFactors: firstStageParticles.dampingFactors,
    particleScales: firstStageParticles.particleScales
  };
}

