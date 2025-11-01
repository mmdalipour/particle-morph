'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useParticleGeometry } from '@/hooks/useParticleGeometry';
import { useInteractiveRotation } from '@/hooks/useInteractiveRotation';
import { particleSceneConfig } from '@/config/particle-scene.config';
// @ts-ignore - raw-loader will handle these
import vertexShader from '@/shaders/particleMorph.vert.glsl';
// @ts-ignore - raw-loader will handle these
import fragmentShader from '@/shaders/particleMorph.frag.glsl';

interface ParticleSystemProps {
  scrollProgress: number;
  setIsDragging?: (isDragging: boolean) => void;
}

export default function ParticleSystem({ 
  scrollProgress,
  setIsDragging
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Interactive rotation with smooth damping
  const { rotation, onPointerDown, onPointerMove, onPointerUp, isDragging } = useInteractiveRotation(
    particleSceneConfig.rotation.dampingFactor,
    particleSceneConfig.rotation.autoRotateSpeed
  );

  // Update parent component's dragging state for cursor change
  useEffect(() => {
    if (setIsDragging) {
      setIsDragging(isDragging);
    }
  }, [isDragging, setIsDragging]);

  // Load and convert model to particle geometry
  const { geometry, isLoading, error } = useParticleGeometry(
    particleSceneConfig.modelPath,
    particleSceneConfig.targetParticleCount,
    particleSceneConfig.dispersalRadius
  );

  // Convert hex colors to RGB
  const primaryColor = useMemo(() => {
    const color = new THREE.Color(particleSceneConfig.colors.primary);
    return new THREE.Vector3(color.r, color.g, color.b);
  }, []);

  const secondaryColor = useMemo(() => {
    const color = new THREE.Color(particleSceneConfig.colors.secondary);
    return new THREE.Vector3(color.r, color.g, color.b);
  }, []);

  // Create shader material
  const material = useMemo(() => {
    if (!geometry) return null;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: particleSceneConfig.particleSize },
        uColorPrimary: { value: primaryColor },
        uColorSecondary: { value: secondaryColor }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, [geometry, primaryColor, secondaryColor]);

  // Update progress uniform when scrollProgress changes
  useEffect(() => {
    if (material && material.uniforms.uProgress) {
      material.uniforms.uProgress.value = scrollProgress;
    }
  }, [scrollProgress, material]);

  // Update material uniforms and rotation each frame
  useFrame(() => {
    if (pointsRef.current && material) {
      material.uniforms.uProgress.value = scrollProgress;
    }
    if (groupRef.current) {
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
      {/* Invisible sphere to capture pointer events */}
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
    </group>
  );
}
