"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

/**
 * Multi-Stage Morph Example
 * Morphing through 4 different shapes with color transitions
 */
export default function MultiStageExample() {
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
        Multi-Stage: Sphere → Torus → Dodecahedron → Octahedron
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { type: "sphere", size: 5 },
            scrollStart: 0,
            scrollEnd: 0.25,
            color: "#00ffff",
          },
          {
            shape: { type: "torus", size: 3 },
            scrollStart: 0.25,
            scrollEnd: 0.5,
            color: "#0088ff",
          },
          {
            shape: { type: "dodecahedron", size: 5 },
            scrollStart: 0.5,
            scrollEnd: 0.75,
            color: "#ff00ff",
          },
          {
            shape: { type: "octahedron", size: 5 },
            scrollStart: 0.75,
            scrollEnd: 1,
            color: "#ffff00",
          },
        ]}
        targetParticleCount={8000}
        particleSize={3}
        particleSizeRange={{
          min: 0.2,
          max: 1.5,
        }}
        bloom={{
          enabled: true,
          strength: 2.0,
          radius: 0.9,
          threshold: 0.05,
        }}
        camera={{
          position: [0, 0, 12],
          fov: 75,
        }}
        rotation={{
          enabled: true,
          dampingFactor: 0.1,
          autoRotateSpeed: 0.002,
        }}
        particleAnimation={{
          enabled: true,
          dampingFactor: 0.8,
          driftSpeed: 1.0,
          driftAmplitude: 0.3,
        }}
      />
    </>
  );
}

