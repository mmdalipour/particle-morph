'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook to track scroll position and convert to smooth 0-1 progress value
 * @param triggerHeight - Number of viewport heights to scroll for full progress (default: 2)
 * @returns Progress value from 0 to 1
 */
export function useScrollProgress(triggerHeight: number = 2): number {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const quickToRef = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    quickToRef.current = gsap.quickTo(progressRef, 'current', {
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(progressRef.current);
      }
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = window.innerHeight * triggerHeight;

      const rawProgress = scrollY / scrollHeight;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      if (quickToRef.current) {
        quickToRef.current(clampedProgress);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [triggerHeight]);

  return progress;
}

