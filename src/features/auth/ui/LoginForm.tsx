import { FormEvent, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type ReCAPTCHA from "react-google-recaptcha";
import { loginUser } from "../api/auth-api";
import { logAuthError, logAuthSuccess } from "../lib/log-auth-response";
import { parseAuthError } from "../lib/parse-auth-error";
import { AuthRecaptcha } from "./AuthRecaptcha";

type LoginFormProps = {
  onLoggedIn: () => void;
  onForgotPasswordClick: () => void;
};

export function LoginForm({
  onLoggedIn,
  onForgotPasswordClick,
}: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const loginMutation = useMutation({
    mutationFn: (variables: {
      email: string;
      password: string;
      recaptchaToken: string;
    }) =>
      loginUser(
        { email: variables.email, password: variables.password },
        variables.recaptchaToken,
      ),
    onSuccess: (response) => {
      logAuthSuccess("login", response);
      onLoggedIn();
    },
    onError: (error) => {
      logAuthError("login", error);
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

    loginMutation.mutate({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      recaptchaToken,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <label className="block font-light leading-4.5 text-(--color-text-muted)">
          Email
          <input
            className="mt-1.5 h-11 w-full rounded-lg border border-(--color-surface-icon) bg-(--color-surface) px-3 text-sm text-(--color-text-primary) outline-none transition placeholder:text-[#6f778c] focus:border-[#c82831]"
            name="email"
            placeholder="Enter your email"
            required
          />
        </label>

        <label className="block font-light leading-4.5 text-(--color-text-muted)">
          Password
          <input
            className="mt-1.5 h-11 w-full rounded-lg border border-(--color-surface-icon) bg-(--color-surface) px-3 text-sm text-(--color-text-primary) outline-none transition placeholder:text-[#6f778c] focus:border-[#c82831]"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="text-[16px] font-medium text-(--color-text-primary)">
          To access the platform, please confirm:
        </p>
        <label className="mt-2 flex items-center gap-3 text-sm text-(--color-text-muted)">
          <input className="auth-checkbox" type="checkbox" required />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>
        <label className="mt-2 flex items-center gap-3 text-sm text-(--color-text-muted)">
          <input className="auth-checkbox" type="checkbox" required />
          <span>I am 18 years old or older</span>
        </label>
      </div>

      <div className="mt-4">
        <AuthRecaptcha ref={recaptchaRef} />
      </div>

      {errorMessage ? (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      ) : null}

      <button
        className="mt-5 h-12 w-full rounded-lg bg-[#c82831] px-4 text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43] disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Log in"}
      </button>

      <button
        className="mt-4 w-full text-sm font-medium text-[#8f98ad] transition hover:text-white"
        type="button"
        onClick={onForgotPasswordClick}
      >
        Forgot password?
      </button>
    </form>
  );
}
