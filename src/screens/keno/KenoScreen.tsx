import { KenoGamePanel } from "@/features/keno";
import { ProvablyFairBar } from "@/features/provably-fair";
import { BetHistoryTable } from "@/widgets/bet-history";

export function KenoScreen() {
  return (
    <main className="min-h-screen bg-[var(--color-page)] py-5 text-white md:px-[10px] md:py-7">
      <div className="mx-auto w-full max-w-[1017px]">
        <KenoGamePanel />
        <ProvablyFairBar game="keno" />
        <BetHistoryTable
          className="mt-8"
          game="keno"
          variant="game-live"
        />
      </div>
    </main>
  );
}
