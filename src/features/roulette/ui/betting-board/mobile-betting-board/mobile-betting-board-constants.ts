export const MOBILE_NUMBER_ROWS = Array.from({ length: 12 }, (_, rowIndex) =>
  Array.from({ length: 3 }, (_, columnIndex) => rowIndex * 3 + columnIndex + 1),
);

export const MOBILE_DOZEN_AREAS = [
  { label: "1 to 12", min: 1, max: 12, dozen: "FIRST" as const },
  { label: "13 to 24", min: 13, max: 24, dozen: "SECOND" as const },
  { label: "25 to 36", min: 25, max: 36, dozen: "THIRD" as const },
] as const;
