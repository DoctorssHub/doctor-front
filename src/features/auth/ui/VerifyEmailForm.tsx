import Image from "next/image";
import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { getCurrentUser, verifyEmail } from "../api/auth-api";
import { parseAuthError } from "../lib/parse-auth-error";
import {
  readUserBalances,
  readUsername,
  type UserBalance,
} from "../lib/read-auth-response";

const CODE_LENGTH = 6;

type VerifyEmailFormProps = {
  verificationToken: string;
  email: string;
  fallbackUsername: string;
  onVerified: (username: string, balances?: UserBalance[] | null) => void;
  onBack: () => void;
};

export function VerifyEmailForm({
  verificationToken,
  email,
  fallbackUsername,
  onVerified,
  onBack,
}: VerifyEmailFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [codeDigits, setCodeDigits] = useState<string[]>(
    Array.from({ length: CODE_LENGTH }, () => ""),
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isCodeComplete = codeDigits.every(Boolean);

  const verifyMutation = useMutation({
    mutationFn: async (payload: {
      verificationToken: string;
      code: string;
    }) => {
      await verifyEmail(payload);

      const meResponse = await getCurrentUser();

      return meResponse;
    },
    onSuccess: (meResponse) => {
      onVerified(
        readUsername(meResponse.data) || fallbackUsername,
        readUserBalances(meResponse.data),
      );
    },
    onError: (error) => {
      setErrorMessage(parseAuthError(error));
    },
  });
  const isConfirmDisabled = !isCodeComplete || verifyMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const code = codeDigits.join("");

    if (code.length !== CODE_LENGTH) {
      setErrorMessage("Please enter the full verification code.");
      return;
    }

    verifyMutation.mutate({
      verificationToken,
      code,
    });
  }

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...codeDigits];
    nextDigits[index] = digit;
    setCodeDigits(nextDigits);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    if (event.key !== "Backspace" || codeDigits[index] || index === 0) {
      return;
    }

    inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!pastedCode) {
      return;
    }

    const nextDigits = Array.from({ length: CODE_LENGTH }, (_, index) => {
      return pastedCode[index] || "";
    });

    setCodeDigits(nextDigits);
    inputRefs.current[Math.min(pastedCode.length, CODE_LENGTH) - 1]?.focus();
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex justify-center">
        <Image
          src="/mcqueen-logo.png"
          alt="Logo"
          width={190}
          height={90}
          className="h-auto w-29.5 drop-shadow-(--shadow-auth-logo)"
          priority
        />
      </div>

      <div className="mt-7 w-full text-center">
        <h1 className="text-lg leading-5 font-semibold text-(--color-text-primary) sm:text-[22px] sm:leading-6 xl:text-2xl xl:leading-8">
          Your code is on the way!
        </h1>
        <p className="mx-auto mt-2 text-xs leading-4 text-(--color-text-muted) sm:text-lg sm:leading-5 xl:leading-6">
          To log in, enter the code we emailed to{" "}
          <span className="font-medium text-(--color-auth-action-hover)">{email}</span>
          <br />
          It may take a minute to arrive
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-1 sm:gap-2">
        {codeDigits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            className="h-13 w-12 rounded-lg border border-(--color-surface-icon) bg-(--color-surface) text-center text-lg font-medium text-(--color-text-primary) outline-none transition placeholder:text-(--color-auth-placeholder) focus:border-(--color-auth-action) focus:bg-(--color-surface-icon) sm:h-15 sm:w-15"
            value={digit}
            placeholder="-"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Verification code digit ${index + 1}`}
            required
            maxLength={1}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateDigit(index, event.target.value)
            }
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={handlePaste}
          />
        ))}
      </div>

      {errorMessage ? (
        <p className="mt-4 text-center text-sm text-red-400">{errorMessage}</p>
      ) : null}

      <button
        className={`mt-7 h-10 w-full rounded-lg px-4 text-sm font-bold text-(--color-auth-action-contrast) transition disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:px-8 ${
          isConfirmDisabled
            ? "bg-(--color-auth-disabled)/50 hover:bg-(--color-auth-disabled-hover)/50"
            : "bg-(--color-auth-action) hover:bg-(--color-auth-action-hover)"
        }`}
        type="submit"
        disabled={isConfirmDisabled}
      >
        {verifyMutation.isPending ? "Confirming..." : "Confirm"}
      </button>

      <div className="mt-5 flex justify-center">
        <button
          className="text-base font-semibold text-(--color-text-primary) transition hover:text-(--color-auth-action-hover) sm:text-lg"
          type="button"
          onClick={onBack}
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );
}
