"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

/**
 * Minimal Example
 * The simplest possible configuration with default settings
 */
export default function MinimalExample() {
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
        Minimal Configuration
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { type: "sphere", size: 5 },
            scrollStart: 0,
            scrollEnd: 0.5,
          },
          {
            shape: { type: "box", size: 5 },
            scrollStart: 0.5,
            scrollEnd: 1,
          },
        ]}
      />
    </>
  );
}

