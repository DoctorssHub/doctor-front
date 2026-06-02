const navItems = ["Leaderboard", "Games", "Roulette", "Keno", "Plinko", "Dice", "Rewards"];

export function Sidebar() {
  return (
    <aside className="fixed inset-x-0 top-0 z-30 border-b border-[var(--color-border-sidebar)] bg-[var(--color-surface)]/95 px-4 py-2 backdrop-blur lg:inset-y-0 lg:right-auto lg:w-[92px] lg:border-b-0 lg:border-r lg:px-2">
      <div className="flex items-center justify-between gap-3 lg:h-full lg:flex-col lg:justify-start">
        <div className="flex items-center gap-2 lg:flex-col lg:pt-2">
          <div className="grid size-8 place-items-center rounded-full bg-[var(--color-brand-logo)] text-xs font-black text-[var(--color-brand-contrast)]">TD</div>
          <span className="text-xs font-black uppercase leading-none text-white lg:text-[10px]">The Doctor</span>
        </div>
        <div className="hidden w-full rounded-lg border border-[var(--color-border-claim)] bg-[var(--color-surface-claim)] p-2 text-center lg:block">
          <p className="text-[10px] font-black uppercase">Daily claim</p>
          <button className="mt-2 rounded-md bg-[var(--color-brand)] px-2 py-1 text-[10px] font-bold text-[var(--color-brand-contrast)]">Claim</button>
        </div>
        <nav className="hidden w-full flex-col gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              className="rounded-md px-2 py-2 text-[11px] font-semibold text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-nav-hover)] hover:text-white"
              href="#"
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
        <button className="rounded-md bg-[var(--color-brand)] px-4 py-2 text-xs font-bold text-[var(--color-brand-contrast)] lg:hidden">Login</button>
      </div>
    </aside>
  );
}
