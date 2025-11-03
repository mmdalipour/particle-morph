'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useMultiShapeMorphGeometry } from '../hooks/useMultiShapeMorphGeometry';
import { useInteractiveRotation } from '../hooks/useInteractiveRotation';
import { ParticleMorphConfig } from '../types';
import vertexShader from '../shaders/particleMultiShapeMorph.vert.glsl';
import fragmentShader from '../shaders/particleMorph.frag.glsl';

/**
 * ParticleSystem - Internal component that renders the particle system
 */
function ParticleSystem({
  stages,
  targetParticleCount,
  colors,
  particleSize,
  particleSizeRange,
  scrollProgress,
  rotationConfig,
  particleAnimationConfig,
  onDraggingChange
}: {
  stages: ParticleMorphConfig['stages'];
  targetParticleCount: number;
  colors: { primary?: string; secondary?: string };
  particleSize: number;
  particleSizeRange: { min?: number; max?: number };
  scrollProgress: number;
  rotationConfig: ParticleMorphConfig['rotation'];
  particleAnimationConfig: ParticleMorphConfig['particleAnimation'];
  onDraggingChange: (isDragging: boolean) => void;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const rotationEnabled = rotationConfig?.enabled !== false;
  const dampingFactor = rotationConfig?.dampingFactor ?? 0.08;
  const autoRotateSpeed = rotationConfig?.autoRotateSpeed ?? 0.001;

  const animationEnabled = particleAnimationConfig?.enabled !== false;
  const animationDampingFactor = particleAnimationConfig?.dampingFactor ?? 0.5;
  const driftSpeed = particleAnimationConfig?.driftSpeed ?? 0.5;
  const driftAmplitude = particleAnimationConfig?.driftAmplitude ?? 0.15;

  const { rotation, onPointerDown, onPointerMove, onPointerUp, isDragging } = useInteractiveRotation(
    dampingFactor,
    autoRotateSpeed
  );

  useEffect(() => {
    if (onDraggingChange) {
      onDraggingChange(isDragging);
    }
  }, [isDragging, onDraggingChange]);

  const sizeRangeMin = particleSizeRange?.min ?? 0.2;
  const sizeRangeMax = particleSizeRange?.max ?? 2.0;

  const { geometry, isLoading, error } = useMultiShapeMorphGeometry(
    stages,
    targetParticleCount,
    sizeRangeMin,
    sizeRangeMax
  );

  const primaryColor = useMemo(() => {
    const color = new THREE.Color(colors.primary || '#00ffff');
    return new THREE.Vector3(color.r, color.g, color.b);
  }, [colors.primary]);

  const secondaryColor = useMemo(() => {
    const color = new THREE.Color(colors.secondary || '#0088ff');
    return new THREE.Vector3(color.r, color.g, color.b);
  }, [colors.secondary]);

  const material = useMemo(() => {
    if (!geometry) return null;

    const stageRanges = stages.map(s => new THREE.Vector2(s.scrollStart, s.scrollEnd));
    while (stageRanges.length < 4) {
      stageRanges.push(new THREE.Vector2(1, 1));
    }

    const explosionEnabled = [0, 0, 0, 0];
    const explosionRadii = [10, 10, 10, 10];
    
    stages.forEach((stage, index) => {
      if (index < 4 && stage.explosion?.enabled) {
        explosionEnabled[index] = 1;
        explosionRadii[index] = stage.explosion?.radius ?? 10;
      }
    });
    
    const hasAnyExplosion = explosionEnabled.some(e => e === 1);

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
        uSize: { value: particleSize },
        uColorPrimary: { value: primaryColor.clone() },
        uColorSecondary: { value: secondaryColor.clone() },
        uTime: { value: 0 },
        uAnimationEnabled: { value: animationEnabled ? 1.0 : 0.0 },
        uDampingStrength: { value: animationDampingFactor },
        uDriftSpeed: { value: driftSpeed },
        uDriftAmplitude: { value: driftAmplitude },
        uStage0Range: { value: stageRanges[0] },
        uStage1Range: { value: stageRanges[1] },
        uStage2Range: { value: stageRanges[2] },
        uStage3Range: { value: stageRanges[3] },
        uStageCount: { value: stages.length },
        uHasAnyExplosion: { value: hasAnyExplosion ? 1.0 : 0.0 },
        uExplosionEnabled: { value: new THREE.Vector4(...explosionEnabled) },
        uExplosionRadii: { value: new THREE.Vector4(...explosionRadii) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    
    return mat;
  }, [geometry, primaryColor, secondaryColor, particleSize, animationEnabled, animationDampingFactor, driftSpeed, driftAmplitude, stages]);

  useEffect(() => {
    if (material) {
      material.uniforms.uColorPrimary.value.copy(primaryColor);
      material.uniforms.uColorSecondary.value.copy(secondaryColor);
    }
  }, [material, primaryColor, secondaryColor]);

  useEffect(() => {
    return () => {
      if (material) {
        material.dispose();
      }
    };
  }, [material]);

  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  useFrame((state) => {
    if (material) {
      if (material.uniforms.uProgress.value !== progressRef.current) {
        material.uniforms.uProgress.value = progressRef.current;
      }
      
      if (animationEnabled) {
        material.uniforms.uTime.value = state.clock.getElapsedTime();
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

/**
 * ParticleMorph - Component for morphing particles through multiple shape stages
 * 
 * @example
 * ```tsx
 * <ParticleMorph
 *   stages={[
 *     { shape: { type: 'sphere', size: 5 }, scrollStart: 0, scrollEnd: 0.3 },
 *     { shape: { type: 'box', size: 5 }, scrollStart: 0.3, scrollEnd: 0.5 },
 *     { 
 *       shape: { type: 'torus', size: 5 }, 
 *       scrollStart: 0.5, 
 *       scrollEnd: 1.0,
 *       explosion: { enabled: true, radius: 40 }
 *     }
 *   ]}
 *   targetParticleCount={5000}
 * />
 * ```
 */
export function ParticleMorph({
  stages,
  targetParticleCount = 5000,
  colors = {
    primary: '#00ffff',
    secondary: '#0088ff'
  },
  particleSize = 3,
  particleSizeRange = {
    min: 0.2,
    max: 2.0
  },
  bloom = {
    enabled: true,
    strength: 1.5,
    radius: 0.8,
    threshold: 0.1
  },
  camera = {
    position: [0, 0, 10],
    fov: 75
  },
  rotation = {
    enabled: true,
    dampingFactor: 0.08,
    autoRotateSpeed: 0.001
  },
  particleAnimation = {
    enabled: true,
    dampingFactor: 0.5,
    driftSpeed: 0.5,
    driftAmplitude: 0.15
  },
  background = '#000000',
  className,
  style
}: ParticleMorphConfig) {
  const scrollProgress = useScrollProgress(true);
  
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const bloomEnabled = bloom?.enabled !== false;
  const bloomStrength = bloom?.strength ?? 1.5;
  const bloomRadius = bloom?.radius ?? 0.8;
  const bloomThreshold = bloom?.threshold ?? 0.1;

  const cameraPosition = camera?.position ?? [0, 0, 10];
  const cameraFov = camera?.fov ?? 75;

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        ...style 
      }}
      className={className}
    >
      <div 
        ref={canvasRef}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 0 
        }}
      >
        <Canvas
          camera={{
            position: cameraPosition,
            fov: cameraFov
          }}
          gl={{ 
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
            stencil: false,
            depth: true
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          style={{ 
            background, 
            width: '100%', 
            height: '100%', 
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none'
          }}
        >
          <ParticleSystem
            stages={stages}
            targetParticleCount={targetParticleCount}
            colors={colors}
            particleSize={particleSize}
            particleSizeRange={particleSizeRange}
            scrollProgress={scrollProgress}
            rotationConfig={rotation}
            particleAnimationConfig={particleAnimation}
            onDraggingChange={setIsDragging}
          />

          {bloomEnabled && (
            <EffectComposer>
              <Bloom
                intensity={bloomStrength}
                luminanceThreshold={bloomThreshold}
                luminanceSmoothing={bloomRadius}
              />
            </EffectComposer>
          )}
        </Canvas>
      </div>
    </div>
  );
}

