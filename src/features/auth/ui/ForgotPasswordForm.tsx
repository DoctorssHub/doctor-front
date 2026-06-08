import { FormEvent, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type ReCAPTCHA from "react-google-recaptcha";
import { forgotPassword } from "../api/auth-api";
import { parseAuthError } from "../lib/parse-auth-error";
import { AuthRecaptcha } from "./AuthRecaptcha";

type ForgotPasswordFormProps = {
  onSubmitted: () => void;
  onBack: () => void;
};

export function ForgotPasswordForm({
  onSubmitted,
  onBack,
}: ForgotPasswordFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const forgotMutation = useMutation({
    mutationFn: (variables: { email: string; recaptchaToken: string }) =>
      forgotPassword({ email: variables.email }, variables.recaptchaToken),
    onSuccess: () => {
      onSubmitted();
    },
    onError: (error) => {
      setErrorMessage(parseAuthError(error));
    },
    onSettled: () => {
      recaptchaRef.current?.reset();
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    forgotMutation.mutate({
      email: String(formData.get("email") || ""),
      recaptchaToken,
    });
  }

  return (
    <form
      className="rounded-xl border border-[#1c2333] bg-[#0b101d] p-6"
      onSubmit={handleSubmit}
    >
      <button
        className="mb-8 flex size-12 items-center justify-center rounded-lg bg-[#0d121e] text-[#d9e0ef] transition hover:bg-[#151b29] hover:text-white"
        type="button"
        aria-label="Back to log in"
        onClick={onBack}
      >
        <svg
          aria-hidden="true"
          className="size-7"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M19 12H5m0 0 6-6m-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-white">Forgot password</h1>
        <p className="text-sm text-[#8f98ad]">
          Enter your email and we will send a password reset link if an account
          exists.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-xs font-medium text-[#aeb6c9]">
          Email
          <input
            className="mt-2 h-12 w-full rounded-lg border border-[#1c2333] bg-[#0d121e] px-4 text-sm text-white outline-none transition placeholder:text-[#6f778c] focus:border-[#c82831]"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
          />
        </label>
      </div>

      <div className="mt-5">
        <AuthRecaptcha ref={recaptchaRef} />
      </div>

      {errorMessage ? (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      ) : null}

      <button
        className="mt-6 h-14 w-full rounded-lg bg-[#c82831] px-4 text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43] disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={forgotMutation.isPending}
      >
        {forgotMutation.isPending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
