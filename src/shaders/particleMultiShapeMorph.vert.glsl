// Custom attributes - positions for each stage
attribute vec3 position0;
attribute vec3 position1;
attribute vec3 position2;
attribute vec3 position3;
attribute vec3 animationSeed;
attribute float dampingFactor;
attribute float particleScale;

// Uniforms
uniform float uProgress;
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;
uniform float uAnimationEnabled;
uniform float uDampingStrength;
uniform float uDriftSpeed;
uniform float uDriftAmplitude;
uniform float uGlowCoverage;

// Stage configuration (x: scrollStart, y: scrollEnd)
uniform vec2 uStage0Range;
uniform vec2 uStage1Range;
uniform vec2 uStage2Range;
uniform vec2 uStage3Range;
uniform float uStageCount;
uniform float uHasAnyExplosion;
uniform vec4 uExplosionEnabled; // x=stage0, y=stage1, z=stage2, w=stage3
uniform vec4 uExplosionRadii;   // x=stage0, y=stage1, z=stage2, w=stage3

// Stage colors
uniform vec3 uStage0Color;
uniform vec3 uStage1Color;
uniform vec3 uStage2Color;
uniform vec3 uStage3Color;

// Varying to pass data to fragment shader
varying float vDistance;
varying vec3 vColor;
varying float vGlowSeed;

// Realistic explosion expansion - fast burst with deceleration
// Simulates initial explosive force that slows down over time
float smoothExplosionExpand(float t) {
  // Exponential ease-out for realistic physics
  // Fast start that decelerates (like real explosions)
  return 1.0 - exp(-4.0 * t);
}

// Realistic implosion/gathering - accelerates as particles are pulled back
float smoothExplosionReverse(float t) {
  // Exponential ease-in for accelerating implosion
  // Starts slow and speeds up (like gravity pulling inward)
  return exp(4.0 * (t - 1.0));
}

vec3 getInterpolatedPosition(out vec3 interpolatedColor) {
  // Simple approach: iterate through stages and interpolate between them
  
  // Stage 0: transition to position1
  if (uProgress < uStage0Range.y) {
    float stageProgress = (uProgress - uStage0Range.x) / (uStage0Range.y - uStage0Range.x);
    stageProgress = clamp(stageProgress, 0.0, 1.0);
    if (uStageCount > 1.0) {
      interpolatedColor = mix(uStage0Color, uStage1Color, stageProgress);
      return mix(position0, position1, stageProgress);
    }
    interpolatedColor = uStage0Color;
    return position0;
  } 
  // Stage 1: transition to position2
  else if (uProgress < uStage1Range.y) {
    float stageProgress = (uProgress - uStage1Range.x) / (uStage1Range.y - uStage1Range.x);
    stageProgress = clamp(stageProgress, 0.0, 1.0);
    if (uStageCount > 2.0) {
      interpolatedColor = mix(uStage1Color, uStage2Color, stageProgress);
      return mix(position1, position2, stageProgress);
    }
    interpolatedColor = uStage1Color;
    return position1;
  } 
  // Stage 2: transition to position3
  else if (uProgress < uStage2Range.y) {
    float stageProgress = (uProgress - uStage2Range.x) / (uStage2Range.y - uStage2Range.x);
    stageProgress = clamp(stageProgress, 0.0, 1.0);
    if (uStageCount > 3.0) {
      interpolatedColor = mix(uStage2Color, uStage3Color, stageProgress);
      return mix(position2, position3, stageProgress);
    }
    interpolatedColor = uStage2Color;
    return position2;
  }
  // Stage 3 or beyond
  else {
    if (uStageCount > 3.0) {
      interpolatedColor = uStage3Color;
      return position3;
    }
    if (uStageCount > 2.0) {
      interpolatedColor = uStage2Color;
      return position2;
    }
    if (uStageCount > 1.0) {
      interpolatedColor = uStage1Color;
      return position1;
    }
    interpolatedColor = uStage0Color;
    return position0;
  }
}

