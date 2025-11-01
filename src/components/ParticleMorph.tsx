'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ParticleModel } from './ParticleModel';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { ParticleMorphConfig } from '../types';

/**
 * ParticleMorph - Main component for 3D particle morph effect
 * 
 * @example
 * ```tsx
 * <ParticleMorph
 *   modelPath="/models/skull.glb"
 *   targetParticleCount={5000}
 *   colors={{ primary: '#00ffff', secondary: '#0088ff' }}
 *   scroll={{ enabled: true }}
 *   rotation={{ enabled: true }}
 * />
 * ```
 */
export function ParticleMorph({
  modelPath,
  targetParticleCount = 5000,
  dispersalRadius = 40,
  colors = {
    primary: '#00ffff',
    secondary: '#0088ff'
  },
  particleSize = 3,
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
  scroll = {
    enabled: true,
    triggerHeight: 2
  },
  background = '#000000',
  className,
  style
}: ParticleMorphConfig) {
  const scrollEnabled = scroll?.enabled !== false;
  const triggerHeight = scroll?.triggerHeight ?? 2;
  const scrollProgress = useScrollProgress(scrollEnabled ? triggerHeight : 0);
  
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const bloomEnabled = bloom?.enabled !== false;
  const bloomStrength = bloom?.strength ?? 1.5;
  const bloomRadius = bloom?.radius ?? 0.8;
  const bloomThreshold = bloom?.threshold ?? 0.1;

  const cameraPosition = camera?.position ?? [0, 0, 10];
  const cameraFov = camera?.fov ?? 75;

  const containerHeight = scrollEnabled ? '300vh' : '100vh';

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: containerHeight, 
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
          gl={{ antialias: true }}
          style={{ 
            background, 
            width: '100%', 
            height: '100%', 
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none'
          }}
        >
          <ParticleModel
            modelPath={modelPath}
            targetParticleCount={targetParticleCount}
            dispersalRadius={dispersalRadius}
            colors={colors}
            particleSize={particleSize}
            scrollProgress={scrollEnabled ? scrollProgress : 0}
            rotationConfig={rotation}
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

