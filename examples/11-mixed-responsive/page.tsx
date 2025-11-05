"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

// Responsive breakpoints
const MOBILE = 0;
const DESKTOP = 1024;

/**
 * Mixed Responsive Example
 * Demonstrates mixing responsive and non-responsive values
 * Shows that all parameters accept both their original type AND responsive objects
 */
export default function MixedResponsiveExample() {
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
        Mixed Responsive Example
        <div style={{ fontSize: "14px", marginTop: "8px", color: "#888" }}>
          Some parameters responsive, others fixed
        </div>
      </div>

      <ParticleMorph
        stages={[
          {
            shape: {
              type: "sphere",
              size: 5, // ✅ Plain number - same for all devices
            },
            scrollStart: 0,
            scrollEnd: 0.5,
            color: "#00ffff",
          },
          {
            shape: {
              type: "box",
              // ✅ Responsive object - adapts to screen size
              size: {
                [MOBILE]: 4,
                [DESKTOP]: 5,
              },
            },
            scrollStart: 0.5,
            scrollEnd: 1,
            color: "#ff00ff",
            explosion: {
              enabled: true,
              radius: 18, // ✅ Plain number - same explosion for all devices
            },
          },
        ]}
        // ✅ Responsive - adapts to screen size
        targetParticleCount={{
          [MOBILE]: 2000,
          [DESKTOP]: 5000,
        }}
        // ✅ Plain number - same size for all devices
        particleSize={3}
        // ✅ Responsive camera position
        camera={{
          position: {
            [MOBILE]: [0, 0, 15],
            [DESKTOP]: [0, 0, 10],
          },
          // ✅ Plain number - same FOV for all devices
          fov: 75,
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


