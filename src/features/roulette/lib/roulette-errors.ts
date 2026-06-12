export function getRouletteErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Bet request failed";
}
