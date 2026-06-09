import CloudIcon from "@/assets/notFoundPage/cloudIcon.svg";
import TopImage from "@/assets/notFoundPage/topImg.webp";
import BottomImage from "@/assets/notFoundPage/bottomImg.webp";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#0a0d19] px-16 pb-16 pt-32 max-tablet:px-6 max-tablet:pb-10 max-tablet:pt-24 max-mobile:px-4">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1/2 bottom-0 z-0 h-auto w-[1920px] max-w-none -translate-x-1/2"
        fill="none"
        height="478"
        viewBox="0 0 1920 478"
        width="1920"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#notFoundGlow)">
          <path
            d="M3076 160L1340.18 719L976.116 719L-869 160L3076 160Z"
            fill="url(#notFoundGradient)"
            fillOpacity="0.3"
          />
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="879"
            id="notFoundGlow"
            width="4265"
            x="-1029"
            y="0"
          >
            <feFlood
              floodOpacity="0"
              result="BackgroundImageFix"
            />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              mode="normal"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_4184_16551"
              stdDeviation="80"
            />
          </filter>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="notFoundGradient"
            x1="1231.2"
            x2="1216.36"
            y1="133.962"
            y2="733.886"
          >
            <stop stopOpacity="0" />
            <stop
              offset="1"
              stopColor="#1BD167"
            />
          </linearGradient>
        </defs>
      </svg>

      <section className="relative z-20 mx-auto flex h-[250px] w-[573px] max-w-full flex-col items-center justify-center rounded-[20px] bg-[#0e121c] p-10 text-center max-tablet:h-auto max-tablet:min-h-[220px] max-tablet:p-8 mobile:h-[236px] max-mobile:p-6">
        <Image
          src={CloudIcon}
          alt="Cloud error icon"
          width={74}
          height={54}
          className="h-auto w-[74px]  mobile:w-[60px]"
        />
        <h1 className="mt-8 text-center text-[32px] font-semibold leading-[1.25] text-(--color-text-primary) mobile:text-[20px]">
          Something went wrong
        </h1>
        <p className="mt-2  text-center text-[18px] font-semibold leading-[1.33] text-(--color-text-muted)   mobile:text-[16px]">
          There was an unexpected error, please refresh and try again.
        </p>
      </section>

      <Image
        alt="Floating cash decoration"
        className="pointer-events-none absolute top-0 right-0 z-10 h-auto min-desktop:w-[400px] max-w-none min-tablet:max-w-[200px]  min-tablet:top-[-50px] max-tablet:right-[-50px] min-mobile:w-[150px] min-mobile:top-[-30px] min-mobile:right-[-30px]"
        src={TopImage}
      />
      <Image
        alt="Cash and chip decoration"
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-auto min-desktop:w-[400px] max-w-none min-tablet:max-w-[300px] mobile:w-[250px] "
        src={BottomImage}
      />
    </main>
  );
}
