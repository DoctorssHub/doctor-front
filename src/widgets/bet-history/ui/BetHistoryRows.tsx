"use client";

import type { ReactNode } from "react";
import type { BetHistoryItem } from "@/entities/bet/model/types";
import {
  formatBetDateTime,
  formatBetMultiplier,
} from "@/entities/bet/lib/formatters";
import { BetHistoryAmount } from "@/widgets/bet-history/ui/BetHistoryAmount";

type BetHistoryRowsProps = {
  error: Error | null;
  isLoading: boolean;
  items: BetHistoryItem[];
  onRetry: () => void;
};

const columns = ["User", "Game", "Bet", "Multiplier", "Prize", "Time"] as const;

function formatGameLabel(game: BetHistoryItem["game"]): string {
  return game.charAt(0).toUpperCase() + game.slice(1);
}

function renderColumnGroup() {
  return (
    <colgroup>
      <col className="w-[25%]" />
      <col className="w-[14%]" />
      <col className="w-[15%]" />
      <col className="w-[13%]" />
      <col className="w-[15%]" />
      <col className="w-[18%]" />
    </colgroup>
  );
}

function renderHeader() {
  return (
    <thead className="text-xs font-semibold tracking-normal text-(--color-text-subtle)">
      <tr>
        {columns.map((column) => (
          <th
            className="px-4 py-3 text-left font-semibold"
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

function renderLoadingRows() {
  return (
    <tbody>
      {Array.from({ length: 8 }, (_, rowIndex) => (
        <tr
          className="odd:bg-(--color-page)"
          key={rowIndex}
        >
          {columns.map((column, columnIndex) => (
            <td className="px-4 py-3" key={column}>
              <div
                className={`h-4 animate-pulse rounded bg-(--color-surface-hover) ${
                  columnIndex === 0
                    ? "w-32"
                    : columnIndex === columns.length - 1
                      ? "w-28"
                      : "w-20"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function renderTableFrame(children: ReactNode) {
  return (
    <div className="overflow-x-auto rounded-lg bg-(--color-surface)/80">
      <table className="w-full min-w-[760px] table-fixed text-sm">
        {renderColumnGroup()}
        {renderHeader()}
        {children}
      </table>
    </div>
  );
}

function renderMessageRow(children: ReactNode) {
  return (
    <tbody>
      <tr>
        <td colSpan={columns.length}>{children}</td>
      </tr>
    </tbody>
  );
}

function renderItems(items: BetHistoryItem[]) {
  return (
    <tbody>
      {items.map((item) => (
        <tr
          className="bet-history-row-in text-(--color-text-muted) odd:bg-(--color-page)"
          key={item.id}
        >
          <td className="px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="size-8 shrink-0 rounded-full border border-(--color-border-button) bg-(--color-surface-elevated)"
              />
              <span className="truncate font-semibold text-(--color-text-primary)">
                {item.user.name}
              </span>
            </div>
          </td>
          <td className="truncate px-4 py-3">{formatGameLabel(item.game)}</td>
          <td className="px-4 py-3">
            <BetHistoryAmount amount={item.betAmount} />
          </td>
          <td className="truncate px-4 py-3 font-semibold text-(--color-accent-yellow)">
            {formatBetMultiplier(item.multiplier)}
          </td>
          <td className="px-4 py-3">
            <BetHistoryAmount amount={item.prize} />
          </td>
          <td className="truncate px-4 py-3 text-(--color-text-subtle)">
            {formatBetDateTime(item.createdAt)}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export function BetHistoryRows({
  error,
  isLoading,
  items,
  onRetry,
}: BetHistoryRowsProps) {
  if (error) {
    return renderTableFrame(
      renderMessageRow(
        <div className="flex min-h-36 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
          <p className="text-sm font-semibold text-(--color-text-primary)">
            Unable to load bet history.
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
        </div>,
      ),
    );
  }

  if (isLoading) {
    return renderTableFrame(renderLoadingRows());
  }

  if (items.length === 0) {
    return renderTableFrame(
      renderMessageRow(
        <div className="flex min-h-32 items-center justify-center px-4 py-8 text-center text-sm font-medium text-(--color-text-subtle)">
          No bets found.
        </div>,
      ),
    );
  }

  return renderTableFrame(renderItems(items));
}
