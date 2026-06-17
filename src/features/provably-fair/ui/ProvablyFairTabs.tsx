"use client";

type FairnessTab = "seeds" | "verify";

type ProvablyFairTabsProps = {
  activeTab: FairnessTab;
  onChange: (tab: FairnessTab) => void;
};

export function ProvablyFairTabs({
  activeTab,
  onChange,
}: ProvablyFairTabsProps) {
  return (
    <div className="grid h-[60px] grid-cols-2 gap-2 rounded-[12px] bg-[#0e121c] p-2">
      {(["seeds", "verify"] as const).map((tab) => (
        <button
          className={[
            "h-11 rounded-[8px] px-4 py-3 text-sm font-bold capitalize text-[var(--color-text-primary)] transition",
            activeTab === tab
              ? "bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)]"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)]",
          ].join(" ")}
          key={tab}
          onClick={() => onChange(tab)}
          type="button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
