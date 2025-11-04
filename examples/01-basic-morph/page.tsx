"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

/**
 * Basic Morph Example
 * Simple morphing between two shapes: sphere and box
 */
export default function BasicMorphExample() {
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
        Basic Morph: Sphere → Box
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
            shape: { type: "box", size: 5 },
            scrollStart: 0.5,
            scrollEnd: 1,
            color: "#ff00ff",
          },
        ]}
        targetParticleCount={5000}
        particleSize={3}
        camera={{
          position: [0, 0, 10],
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
      />
    </>
  );
}

