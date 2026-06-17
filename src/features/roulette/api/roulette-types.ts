export type RouletteConfigResponse = {
  minBet: number;
  maxBet: number;
};

export type RouletteAmount = string;

export type RouletteColor = "RED" | "BLACK";
export type RouletteParity = "EVEN" | "ODD";
export type RouletteHalf = "LOW" | "HIGH";
export type RouletteDozen = "FIRST" | "SECOND" | "THIRD";
export type RouletteColumn = "TOP" | "MIDDLE" | "BOTTOM";

export type RouletteBetParams = {
  straightValues: Array<{
    straightNumber: number;
    amount: RouletteAmount;
  }>;
  colorValues: Array<{
    color: RouletteColor;
    amount: RouletteAmount;
  }>;
  parityValues: Array<{
    parity: RouletteParity;
    amount: RouletteAmount;
  }>;
  halfValues: Array<{
    half: RouletteHalf;
    amount: RouletteAmount;
  }>;
  dozenValues: Array<{
    dozen: RouletteDozen;
    amount: RouletteAmount;
  }>;
  columnValues: Array<{
    column: RouletteColumn;
    amount: RouletteAmount;
  }>;
  splitValues: Array<{
    firstNumber: number;
    secondNumber: number;
    amount: RouletteAmount;
  }>;
  cornerValues: Array<{
    firstNumber: number;
    secondNumber: number;
    thirdNumber: number;
    fourthNumber: number;
    amount: RouletteAmount;
  }>;
  streetValues: Array<{
    street: number[];
    amount: RouletteAmount;
  }>;
  doubleStreetValues: Array<{
    firstStreet: number[];
    secondStreet: number[];
    amount: RouletteAmount;
  }>;
};

export type RouletteBetRequest = {
  params: RouletteBetParams;
};

export type RouletteBetResponse = {
  createdAt: string;
  betId: string;
  betSize: string;
  payout: string;
  randomPosition: number;
  multiplier: number;
};
