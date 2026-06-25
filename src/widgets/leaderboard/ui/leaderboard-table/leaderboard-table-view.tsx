import type { LeaderboardParticipant } from "@/features/leaderboard";

import { LEADERBOARD_COLUMNS } from "./leaderboard-table.constants";
import { LeaderboardTableMessage } from "./leaderboard-table-message";
import { LeaderboardTableRow } from "./leaderboard-table-row";
import { LeaderboardTableSkeleton } from "./leaderboard-table-skeleton";

type LeaderboardTableViewProps = {
  hasError: boolean;
  isLoading: boolean;
  items: LeaderboardParticipant[];
  onRetry: () => void;
};

function LeaderboardTableColumnGroup() {
  return (
    <colgroup>
      <col className="w-[12%] max-[767px]:w-[10%]" />
      <col className="w-[38%] max-[767px]:w-[32%]" />
      <col className="w-[25%] max-[767px]:w-[29%]" />
      <col className="w-[25%] max-[767px]:w-[29%]" />
    </colgroup>
  );
}

function LeaderboardTableHeader() {
  return (
    <thead className="text-xs font-semibold tracking-normal text-(--color-text-subtle)">
      <tr>
        {LEADERBOARD_COLUMNS.map((column) => (
          <th
            className="px-4 py-3 text-left font-semibold max-[767px]:px-1 max-[767px]:py-2"
            key={column}
            scope="col"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function LeaderboardTableBody({
  hasError,
  isLoading,
  items,
  onRetry,
}: LeaderboardTableViewProps) {
  if (hasError) {
    return (
      <LeaderboardTableMessage>
        <div className="flex min-h-36 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
          <p className="text-sm font-semibold text-(--color-text-primary)">
            Unable to load leaderboard.
          </p>
          <p className="max-w-md text-sm text-(--color-text-subtle)">
            Please try again.
          </p>
          <button
            className="h-9 rounded-lg bg-(--color-accent-red) px-4 text-sm font-semibold text-white transition hover:opacity-90"
            onClick={onRetry}
            type="button"
          >
            Retry
          </button>
        </div>
      </LeaderboardTableMessage>
    );
  }

  if (isLoading) {
    return <LeaderboardTableSkeleton />;
  }

  if (items.length === 0) {
    return (
      <LeaderboardTableMessage>
        <div className="flex min-h-32 items-center justify-center px-4 py-8 text-center text-sm font-medium text-(--color-text-subtle)">
          No leaderboard entries found.
        </div>
      </LeaderboardTableMessage>
    );
  }

  return (
    <tbody>
      {items.map((item) => (
        <LeaderboardTableRow item={item} key={item.id} />
      ))}
    </tbody>
  );
}

export function LeaderboardTableView(props: LeaderboardTableViewProps) {
  return (
    <div className="overflow-x-auto rounded-lg bg-(--color-surface)/80 max-[767px]:w-full max-[767px]:overflow-visible">
      <table className="w-full min-w-[720px] table-fixed max-[767px]:min-w-0">
        <LeaderboardTableColumnGroup />
        <LeaderboardTableHeader />
        <LeaderboardTableBody {...props} />
      </table>
    </div>
  );
}
