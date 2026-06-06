import DiscordIcon from "@/assets/footer/discordIcon.svg";
import FacebookIcon from "@/assets/footer/facebookIcon.svg";
import InstIcon from "@/assets/footer/instIcon.svg";
import TelegramIcon from "@/assets/footer/telegramIcon.svg";
import TviterIcon from "@/assets/footer/twiterIcon.svg";

import { FooterBrand } from "./footer-brand";
import { FooterColumn } from "./footer-column";
import { FooterLegal } from "./footer-legal";
import { FooterSocials } from "./footer-socials";

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
    <footer className="border-t border-(--color-border-strong) bg-(--color-surface) px-6 py-7 sm:px-8 max-[767px]:px-4 max-[767px]:py-8">
      <div className="mx-auto flex flex-col gap-6 max-[767px]:max-w-[339px]">
        <div className="flex flex-col gap-10 pb-6 pt-3 min-[768px]:max-[1023px]:grid min-[768px]:max-[1023px]:grid-cols-[minmax(220px,1fr)_minmax(150px,auto)_minmax(260px,auto)] min-[768px]:max-[1023px]:items-start lg:flex-row lg:items-start lg:justify-between max-[767px]:gap-9 max-[767px]:pb-0 max-[767px]:pt-0">
          <FooterBrand />

          <div className="grid w-full sm:grid-cols-3 min-[768px]:max-[1023px]:contents lg:w-[614px] max-[767px]:grid-cols-2 max-[767px]:gap-x-8 max-[767px]:gap-y-8">
            <FooterColumn
              className="min-[768px]:max-[1023px]:col-start-2"
              items={about}
              title="About"
            />
            <div className="min-[768px]:max-[1023px]:col-start-3 min-[768px]:max-[1023px]:flex min-[768px]:max-[1023px]:flex-col min-[768px]:max-[1023px]:gap-8 lg:contents max-[767px]:contents">
              <FooterColumn
                items={terms}
                title="Terms"
              />
              <FooterSocials
                className="max-[767px]:col-span-2"
                socials={socials}
              />
            </div>
          </div>
        </div>

        <FooterLegal />
      </div>
    </footer>
  );
}
