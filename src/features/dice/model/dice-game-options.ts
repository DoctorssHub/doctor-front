export type DiceMode = "manual" | "auto";

export type DiceAutoConfig = {
  onWinMode: "reset" | "increase";
  onWinIncrease: string;
  onLossMode: "reset" | "increase";
  onLossIncrease: string;
  stopOnProfit: string;
  stopOnLoss: string;
};

export const DEFAULT_DICE_AUTO_CONFIG: DiceAutoConfig = {
  onWinMode: "reset",
  onWinIncrease: "0.00",
  onLossMode: "reset",
  onLossIncrease: "0.00",
  stopOnProfit: "1.00",
  stopOnLoss: "1.00",
};