"use client";

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

// Responsive breakpoints
const MOBILE = 0;
const TABLET = 768;
const DESKTOP = 1024;

export default function Home() {
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
            shape: {
              type: "box",
              // Responsive shape size
              size: {
                [MOBILE]: 4,
                [TABLET]: 4.5,
                [DESKTOP]: 5,
              },
            },
            scrollStart: 0,
            scrollEnd: 0.25,
          },
          {
            shape: {
              type: "sphere",
              size: {
                [MOBILE]: 4,
                [TABLET]: 4.5,
                [DESKTOP]: 5,
              },
            },
            scrollStart: 0.25,
            scrollEnd: 1,
            color: "#FFA500",
            explosion: {
              enabled: true,
              // Responsive explosion radius
              radius: {
                [MOBILE]: 15,    // Smaller explosion on mobile
                [TABLET]: 17,    // Medium explosion on tablet
                [DESKTOP]: 20,   // Full explosion on desktop
              },
            },
          },
        ]}
        // Responsive particle count - adapts to screen size
        targetParticleCount={{
          [MOBILE]: 2000,      // Mobile: reduced for better performance
          [TABLET]: 3500,      // Tablet: medium particle count
          [DESKTOP]: 5000,     // Desktop: full particle count
        }}
        // Responsive particle size
        particleSize={{
          [MOBILE]: 3,
          [TABLET]: 3.5,
          [DESKTOP]: 4,
        }}
        particleSizeRange={{
          min: 0.1,
          max: 2.0,
        }}
        // Responsive camera position - further on mobile for better view
        camera={{
          position: {
            [MOBILE]: [0, 0, 15],    // Mobile: further away
            [TABLET]: [0, 0, 12],    // Tablet: medium distance
            [DESKTOP]: [0, 0, 10],   // Desktop: close
          },
          fov: 75,
        }}
        rotation={{
          x: 0.3,
          y: 0.7,
          z: 0,
          autoRotate: {
            enabled: true,
            dampingFactor: 0.01,
            speed: {
              x: 0.01,
              y: 0.01,
              z: 0,
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
