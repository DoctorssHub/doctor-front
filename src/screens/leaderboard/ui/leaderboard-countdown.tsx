const countdownItems = [
  { label: "D", value: "00" },
  { label: "H", value: "13" },
  { label: "M", value: "49" },
  { label: "S", value: "12" },
];

export function LeaderboardCountdown() {
  return (
    <div
      className="mx-auto mt-4 flex h-[138px] w-[288px] flex-col items-center rounded-[18px] p-6 max-[374px]:w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(27, 31, 38, 0.4) 0%, rgba(43, 48, 59, 0.4) 100%)",
      }}
    >
      <p className="text-[16px] font-semibold leading-[125%] text-[#fdfdfd]">
        Competition ends in:
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {countdownItems.map((item) => (
          <div
            className="flex h-[54px] w-[51px] flex-col items-center justify-center rounded-lg bg-[#0e0f13] px-4 py-2"
            key={item.label}
          >
            <span className="text-[14px] font-semibold leading-[129%] text-[#fdfdfd]">
              {item.value}
            </span>
            <span className="text-[12px] font-semibold leading-[133%] text-[#566374]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
