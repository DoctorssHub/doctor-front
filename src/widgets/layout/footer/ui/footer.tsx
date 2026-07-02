import DiscordIcon from "@/assets/footer/discordIcon.svg";
import FacebookIcon from "@/assets/footer/facebookIcon.svg";
import InstIcon from "@/assets/footer/instIcon.svg";
import TviterIcon from "@/assets/footer/twiterIcon.svg";

import { FooterBrand } from "./footer-brand";
import { FooterColumn } from "./footer-column";
import { FooterLegal } from "./footer-legal";
import { FooterSocials } from "./footer-socials";

const about = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/all-games", label: "Games" },
  { href: "/rewards", label: "Rewards" },
];
const terms = [
  {
    href: "mailto:support@thedoctor.net?subject=Terms%20and%20Conditions",
    label: "Terms and Conditions",
  },
  {
    href: "mailto:support@thedoctor.net?subject=Privacy%20Policy",
    label: "Privacy Policy",
  },
];
const socials = [
  {
    href: "https://www.facebook.com/thedoctorslots",
    icon: FacebookIcon,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/thedoctorsocial/",
    icon: InstIcon,
    label: "Instagram",
  },
  { href: "https://x.com/TheDoctorGamble", icon: TviterIcon, label: "X" },
  {
    href: "https://discord.com/invite/thedoctor",
    icon: DiscordIcon,
    label: "Discord",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-(--color-border-strong) bg-(--color-surface) px-6 py-7 sm:px-8 max-tablet:px-4 max-tablet:py-8">
      <div className="mx-auto flex flex-col gap-6 max-tablet:max-w-[339px]">
        <div className="flex flex-col gap-10 pb-6 pt-3 tablet:max-laptop:grid tablet:max-laptop:grid-cols-[minmax(220px,1fr)_minmax(150px,auto)_minmax(260px,auto)] tablet:max-laptop:items-start lg:flex-row lg:items-start lg:justify-between max-tablet:gap-9 max-tablet:pb-0 max-tablet:pt-0">
          <FooterBrand />

          <div className="grid w-full sm:grid-cols-3 tablet:max-laptop:contents lg:w-[614px] max-tablet:grid-cols-2 max-tablet:gap-x-8 max-tablet:gap-y-8">
            <FooterColumn
              className="tablet:max-laptop:col-start-2"
              items={about}
              title="About"
            />
            <div className="tablet:max-laptop:col-start-3 tablet:max-laptop:flex tablet:max-laptop:flex-col tablet:max-laptop:gap-8 lg:contents max-tablet:contents">
              <FooterColumn items={terms} title="Terms" />
              <FooterSocials
                className="max-tablet:col-span-2"
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
