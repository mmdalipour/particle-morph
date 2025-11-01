'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook to track scroll position and convert to smooth 0-1 progress value
 * Progress = 0 at top, 1 after scrolling 2 viewport heights
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const quickToRef = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    // Initialize GSAP QuickTo for smooth animation
    quickToRef.current = gsap.quickTo(progressRef, 'current', {
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(progressRef.current);
      }
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const triggerHeight = window.innerHeight * 2; // 2 viewport heights

      // Calculate scroll progress (0 to 1)
      const rawProgress = scrollY / triggerHeight;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      // Use GSAP to smooth the value
      if (quickToRef.current) {
        quickToRef.current(clampedProgress);
      }
    };

    // Initial calculation
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return progress;
}
