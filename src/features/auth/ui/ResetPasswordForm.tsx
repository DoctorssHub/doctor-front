import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/auth-api";
import { parseAuthError } from "../lib/parse-auth-error";

type ResetPasswordFormProps = {
  onReset: () => void;
  onBack: () => void;
};

export function ResetPasswordForm({ onReset, onBack }: ResetPasswordFormProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      onReset();
    },
    onError: (error) => {
      setErrorMessage(parseAuthError(error));
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    resetMutation.mutate({
      token: String(formData.get("token") || ""),
      newPassword: String(formData.get("newPassword") || ""),
    });
  }

  return (
    <form
      className="rounded-xl border border-(--color-auth-form-border) bg-(--color-hero-surface) p-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-(--color-text-primary)">Reset password</h1>
        <p className="text-sm text-(--color-text-subtle)">
          Enter the reset token and your new password.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-xs font-medium text-(--color-auth-label)">
          Reset token
          <input
            className="mt-2 h-12 w-full rounded-lg border border-(--color-auth-form-border) bg-(--color-auth-field) px-4 text-sm text-(--color-text-primary) outline-none transition placeholder:text-(--color-auth-placeholder) focus:border-(--color-auth-action)"
            name="token"
            required
          />
        </label>

        <label className="block text-xs font-medium text-(--color-auth-label)">
          New password
          <input
            className="mt-2 h-12 w-full rounded-lg border border-(--color-auth-form-border) bg-(--color-auth-field) px-4 text-sm text-(--color-text-primary) outline-none transition placeholder:text-(--color-auth-placeholder) focus:border-(--color-auth-action)"
            name="newPassword"
            type="password"
            required
          />
        </label>
      </div>

      {errorMessage ? (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      ) : null}

      <button
        className="mt-6 h-14 w-full rounded-lg bg-(--color-auth-action) px-4 text-sm font-bold text-(--color-auth-action-contrast) transition hover:bg-(--color-auth-action-hover) disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={resetMutation.isPending}
      >
        {resetMutation.isPending ? "Resetting..." : "Reset password"}
      </button>

      <button
        className="mt-4 w-full text-sm font-medium text-(--color-text-subtle) transition hover:text-(--color-text-primary)"
        type="button"
        onClick={onBack}
      >
        Back to log in
      </button>
    </form>
  );
}
