export function AllGamesIntro() {
  return (
    <header className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center">
      <h1
        className="text-3xl leading-tight font-bold text-(--color-text-primary) uppercase max-[1023px]:text-2xl max-[767px]:text-xl"
        id="all-games-title"
      >
        <span className="block text-(--color-accent-red)">
          Play with McQueen!
        </span>
        Bet on games and get rewards
      </h1>
      <p className="text-sm text-(--color-text-muted) max-[767px]:text-xs">
        Explore different game modes and get a chance to win instant rewards
        every time you play.
      </p>
    </header>
  );
}
