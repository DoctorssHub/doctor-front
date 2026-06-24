type GetKenoBetButtonLabelParams = {
  isAutoBetStopRequested: boolean;
  isAutoBetting: boolean;
  isAutoMode: boolean;
  isBetting: boolean;
};

export function getKenoBetButtonLabel({
  isAutoBetStopRequested,
  isAutoBetting,
  isAutoMode,
  isBetting,
}: GetKenoBetButtonLabelParams) {
  if (isAutoBetting) {
    return isAutoBetStopRequested ? "Stopping..." : "Stop Autobet";
  }

  if (isAutoMode) {
    return "Start Autobet";
  }

  if (isBetting) {
    return "Betting...";
  }

  return "Bet";
}
