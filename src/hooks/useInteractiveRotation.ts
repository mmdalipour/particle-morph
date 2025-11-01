'use client';

import { useState, useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { UseInteractiveRotationReturn } from '../types';

interface RotationState {
  current: THREE.Euler;
  target: THREE.Euler;
  velocity: THREE.Euler;
}

/**
 * Hook for smooth interactive rotation with damping
 * @param dampingFactor - Controls smoothness of rotation (default: 0.08)
 * @param autoRotateSpeed - Speed of automatic rotation when idle (default: 0.001)
 */
export function useInteractiveRotation(
  dampingFactor: number = 0.08,
  autoRotateSpeed: number = 0.001
): UseInteractiveRotationReturn {
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  
  const rotationState = useRef<RotationState>({
    current: new THREE.Euler(0, 0, 0),
    target: new THREE.Euler(0, 0, 0),
    velocity: new THREE.Euler(0, 0, 0)
  });

  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));

  const onPointerDown = useCallback((event: any) => {
    event.stopPropagation?.();
    isDraggingRef.current = true;
    setIsDragging(true);
    
    const nativeEvent = event.nativeEvent || event;
    const clientX = nativeEvent.clientX ?? nativeEvent.touches?.[0]?.clientX ?? 0;
    const clientY = nativeEvent.clientY ?? nativeEvent.touches?.[0]?.clientY ?? 0;
    
    previousMousePosition.current = { x: clientX, y: clientY };
  }, []);

  const onPointerMove = useCallback((event: any) => {
    if (!isDraggingRef.current) return;
    event.stopPropagation?.();

    const nativeEvent = event.nativeEvent || event;
    const clientX = nativeEvent.clientX ?? nativeEvent.touches?.[0]?.clientX ?? 0;
    const clientY = nativeEvent.clientY ?? nativeEvent.touches?.[0]?.clientY ?? 0;

    const deltaX = clientX - previousMousePosition.current.x;
    const deltaY = clientY - previousMousePosition.current.y;

    rotationState.current.target.y += deltaX * 0.01;
    rotationState.current.target.x += deltaY * 0.01;

    rotationState.current.velocity.y = deltaX * 0.001;
    rotationState.current.velocity.x = deltaY * 0.001;

    previousMousePosition.current = { x: clientX, y: clientY };
  }, []);

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  useFrame(() => {
    const state = rotationState.current;

    if (!isDraggingRef.current) {
      state.target.x += state.velocity.x;
      state.target.y += state.velocity.y;
      
      state.velocity.x *= 0.95;
      state.velocity.y *= 0.95;

      if (Math.abs(state.velocity.x) < 0.0001 && Math.abs(state.velocity.y) < 0.0001) {
        state.target.y += autoRotateSpeed;
      }
    }

    state.current.x += (state.target.x - state.current.x) * dampingFactor;
    state.current.y += (state.target.y - state.current.y) * dampingFactor;
    state.current.z += (state.target.z - state.current.z) * dampingFactor;

    setRotation(new THREE.Euler(state.current.x, state.current.y, state.current.z));
  });

  return {
    rotation,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    isDragging
  };
}

