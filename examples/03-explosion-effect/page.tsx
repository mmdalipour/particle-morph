"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

/**
 * Explosion Effect Example
 * Demonstrates the explosion feature where particles scatter
 */
export default function ExplosionExample() {
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
        Explosion Effect: Box → Sphere (Explodes!)
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          color: "#ff00ff",
          fontSize: "16px",
          textAlign: "center",
        }}
      >
        Keep scrolling to see the explosion effect
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { type: "box", size: 5 },
            scrollStart: 0,
            scrollEnd: 0.5,
            color: "#00ffff",
          },
          {
            shape: { type: "sphere", size: 5 },
            scrollStart: 0.5,
            scrollEnd: 1,
            color: "#ff00ff",
            explosion: {
              enabled: true,
              radius: 50,
            },
          },
        ]}
        targetParticleCount={10000}
        particleSize={4}
        particleSizeRange={{
          min: 0.1,
          max: 2.5,
        }}
        bloom={{
          enabled: true,
          strength: 2.5,
          radius: 1.0,
          threshold: 0.05,
        }}
        camera={{
          position: [0, 0, 15],
          fov: 75,
        }}
        rotation={{
          enabled: true,
          dampingFactor: 0.05,
          autoRotateSpeed: 0.0015,
        }}
        particleAnimation={{
          enabled: true,
          dampingFactor: 1.5,
          driftSpeed: 2.0,
          driftAmplitude: 1.0,
        }}
      />
    </>
  );
}

