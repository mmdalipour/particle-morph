"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

/**
 * High Particle Count Example
 * Tests performance with a large number of particles
 */
export default function HighParticleCountExample() {
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
        High Particle Count: 15,000 particles
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
        Performance test - may affect FPS on lower-end devices
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { type: "sphere", size: 6 },
            scrollStart: 0,
            scrollEnd: 0.33,
            color: "#00ffff",
          },
          {
            shape: { type: "torus", size: 4 },
            scrollStart: 0.33,
            scrollEnd: 0.66,
            color: "#ff00ff",
          },
          {
            shape: { type: "dodecahedron", size: 6 },
            scrollStart: 0.66,
            scrollEnd: 1,
            color: "#ffff00",
          },
        ]}
        targetParticleCount={15000}
        particleSize={2.5}
        particleSizeRange={{
          min: 0.1,
          max: 1.5,
        }}
        camera={{
          position: [0, 0, 14],
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
              y: 0.001,
            },
          },
        }}
        particleAnimation={{
          enabled: true,
          dampingFactor: 0.4,
          driftSpeed: 0.8,
          driftAmplitude: 0.2,
        }}
      />
    </>
  );
}

