"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

// Responsive breakpoints
const MOBILE = 0;
const TABLET = 768;
const DESKTOP = 1024;

/**
 * Responsive Example
 * Demonstrates how the particle system automatically adapts to different screen sizes
 * Uses pixel-based breakpoints for maximum flexibility:
 * - 0-767px: 3,000 particles, size 1.8, camera at [0, 0, 15]
 * - 768-1023px: 6,000 particles, size 2.4, camera at [0, 0, 12]
 * - 1024+px: 10,000 particles, size 3, camera at [0, 0, 10]
 */
export default function ResponsiveExample() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          color: "#00ffff",
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        Responsive Particle System
        <div style={{ fontSize: "14px", marginTop: "8px", color: "#888" }}>
          Resize your browser window to see adaptive behavior
        </div>
      </div>

      <ParticleMorph
        stages={[
          {
            shape: {
              type: "sphere",
              // Responsive shape size
              size: {
                [MOBILE]: 4,
                [TABLET]: 4.5,
                [DESKTOP]: 5,
              },
            },
            scrollStart: 0,
            scrollEnd: 0.33,
            color: "#00ffff",
          },
          {
            shape: {
              type: "torus",
              size: {
                [MOBILE]: 4,
                [TABLET]: 4.5,
                [DESKTOP]: 5,
              },
            },
            scrollStart: 0.33,
            scrollEnd: 0.66,
            color: "#ff00ff",
          },
          {
            shape: {
              type: "box",
              size: {
                [MOBILE]: 4,
                [TABLET]: 4.5,
                [DESKTOP]: 5,
              },
            },
            scrollStart: 0.66,
            scrollEnd: 1,
            color: "#ffff00",
          },
        ]}
        // Responsive particle count using pixel breakpoints
        targetParticleCount={{
          [MOBILE]: 3000,      // Mobile devices (0px and up)
          [TABLET]: 6000,      // Tablets (768px and up)
          [DESKTOP]: 10000,    // Desktop (1024px and up)
        }}
        // Responsive particle size
        particleSize={{
          [MOBILE]: 1.8,
          [TABLET]: 2.4,
          [DESKTOP]: 3,
        }}
        // Responsive camera position
        camera={{
          position: {
            [MOBILE]: [0, 0, 15],      // Further away on mobile
            [TABLET]: [0, 0, 12],      // Medium distance on tablet
            [DESKTOP]: [0, 0, 10],     // Close on desktop
          },
          fov: {
            [MOBILE]: 60,
            [TABLET]: 70,
            [DESKTOP]: 75,
          },
        }}
        rotation={{
          x: 0.3,
          y: 0.7,
          z: 0,
          autoRotate: {
            enabled: true,
            dampingFactor: 0.05,
            speed: {
              y: 0.002,
            },
          },
        }}
      />
    </>
  );
}

