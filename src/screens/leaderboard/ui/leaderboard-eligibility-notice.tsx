export function LeaderboardEligibilityNotice() {
  return (
    <div className="mx-auto flex h-11 w-full items-center justify-center rounded-lg bg-[rgba(82,91,113,0.13)] px-3 text-center max-[767px]:h-auto max-[767px]:min-h-11">
      <p className="text-[12px] font-medium leading-[133%] text-[#616a80]">
        Only registered and <span className="font-bold">Super Confirmed</span>{" "}
        players wagering with code{" "}
        <span className="font-bold">THEDOCTOR</span> are ranked
      </p>
    </div>
  );
}
