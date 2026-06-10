import type {
  RouletteBetParams,
  RouletteBetRequest,
  RouletteColor,
  RouletteColumn,
  RouletteDozen,
  RouletteHalf,
  RouletteParity,
} from "../api/roulette-types";

export type NewRouletteBet =
  | {
      kind: "straight";
      straightNumber: number;
    }
  | {
      kind: "color";
      color: RouletteColor;
    }
  | {
      kind: "parity";
      parity: RouletteParity;
    }
  | {
      kind: "half";
      half: RouletteHalf;
    }
  | {
      kind: "dozen";
      dozen: RouletteDozen;
    }
  | {
      kind: "column";
      column: RouletteColumn;
    };

export type PlacedRouletteBet = NewRouletteBet & {
  id: string;
  amount: number;
};

export function getPlacedBetsTotal(bets: PlacedRouletteBet[]) {
  return bets.reduce((total, bet) => total + bet.amount, 0);
}

export function formatRouletteAmount(amount: number) {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

function createEmptyRouletteBetParams(): RouletteBetParams {
  return {
    straightValues: [],
    colorValues: [],
    parityValues: [],
    halfValues: [],
    dozenValues: [],
    columnValues: [],
    splitValues: [],
    cornerValues: [],
    streetValues: [],
    doubleStreetValues: [],
  };
}

export function buildRouletteBetPayload(
  bets: PlacedRouletteBet[],
): RouletteBetRequest {
  const params = createEmptyRouletteBetParams();

  for (const bet of bets) {
    const amount = formatRouletteAmount(bet.amount);

    if (bet.kind === "straight") {
      params.straightValues.push({
        straightNumber: bet.straightNumber,
        amount,
      });
    }

    if (bet.kind === "color") {
      params.colorValues.push({ color: bet.color, amount });
    }

    if (bet.kind === "parity") {
      params.parityValues.push({ parity: bet.parity, amount });
    }

    if (bet.kind === "half") {
      params.halfValues.push({ half: bet.half, amount });
    }

    if (bet.kind === "dozen") {
      params.dozenValues.push({ dozen: bet.dozen, amount });
    }

    if (bet.kind === "column") {
      params.columnValues.push({ column: bet.column, amount });
    }
  }

  return { params };
}
