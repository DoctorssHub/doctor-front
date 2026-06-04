import Image from "next/image";
import Link from "next/link";

import DiscordIcon from "@/assets/discordIcon.svg";
import FacebookIcon from "@/assets/facebookIcon.svg";
import Logo from "@/assets/Logo_footer.webp";
import TelegramIcon from "@/assets/telegramIcon.svg";
import TviterIcon from "@/assets/twiterIcon.svg";
import InstIcon from "@/assets/instIcon.svg";

const about = ["Pointshop", "Leaderboard", "Games", "Rewards", "Bonuses"];
const terms = ["Terms and Conditions", "Privacy Policy"];
const socials = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: TelegramIcon, label: "Telegram" },
  { icon: DiscordIcon, label: "Discord" },
  { icon: TviterIcon, label: "Twitter" },
  { icon: InstIcon, label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="border-t border-(--color-border-strong) bg-(--color-surface) px-6 py-7 sm:px-8">
      <div className="mx-auto flex  flex-col gap-6">
        <div className="flex flex-col gap-10 pb-6 pt-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <Link
              aria-label="The Doctor home"
              className="relative block "
              href="#"
            >
              <Image
                alt=""
                className=""
                width={140}
                height={74}
                src={Logo}
              />
            </Link>
            <div className="flex items-center gap-2 text-(--color-text-muted)">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-(--color-text-muted) text-sm font-semibold leading-none">
                18+
              </span>
              <p className="max-w-[140px] text-[16px] leading-5 font-semibold">
                Gamble Responsibly
              </p>
            </div>
          </div>

          <div className="grid w-full  sm:grid-cols-3 lg:w-[614px] ">
            <FooterColumn
              items={about}
              title="About"
            />
            <FooterColumn
              items={terms}
              title="Terms"
            />
            <div className="pt-0 sm:pt-3.5">
              <h3 className="mb-4 text-[16px] leading-5 font-medium text-(--color-text-primary) uppercase">
                Socials
              </h3>
              <div className="flex items-center gap-2">
                {socials.map((social) => (
                  <Link
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-lg bg-(--color-surface-icon) text-xs font-bold text-(--color-text-muted) transition duration-300 hover:-translate-y-0.5 hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)"
                    href="#"
                    key={social.label}
                  >
                    <Image
                      alt=""
                      className="size-6"
                      src={social.icon}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-(--color-page-raised) p-6 text-[12px] leading-4 font-light text-(--color-text-disabled)">
          <p className="mb-1">
            Copyright &copy; 2025 www.thedoctor.com is owned and operated by
            Wild Technology Ltd. registration number: 3-102-898807 registered
            address: San Rafael,Edificio, Fuentecantos, San Jose,
          <br />
            Costa Rica and is licensed and regulated by the Government of the
            Autonomous Island of Anjouan, Union of Comoros and operates under
            License No. ALSI-132405034-FI3
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="pt-0 sm:pt-3.5">
      <h3 className="mb-4 text-[16px] leading-5 font-medium text-(--color-text-primary) uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5 text-[14px] leading-[18px] font-light text-(--color-text-muted)">
        {items.map((item) => (
          <li key={item}>
            <Link
              className="transition duration-300 hover:text-(--color-text-primary)"
              href="#"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
