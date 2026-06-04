import Image from "next/image";

export function AuthVisualPanel() {
  return (
    <div className="relative hidden h-full flex-1 overflow-hidden bg-[#13070b] lg:block">
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(88,12,18,0.74)_0%,rgba(45,10,16,0.92)_30%,#13070b_62%,#13070b_100%)]" />
      <div className="absolute left-1/2 top-8 z-10 -translate-x-1/2">
        <Image
          src="/mcqueen-logo.png"
          alt="McQueen logo"
          width={190}
          height={90}
          className="h-auto w-[124px]"
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-28" />
      <Image
        src="/racing-flag.png"
        alt="Racing flag"
        width={260}
        height={220}
        className="absolute left-[5%] top-[24%] h-[100px] w-[210px] opacity-90"
        aria-hidden="true"
      />
      <Image
        src="/racing-flag.png"
        alt="Racing flag"
        width={360}
        height={220}
        className="absolute right-3 top-[24%] h-[100px] w-[210px] opacity-90"
        aria-hidden="true"
      />
      <div className="absolute left-[52%] top-[72%] h-12 w-[300px] -translate-x-1/2 rounded-full bg-black/35 blur-xl" />
      <Image
        src="/lightning-mcqueen.png"
        alt="mcqueen"
        width={430}
        height={260}
        className="absolute left-[52%] top-[60%] h-auto w-[390px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_22px_42px_rgba(0,0,0,0.42)]"
        aria-hidden="true"
        priority
      />
      <Image
        src="/gas-station.png"
        alt="gas station"
        width={260}
        height={220}
        className="absolute -bottom-5 -left-15 h-auto w-[230px] opacity-86 drop-shadow-[0_0_20px_rgba(196,32,38,0.14)]"
        aria-hidden="true"
      />
      <Image
        src="/wheel.png"
        alt="wheel"
        width={170}
        height={170}
        className="absolute bottom-0 -right-3 h-auto w-[180px]"
        aria-hidden="true"
      />
    </div>
  );
}
