import {
  type BoardLayout,
  getBoardHeight,
  getBoardWidth,
  getBucketLayout,
} from "./animation";

export function getPlinkoBoardMetrics(rows: number, layout: BoardLayout) {
  return {
    boardHeight: getBoardHeight(rows, layout),
    boardWidth: getBoardWidth(layout),
    bucketLayout: getBucketLayout(rows, layout),
  };
}
