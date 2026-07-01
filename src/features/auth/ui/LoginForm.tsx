import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getCurrentUser, loginUser } from "../api/auth-api";
import { parseAuthError } from "../lib/parse-auth-error";
import {
  readUserBalances,
  readUsername,
  type UserBalance,
} from "../lib/read-auth-response";

type LoginFormProps = {
  onLoggedIn: (username: string, balances?: UserBalance[] | null) => void;
  onForgotPasswordClick: () => void;
};

export function LoginForm({
  onLoggedIn,
  onForgotPasswordClick,
}: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (variables: { email: string; password: string }) => {
      await loginUser({
        email: variables.email,
        password: variables.password,
      });
      try {
        const meResponse = await getCurrentUser();

        return meResponse;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (meResponse) => {
      const username = readUsername(meResponse.data);
      const balances = readUserBalances(meResponse.data);

      if (!username) {
        setErrorMessage("Username was not returned by the server.");
        return;
      }

      onLoggedIn(username, balances);
    },
    onError: (error) => {
      setErrorMessage(
        axios.isAxiosError(error) && error.config?.url === "/user/query/me"
          ? "Login successful, but the profile request is unauthorized."
          : parseAuthError(error),
      );
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    loginMutation.mutate({
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <label className="block font-light leading-4.5 text-(--color-text-muted)">
          Email
          <input
            className="mt-1.5 h-11 w-full rounded-lg border border-(--color-surface-icon) bg-(--color-surface) px-3 text-sm text-(--color-text-primary) outline-none transition placeholder:text-(--color-auth-placeholder) focus:border-(--color-auth-action)"
            name="email"
            placeholder="Enter your email"
            required
          />
        </label>

        <label className="block font-light leading-4.5 text-(--color-text-muted)">
          Password
          <input
            className="mt-1.5 h-11 w-full rounded-lg border border-(--color-surface-icon) bg-(--color-surface) px-3 text-sm text-(--color-text-primary) outline-none transition placeholder:text-(--color-auth-placeholder) focus:border-(--color-auth-action)"
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

      {errorMessage ? (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      ) : null}

      <button
        className="mt-5 h-12 w-full rounded-lg bg-(--color-auth-action) px-4 text-sm font-bold text-(--color-auth-action-contrast) transition hover:bg-(--color-auth-action-hover) disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Log in"}
      </button>

      <button
        className="mt-4 w-full text-sm font-medium text-(--color-text-subtle) transition hover:text-(--color-text-primary)"
        type="button"
        onClick={onForgotPasswordClick}
      >
        Forgot password?
      </button>
    </form>
  );
}
