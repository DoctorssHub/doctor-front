export function sanitizeDecimalInput(value: string) {
  const normalizedValue = value.replace(",", ".");
  const [integerPart = "", ...fractionParts] = normalizedValue
    .replace(/[^\d.]/g, "")
    .split(".");
  const fractionPart = fractionParts.join("");

  return fractionParts.length > 0
    ? `${integerPart}.${fractionPart}`
    : integerPart;
}
