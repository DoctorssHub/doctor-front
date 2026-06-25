"use client";

import Image from "next/image";
import { useState } from "react";

import arrow from "@/assets/aside/arrowSidebar.svg";
import FAQIcon from "@/assets/homePage/faq/faqIcon.svg";
import { SectionTitle } from "@/shared/ui/section-title";

import { FaqItem, FaqToggleLabels } from "../model/faq-content";

type FaqSectionProps = {
  defaultOpenIndex?: number | null;
  items: FaqItem[];
  title: string;
  toggleLabels: FaqToggleLabels;
};

export function FaqSection({
  defaultOpenIndex = null,
  items,
  title,
  toggleLabels,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <section className="mx-auto flex w-full max-w-[928px] flex-col items-center gap-4">
      <SectionTitle
        icon={FAQIcon}
        title={title}
      />
      <div className="flex w-full flex-col gap-2">
        {items.map((item, index) => {
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
                  alt={
                    isOpen
                      ? toggleLabels.collapseAnswer
                      : toggleLabels.expandAnswer
                  }
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
