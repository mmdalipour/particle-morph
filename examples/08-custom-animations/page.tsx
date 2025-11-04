"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

/**
 * Custom Animations Example
 * Demonstrates different particle animation settings
 */
export default function CustomAnimationsExample() {
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
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        Custom Particle Animations
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          color: "#ff00ff",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        High damping + Fast drift = Energetic dust-like effect
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { type: "sphere", size: 5 },
            scrollStart: 0,
            scrollEnd: 0.5,
            color: "#00ffff",
          },
          {
            shape: { type: "octahedron", size: 5 },
            scrollStart: 0.5,
            scrollEnd: 1,
            color: "#ff00ff",
          },
        ]}
        targetParticleCount={8000}
        particleSize={3.5}
        particleSizeRange={{
          min: 0.2,
          max: 2.5,
        }}
        camera={{
          position: [0, 0, 12],
          fov: 75,
        }}
        rotation={{
          x: 0,
          y: 0,
          z: 0,
          autoRotate: {
            enabled: true,
            dampingFactor: 0.05,
            speed: {
              y: 0.004,
            },
          },
        }}
        particleAnimation={{
          enabled: true,
          dampingFactor: 3.0, // Very high damping
          driftSpeed: 4.0, // Fast drift
          driftAmplitude: 1.2, // Large amplitude
        }}
      />
    </>
  );
}

