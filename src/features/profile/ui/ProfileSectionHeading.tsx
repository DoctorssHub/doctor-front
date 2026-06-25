type ProfileSectionHeadingProps = {
  title: string;
  size?: "lg" | "md";
};

export function ProfileSectionHeading({
  title,
  size = "md",
}: ProfileSectionHeadingProps) {
  return (
    <h2
      className={`font-semibold text-(--color-text-primary) ${
        size === "lg" ? "text-2xl max-mobile:text-xl" : "text-lg"
      }`}
    >
      {title}
    </h2>
  );
}
