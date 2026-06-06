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
          alt=""
          src={ClaimBgCollapsed}
        />
      </button>
    );
  }

  return (
    <div className="relative max-[767px]:h-[124px] max-[767px]:w-[327px]">
      <Image
        alt="Claim Background"
        className="max-[767px]:h-full max-[767px]:w-full max-[767px]:object-cover"
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
            alt="Claim Icon"
            className="ml-1 mr-0.5"
            src={ClaimIcon}
          />
          10
        </button>
      </div>
    </div>
  );
}
