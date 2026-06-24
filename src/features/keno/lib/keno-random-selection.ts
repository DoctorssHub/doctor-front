import { KENO_NUMBERS } from "../model/keno-constants";

export function pickRandomKenoNumbers(excludedNumbers: number[], amount: number) {
  const excluded = new Set(excludedNumbers);
  const availableNumbers = KENO_NUMBERS.filter(
    (number) => !excluded.has(number),
  );

  for (let index = availableNumbers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [availableNumbers[index], availableNumbers[randomIndex]] = [
      availableNumbers[randomIndex],
      availableNumbers[index],
    ];
  }

  return availableNumbers.slice(0, amount);
}
