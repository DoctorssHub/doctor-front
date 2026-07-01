import Image, { type StaticImageData } from "next/image";
import discordIcon from "@/assets/auth/social/discord.webp";
import googleIcon from "@/assets/auth/social/google.webp";
import steamIcon from "@/assets/auth/social/steam.webp";
import kickIcon from "@/assets/auth/social/iconKick.webp";
import type { ProfileConnectionProvider } from "../../model/profile-connections";

type ConnectionIconProps = {
  provider: ProfileConnectionProvider;
};

const IMAGE_ICONS: Partial<Record<ProfileConnectionProvider, StaticImageData>> =
  {
    discord: discordIcon,
    google: googleIcon,
    steam: steamIcon,
    kick: kickIcon,
  };

export function ConnectionIcon({ provider }: ConnectionIconProps) {
  const imageIcon = IMAGE_ICONS[provider];

  if (imageIcon) {
    return (
      <Image
        alt=""
        aria-hidden="true"
        className="size-9 shrink-0 object-contain"
        height={36}
        src={imageIcon}
        width={36}
      />
    );
  }
}
