// Uniforms
uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;
uniform float uProgress;

void main() {
  // Create circular particle shape
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Discard fragments outside circle
  if (dist > 0.5) {
    discard;
  }

  // Create radial gradient for glow effect
  float strength = 1.0 - (dist * 2.0);
  strength = pow(strength, 3.0);

  // Mix between primary and secondary colors based on progress
  vec3 mixedColor = mix(uColorPrimary, uColorSecondary, uProgress * 0.5);

  // Apply glow strength
  vec3 finalColor = mixedColor * strength;

  // Output color with alpha based on strength
  float alpha = mix(1.0, 0.6, uProgress);
  gl_FragColor = vec4(finalColor, alpha * strength);
}

