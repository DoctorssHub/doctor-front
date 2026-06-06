import DiscordIcon from "@/assets/discordIcon.svg";
import FacebookIcon from "@/assets/facebookIcon.svg";
import InstIcon from "@/assets/instIcon.svg";
import TelegramIcon from "@/assets/telegramIcon.svg";
import TviterIcon from "@/assets/twiterIcon.svg";

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
    <footer className="border-t border-(--color-border-strong) bg-(--color-surface) px-6 py-7 sm:px-8">
      <div className="mx-auto flex  flex-col gap-6">
        <div className="flex flex-col gap-10 pb-6 pt-3 lg:flex-row lg:items-start lg:justify-between">
          <FooterBrand />

          <div className="grid w-full  sm:grid-cols-3 lg:w-[614px] ">
            <FooterColumn
              items={about}
              title="About"
            />
            <FooterColumn
              items={terms}
              title="Terms"
            />
            <FooterSocials socials={socials} />
          </div>
        </div>

        <FooterLegal />
      </div>
    </footer>
  );
}
