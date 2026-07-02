const DESKTOP_HOVER_TARGET_DATASET_KEYS = [
  "hoverColor",
  "hoverDozen",
  "hoverHalf",
  "hoverNumbers",
  "hoverParity",
  "hoverRow",
] as const;

function clearDesktopHoverTargetAttributes(shell: HTMLElement) {
  for (const key of DESKTOP_HOVER_TARGET_DATASET_KEYS) {
    delete shell.dataset[key];
  }
}

export function clearDesktopHoverAttributes(shell: HTMLElement) {
  delete shell.dataset.hoverActive;
  clearDesktopHoverTargetAttributes(shell);
}

function getDesktopHoverTrigger(target: EventTarget | null, shell: HTMLElement) {
  if (!(target instanceof Element)) {
    return null;
  }

  const trigger = target.closest<HTMLElement>(".roulette-board-trigger");

  if (!trigger || !shell.contains(trigger)) {
    return null;
  }

  if (trigger instanceof HTMLButtonElement && trigger.disabled) {
    return null;
  }

  return trigger;
}

export function syncDesktopHoverTargetAttributes(
  shell: HTMLElement,
  target: EventTarget | null,
) {
  const trigger = getDesktopHoverTrigger(target, shell);

  if (!trigger) {
    clearDesktopHoverTargetAttributes(shell);
    return;
  }

  const nextHoverColor = trigger.dataset.hoverColor;
  const nextHoverDozen = trigger.dataset.hoverDozen;
  const nextHoverHalf = trigger.dataset.hoverHalf;
  const nextHoverNumbers = trigger.dataset.hoverNumbers;
  const nextHoverParity = trigger.dataset.hoverParity;
  const nextHoverRow = trigger.dataset.hoverRow;

  if (
    shell.dataset.hoverColor === nextHoverColor &&
    shell.dataset.hoverDozen === nextHoverDozen &&
    shell.dataset.hoverHalf === nextHoverHalf &&
    shell.dataset.hoverNumbers === nextHoverNumbers &&
    shell.dataset.hoverParity === nextHoverParity &&
    shell.dataset.hoverRow === nextHoverRow
  ) {
    return;
  }

  clearDesktopHoverTargetAttributes(shell);

  if (nextHoverColor) {
    shell.dataset.hoverColor = nextHoverColor;
  }

  if (nextHoverDozen) {
    shell.dataset.hoverDozen = nextHoverDozen;
  }

  if (nextHoverHalf) {
    shell.dataset.hoverHalf = nextHoverHalf;
  }

  if (nextHoverNumbers) {
    shell.dataset.hoverNumbers = nextHoverNumbers;
  }

  if (nextHoverParity) {
    shell.dataset.hoverParity = nextHoverParity;
  }

  if (nextHoverRow) {
    shell.dataset.hoverRow = nextHoverRow;
  }
}
