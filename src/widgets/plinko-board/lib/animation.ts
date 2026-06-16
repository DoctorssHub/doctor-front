export type BallPosition = {
  x: number;
  y: number;
};

export type BoardLayout =
  | "regular"
  | "laptop"
  | "tablet"
  | "compact"
  | "narrow";

type PegRadiusRange = {
  maxRowsRadius: number;
  minRowsRadius: number;
};

type LayoutConfig = {
  ballRadius: number;
  boardBottomPadding: number;
  boardWidth: number;
  bucketGap: number;
  bucketHeight: number;
  bucketHorizontalPadding: number;
  bucketRadius: number;
  pegRadius: PegRadiusRange;
  pyramidHeight: number;
  pyramidWidth: number;
  rowStartY: number;
};

const minRowsForPegScale = 8;
const maxRowsForPegScale = 16;

const layoutConfigs: Record<BoardLayout, LayoutConfig> = {
  compact: {
    ballRadius: 7.2,
    boardBottomPadding: 46,
    boardWidth: 340,
    bucketGap: 2,
    bucketHeight: 24,
    bucketHorizontalPadding: 6,
    bucketRadius: 6,
    pegRadius: {
      maxRowsRadius: 2.6,
      minRowsRadius: 4,
    },
    pyramidHeight: 190,
    pyramidWidth: 320,
    rowStartY: 20,
  },
  laptop: {
    ballRadius: 12,
    boardBottomPadding: 68,
    boardWidth: 590,
    bucketGap: 5,
    bucketHeight: 30,
    bucketHorizontalPadding: 9,
    bucketRadius: 8,
    pegRadius: {
      maxRowsRadius: 3.8,
      minRowsRadius: 6,
    },
    pyramidHeight: 388,
    pyramidWidth: 520,
    rowStartY: 30,
  },
  narrow: {
    ballRadius: 5.2,
    boardBottomPadding: 44,
    boardWidth: 286,
    bucketGap: 2,
    bucketHeight: 23,
    bucketHorizontalPadding: 4,
    bucketRadius: 6,
    pegRadius: {
      maxRowsRadius: 2.1,
      minRowsRadius: 3.3,
    },
    pyramidHeight: 172,
    pyramidWidth: 270,
    rowStartY: 18,
  },
  regular: {
    ballRadius: 12.5,
    boardBottomPadding: 74,
    boardWidth: 625,
    bucketGap: 6,
    bucketHeight: 30,
    bucketHorizontalPadding: 10,
    bucketRadius: 8,
    pegRadius: {
      maxRowsRadius: 4.2,
      minRowsRadius: 6.5,
    },
    pyramidHeight: 420,
    pyramidWidth: 558,
    rowStartY: 30,
  },
  tablet: {
    ballRadius: 11,
    boardBottomPadding: 48,
    boardWidth: 460,
    bucketGap: 4,
    bucketHeight: 28,
    bucketHorizontalPadding: 8,
    bucketRadius: 7,
    pegRadius: {
      maxRowsRadius: 2.8,
      minRowsRadius: 4.5,
    },
    pyramidHeight: 260,
    pyramidWidth: 430,
    rowStartY: 22,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getLayoutConfig(layout: BoardLayout) {
  return layoutConfigs[layout];
}

function getRowsDensity(rows: number) {
  return clamp(
    (rows - minRowsForPegScale) / (maxRowsForPegScale - minRowsForPegScale),
    0,
    1,
  );
}

function getPegGap(rows: number, layout: BoardLayout) {
  return getLayoutConfig(layout).pyramidWidth / (rows + 1);
}

export function getBoardWidth(layout: BoardLayout = "regular") {
  return getLayoutConfig(layout).boardWidth;
}

export function getBoardHeight(_rows: number, layout: BoardLayout = "regular") {
  const config = getLayoutConfig(layout);

  return (
    config.rowStartY + config.pyramidHeight + config.boardBottomPadding
  );
}

export function getPegRadius(rows: number, layout: BoardLayout = "regular") {
  const density = getRowsDensity(rows);
  const { maxRowsRadius, minRowsRadius } = getLayoutConfig(layout).pegRadius;

  return minRowsRadius - density * (minRowsRadius - maxRowsRadius);
}

export function getBallRadius(rows: number, layout: BoardLayout = "regular") {
  const config = getLayoutConfig(layout);
  const baseClearPegGap = getClearPegGap(minRowsForPegScale, layout);
  const clearPegGap = getClearPegGap(rows, layout);
  const gapScale = baseClearPegGap > 0 ? clearPegGap / baseClearPegGap : 1;

  return Math.max(0, config.ballRadius * Math.min(1, gapScale));
}

function getClearPegGap(rows: number, layout: BoardLayout) {
  const pegGap = getPegGap(rows, layout);

  return pegGap - getPegRadius(rows, layout) * 2;
}

export function getPegPosition(
  rowIndex: number,
  pegIndex: number,
  rows: number,
  layout: BoardLayout = "regular",
) {
  const config = getLayoutConfig(layout);
  const pegCount = rowIndex + 3;
  const pegGap = getPegGap(rows, layout);
  const rowWidth = (pegCount - 1) * pegGap;
  const currentRowGap = rows > 1 ? config.pyramidHeight / (rows - 1) : 0;

  return {
    x: config.boardWidth / 2 - rowWidth / 2 + pegIndex * pegGap,
    y: config.rowStartY + rowIndex * currentRowGap,
  };
}

export function getBucketLayout(rows: number, layout: BoardLayout = "regular") {
  const config = getLayoutConfig(layout);
  const bucketCount = rows + 1;
  const pegGap = config.pyramidWidth / bucketCount;
  const bucketWidth = Math.max(0, pegGap - config.bucketGap);
  const totalWidth =
    bucketCount * bucketWidth + (bucketCount - 1) * config.bucketGap;

  return {
    bucketGap: config.bucketGap,
    bucketHeight: config.bucketHeight,
    bucketRadius: config.bucketRadius,
    bucketWidth,
    bucketHorizontalPadding: config.bucketHorizontalPadding,
    totalWidth,
  };
}
