'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroFallback from './HeroFallback';

// Dynamically import ParticleScene to avoid SSR issues
const ParticleScene = dynamic(() => import('./ParticleScene'), {
  ssr: false,
  loading: () => <div style={{ width: '100vw', height: '300vh', backgroundColor: '#000000' }} />
});

export default function ParticleHero() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    // Check viewport width
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkViewport();

    // Listen for resize
    window.addEventListener('resize', checkViewport);

    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  // Show nothing until we know the viewport size (prevents flash)
  if (isDesktop === null) {
    return <div style={{ width: '100vw', height: '300vh', backgroundColor: '#000000' }} />;
  }

  // Render appropriate component based on viewport
  return isDesktop ? <ParticleScene /> : <HeroFallback />;
}
