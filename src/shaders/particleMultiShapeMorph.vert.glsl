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

// Smooth ease-in for explosion expansion (starts slow, accelerates gradually)
float smoothExplosionExpand(float t) {
  // Cubic ease-in-out for smooth start
  float smoothed = smoothstep(0.0, 1.0, t);
  // Apply another layer of smoothing
  return smoothed * smoothed;
}

// Ultra smooth easing function for explosion reverse
// Combines exponential and smoothstep for maximum smoothness
float smoothExplosionReverse(float t) {
  // First apply smoothstep for initial smoothness
  float smoothed = smoothstep(0.0, 1.0, t);
  // Then apply exponential ease-out for extra smoothness
  smoothed = 1.0 - exp(-5.0 * smoothed);
  // Normalize back to 0-1 range
  return smoothed / (1.0 - exp(-5.0));
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
        vec3 direction = normalize(explosionStagePosition);
        
        if (length(explosionStagePosition) < 0.001) {
          direction = normalize(animationSeed);
        }
        
        // Add consistent randomness per particle
        vec3 randomOffset = normalize(vec3(
          sin(animationSeed.x * 12.9898 + animationSeed.y * 78.233 + float(i) * 43.758) * 2.0 - 1.0,
          sin(animationSeed.y * 12.9898 + animationSeed.z * 78.233 + float(i) * 43.758) * 2.0 - 1.0,
          sin(animationSeed.z * 12.9898 + animationSeed.x * 78.233 + float(i) * 43.758) * 2.0 - 1.0
        ));
        
        vec3 messyDirection = normalize(direction * 0.7 + randomOffset * 0.3);
        float easedIntensity = explosionIntensity * explosionIntensity;
        
        totalExplosionOffset += messyDirection * explosionRadius * easedIntensity;
      }
    }
    
    finalPosition += totalExplosionOffset;
  }
  
  // Apply dust-like damping animation if enabled
  if (uAnimationEnabled > 0.5) {
    float timeX = uTime * uDriftSpeed + animationSeed.x;
    float timeY = uTime * uDriftSpeed + animationSeed.y;
    float timeZ = uTime * uDriftSpeed + animationSeed.z;
    
    vec3 drift = vec3(
      sin(timeX) * cos(timeY * 0.7),
      sin(timeY) * cos(timeZ * 0.8),
      sin(timeZ) * cos(timeX * 0.6)
    );
    
    float particleDamping = mix(0.3, 1.0, dampingFactor);
    float totalDamping = particleDamping * uDampingStrength;
    
    float baseAnimation = 0.2;
    float driftScale = uDriftAmplitude * totalDamping * baseAnimation;
    
    finalPosition += drift * driftScale;
  }

  vec4 modelViewPosition = modelViewMatrix * vec4(finalPosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  float distance = -modelViewPosition.z;
  vDistance = distance;
  
  float sizeAttenuation = 1.0 / max(distance, 1.0);
  gl_PointSize = uSize * uPixelRatio * sizeAttenuation * particleScale * 10.0 + 0.5;
}

