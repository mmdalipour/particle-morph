# Examples

This directory contains usage examples for the particle-morph package.

## Examples

### 1. Basic Usage (`basic-usage.tsx`)
The simplest way to get started with ParticleMorph.

### 2. Custom Colors (`custom-colors.tsx`)
Demonstrates how to customize particle colors and bloom effects.

### 3. Without Scroll (`without-scroll.tsx`)
Shows how to disable scroll-based animation for static displays.

### 4. Custom Scene (`custom-scene.tsx`)
How to use ParticleModel in a custom Three.js scene with your own controls and objects.

### 5. Using Hooks (`using-hooks.tsx`)
Demonstrates how to use individual hooks to build custom particle effects.

## Running Examples

To run these examples, import them in your Next.js app:

```tsx
// app/page.tsx
import BasicExample from '../examples/basic-usage';

export default function Page() {
  return <BasicExample />;
}
```

Or use dynamic imports to avoid SSR issues:

```tsx
import dynamic from 'next/dynamic';

const BasicExample = dynamic(() => import('../examples/basic-usage'), {
  ssr: false
});

export default function Page() {
  return <BasicExample />;
}
```

