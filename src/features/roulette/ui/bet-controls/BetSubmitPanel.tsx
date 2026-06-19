import { GameBetButton } from "@/widgets/game-sidebar";

type BetSubmitPanelProps = {
  actionLabel: string;
  helperMessage: string | null;
  isBetDisabled: boolean;
  isLoading: boolean;
  onSubmit: () => void;
};

export function BetSubmitPanel({
  actionLabel,
  helperMessage,
  isBetDisabled,
  isLoading,
  onSubmit,
}: BetSubmitPanelProps) {
  return (
    <div className="space-y-3">
      <GameBetButton
        disabled={isBetDisabled}
        isLoading={isLoading}
        label={actionLabel}
        onClick={onSubmit}
      />
      {helperMessage ? (
        <p className="min-h-5 text-center text-xs font-medium text-[var(--color-text-subtle)]">
          {helperMessage}
        </p>
      ) : (
        <p className="min-h-5" />
      )}
    </div>
  );
}
