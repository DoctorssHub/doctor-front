import type { CSSProperties } from "react";
import type { AuthFlow } from "./types";

type AuthTabsProps = {
  flow: AuthFlow;
  onChange: (flow: "login" | "register") => void;
};

const activeTabStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, #1B1F26 0%, #2B303B 100%) padding-box, linear-gradient(180deg, #1B1F26 0%, #2B303B 100%) border-box",
};

export function AuthTabs({ flow, onChange }: AuthTabsProps) {
  if (flow !== "login" && flow !== "register") {
    return null;
  }

  return (
    <div className="mb-5 grid h-15 shrink-0 grid-cols-2 rounded-xl bg-(--color-surface) p-2">
      <button
        className={`rounded-lg text-[16px] leading-5 font-medium transition ${
          flow === "login"
            ? "text-(--color-text-primary) shadow-sm"
            : "text-(--color-text-muted) hover:text-white"
        }`}
        style={flow === "login" ? activeTabStyle : undefined}
        type="button"
        onClick={() => onChange("login")}
      >
        Log In
      </button>
      <button
        className={`rounded-lg text-[16px] leading-5 font-medium transition ${
          flow === "register"
            ? "text-(--color-text-primary) shadow-sm"
            : "text-(--color-text-muted) hover:text-white"
        }`}
        style={flow === "register" ? activeTabStyle : undefined}
        type="button"
        onClick={() => onChange("register")}
      >
        Register
      </button>
    </div>
  );
}
