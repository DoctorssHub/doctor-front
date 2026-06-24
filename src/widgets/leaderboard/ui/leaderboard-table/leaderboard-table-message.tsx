import { ReactNode } from "react";

import { LEADERBOARD_COLUMNS } from "./leaderboard-table.constants";

type LeaderboardTableMessageProps = {
  children: ReactNode;
};

export function LeaderboardTableMessage({
  children,
}: LeaderboardTableMessageProps) {
  return (
    <tbody>
      <tr>
        <td colSpan={LEADERBOARD_COLUMNS.length}>{children}</td>
      </tr>
    </tbody>
  );
}
