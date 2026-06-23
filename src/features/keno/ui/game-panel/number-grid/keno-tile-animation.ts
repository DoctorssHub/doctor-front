export const KENO_TILE_SCALE_KEYFRAMES: Keyframe[] = [
  { transform: "scale(1)" },
  { offset: 0.55, transform: "scale(1.12)" },
  { transform: "scale(1)" },
];

export const KENO_TILE_SCALE_ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 260,
  easing: "cubic-bezier(0.2, 0.9, 0.28, 1.1)",
};
