"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  delayMs?: number;
};

type LoaderPhaseChangeEvent = CustomEvent<{
  phase: string;
}>;

function isLoaderHidden() {
  return document.documentElement.dataset.loaderPhase === "hidden";
}

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

    let observer: IntersectionObserver | null = null;
    let isDisposed = false;

    element.classList.add("scroll-reveal");

    const revealImmediately = () => {
      element.classList.add("is-visible");
    };

    const startReveal = () => {
      if (isDisposed) {
        return;
      }

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealImmediately();
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        },
        {
          rootMargin: "0px 0px -6% 0px",
          threshold: 0.12,
        },
      );

      observer.observe(element);
    };

    const handleLoaderPhaseChange = (event: Event) => {
      const { phase } = (event as LoaderPhaseChangeEvent).detail;

      if (phase === "hidden") {
        window.removeEventListener(
          "global-loader-phase-change",
          handleLoaderPhaseChange,
        );
        startReveal();
      }
    };

    if (isLoaderHidden()) {
      startReveal();
    } else {
      window.addEventListener(
        "global-loader-phase-change",
        handleLoaderPhaseChange,
      );
    }

    return () => {
      isDisposed = true;
      window.removeEventListener(
        "global-loader-phase-change",
        handleLoaderPhaseChange,
      );

      if (observer) {
        observer.disconnect();
      }
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
