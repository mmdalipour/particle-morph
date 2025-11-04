"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ParticleMorph = dynamic(
  () =>
    import("../src/components/ParticleMorph").then((mod) => ({
      default: mod.ParticleMorph,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{ width: "100vw", height: "500vh", backgroundColor: "#000000" }}
      />
    ),
  }
);

export default function Home() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    return () => {
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  if (isDesktop === null) {
    return (
      <div
        style={{ width: "100vw", height: "500vh", backgroundColor: "#000000" }}
      />
    );
  }

  if (!isDesktop) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00ffff",
          fontSize: "1.5rem",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        Please view on desktop for the best experience
      </div>
    );
  }

  return (
    <>
      {/* Scroll hint */}
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          color: "#00ffff",
          fontSize: "18px",
          textAlign: "center",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        Scroll down to see the magic
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { type: "box", size: 5 },
            scrollStart: 0,
            scrollEnd: 0.25,
          },
          {
            shape: { type: "sphere", size: 5 },
            scrollStart: 0.25,
            scrollEnd: 1,
            color: "#FFA500",
            explosion: {
              enabled: true,
              radius: 20,
            },
          },
        ]}
        targetParticleCount={5000}
        particleSize={4}
        particleSizeRange={{
          min: 0.1,
          max: 2.0,
        }}
        camera={{
          position: [0, 0, 10],
          fov: 75,
        }}
        interactive
        rotation={{
          x: 0.3, // Initial tilt on X axis (radians)
          y: 0.7, // Initial rotation on Y axis (radians)
          z: 0,
          autoRotate: {
            enabled: true,
            dampingFactor: 0.01, // Smoothness of auto-rotation
            speed: {
              x: 0.01, // Auto-rotation on X
              y: 0.01, // Auto-rotate on Y axis
              z: 0, // No auto-rotation on Z
            },
          },
        }}
        particleColor="#00ffff"
        particleAnimation={{
          enabled: true,
          dampingFactor: 2,
          driftSpeed: 2.5,
          driftAmplitude: 0.75,
        }}
        glow={{
          enabled: true,
          intensity: 1,
          frequency: 10,
          coverage: 0.25,
        }}
      />

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
