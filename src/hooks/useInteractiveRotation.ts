'use client';

import { useState, useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { UseInteractiveRotationReturn } from '../types';

/**
 * Hook for smooth interactive rotation with camera-relative drag behavior
 * @param initialRotation - Initial rotation in radians for x, y, z axes
 * @param autoRotateEnabled - Enable auto-rotation when stopped (default: true)
 * @param autoRotateDampingFactor - Controls auto-rotation smoothness (default: 0.05)
 * @param autoRotateSpeed - Auto-rotation speeds when idle
 * @param interactiveEnabled - Enable pointer interactions (default: true)
 */
export function useInteractiveRotation(
  initialRotation: { x?: number; y?: number; z?: number } = {},
  autoRotateEnabled: boolean = true,
  autoRotateDampingFactor: number = 0.05,
  autoRotateSpeed: { 
    x?: number;
    y?: number;
    z?: number;
  } = {},
  interactiveEnabled: boolean = true
): UseInteractiveRotationReturn {
  const { camera } = useThree();
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  
  const initialX = initialRotation.x ?? 0;
  const initialY = initialRotation.y ?? 0;
  const initialZ = initialRotation.z ?? 0;
  
  // Use quaternion for camera-relative rotation
  const quaternion = useRef<THREE.Quaternion | null>(null);
  const targetQuaternion = useRef<THREE.Quaternion | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  
  // Initialize quaternion from initial Euler angles
  if (!quaternion.current) {
    const initialEuler = new THREE.Euler(initialX, initialY, initialZ, 'YXZ');
    quaternion.current = new THREE.Quaternion().setFromEuler(initialEuler);
    targetQuaternion.current = quaternion.current.clone();
  }

  const [rotation, setRotation] = useState(new THREE.Euler(initialX, initialY, initialZ, 'YXZ'));

  const onPointerDown = useCallback((event: any) => {
    if (!interactiveEnabled) return;
    
    event.stopPropagation?.();
    isDraggingRef.current = true;
    setIsDragging(true);
    
    const nativeEvent = event.nativeEvent || event;
    const clientX = nativeEvent.clientX ?? nativeEvent.touches?.[0]?.clientX ?? 0;
    const clientY = nativeEvent.clientY ?? nativeEvent.touches?.[0]?.clientY ?? 0;
    
    previousMousePosition.current = { x: clientX, y: clientY };
    
    // Sync target with current rotation to prevent jumps when starting drag
    if (quaternion.current && targetQuaternion.current) {
      targetQuaternion.current.copy(quaternion.current);
    }
    
    // Reset velocity to prevent momentum from interfering with initial drag
    velocity.current = { x: 0, y: 0 };
  }, [interactiveEnabled]);

  const onPointerMove = useCallback((event: any) => {
    if (!interactiveEnabled || !isDraggingRef.current || !targetQuaternion.current) return;
    event.stopPropagation?.();

    const nativeEvent = event.nativeEvent || event;
    const clientX = nativeEvent.clientX ?? nativeEvent.touches?.[0]?.clientX ?? 0;
    const clientY = nativeEvent.clientY ?? nativeEvent.touches?.[0]?.clientY ?? 0;

    const deltaX = clientX - previousMousePosition.current.x;
    const deltaY = clientY - previousMousePosition.current.y;

    // Extract camera axes for screen-relative rotation
    const cameraRight = new THREE.Vector3();
    const cameraUp = new THREE.Vector3();
    camera.matrix.extractBasis(cameraRight, cameraUp, new THREE.Vector3());
    
    // Rotate around camera axes (drag direction matches visual movement)
    const horizontalRotation = new THREE.Quaternion().setFromAxisAngle(cameraUp.normalize(), deltaX * 0.005);
    const verticalRotation = new THREE.Quaternion().setFromAxisAngle(cameraRight.normalize(), deltaY * 0.005);
    
    targetQuaternion.current.premultiply(horizontalRotation);
    targetQuaternion.current.premultiply(verticalRotation);
    
    // Store velocity with smoothing for better momentum
    const newVelocityX = deltaY * 0.002;
    const newVelocityY = deltaX * 0.002;
    velocity.current.x = velocity.current.x * 0.7 + newVelocityX * 0.3;
    velocity.current.y = velocity.current.y * 0.7 + newVelocityY * 0.3;

    previousMousePosition.current = { x: clientX, y: clientY };
  }, [camera, interactiveEnabled]);

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  useFrame(() => {
    if (!quaternion.current || !targetQuaternion.current) return;

    if (isDraggingRef.current && interactiveEnabled) {
      // Smooth response during drag - feels more natural and fluid
      quaternion.current.slerp(targetQuaternion.current, 0.12);
    } else {
      // Only apply velocity if interactive is enabled
      if (interactiveEnabled) {
        // Apply velocity for momentum effect
        const cameraRight = new THREE.Vector3();
        const cameraUp = new THREE.Vector3();
        camera.matrix.extractBasis(cameraRight, cameraUp, new THREE.Vector3());
        
        targetQuaternion.current.premultiply(
          new THREE.Quaternion().setFromAxisAngle(cameraUp.normalize(), velocity.current.y)
        );
        targetQuaternion.current.premultiply(
          new THREE.Quaternion().setFromAxisAngle(cameraRight.normalize(), velocity.current.x)
        );
        
        // Decay velocity smoothly (friction effect)
        velocity.current.x *= 0.97;
        velocity.current.y *= 0.97;
      }

      // Check if velocity is very small or interactive is disabled
      const stopped = Math.abs(velocity.current.x) < 0.0001 && Math.abs(velocity.current.y) < 0.0001;
      
      if (stopped && autoRotateEnabled) {
        // Transition to auto-rotation when stopped
        const { x = 0, y = 0, z = 0 } = autoRotateSpeed;
        if (x) targetQuaternion.current.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), x));
        if (y) targetQuaternion.current.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), y));
        if (z) targetQuaternion.current.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), z));
        
        // Apply damping only during auto-rotation
        quaternion.current.slerp(targetQuaternion.current, autoRotateDampingFactor);
      } else if (interactiveEnabled) {
        // Smooth response for momentum (slight damping for smoothness)
        quaternion.current.slerp(targetQuaternion.current, 0.12);
      }
    }

    setRotation(new THREE.Euler().setFromQuaternion(quaternion.current, 'YXZ'));
  });

  return {
    rotation,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    isDragging
  };
}
