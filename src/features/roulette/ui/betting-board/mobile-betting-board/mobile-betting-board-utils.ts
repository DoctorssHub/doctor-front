export function mobileButtonStateClass(isHighlighted: boolean) {
  return isHighlighted
    ? "border-[var(--color-roulette-highlight-border)] brightness-110 shadow-[var(--shadow-roulette-highlight)]"
    : "border-[var(--color-roulette-soft-border)] hover:border-[var(--color-roulette-highlight-border)] hover:brightness-110";
}
