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
        Scroll down to see multi-stage morph
      </div>

      <ParticleMorph
        stages={[
          {
            shape: { type: "box", size: 5, segments: 32 },
            scrollStart: 0,
            scrollEnd: 0.5,
          },
          {
            shape: { type: "sphere", size: 5, segments: 32 },
            scrollStart: 0.5,
            scrollEnd: 1,
            explosion: {
              enabled: true,
              radius: 40,
            },
          },
        ]}
        targetParticleCount={5000}
        colors={{
          primary: "#00ffff",
          secondary: "#0088ff",
        }}
        particleSize={4}
        particleSizeRange={{
          min: 0.1,
          max: 2.0,
        }}
        bloom={{
          enabled: true,
          strength: 1.5,
          radius: 0.8,
          threshold: 0.1,
        }}
        camera={{
          position: [0, 0, 10],
          fov: 75,
        }}
        rotation={{
          enabled: true,
          dampingFactor: 0.08,
          autoRotateSpeed: 0.001,
        }}
        particleAnimation={{
          enabled: true,
          dampingFactor: 2,
          driftSpeed: 2.5,
          driftAmplitude: 0.75,
        }}
        background="transparent"
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
