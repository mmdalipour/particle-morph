// Uniforms
uniform float uProgress;

// Varying from vertex shader
varying float vDistance;
varying vec3 vColor;

void main() {
  // Optimized circular particle with smoothstep for AA
  vec2 center = gl_PointCoord - 0.5;
  float dist = dot(center, center); // Use squared distance for performance
  
  // Smooth alpha cutoff (better than discard for GPU performance)
  float alpha = smoothstep(0.25, 0.2, dist); // 0.5^2 = 0.25
  if (alpha < 0.001) discard; // Only discard fully transparent
  
  // Optimized radial gradient using squared distance
  float strength = 1.0 - sqrt(dist) * 2.0;
  strength = strength * strength * strength; // Faster than pow(strength, 3.0)
  
  // Use interpolated color from vertex shader
  vec3 finalColor = vColor * strength;
  
  // Calculate final alpha
  float baseAlpha = 1.0 - uProgress * 0.15; // Equivalent to mix(1.0, 0.85, uProgress)
  float finalAlpha = baseAlpha * strength * alpha * 1.2;
  
  gl_FragColor = vec4(finalColor, finalAlpha);
}

