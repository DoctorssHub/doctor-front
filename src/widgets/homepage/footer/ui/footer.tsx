const about = ["Pointshop", "Leaderboard", "Games", "Rewards", "Bonuses"];
const terms = ["Terms and Conditions", "Privacy Policy"];
const socials = ["f", "ig", "x", "tg", "dc"];

export function Footer() {
  return (
    <footer className="border-t border-(--color-border-strong) bg-(--color-surface) px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-[1210px] flex-col gap-8">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr_2fr]">
          <FooterColumn items={about} title="About" />
          <FooterColumn items={terms} title="Terms" />
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase text-white">Socials</h3>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <span className="grid size-9 place-items-center rounded-lg bg-(--color-surface-icon) text-xs font-bold text-(--color-text-muted)" key={social}>
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-(--color-page-raised) p-5 text-xs leading-5 text-(--color-text-disabled)">
          <p>
            Copyright 2025 www.thedoctor.com is owned and operated by Wild Technology Ltd. registration number: 3-102-898807 registered
            address: San Rafael, Edificio, Fuentecantos, San Jose.
          </p>
          <p>
            Costa Rica and is licensed and regulated by the Government of the Autonomous Island of Anjouan, Union of Comoros and operates
            under License No. ALSI-132405034-FI3
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase text-white">{title}</h3>
      <ul className="space-y-2 text-sm text-(--color-text-muted)">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
