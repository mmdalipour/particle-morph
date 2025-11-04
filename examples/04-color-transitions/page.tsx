"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

/**
 * Color Transitions Example
 * Showcases smooth color transitions between shapes
 */
export default function ColorTransitionsExample() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          color: "#ffffff",
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        Rainbow Morphing: Watch the color transitions
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { type: "sphere", size: 5 },
            scrollStart: 0,
            scrollEnd: 0.2,
            color: "#ff0000", // Red
          },
          {
            shape: { type: "torus", size: 3 },
            scrollStart: 0.2,
            scrollEnd: 0.4,
            color: "#ff8800", // Orange
          },
          {
            shape: { type: "box", size: 5 },
            scrollStart: 0.4,
            scrollEnd: 0.6,
            color: "#00ff00", // Green
          },
          {
            shape: { type: "cone", size: 5 },
            scrollStart: 0.6,
            scrollEnd: 0.8,
            color: "#0088ff", // Blue
          },
        ]}
        targetParticleCount={6000}
        particleSize={3.5}
        particleSizeRange={{
          min: 0.3,
          max: 1.8,
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
              y: 0.003,
            },
          },
        }}
        particleAnimation={{
          enabled: true,
          dampingFactor: 0.6,
          driftSpeed: 1.5,
          driftAmplitude: 0.5,
        }}
      />
    </>
  );
}

