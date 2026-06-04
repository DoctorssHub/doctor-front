export function VerifyEmailForm() {
  return (
    <form className="rounded-xl border border-[#1c2333] bg-[#0b101d] p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">Verify email</h1>
        <p className="text-sm text-[#8f98ad]">
          Enter the verification code sent to your email.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-xs font-medium text-[#aeb6c9]">
          Verification token
          <input
            className="mt-2 h-12 w-full rounded-lg border border-[#1c2333] bg-[#0d121e] px-4 text-sm text-white outline-none transition placeholder:text-[#6f778c] focus:border-[#c82831]"
            name="verificationToken"
            required
          />
        </label>

        <label className="block text-xs font-medium text-[#aeb6c9]">
          Code
          <input
            className="mt-2 h-12 w-full rounded-lg border border-[#1c2333] bg-[#0d121e] px-4 text-sm text-white outline-none transition placeholder:text-[#6f778c] focus:border-[#c82831]"
            name="code"
            inputMode="numeric"
            required
          />
        </label>
      </div>

      <button
        className="mt-6 h-14 w-full rounded-lg bg-[#c82831] px-4 text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43] disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
      >
        Verify email
      </button>

      <button
        className="mt-4 w-full text-sm font-medium text-[#8f98ad] transition hover:text-white"
        type="button"
      >
        Back to register
      </button>
    </form>
  );
}
