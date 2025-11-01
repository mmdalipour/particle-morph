// Custom attributes
attribute vec3 scatteredPosition;
attribute float randomFactor;

// Uniforms
uniform float uProgress;
uniform float uPixelRatio;
uniform float uSize;

void main() {
  // Start formed (progress=0), scatter as you scroll down (progress=1)
  vec3 finalPosition = mix(position, scatteredPosition, uProgress);

  // Apply transformations
  vec4 modelViewPosition = modelViewMatrix * vec4(finalPosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  // Calculate point size based on distance from camera
  float distanceFromCamera = -modelViewPosition.z;
  gl_PointSize = uSize * uPixelRatio * (1.0 / distanceFromCamera) * 10.0;
}