void main() {
  // Get interpolated position and color based on current progress
  vec3 interpolatedColor;
  vec3 basePosition = getInterpolatedPosition(interpolatedColor);
  vec3 finalPosition = basePosition;
  vColor = interpolatedColor;
  
  // Apply explosion effects for all stages that have it enabled
  if (uHasAnyExplosion > 0.5) {
    vec3 totalExplosionOffset = vec3(0.0);
    
    // Process each stage's explosion
    for (int i = 0; i < 4; i++) {
      float stageExplosionEnabled = 0.0;
      float explosionRadius = 10.0;
      vec2 stageRange = vec2(1.0, 1.0);
      vec3 explosionStagePosition = position0;
      
      // Get stage-specific data
      if (i == 0) {
        stageExplosionEnabled = uExplosionEnabled.x;
        explosionRadius = uExplosionRadii.x;
        stageRange = uStage0Range;
        explosionStagePosition = position0;
      } else if (i == 1) {
        stageExplosionEnabled = uExplosionEnabled.y;
        explosionRadius = uExplosionRadii.y;
        stageRange = uStage1Range;
        explosionStagePosition = position1;
      } else if (i == 2) {
        stageExplosionEnabled = uExplosionEnabled.z;
        explosionRadius = uExplosionRadii.z;
        stageRange = uStage2Range;
        explosionStagePosition = position2;
      } else if (i == 3) {
        stageExplosionEnabled = uExplosionEnabled.w;
        explosionRadius = uExplosionRadii.w;
        stageRange = uStage3Range;
        explosionStagePosition = position3;
      }
      
      // Skip if explosion not enabled for this stage
      if (stageExplosionEnabled < 0.5) continue;
      
      // Skip if we haven't reached this stage yet
      if (uProgress < stageRange.x) continue;
      
      // Check if next stage has explosion enabled
      float nextStageHasExplosion = 0.0;
      if (i == 0 && i + 1 < int(uStageCount)) {
        nextStageHasExplosion = uExplosionEnabled.y;
      } else if (i == 1 && i + 1 < int(uStageCount)) {
        nextStageHasExplosion = uExplosionEnabled.z;
      } else if (i == 2 && i + 1 < int(uStageCount)) {
        nextStageHasExplosion = uExplosionEnabled.w;
      }
      
      float explosionIntensity = 0.0;
      float stageDuration = stageRange.y - stageRange.x;
      float stageProgress = (uProgress - stageRange.x) / stageDuration;
      stageProgress = clamp(stageProgress, 0.0, 1.0);
      
      // During explosion stage
      if (uProgress >= stageRange.x && uProgress <= stageRange.y) {
        // If next stage has explosion, split current stage: expand first half, contract second half
        if (nextStageHasExplosion > 0.5) {
          if (stageProgress < 0.5) {
            // First half: expand from 0 to 1 with smooth ease-in
            float expandProgress = stageProgress * 2.0; // 0->0.5 becomes 0->1
            explosionIntensity = smoothExplosionExpand(expandProgress);
          } else {
            // Second half: contract from 1 to 0 with ultra smooth easing
            float contractionProgress = (stageProgress - 0.5) * 2.0; // 0.5->1 becomes 0->1
            explosionIntensity = 1.0 - smoothExplosionReverse(contractionProgress);
          }
        } else {
          // No explosion in next stage: expand throughout this stage with smooth ease-in
          explosionIntensity = smoothExplosionExpand(stageProgress);
        }
      } 
      // After explosion stage: only contract if next stage doesn't have explosion
      else if (uProgress > stageRange.y && nextStageHasExplosion < 0.5) {
        // Find next stage range
        vec2 nextStageRange = vec2(stageRange.y, 1.0);
        if (i == 0 && uStageCount > 1.0) {
          nextStageRange = uStage1Range;
        } else if (i == 1 && uStageCount > 2.0) {
          nextStageRange = uStage2Range;
        } else if (i == 2 && uStageCount > 3.0) {
          nextStageRange = uStage3Range;
        }
        
        // Contract during the next stage with ultra smooth easing
        if (uProgress <= nextStageRange.y) {
          float contractionProgress = (uProgress - nextStageRange.x) / (nextStageRange.y - nextStageRange.x);
          contractionProgress = clamp(contractionProgress, 0.0, 1.0);
          explosionIntensity = 1.0 - smoothExplosionReverse(contractionProgress);
        }
      }
      
      // Apply explosion offset if intensity > 0
      if (explosionIntensity > 0.0) {
        // Calculate direction from the explosion stage position
        float posLen = length(explosionStagePosition);
        vec3 direction = posLen > 0.001 ? explosionStagePosition / posLen : animationSeed;
        
        // Pre-compute hash values for randomness (reuse calculations)
        float hash1 = animationSeed.x * 12.9898 + animationSeed.y * 78.233 + float(i) * 43.758;
        float hash2 = animationSeed.y * 12.9898 + animationSeed.z * 78.233 + float(i) * 43.758;
        float hash3 = animationSeed.z * 12.9898 + animationSeed.x * 78.233 + float(i) * 43.758;
        
        // Generate chaotic randomness per particle
        vec3 randomOffset = vec3(
          sin(hash1) * 2.0 - 1.0,
          sin(hash2) * 2.0 - 1.0,
          sin(hash3) * 2.0 - 1.0
        );
        
        // More chaotic direction - higher randomness for realistic explosion
        vec3 mixedDirection = direction * 0.4 + randomOffset * 0.6;
        float mixLen = length(mixedDirection);
        vec3 chaoticDirection = mixLen > 0.001 ? mixedDirection / mixLen : direction;
        
        // Variable particle speeds - some particles fly faster than others
        float speedVariation = 0.5 + abs(sin(animationSeed.x * 27.182 + animationSeed.z * 31.415)) * 0.8;
        
        // Add turbulence/rotation during explosion (optimized)
        float turbulenceAngle = (animationSeed.x + animationSeed.y) * 6.28318;
        float turbulence = sin(turbulenceAngle + explosionIntensity * 3.0) * 0.15;
        vec3 turbulentOffset = vec3(
          cos(turbulenceAngle) * turbulence,
          sin(turbulenceAngle * 1.3) * turbulence,
          cos(turbulenceAngle * 0.7) * turbulence
        );
        
        // Combine all effects for realistic explosion
        vec3 finalDirection = chaoticDirection + turbulentOffset;
        
        totalExplosionOffset += finalDirection * explosionRadius * explosionIntensity * speedVariation;
      }
    }
    
    finalPosition += totalExplosionOffset;
  }
  
  // Apply dust-like damping animation if enabled (optimized)
  if (uAnimationEnabled > 0.5) {
    // Pre-calculate time offsets
    float baseTime = uTime * uDriftSpeed;
    vec3 timeOffsets = baseTime + animationSeed;
    
    // Simplified drift calculation with fewer trig operations
    vec3 drift = vec3(
      sin(timeOffsets.x) * cos(timeOffsets.y * 0.7),
      sin(timeOffsets.y) * cos(timeOffsets.z * 0.8),
      sin(timeOffsets.z) * cos(timeOffsets.x * 0.6)
    );
    
    // Combine multiplications
    float driftScale = uDriftAmplitude * mix(0.06, 0.2, dampingFactor) * uDampingStrength;
    
    finalPosition += drift * driftScale;
  }

  vec4 modelViewPosition = modelViewMatrix * vec4(finalPosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  float distance = -modelViewPosition.z;
  vDistance = distance;
  
  // Pass per-particle random seed for glow effect
  vGlowSeed = animationSeed.x * 43758.5453 + animationSeed.y * 12.9898 + animationSeed.z * 78.233;
  
  // Make particles larger when they might glow for better visibility
  float glowNoise = fract(sin(vGlowSeed) * 43758.5453);
  float glowThreshold = 1.0 - uGlowCoverage;
  float sizeMultiplier = 1.0 + step(glowThreshold, glowNoise) * 0.5; // 50% larger for glow particles
  
  float sizeAttenuation = 1.0 / max(distance, 1.0);
  gl_PointSize = uSize * uPixelRatio * sizeAttenuation * particleScale * 10.0 * sizeMultiplier + 0.5;
}

