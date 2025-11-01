import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'gsap',
    'postprocessing'
  ],
  loader: {
    '.glsl': 'text'
  },
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});

