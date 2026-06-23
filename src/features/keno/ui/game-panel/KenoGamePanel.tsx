"use client";

import { useKenoGame } from "../../model/use-keno-game";
import { KenoResultModal } from "../result-modal";
import { KenoNumberGrid } from "./KenoNumberGrid";
import { KenoSidebar } from "./KenoSidebar";

export function KenoGamePanel() {
  const game = useKenoGame();

  return (
    <div className="relative grid h-[560px] w-[1017px] grid-cols-[352px_665px] overflow-hidden rounded-t-2xl">
      <KenoSidebar {...game} />
      <KenoNumberGrid
        key={game.resultRoundId}
        isInteractionLocked={game.isInteractionLocked}
        isRevealingResults={game.isRevealingResults}
        onResultsReset={game.onResultsReset}
        onRevealComplete={game.onRevealComplete}
        resultNumbers={game.resultNumbers}
        roundSelectedNumbers={game.roundSelectedNumbers}
      />
      {game.lastBetResult && game.isResultModalVisible ? (
        <KenoResultModal
          hitCount={game.resultHitCount}
          onClose={game.onResultModalClose}
          result={game.lastBetResult}
        />
      ) : null}
    </div>
  );
}
