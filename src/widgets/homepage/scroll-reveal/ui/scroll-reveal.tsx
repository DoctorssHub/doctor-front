"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  delayMs?: number;
};

export function ScrollReveal({ children, delayMs = 0 }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    element.classList.add("homepage-scroll-reveal");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      },
      {
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.12,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const style = {
    "--scroll-reveal-delay": `${delayMs}ms`,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      style={style}
    >
      {children}
    </div>
  );
}
