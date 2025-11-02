'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useParticleGeometry } from '../hooks/useParticleGeometry';
import { useInteractiveRotation } from '../hooks/useInteractiveRotation';
import { ParticleModelProps } from '../types';
import vertexShader from '../shaders/particleMorph.vert.glsl';
import fragmentShader from '../shaders/particleMorph.frag.glsl';

/**
 * ParticleModel component - Renders a 3D model as interactive particles
 * @param modelPath - Path to the GLTF model file
 * @param targetParticleCount - Number of particles to generate (default: 5000)
 * @param dispersalRadius - How far particles spread when dispersed (default: 40)
 * @param colors - Primary and secondary colors for particles
 * @param particleSize - Size of individual particles (default: 3)
 * @param scrollProgress - Progress value (0-1) for particle animation
 * @param rotationConfig - Configuration for interactive rotation
 * @param onDraggingChange - Callback when dragging state changes
 */
export function ParticleModel({
  modelPath,
  targetParticleCount = 5000,
  dispersalRadius = 40,
  colors = {
    primary: '#00ffff',
    secondary: '#0088ff'
  },
  particleSize = 3,
  scrollProgress = 0,
  rotationConfig = {
    enabled: true,
    dampingFactor: 0.08,
    autoRotateSpeed: 0.001
  },
  onDraggingChange
}: ParticleModelProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const rotationEnabled = rotationConfig?.enabled !== false;
  const dampingFactor = rotationConfig?.dampingFactor ?? 0.08;
  const autoRotateSpeed = rotationConfig?.autoRotateSpeed ?? 0.001;

  const { rotation, onPointerDown, onPointerMove, onPointerUp, isDragging } = useInteractiveRotation(
    dampingFactor,
    autoRotateSpeed
  );

  useEffect(() => {
    if (onDraggingChange) {
      onDraggingChange(isDragging);
    }
  }, [isDragging, onDraggingChange]);

  const { geometry, isLoading, error } = useParticleGeometry(
    modelPath,
    targetParticleCount,
    dispersalRadius
  );

  // Memoize color conversions to reduce object allocations
  const primaryColor = useMemo(() => {
    const color = new THREE.Color(colors.primary);
    return new THREE.Vector3(color.r, color.g, color.b);
  }, [colors.primary]);

  const secondaryColor = useMemo(() => {
    const color = new THREE.Color(colors.secondary);
    return new THREE.Vector3(color.r, color.g, color.b);
  }, [colors.secondary]);

  const material = useMemo(() => {
    if (!geometry) return null;

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
        uSize: { value: particleSize },
        uColorPrimary: { value: primaryColor.clone() },
        uColorSecondary: { value: secondaryColor.clone() }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    
    return mat;
  }, [geometry, primaryColor, secondaryColor, particleSize]);

  // Update color uniforms when they change (without recreating material)
  useEffect(() => {
    if (material) {
      material.uniforms.uColorPrimary.value.copy(primaryColor);
      material.uniforms.uColorSecondary.value.copy(secondaryColor);
    }
  }, [material, primaryColor, secondaryColor]);

  // Clean up material on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (material) {
        material.dispose();
      }
    };
  }, [material]);

  // Update progress uniform directly without re-creating material
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  useFrame(() => {
    if (material) {
      // Only update if changed
      if (material.uniforms.uProgress.value !== progressRef.current) {
        material.uniforms.uProgress.value = progressRef.current;
      }
    }
    if (groupRef.current && rotationEnabled) {
      groupRef.current.rotation.copy(rotation);
    }
  });

  if (error) {
    console.error('Particle system error:', error);
    return null;
  }

  if (isLoading || !geometry || !material) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <points 
        ref={pointsRef} 
        geometry={geometry} 
        material={material}
        frustumCulled={false}
      />
      {rotationEnabled && (
        <mesh
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          frustumCulled={false}
        >
          <sphereGeometry args={[10, 32, 32]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
}

