// Uniforms
uniform float uProgress;
uniform float uTime;
uniform float uGlowIntensity;
uniform float uGlowFrequency;
uniform float uGlowCoverage;

// Varying from vertex shader
varying float vDistance;
varying vec3 vColor;
varying float vGlowSeed;

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
  
  // Random glow effect per particle (GPU-efficient)
  float glowNoise = fract(sin(vGlowSeed) * 43758.5453);
  float glowPhase = glowNoise * 6.28318; // Random phase offset
  float glowSpeed = 0.5 + glowNoise * 1.5; // Varied speed per particle
  float glowWave = sin(uTime * uGlowFrequency * glowSpeed + glowPhase);
  
  // Control percentage of particles that glow using coverage parameter
  float glowThreshold = 1.0 - uGlowCoverage;
  float shouldGlow = step(glowThreshold, glowNoise);
  float glowPulse = max(0.0, glowWave) * shouldGlow; // Only positive waves
  
  // Enhanced glow with dramatic brightness increase
  // Create a softer, larger glow halo that extends beyond particle core
  float distFromCenter = sqrt(dist);
  float glowHalo = exp(-distFromCenter * 4.0) * glowPulse; // Exponential falloff for glow
  float glowStrength = glowPulse * uGlowIntensity;
  
  // Apply glow: boost both core and create halo
  float totalBrightness = 1.0 + glowStrength;
  vec3 glowColor = vColor * (strength + glowHalo * glowStrength * 2.0); // Extra bright halo
  vec3 baseColor = vColor * strength;
  vec3 finalColor = mix(baseColor, glowColor * totalBrightness, glowPulse);
  
  // Calculate final alpha with glow contribution
  float baseAlpha = 1.0 - uProgress * 0.15;
  float glowAlphaBoost = glowHalo * glowStrength * 0.5; // Add glow to alpha
  float finalAlpha = baseAlpha * (strength * alpha * 1.2 + glowAlphaBoost);
  
  gl_FragColor = vec4(finalColor, finalAlpha);
}

