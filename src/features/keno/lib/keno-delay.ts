export function delay(duration: number) {
  return new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, duration);
  });
}
