'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useMultiShapeMorphGeometry } from '../hooks/useMultiShapeMorphGeometry';
import { useInteractiveRotation } from '../hooks/useInteractiveRotation';
import { useResponsive, resolveResponsiveValue } from '../hooks/useResponsive';
import { ParticleMorphConfig, ShapeStage } from '../types';
import vertexShader from '../shaders/particleMultiShapeMorph.vert.glsl';
import fragmentShader from '../shaders/particleMorph.frag.glsl';

// Resolved stage type with plain numbers (ResponsiveValues resolved)
type ResolvedShapeStage = {
  shape: {
    type: ShapeStage['shape']['type'];
    size?: number;
    modelPath?: string;
  };
  scrollStart: number;
  scrollEnd: number;
  color?: string;
  explosion?: {
    enabled: boolean;
    radius: number;
  };
};

/**
 * ParticleSystem - Internal component that renders the particle system
 */
function ParticleSystem({
  stages,
  targetParticleCount,
  particleColor,
  particleSize,
  particleSizeRange,
  scrollProgress,
  interactiveEnabled,
  rotationConfig,
  particleAnimationConfig,
  glowConfig,
  onDraggingChange
}: {
  stages: ResolvedShapeStage[];
  targetParticleCount: number;
  particleColor: string;
  particleSize: number;
  particleSizeRange: { min?: number; max?: number };
  scrollProgress: number;
  interactiveEnabled: boolean;
  rotationConfig: ParticleMorphConfig['rotation'];
  particleAnimationConfig: ParticleMorphConfig['particleAnimation'];
  glowConfig: ParticleMorphConfig['glow'];
  onDraggingChange: (isDragging: boolean) => void;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const rotationEnabled = rotationConfig !== undefined;
  const initialRotation = {
    x: rotationConfig?.x ?? 0,
    y: rotationConfig?.y ?? 0,
    z: rotationConfig?.z ?? 0
  };
  const autoRotateEnabled = rotationConfig?.autoRotate?.enabled ?? true;
  const autoRotateDampingFactor = rotationConfig?.autoRotate?.dampingFactor ?? 0.05;
  const autoRotateSpeed = rotationConfig?.autoRotate?.speed ?? {};

  const animationEnabled = particleAnimationConfig?.enabled !== false;
  const animationDampingFactor = particleAnimationConfig?.dampingFactor ?? 0.5;
  const driftSpeed = particleAnimationConfig?.driftSpeed ?? 0.5;
  const driftAmplitude = particleAnimationConfig?.driftAmplitude ?? 0.15;

  const glowEnabled = glowConfig?.enabled !== false;
  const glowIntensity = glowConfig?.intensity ?? 1.5;
  const glowFrequency = glowConfig?.frequency ?? 1.0;
  const glowCoverage = glowConfig?.coverage ?? 0.25;

  const { rotation, onPointerDown, onPointerMove, onPointerUp, isDragging } = useInteractiveRotation(
    initialRotation,
    autoRotateEnabled,
    autoRotateDampingFactor,
    autoRotateSpeed,
    interactiveEnabled
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

  // Extract colors from stages - stage color takes priority over default particleColor
  const stageColors = useMemo(() => {
    const colors: THREE.Vector3[] = [];
    
    for (let i = 0; i < 4; i++) {
      // Stage color has priority, fallback to particleColor prop
      const colorStr = stages[i]?.color || particleColor;
      const color = new THREE.Color(colorStr);
      colors.push(new THREE.Vector3(color.r, color.g, color.b));
    }
    
    return colors;
  }, [stages, particleColor]);

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
        uStage0Color: { value: stageColors[0].clone() },
        uStage1Color: { value: stageColors[1].clone() },
        uStage2Color: { value: stageColors[2].clone() },
        uStage3Color: { value: stageColors[3].clone() },
        uTime: { value: 0 },
        uAnimationEnabled: { value: animationEnabled ? 1.0 : 0.0 },
        uDampingStrength: { value: animationDampingFactor },
        uDriftSpeed: { value: driftSpeed },
        uDriftAmplitude: { value: driftAmplitude },
        uGlowIntensity: { value: glowEnabled ? glowIntensity : 0.0 },
        uGlowFrequency: { value: glowFrequency },
        uGlowCoverage: { value: glowCoverage },
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
  }, [geometry, stageColors, particleSize, animationEnabled, animationDampingFactor, driftSpeed, driftAmplitude, glowEnabled, glowIntensity, glowFrequency, glowCoverage, stages]);

  useEffect(() => {
    if (material) {
      material.uniforms.uStage0Color.value.copy(stageColors[0]);
      material.uniforms.uStage1Color.value.copy(stageColors[1]);
      material.uniforms.uStage2Color.value.copy(stageColors[2]);
      material.uniforms.uStage3Color.value.copy(stageColors[3]);
    }
  }, [material, stageColors]);

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
      // Only update if progress changed significantly (reduces GPU updates)
      const progressDiff = Math.abs(material.uniforms.uProgress.value - progressRef.current);
      if (progressDiff > 0.001) {
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
      {rotationEnabled && interactiveEnabled && (
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
 *     { shape: { type: 'box', size: 5 }, scrollStart: 0.3, scrollEnd: 0.5, color: '#ff0000' },
 *     { 
 *       shape: { type: 'torus', size: 5 }, 
 *       scrollStart: 0.5, 
 *       scrollEnd: 1.0,
 *       explosion: { enabled: true, radius: 40 }
 *     }
 *   ]}
 *   particleColor="#00ffff"
 *   targetParticleCount={5000}
 *   interactive={true}
 *   rotation={{
 *     x: 0.3,
 *     y: 0.7,
 *     z: 0,
 *     autoRotate: {
 *       enabled: true,
 *       dampingFactor: 0.05,
 *       speed: { x: 0, y: 0.01, z: 0 }
 *     }
 *   }}
 * />
 * ```
 */
export function ParticleMorph({
  stages,
  targetParticleCount = 5000,
  particleColor = '#ffffff',
  particleSize = 3,
  particleSizeRange = {
    min: 0.2,
    max: 2.0
  },
  camera = {
    position: [0, 0, 10],
    fov: 75
  },
  interactive = false,
  rotation,
  particleAnimation = {
    enabled: true,
    dampingFactor: 0.5,
    driftSpeed: 0.5,
    driftAmplitude: 0.15
  },
  glow = {
    enabled: true,
    intensity: 1.5,
    frequency: 1.0,
    coverage: 0.25
  },
  className,
  style
}: ParticleMorphConfig) {
  const scrollProgress = useScrollProgress(true);
  const currentWidth = useResponsive();
  
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Resolve responsive values for each parameter
  const resolvedParticleCount = Math.round(
    resolveResponsiveValue(targetParticleCount, currentWidth)
  );
  const resolvedParticleSize = resolveResponsiveValue(particleSize, currentWidth);

  // Resolve camera values
  const resolvedCameraPosition: [number, number, number] = resolveResponsiveValue(
    camera?.position ?? [0, 0, 10],
    currentWidth
  ) as [number, number, number];
  const resolvedCameraFov = resolveResponsiveValue(
    camera?.fov ?? 75,
    currentWidth
  );

  // Resolve responsive shape sizes and explosion radii in stages
  const resolvedStages = useMemo(() => {
    return stages.map(stage => ({
      ...stage,
      shape: {
        ...stage.shape,
        size: resolveResponsiveValue(stage.shape.size ?? 5, currentWidth) as number
      },
      explosion: stage.explosion ? {
        enabled: stage.explosion.enabled,
        radius: resolveResponsiveValue(stage.explosion.radius, currentWidth) as number
      } : undefined
    }));
  }, [stages, currentWidth]);
  
  const interactiveEnabled = interactive === true; // Default to false

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
            position: resolvedCameraPosition,
            fov: resolvedCameraFov
          }}
          gl={{ 
            antialias: false, // Disable antialiasing for better performance
            powerPreference: 'high-performance',
            alpha: true, // Enable alpha for transparency
            stencil: false,
            depth: true,
            precision: 'mediump' // Use medium precision for better performance
          }}
          dpr={[1, 1.5]} // Reduce max DPR from 2 to 1.5
          performance={{ min: 0.5, max: 1 }}
          frameloop="always"
          style={{ 
            width: '100%', 
            height: '100%', 
            cursor: interactiveEnabled ? (isDragging ? 'grabbing' : 'grab') : 'default',
            touchAction: interactiveEnabled ? 'none' : 'auto'
          }}
        >
          <ParticleSystem
            stages={resolvedStages}
            targetParticleCount={resolvedParticleCount}
            particleColor={particleColor}
            particleSize={resolvedParticleSize}
            particleSizeRange={particleSizeRange}
            scrollProgress={scrollProgress}
            interactiveEnabled={interactiveEnabled}
            rotationConfig={rotation}
            particleAnimationConfig={particleAnimation}
            glowConfig={glow}
            onDraggingChange={setIsDragging}
          />
        </Canvas>
      </div>
    </div>
  );
}

