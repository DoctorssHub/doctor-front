import { memo } from "react";
import type { GameMode } from "@/entities/game/model/types";

type ModeTabsProps = {
  isDisabled?: boolean;
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
};

export const ModeTabs = memo(function ModeTabs({
  isDisabled = false,
  mode,
  onModeChange,
}: ModeTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg max-[1023px]:order-7 max-[1023px]:mt-6">
      {(["Manual", "Auto"] as const).map((nextMode) => (
        <button
          className={`flex h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${
            mode === nextMode
              ? "bg-[linear-gradient(180deg,rgb(27_31_38_/_40%)_0%,rgb(43_48_59_/_40%)_100%)] text-white"
              : "text-white/70 hover:bg-[#171d29]"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          disabled={isDisabled}
          key={nextMode}
          onClick={() => onModeChange(nextMode)}
          type="button"
        >
          {nextMode}
        </button>
      ))}
    </div>
  );
});
