export function ClaimToast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-[120] rounded-lg border border-(--color-brand)/40 bg-(--color-page-raised) px-4 py-3 text-[14px] font-semibold text-(--color-text-primary) shadow-[0_16px_40px_rgb(0_0_0/45%)] [animation:dice-mode-panel-in_180ms_cubic-bezier(0.22,1,0.36,1)_both]">
      {message}
    </div>
  );
}
