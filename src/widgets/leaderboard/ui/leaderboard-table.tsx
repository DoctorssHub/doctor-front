"use client";

import Image from "next/image";
import { ReactNode, useState } from "react";

import avatarFallback from "@/assets/homePage/leaderboardSection/avatar_1.webp";
import { useLatestLeaderboard } from "@/features/leaderboard";
import type { LeaderboardParticipant } from "@/features/leaderboard";
import { Button } from "@/shared";
import { BetHistoryAmount } from "@/widgets/bet-history/ui/BetHistoryAmount";

const LEADERBOARD_INITIAL_TAKE = 10;
const LEADERBOARD_TAKE_STEP = 10;
const leaderboardCellClassName =
  "px-4 py-3 text-[12px] font-normal leading-[133%] text-[#fdfdfd] max-[767px]:px-1 max-[767px]:py-2";
const columns = ["Rank", "Username", "Wagered", "Prize"] as const;

function formatMoney(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `$${value}`;
  }

  return `$${new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

function renderColumnGroup() {
  return (
    <colgroup>
      <col className="w-[12%] max-[767px]:w-[10%]" />
      <col className="w-[38%] max-[767px]:w-[32%]" />
      <col className="w-[25%] max-[767px]:w-[29%]" />
      <col className="w-[25%] max-[767px]:w-[29%]" />
    </colgroup>
  );
}

function renderHeader() {
  return (
    <thead className="text-xs font-semibold tracking-normal text-(--color-text-subtle)">
      <tr>
        {columns.map((column) => (
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

function renderTableFrame(children: ReactNode) {
  return (
    <div className="overflow-x-auto rounded-lg bg-(--color-surface)/80 max-[767px]:w-full max-[767px]:overflow-visible">
      <table className="w-full min-w-[720px] table-fixed max-[767px]:min-w-0">
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

function renderLoadingRows() {
  return (
    <tbody>
      {Array.from({ length: LEADERBOARD_INITIAL_TAKE }, (_, rowIndex) => (
        <tr
          className="odd:bg-(--color-page)"
          key={rowIndex}
        >
          {columns.map((column, columnIndex) => (
            <td className={leaderboardCellClassName} key={column}>
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

function renderItems(items: LeaderboardParticipant[]) {
  return (
    <tbody>
      {items.map((item) => (
        <tr
          className="bet-history-row-in odd:bg-(--color-page)"
          key={item.id}
        >
          <td className={leaderboardCellClassName}>
            {item.position}
          </td>
          <td className={leaderboardCellClassName}>
            <div className="flex min-w-0 items-center gap-3 max-[767px]:gap-1.5">
              <Image
                alt=""
                aria-hidden="true"
                className="size-8 shrink-0 rounded-full border border-(--color-border-button) bg-(--color-surface-elevated) object-cover max-[767px]:size-5"
                src={avatarFallback}
              />
              <span className="truncate">
                {item.username}
              </span>
            </div>
          </td>
          <td className={leaderboardCellClassName}>
            <BetHistoryAmount
              amount={formatMoney(item.usdWager)}
              className="!gap-1 text-[12px] font-normal leading-[133%] text-[#fdfdfd]"
            />
          </td>
          <td className={leaderboardCellClassName}>
            <BetHistoryAmount
              amount={formatMoney(item.prizeValue)}
              className="!gap-1 text-[12px] font-normal leading-[133%] text-[#fdfdfd]"
            />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export function LeaderboardTable() {
  const [visibleCount, setVisibleCount] = useState(LEADERBOARD_INITIAL_TAKE);
  const leaderboardQuery = useLatestLeaderboard(visibleCount);
  const participants = leaderboardQuery.data?.participants.items ?? [];
  const totalItems = leaderboardQuery.data?.participants.totalItems ?? 0;
  const canShowMore = participants.length < totalItems;

  return (
    <section className="mx-auto mt-10 w-full flex flex-col items-center">
      {leaderboardQuery.error
        ? renderTableFrame(
            renderMessageRow(
              <div className="flex min-h-36 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
                <p className="text-sm font-semibold text-(--color-text-primary)">
                  Unable to load leaderboard.
                </p>
                <p className="max-w-md text-sm text-(--color-text-subtle)">
                  Please try again.
                </p>
                <button
                  className="h-9 rounded-lg bg-(--color-accent-red) px-4 text-sm font-semibold text-white transition hover:opacity-90"
                  onClick={() => {
                    void leaderboardQuery.refetch();
                  }}
                  type="button"
                >
                  Retry
                </button>
              </div>,
            ),
          )
        : leaderboardQuery.isLoading
          ? renderTableFrame(renderLoadingRows())
          : participants.length === 0
            ? renderTableFrame(
                renderMessageRow(
                  <div className="flex min-h-32 items-center justify-center px-4 py-8 text-center text-sm font-medium text-(--color-text-subtle)">
                    No leaderboard entries found.
                  </div>,
                ),
              )
            : renderTableFrame(renderItems(participants))}

      {canShowMore ? (
        <Button
          className=" mt-6 block h-12 px-7 text-[16px]"
          disabled={leaderboardQuery.isFetching}
          onClick={() => {
            setVisibleCount((count) => count + LEADERBOARD_TAKE_STEP);
          }}
          type="button"
          variant="ghost"
        >
          Show more
        </Button>
      ) : null}
    </section>
  );
}
