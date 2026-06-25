import Image from "next/image";

import avatarFallback from "@/assets/homePage/leaderboardSection/avatar_1.webp";
import type { LeaderboardParticipant } from "@/features/leaderboard";
import { BetHistoryAmount } from "@/widgets/bet-history/ui/BetHistoryAmount";

import { LEADERBOARD_CELL_CLASS_NAME } from "./leaderboard-table.constants";
import { formatMoney } from "./leaderboard-table-utils";

type LeaderboardTableRowProps = {
  item: LeaderboardParticipant;
};

export function LeaderboardTableRow({ item }: LeaderboardTableRowProps) {
  return (
    <tr
      className="bet-history-row-in odd:bg-(--color-page)"
      key={item.id}
    >
      <td className={LEADERBOARD_CELL_CLASS_NAME}>{item.position}</td>
      <td className={LEADERBOARD_CELL_CLASS_NAME}>
        <div className="flex min-w-0 items-center gap-3 max-[767px]:gap-1.5">
          <Image
            alt=""
            aria-hidden="true"
            className="size-8 shrink-0 rounded-full border border-(--color-border-button) bg-(--color-surface-elevated) object-cover max-[767px]:size-5"
            src={avatarFallback}
          />
          <span className="truncate">{item.username}</span>
        </div>
      </td>
      <td className={LEADERBOARD_CELL_CLASS_NAME}>
        <BetHistoryAmount
          amount={formatMoney(item.usdWager)}
          className="!gap-1 text-[12px] font-normal leading-[133%] text-[#fdfdfd]"
        />
      </td>
      <td className={LEADERBOARD_CELL_CLASS_NAME}>
        <BetHistoryAmount
          amount={formatMoney(item.prizeValue)}
          className="!gap-1 text-[12px] font-normal leading-[133%] text-[#fdfdfd]"
        />
      </td>
    </tr>
  );
}
