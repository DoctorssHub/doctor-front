import {
  LEADERBOARD_CELL_CLASS_NAME,
  LEADERBOARD_COLUMNS,
  LEADERBOARD_INITIAL_TAKE,
} from "./leaderboard-table.constants";

export function LeaderboardTableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: LEADERBOARD_INITIAL_TAKE }, (_, rowIndex) => (
        <tr
          className="odd:bg-(--color-page)"
          key={rowIndex}
        >
          {LEADERBOARD_COLUMNS.map((column, columnIndex) => (
            <td className={LEADERBOARD_CELL_CLASS_NAME} key={column}>
              <div
                className={`h-4 animate-pulse rounded bg-(--color-surface-hover) ${
                  columnIndex === 1 ? "w-32" : "w-20"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
