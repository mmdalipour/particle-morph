import { useState, useEffect } from 'react';
import { ResponsiveValue } from '../types';

/**
 * Hook to get current viewport width
 */
export function useResponsive(): number {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

/**
 * Utility function to resolve a responsive value based on current viewport width
 * @param value - Either a direct value or a ResponsiveValue object with pixel breakpoints
 * @param currentWidth - Current viewport width in pixels
 * @returns The resolved value for the current viewport width
 * 
 * @example
 * // Direct value
 * resolveResponsiveValue(5000, 800) // returns 5000
 * 
 * // Responsive object
 * resolveResponsiveValue({ 0: 3000, 768: 6000, 1024: 10000 }, 800) // returns 6000
 * resolveResponsiveValue({ 0: 3000, 768: 6000, 1024: 10000 }, 500) // returns 3000
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  currentWidth: number
): T {
  // If it's a direct value (not an object with numeric keys), return it
  if (value === null || value === undefined) {
    return value as T;
  }
  
  if (typeof value !== 'object' || Array.isArray(value)) {
    return value as T;
  }

  const responsiveValue = value as { [breakpoint: number]: T };
  
  // Get all breakpoint keys and sort them
  const breakpoints = Object.keys(responsiveValue)
    .map(Number)
    .filter(bp => !isNaN(bp))
    .sort((a, b) => a - b);

  // If no valid numeric breakpoints, return the value as-is
  if (breakpoints.length === 0) {
    return value as T;
  }

  // Find the appropriate breakpoint for the current width
  // Use the largest breakpoint that is <= currentWidth
  let selectedBreakpoint = breakpoints[0];
  for (const breakpoint of breakpoints) {
    if (breakpoint <= currentWidth) {
      selectedBreakpoint = breakpoint;
    } else {
      break;
    }
  }

  return responsiveValue[selectedBreakpoint];
}

