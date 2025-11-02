// Custom attributes
attribute vec3 scatteredPosition;
attribute float randomFactor;

// Uniforms
uniform float uProgress;
uniform float uPixelRatio;
uniform float uSize;

// Varying to pass data to fragment shader
varying float vDistance;

void main() {
  // Interpolate between formed and scattered positions
  vec3 finalPosition = mix(position, scatteredPosition, uProgress);

  // Single matrix multiplication (GPU optimized)
  vec4 modelViewPosition = modelViewMatrix * vec4(finalPosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  // Optimized distance calculation and size attenuation
  float distance = -modelViewPosition.z;
  vDistance = distance;
  
  // Simplified size calculation (avoid max/branching on GPU)
  float sizeAttenuation = 1.0 / max(distance, 1.0);
  gl_PointSize = uSize * uPixelRatio * sizeAttenuation * 10.0 + 0.5;
}

