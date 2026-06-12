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

const boardWidthByLayout: Record<BoardLayout, number> = {
  compact: 340,
  laptop: 590,
  narrow: 286,
  regular: 625,
  tablet: 460,
};
const rowStartYByLayout: Record<BoardLayout, number> = {
  compact: 20,
  laptop: 30,
  narrow: 18,
  regular: 30,
  tablet: 22,
};
const pyramidHeightByLayout: Record<BoardLayout, number> = {
  compact: 190,
  laptop: 388,
  narrow: 172,
  regular: 420,
  tablet: 260,
};
const pyramidWidthByLayout: Record<BoardLayout, number> = {
  compact: 320,
  laptop: 520,
  narrow: 270,
  regular: 558,
  tablet: 430,
};
const boardBottomPaddingByLayout: Record<BoardLayout, number> = {
  compact: 46,
  laptop: 68,
  narrow: 44,
  regular: 74,
  tablet: 48,
};
const bucketGapByLayout: Record<BoardLayout, number> = {
  compact: 2,
  laptop: 5,
  narrow: 2,
  regular: 6,
  tablet: 4,
};
const bucketHeightByLayout: Record<BoardLayout, number> = {
  compact: 24,
  laptop: 30,
  narrow: 23,
  regular: 30,
  tablet: 28,
};
const bucketRadiusByLayout: Record<BoardLayout, number> = {
  compact: 6,
  laptop: 8,
  narrow: 6,
  regular: 8,
  tablet: 7,
};
const bucketHorizontalPaddingByLayout: Record<BoardLayout, number> = {
  compact: 6,
  laptop: 9,
  narrow: 4,
  regular: 10,
  tablet: 8,
};
const minRowsForPegScale = 8;
const maxRowsForPegScale = 16;
const pegRadiusByLayout: Record<
  BoardLayout,
  { maxRowsRadius: number; minRowsRadius: number }
> = {
  compact: {
    maxRowsRadius: 2.6,
    minRowsRadius: 4,
  },
  laptop: {
    maxRowsRadius: 3.8,
    minRowsRadius: 6,
  },
  narrow: {
    maxRowsRadius: 2.1,
    minRowsRadius: 3.3,
  },
  regular: {
    maxRowsRadius: 4.2,
    minRowsRadius: 6.5,
  },
  tablet: {
    maxRowsRadius: 2.8,
    minRowsRadius: 4.5,
  },
};
const ballRadiusByLayout: Record<BoardLayout, number> = {
  compact: 7.2,
  laptop: 12,
  narrow: 5.2,
  regular: 12.5,
  tablet: 11,
};

export function getBoardWidth(layout: BoardLayout = "regular") {
  return boardWidthByLayout[layout];
}

export function getBoardHeight(_rows: number, layout: BoardLayout = "regular") {
  return (
    rowStartYByLayout[layout] +
    pyramidHeightByLayout[layout] +
    boardBottomPaddingByLayout[layout]
  );
}

export function getPegRadius(rows: number, layout: BoardLayout = "regular") {
  const density = Math.min(
    1,
    Math.max(
      0,
      (rows - minRowsForPegScale) / (maxRowsForPegScale - minRowsForPegScale),
    ),
  );
  const { maxRowsRadius, minRowsRadius } = pegRadiusByLayout[layout];

  return minRowsRadius - density * (minRowsRadius - maxRowsRadius);
}

export function getBallRadius(rows: number, layout: BoardLayout = "regular") {
  const baseClearPegGap = getClearPegGap(minRowsForPegScale, layout);
  const clearPegGap = getClearPegGap(rows, layout);
  const gapScale = baseClearPegGap > 0 ? clearPegGap / baseClearPegGap : 1;

  return Math.max(0, ballRadiusByLayout[layout] * Math.min(1, gapScale));
}

function getClearPegGap(rows: number, layout: BoardLayout) {
  const pegGap = pyramidWidthByLayout[layout] / (rows + 1);

  return pegGap - getPegRadius(rows, layout) * 2;
}

export function getPegPosition(
  rowIndex: number,
  pegIndex: number,
  rows: number,
  layout: BoardLayout = "regular",
) {
  const pegCount = rowIndex + 3;
  const pegGap = pyramidWidthByLayout[layout] / (rows + 1);
  const rowWidth = (pegCount - 1) * pegGap;
  const rowStartY = rowStartYByLayout[layout];
  const currentRowGap =
    rows > 1 ? pyramidHeightByLayout[layout] / (rows - 1) : 0;

  return {
    x: boardWidthByLayout[layout] / 2 - rowWidth / 2 + pegIndex * pegGap,
    y: rowStartY + rowIndex * currentRowGap,
  };
}

export function getBucketLayout(rows: number, layout: BoardLayout = "regular") {
  const bucketCount = rows + 1;
  const bucketGap = bucketGapByLayout[layout];
  const pegGap = pyramidWidthByLayout[layout] / bucketCount;
  const bucketWidth = Math.max(0, pegGap - bucketGap);
  const totalWidth = bucketCount * bucketWidth + (bucketCount - 1) * bucketGap;

  return {
    bucketGap,
    bucketHeight: bucketHeightByLayout[layout],
    bucketRadius: bucketRadiusByLayout[layout],
    bucketWidth,
    bucketHorizontalPadding: bucketHorizontalPaddingByLayout[layout],
    totalWidth,
  };
}
