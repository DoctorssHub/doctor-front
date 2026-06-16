import type { Risk } from "@/entities/game/model/types";
import type { ActiveRound } from "@/widgets/plinko-board/model/active-round";

export function getVisibleBucketImpactKeys(
  activeRounds: ActiveRound[],
  rows: number,
  risk: Risk,
) {
  const impactKeys = new Map<number, string>();

  activeRounds.forEach((round) => {
    if (!round.isResultVisible || round.rows !== rows || round.risk !== risk) {
      return;
    }

    impactKeys.set(round.bet.bucketIndex, round.id);
  });

  return impactKeys;
}
