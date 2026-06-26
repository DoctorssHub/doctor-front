"use client";

import { useKenoGame } from "../../model/use-keno-game";
import { KenoResultModal } from "../result-modal";
import { KenoNumberGrid } from "./number-grid";
import { KenoSidebar } from "./sidebar";

type KenoGamePanelProps = {
  isFullscreen?: boolean;
};

export function KenoGamePanel({ isFullscreen = false }: KenoGamePanelProps) {
  const game = useKenoGame();

  return (
    <div
      className={[
        "relative grid w-full rounded-t-2xl max-[1023px]:flex max-[1023px]:h-auto max-[1023px]:w-full max-[1023px]:flex-col",
        isFullscreen
          ? "min-h-[668px] flex-1 shrink-0 overflow-visible rounded-none min-[1024px]:h-auto min-[1024px]:grid-cols-[352px_minmax(0,1fr)]"
          : "h-[668px] overflow-hidden min-[1024px]:w-[1017px] min-[1024px]:grid-cols-[352px_665px]",
      ].join(" ")}
    >
      <KenoSidebar {...game} />
      <KenoNumberGrid
        key={game.resultRoundId}
        isFullscreen={isFullscreen}
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
