type SectionTitleProps = {
  centered?: boolean;
  icon?: string;
  kicker?: string;
  title: string;
};

export function SectionTitle({ centered = false, icon = "*", kicker, title }: SectionTitleProps) {
  return (
    <div className={`flex gap-2 ${centered ? "flex-col items-center text-center" : "items-center"}`}>
      {centered ? null : <span className="text-[var(--color-brand)]">{icon}</span>}
      <div>
        {kicker ? <p className="text-sm text-[var(--color-text-subtle)]">{kicker}</p> : null}
        <h2 className="text-base font-black uppercase tracking-normal text-white sm:text-xl">{title}</h2>
      </div>
    </div>
  );
}
