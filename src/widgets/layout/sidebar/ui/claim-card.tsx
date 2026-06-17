import ClaimBg from "@/assets/aside/claim-bg.png";
import ClaimBgCollapsed from "@/assets/aside/claimBgCollapsed.png";
import ClaimIcon from "@/assets/aside/claimIcon.svg";
import Image from "next/image";

type ClaimCardProps = {
  isCollapsed?: boolean;
};

export function ClaimCard({ isCollapsed = false }: ClaimCardProps) {
  if (isCollapsed) {
    return (
      <button
        aria-label="Claim daily reward"
        type="button"
      >
        <Image
          alt="Daily reward claim"
          src={ClaimBgCollapsed}
        />
      </button>
    );
  }

  return (
    <div className="relative max-tablet:h-[124px] max-tablet:w-[327px]">
      <Image
        alt="Daily claimer reward background"
        className="max-tablet:h-full max-tablet:w-full max-tablet:object-cover"
        src={ClaimBg}
      />
      <div className="absolute top-0 flex h-full flex-col justify-between p-3">
        <h3 className="text-[16px] font-semibold text-(--color-text-primary)">
          DAILY <br /> CLAIMER!
        </h3>
        <button
          className="flex h-8 cursor-pointer items-center justify-center rounded-lg px-3 text-[14px] font-medium text-(--color-page-raised)"
          style={{ backgroundImage: "var(--gradient-claim-panel)" }}
        >
          Claim
          <Image
            alt="Reward coin"
            className="ml-1 mr-0.5"
            src={ClaimIcon}
          />
          10
        </button>
      </div>
    </div>
  );
}
