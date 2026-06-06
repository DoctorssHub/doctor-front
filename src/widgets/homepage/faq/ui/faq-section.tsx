"use client";

import Image from "next/image";
import { useState } from "react";

import arrow from "@/assets/aside/arrowSidebar.svg";
import FAQIcon from "@/assets/homePage/faq/faqIcon.svg";
import { SectionTitle } from "@/shared/ui/section-title";

const questions = [
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question close",
  },
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question open",
  },
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question close",
  },
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question close",
  },
  {
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    question: "Question close",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <section className="mx-auto flex w-full max-w-[928px] flex-col items-center gap-4">
      <SectionTitle
        title="Frequently asked questions"
        icon={FAQIcon}
      />
      <div className="flex w-full flex-col gap-2">
        {questions.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              className="rounded-xl bg-(--color-surface) p-4 text-left"
              key={`${item.question}-${index}`}
            >
              <button
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-[16px] font-semibold text-(--color-text-primary)"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span>{item.question}</span>
                <Image
                  alt=""
                  className={`shrink-0 rotate-90 transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-270" : ""
                  }`}
                  src={arrow}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pt-3 pr-5 text-sm font-normal leading-5 text-(--color-text-muted)">
                    {item.answer}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
