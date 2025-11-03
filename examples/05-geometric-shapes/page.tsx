"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

/**
 * Geometric Shapes Example
 * Showcases all available geometric shapes
 */
export default function GeometricShapesExample() {
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
          fontSize: "18px",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        All Geometric Shapes: Sphere → Box → Torus → Cone → Cylinder →
        Dodecahedron → Octahedron → Tetrahedron
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { type: "sphere", size: 5, segments: 32 },
            scrollStart: 0,
            scrollEnd: 0.125,
            color: "#ff0066",
          },
          {
            shape: { type: "box", size: 5, segments: 32 },
            scrollStart: 0.125,
            scrollEnd: 0.25,
            color: "#ff6600",
          },
          {
            shape: { type: "torus", size: 3, segments: 32 },
            scrollStart: 0.25,
            scrollEnd: 0.375,
            color: "#ffcc00",
          },
          {
            shape: { type: "cone", size: 5, segments: 32 },
            scrollStart: 0.375,
            scrollEnd: 0.5,
            color: "#66ff00",
          },
        ]}
        targetParticleCount={7000}
        particleSize={3}
        particleSizeRange={{
          min: 0.2,
          max: 2.0,
        }}
        bloom={{
          enabled: true,
          strength: 1.8,
          radius: 0.9,
          threshold: 0.1,
        }}
        camera={{
          position: [0, 0, 12],
          fov: 75,
        }}
        rotation={{
          enabled: true,
          dampingFactor: 0.08,
          autoRotateSpeed: 0.002,
        }}
        particleAnimation={{
          enabled: true,
          dampingFactor: 0.7,
          driftSpeed: 1.2,
          driftAmplitude: 0.4,
        }}
      />
    </>
  );
}

