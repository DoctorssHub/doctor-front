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
    <div className="relative grid h-[60px] grid-cols-2 gap-2 overflow-hidden rounded-[12px] bg-[#0e121c] p-2">
      <div
        className={[
          "pointer-events-none absolute left-2 top-2 h-11 w-[calc((100%-24px)/2)] rounded-[8px] bg-[linear-gradient(180deg,rgb(27_31_38/40%)_0%,rgb(43_48_59/40%)_100%)] transition-transform duration-300 ease-out",
          activeTab === "verify"
            ? "translate-x-[calc(100%+8px)]"
            : "translate-x-0",
        ].join(" ")}
      />

      {(["seeds", "verify"] as const).map((tab) => (
        <button
          className={[
            "relative z-10 h-11 rounded-[8px] px-4 py-3 text-sm font-bold capitalize transition-colors duration-200",
            activeTab === tab
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)]",
          ].join(" ")}
          key={tab}
          onClick={() => {
            onChange(tab);
          }}
          type="button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
