import { SectionTitle } from "@/shared/ui/section-title";

const questions = ["Question close", "Question open", "Question close", "Question close", "Question close"];

export function FaqSection() {
  return (
    <section className="mx-auto flex w-full max-w-[928px] flex-col items-center gap-4">
      <SectionTitle title="Frequently asked questions" />
      <div className="flex w-full flex-col gap-2">
        {questions.map((question, index) => (
          <details className="group rounded-xl bg-(--color-surface) p-4 text-left" key={`${question}-${index}`} open={index === 1}>
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-white">
              {question}
              <span className="text-(--color-text-muted) group-open:rotate-180">v</span>
            </summary>
            <p className="mt-3 pr-5 text-sm leading-5 text-(--color-text-muted)">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
