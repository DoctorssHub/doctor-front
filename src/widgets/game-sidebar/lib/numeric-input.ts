export function sanitizeIntegerInput(value: string) {
  return value.replace(/\D/g, "");
}
