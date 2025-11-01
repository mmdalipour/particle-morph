'use client';

import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ParticleSystem from './ParticleSystem';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { particleSceneConfig } from '@/config/particle-scene.config';

export default function ParticleScene() {
  const scrollProgress = useScrollProgress();
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ width: '100vw', height: '300vh', position: 'relative' }}>
      <div 
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
      >
        <Canvas
          camera={{
            position: particleSceneConfig.camera.position,
            fov: particleSceneConfig.camera.fov
          }}
          gl={{ antialias: true }}
          style={{ 
            background: '#000000', 
            width: '100%', 
            height: '100%', 
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none'
          }}
        >
          {/* Particle system */}
          <ParticleSystem 
            scrollProgress={scrollProgress}
            setIsDragging={setIsDragging}
          />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom
              intensity={particleSceneConfig.bloom.strength}
              luminanceThreshold={particleSceneConfig.bloom.threshold}
              luminanceSmoothing={particleSceneConfig.bloom.radius}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}
