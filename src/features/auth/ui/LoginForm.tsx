export function LoginForm() {
  return (
    <form>
      <div className="space-y-3">
        <label className="block font-light leading-4.5 text-(--color-text-muted)">
          Username
          <input
            className="mt-1.5 h-11 w-full rounded-lg border border-(--color-surface-icon) bg-(--color-surface) px-3 text-sm text-(--color-text-primary) outline-none transition placeholder:text-[#6f778c] focus:border-[#c82831]"
            name="email"
            placeholder="Enter your username"
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
          <input
            className="auth-checkbox"
            type="checkbox"
            required
          />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>
        <label className="mt-2 flex items-center gap-3 text-sm text-(--color-text-muted)">
          <input
            className="auth-checkbox"
            type="checkbox"
            required
          />
          <span>I am 18 years old or older</span>
        </label>
      </div>

      <button
        className="mt-5 h-12 w-full rounded-lg bg-[#c82831] px-4 text-sm font-bold text-[#fff7f7] transition hover:bg-[#d93a43] disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
      >
        Log in
      </button>

      <button
        className="mt-4 w-full text-sm font-medium text-[#8f98ad] transition hover:text-white"
        type="button"
      >
        Forgot password?
      </button>
    </form>
  );
}
