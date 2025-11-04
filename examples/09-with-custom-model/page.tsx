"use client";

import { ParticleMorph } from "../../src/components/ParticleMorph";

/**
 * Custom 3D Model Example
 * Demonstrates morphing with a custom GLTF/GLB model
 * Note: Make sure the model file exists at the specified path
 */
export default function CustomModelExample() {
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
          maxWidth: "80%",
        }}
      >
        Custom 3D Model: Sphere Model → Geometric Shapes
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
        Replace '/models/sphere.glb' with your own 3D model path
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { 
              type: "model", 
              modelPath: "/models/sphere.glb" 
            },
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
            shape: { type: "box", size: 5 },
            scrollStart: 0.66,
            scrollEnd: 1,
            color: "#ffff00",
            explosion: {
              enabled: true,
              radius: 45,
            },
          },
        ]}
        targetParticleCount={8000}
        particleSize={3.5}
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
          x: 0,
          y: 0,
          z: 0,
          autoRotate: {
            enabled: true,
            dampingFactor: 0.05,
            speed: {
              y: 0.002,
            },
          },
        }}
        particleAnimation={{
          enabled: true,
          dampingFactor: 1.0,
          driftSpeed: 1.5,
          driftAmplitude: 0.6,
        }}
      />
    </>
  );
}

