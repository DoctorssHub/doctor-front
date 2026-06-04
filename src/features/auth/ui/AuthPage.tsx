"use client";

import { useState } from "react";
import { AuthCloseButton } from "./AuthCloseButton";
import { AuthSocialActions } from "./AuthSocialActions";
import { AuthTabs } from "./AuthTabs";
import { AuthVisualPanel } from "./AuthVisualPanel";
import { RegisterForm } from "./RegisterForm";
import { VerifyEmailForm } from "./VerifyEmailForm";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import type { AuthFlow } from "./types";

export function AuthPage() {
  const [flow, setFlow] = useState<AuthFlow>("register");

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#050812] text-white lg:p-4">
      <section
        className="flex h-[961px] max-h-screen w-full max-w-[768px] overflow-hidden rounded-4xl lg:h-[660px] lg:max-w-[1000px]"
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        <AuthVisualPanel />

        <div className="relative flex h-full w-full items-start justify-center overflow-hidden bg-[#0A0D19] px-8 py-10 sm:px-10 lg:w-[500px]">
          <AuthCloseButton />

          <section className="flex h-full w-full max-w-none flex-col lg:max-w-[420px]">
            <AuthTabs flow={flow} onChange={setFlow} />

            <div className="min-h-0 flex-1">
              {flow === "register" ? (
                <RegisterForm />
              ) : null}

              {flow === "verify-email" ? (
                <VerifyEmailForm />
              ) : null}

              {flow === "login" ? (
                <LoginForm />
              ) : null}

              {flow === "forgot-password" ? (
                <ForgotPasswordForm />
              ) : null}

              {flow === "reset-password" ? (
                <ResetPasswordForm />
              ) : null}
            </div>

            <AuthSocialActions flow={flow} />
          </section>
        </div>
      </section>
    </main>
  );
}
