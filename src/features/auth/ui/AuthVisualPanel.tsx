import Image from "next/image";

export function AuthVisualPanel() {
  return (
    <div className="relative hidden h-full flex-1 overflow-hidden bg-(--color-auth-visual-base) lg:block">
      <div className="absolute inset-0 bg-(--gradient-auth-visual)" />
      <div className="absolute left-1/2 top-8 z-10 -translate-x-1/2">
        <Image
          src="/mcqueen-logo.png"
          alt="McQueen logo"
          width={190}
          height={90}
          className="h-auto w-31"
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-28" />
      <Image
        src="/racing-flag.png"
        alt="Racing flag"
        width={260}
        height={220}
        className="absolute left-[5%] top-[24%] h-25 w-52.5 opacity-90"
        aria-hidden="true"
      />
      <Image
        src="/racing-flag.png"
        alt="Racing flag"
        width={360}
        height={220}
        className="absolute right-3 top-[24%] h-25 w-52.5 opacity-90"
        aria-hidden="true"
      />
      <div className="absolute left-[52%] top-[72%] h-12 w-75 -translate-x-1/2 rounded-full bg-black/35 blur-xl" />
      <Image
        src="/lightning-mcqueen.png"
        alt="mcqueen"
        width={430}
        height={260}
        className="absolute left-[52%] top-[60%] h-auto w-97.5 -translate-x-1/2 -translate-y-1/2 drop-shadow-(--shadow-auth-image)"
        aria-hidden="true"
        priority
      />
      <Image
        src="/gas-station.png"
        alt="gas station"
        width={260}
        height={220}
        className="absolute -bottom-5 -left-15 h-auto w-57.5 opacity-86 drop-shadow-(--shadow-auth-accent)"
        aria-hidden="true"
      />
      <Image
        src="/wheel.png"
        alt="wheel"
        width={170}
        height={170}
        className="absolute bottom-0 -right-3 h-auto w-45"
        aria-hidden="true"
      />
    </div>
  );
}
