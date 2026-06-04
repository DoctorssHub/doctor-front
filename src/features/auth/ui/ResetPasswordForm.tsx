import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/auth-api";
import { logAuthError, logAuthSuccess } from "../lib/log-auth-response";
import { parseAuthError } from "../lib/parse-auth-error";

type ResetPasswordFormProps = {
  onReset: () => void;
  onBack: () => void;
};

export function ResetPasswordForm({ onReset, onBack }: ResetPasswordFormProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      logAuthSuccess("reset-password", response);
      onReset();
    },
    onError: (error) => {
      logAuthError("reset-password", error);
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
      className="rounded-xl border border-[#1c2333] bg-[#0b101d] p-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">Reset password</h1>
        <p className="text-sm text-[#8f98ad]">
          Enter the reset token and your new password.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-xs font-medium text-[#aeb6c9]">
          Reset token
          <input
            className="mt-2 h-12 w-full rounded-lg border border-[#1c2333] bg-[#0d121e] px-4 text-sm text-white outline-none transition placeholder:text-[#6f778c] focus:border-[#c82831]"
            name="token"
            required
          />
        </label>

        <label className="block text-xs font-medium text-[#aeb6c9]">
          New password
          <input
            className="mt-2 h-12 w-full rounded-lg border border-[#1c2333] bg-[#0d121e] px-4 text-sm text-white outline-none transition placeholder:text-[#6f778c] focus:border-[#c82831]"
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
        className="mt-6 h-14 w-full rounded-lg bg-[#c82831] px-4 text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43] disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={resetMutation.isPending}
      >
        {resetMutation.isPending ? "Resetting..." : "Reset password"}
      </button>

      <button
        className="mt-4 w-full text-sm font-medium text-[#8f98ad] transition hover:text-white"
        type="button"
        onClick={onBack}
      >
        Back to log in
      </button>
    </form>
  );
}
