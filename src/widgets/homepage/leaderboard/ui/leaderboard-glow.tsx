export function LeaderboardGlow() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[90px] z-0 h-[1213px] w-[1213px] max-w-none -translate-x-1/2 overflow-visible"
      fill="none"
      viewBox="0 0 1213 1213"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#leaderboard-glow-blur)">
        <path
          d="M-353 679.153L532.729 120H718.5L1660 679.153H-353Z"
          fill="url(#leaderboard-glow-gradient)"
          fillOpacity="0.3"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="1213"
          id="leaderboard-glow-blur"
          width="2253"
          x="-473"
          y="0"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            mode="normal"
            result="shape"
          />
          <feGaussianBlur
            result="effect1_foregroundBlur_10050_976"
            stdDeviation="60"
          />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="leaderboard-glow-gradient"
          x1="668.349"
          x2="666.297"
          y1="143.788"
          y2="636.959"
        >
          <stop stopColor="#00FFAA" stopOpacity="0.5" />
          <stop offset="0.34" stopColor="#24A6C7" />
          <stop offset="1" stopColor="#6A00FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
