export function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  return (
    <span
      className={[
        "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none",
        isConnected
          ? "bg-emerald-500/12 text-emerald-400"
          : "bg-[rgb(200_40_49/12%)] text-(--color-brand-hover)",
      ].join(" ")}
    >
      {isConnected ? "Connected" : "Not connected"}
    </span>
  );
}
