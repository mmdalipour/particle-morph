'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ParticleMorph = dynamic(
  () => import('../src/components/ParticleMorph').then(mod => ({ default: mod.ParticleMorph })),
  { 
    ssr: false,
    loading: () => <div style={{ width: '100vw', height: '300vh', backgroundColor: '#000000' }} />
  }
);

export default function Home() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);

    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  if (isDesktop === null) {
    return <div style={{ width: '100vw', height: '300vh', backgroundColor: '#000000' }} />;
  }

  if (!isDesktop) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00ffff',
        fontSize: '1.5rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        Please view on desktop for the best experience
      </div>
    );
  }

  return (
    <ParticleMorph
      modelPath="/models/sphere.glb"
      targetParticleCount={5000}
      dispersalRadius={40}
      colors={{
        primary: '#00ffff',
        secondary: '#0088ff'
      }}
      particleSize={3}
      bloom={{
        enabled: true,
        strength: 1.5,
        radius: 0.8,
        threshold: 0.1
      }}
      camera={{
        position: [0, 0, 10],
        fov: 75
      }}
      rotation={{
        enabled: true,
        dampingFactor: 0.08,
        autoRotateSpeed: 0.001
      }}
      scroll={{
        enabled: true,
        triggerHeight: 2
      }}
      background="#000000"
    />
  );
}
