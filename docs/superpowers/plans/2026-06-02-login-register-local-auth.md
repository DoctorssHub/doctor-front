# Login/Register Local Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the local authentication flow for register, verify email, login, forgot password, and reset password without social providers.

**Architecture:** Implement one `/login-register` route with internal auth flow states. Add one endpoint at a time, log the actual backend response in the browser console, then update response types only after the contract is observed.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2.4, TypeScript 5, Tailwind CSS 4, Axios 1.16.1, TanStack Query 5.100.14 for auth mutations, Zustand 5.0.14 only if token-based session state is confirmed.

---

## Scope

### In Scope

- Local registration via `POST /auth/local/register`.
- Email verification via `POST /auth/local/verify-email`.
- Login via `POST /auth/local/login`.
- Forgot password via `POST /auth/local/forgot-password`.
- Reset password via `POST /auth/local/reset-password`.
- Temporary dev-only response logging for each endpoint.
- Basic UI states: idle, loading, success, error.
- Responsive implementation according to the existing design.

### Out of Scope

- Google auth.
- Discord auth.
- Steam auth.
- Account linking.
- OAuth callback routes.
- Refresh token flow until backend response contracts are confirmed.
- Protected routes and middleware until login response is confirmed.

---

## Backend Unknowns

Swagger does not describe response payloads. Implementation must proceed endpoint by endpoint.

- [ ] Confirm what `/auth/local/register` returns.
- [ ] Confirm what `/auth/local/verify-email` returns.
- [ ] Confirm what `/auth/local/login` returns.
- [ ] Confirm whether auth uses tokens or httpOnly cookies.
- [ ] Confirm how the frontend receives `verificationToken`.
- [ ] Confirm the error response format.

---

## Planned File Structure

```txt
src/app/login-register/page.tsx
src/features/auth/index.ts
src/features/auth/api/auth-api.ts
src/features/auth/api/auth-types.ts
src/features/auth/lib/log-auth-response.ts
src/features/auth/lib/parse-auth-error.ts
src/features/auth/ui/AuthPage.tsx
src/features/auth/ui/RegisterForm.tsx
src/features/auth/ui/VerifyEmailForm.tsx
src/features/auth/ui/LoginForm.tsx
src/features/auth/ui/ForgotPasswordForm.tsx
src/features/auth/ui/ResetPasswordForm.tsx
```

### File Responsibilities

- `src/app/login-register/page.tsx`: Next.js route entry. Renders `AuthPage`.
- `src/features/auth/index.ts`: Public exports for the auth feature.
- `src/features/auth/api/auth-types.ts`: Request payload types and temporary unknown response types.
- `src/features/auth/api/auth-api.ts`: Axios functions for auth endpoints.
- `src/features/auth/lib/log-auth-response.ts`: Temporary dev logger for success/error responses.
- `src/features/auth/lib/parse-auth-error.ts`: Converts Axios/API errors into readable UI messages.
- `src/features/auth/ui/AuthPage.tsx`: Client component that controls auth flow state.
- `src/features/auth/ui/RegisterForm.tsx`: Registration form and register mutation.
- `src/features/auth/ui/VerifyEmailForm.tsx`: Email verification form and verify mutation.
- `src/features/auth/ui/LoginForm.tsx`: Login form and login mutation.
- `src/features/auth/ui/ForgotPasswordForm.tsx`: Forgot password form and mutation.
- `src/features/auth/ui/ResetPasswordForm.tsx`: Reset password form and mutation.

---

## Task 1: Check Next.js 16 App Router Guidance

**Files:**

- Read: `node_modules/next/dist/docs/`

- [ ] **Step 1: Read relevant Next.js docs before implementation**

Read the local Next.js docs for:

- App Router routes.
- Client components.
- Navigation/redirect behavior.

This is required by `AGENTS.md` because the project uses Next.js `16.2.6`.

- [ ] **Step 2: Record any constraints that affect implementation**

If the docs show a Next.js 16-specific convention that affects this feature, record it in implementation notes before writing code.

---

## Task 2: Create Auth API Types

**Files:**

- Create: `src/features/auth/api/auth-types.ts`

- [ ] **Step 1: Add request payload types**

```ts
export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  affiliateCode: string;
};

export type VerifyEmailRequest = {
  verificationToken: string;
  code: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};
```

- [ ] **Step 2: Add temporary response types**

```ts
export type RegisterResponse = unknown;
export type VerifyEmailResponse = unknown;
export type LoginResponse = unknown;
export type ForgotPasswordResponse = unknown;
export type ResetPasswordResponse = unknown;
```

Update each `unknown` only after the real response is observed in the browser console.

---

## Task 3: Create Auth API Functions

**Files:**

- Create: `src/features/auth/api/auth-api.ts`

- [ ] **Step 1: Add Axios auth functions**

```ts
import axios from "axios";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "./auth-types";

const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function registerUser(payload: RegisterRequest) {
  return authClient.post<RegisterResponse>("/auth/local/register", payload);
}

export async function verifyEmail(payload: VerifyEmailRequest) {
  return authClient.post<VerifyEmailResponse>("/auth/local/verify-email", payload);
}

export async function loginUser(payload: LoginRequest) {
  return authClient.post<LoginResponse>("/auth/local/login", payload);
}

export async function forgotPassword(payload: ForgotPasswordRequest) {
  return authClient.post<ForgotPasswordResponse>("/auth/local/forgot-password", payload);
}

export async function resetPassword(payload: ResetPasswordRequest) {
  return authClient.post<ResetPasswordResponse>("/auth/local/reset-password", payload);
}
```

- [ ] **Step 2: Confirm API base URL configuration**

Confirm whether `NEXT_PUBLIC_API_URL` exists. If it does not exist, add the required environment variable name to project setup notes before testing endpoints.

---

## Task 4: Add Temporary Auth Response Logger

**Files:**

- Create: `src/features/auth/lib/log-auth-response.ts`

- [ ] **Step 1: Add success and error logging helpers**

```ts
import type { AxiosError, AxiosResponse } from "axios";

type AuthEndpoint =
  | "register"
  | "verify-email"
  | "login"
  | "forgot-password"
  | "reset-password";

export function logAuthSuccess(endpoint: AuthEndpoint, response: AxiosResponse<unknown>) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.log(`[auth/${endpoint}] response`, {
    status: response.status,
    data: response.data,
  });
}

export function logAuthError(endpoint: AuthEndpoint, error: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const axiosError = error as AxiosError;

  console.error(`[auth/${endpoint}] error`, {
    status: axiosError.response?.status,
    data: axiosError.response?.data,
    message: axiosError.message,
  });
}
```

Do not log passwords or request payloads.

---

## Task 5: Add API Error Parser

**Files:**

- Create: `src/features/auth/lib/parse-auth-error.ts`

- [ ] **Step 1: Add readable error parser**

```ts
import axios from "axios";

export function parseAuthError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong. Please try again.";
  }

  const data = error.response?.data;

  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }

  return error.message || "Something went wrong. Please try again.";
}
```

Update this parser after the real backend error format is observed.

---

## Task 6: Create Auth Route and Page Shell

**Files:**

- Create: `src/app/login-register/page.tsx`
- Create: `src/features/auth/ui/AuthPage.tsx`
- Create: `src/features/auth/index.ts`

- [ ] **Step 1: Add route entry**

```tsx
import { AuthPage } from "@/features/auth";

export default function LoginRegisterPage() {
  return <AuthPage />;
}
```

- [ ] **Step 2: Add auth feature export**

```ts
export { AuthPage } from "./ui/AuthPage";
```

- [ ] **Step 3: Add auth page shell**

```tsx
"use client";

import { useState } from "react";
import { RegisterForm } from "./RegisterForm";

type AuthFlow = "register" | "verify-email" | "login" | "forgot-password" | "reset-password";

export function AuthPage() {
  const [flow, setFlow] = useState<AuthFlow>("register");

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <section className="w-full max-w-md">
        {flow === "register" ? (
          <RegisterForm onRegistered={() => setFlow("verify-email")} onLoginClick={() => setFlow("login")} />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            Next auth step: {flow}
          </div>
        )}
      </section>
    </main>
  );
}
```

This shell starts with `register` because register response determines the verify-email flow.

---

## Task 7: Implement Register Endpoint First

**Files:**

- Create: `src/features/auth/ui/RegisterForm.tsx`
- Modify: `src/features/auth/ui/AuthPage.tsx`

- [ ] **Step 1: Add register form with TanStack Query mutation**

```tsx
"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth-api";
import { logAuthError, logAuthSuccess } from "../lib/log-auth-response";
import { parseAuthError } from "../lib/parse-auth-error";

type RegisterFormProps = {
  onRegistered: () => void;
  onLoginClick: () => void;
};

export function RegisterForm({ onRegistered, onLoginClick }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("doctor");
  const [errorMessage, setErrorMessage] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      logAuthSuccess("register", response);
      onRegistered();
    },
    onError: (error) => {
      logAuthError("register", error);
      setErrorMessage(parseAuthError(error));
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    registerMutation.mutate({
      username,
      email,
      password,
      affiliateCode,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-950">Create account</h1>
        <p className="text-sm text-zinc-600">Register with email and password.</p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-zinc-800">
          Username
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>

        <label className="block text-sm font-medium text-zinc-800">
          Email
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="block text-sm font-medium text-zinc-800">
          Password
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <label className="block text-sm font-medium text-zinc-800">
          Affiliate code
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
            name="affiliateCode"
            value={affiliateCode}
            onChange={(event) => setAffiliateCode(event.target.value)}
            required
          />
        </label>
      </div>

      {errorMessage ? <p className="mt-4 text-sm text-red-600">{errorMessage}</p> : null}

      <button
        className="mt-6 w-full rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating account..." : "Create account"}
      </button>

      <button
        className="mt-4 w-full text-sm font-medium text-zinc-700"
        type="button"
        onClick={onLoginClick}
      >
        Already have an account? Log in
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Test register in browser**

Open `/login-register`, submit:

```json
{
  "username": "cool_user",
  "email": "user@example.com",
  "password": "SecureP@ssw0rd12",
  "affiliateCode": "doctor"
}
```

Expected browser console:

```txt
[auth/register] response
```

or:

```txt
[auth/register] error
```

- [ ] **Step 3: User reports actual register response**

Record:

- HTTP status.
- Response data.
- Whether `verificationToken` is included.
- Error shape if request fails.

Do not implement verify email until this is known.

---

## Task 8: Implement Verify Email After Register Response Is Known

**Files:**

- Create: `src/features/auth/ui/VerifyEmailForm.tsx`
- Modify: `src/features/auth/ui/AuthPage.tsx`
- Modify: `src/features/auth/api/auth-types.ts` if register response is known

- [ ] **Step 1: Update register response type if needed**

If register returns a verification token, replace `RegisterResponse = unknown` with the observed shape.

- [ ] **Step 2: Add verify email form**

Create a form for:

```json
{
  "verificationToken": "550e8400-e29b-41d4-a716-446655440000",
  "code": "123456"
}
```

Use `verifyEmail`, `useMutation`, `logAuthSuccess("verify-email", response)`, and `logAuthError("verify-email", error)`.

- [ ] **Step 3: Test verify email in browser**

Expected browser console:

```txt
[auth/verify-email] response
```

or:

```txt
[auth/verify-email] error
```

- [ ] **Step 4: User reports actual verify email response**

Update `VerifyEmailResponse` after observing the real response.

---

## Task 9: Implement Login After Verify Flow Is Known

**Files:**

- Create: `src/features/auth/ui/LoginForm.tsx`
- Modify: `src/features/auth/ui/AuthPage.tsx`
- Modify: `src/features/auth/api/auth-types.ts` if login response is known

- [ ] **Step 1: Add login form**

Create a form for:

```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```

Use `loginUser`, `useMutation`, `logAuthSuccess("login", response)`, and `logAuthError("login", error)`.

- [ ] **Step 2: Test login in browser**

Expected browser console:

```txt
[auth/login] response
```

or:

```txt
[auth/login] error
```

- [ ] **Step 3: User reports actual login response**

Record:

- Whether tokens are returned.
- Whether user data is returned.
- Whether cookies are set.
- Redirect target after login.

- [ ] **Step 4: Implement minimal session handling**

Only after the login response is known:

- If backend uses httpOnly cookies, do not store tokens in frontend state.
- If backend returns JWT, add a minimal session store/helper.
- If backend returns user data, keep only the required user fields.

---

## Task 10: Implement Forgot Password

**Files:**

- Create: `src/features/auth/ui/ForgotPasswordForm.tsx`
- Modify: `src/features/auth/ui/AuthPage.tsx`
- Modify: `src/features/auth/api/auth-types.ts` if forgot password response is known

- [ ] **Step 1: Add forgot password form**

Create a form for:

```json
{
  "email": "user@example.com"
}
```

Use `forgotPassword`, `useMutation`, `logAuthSuccess("forgot-password", response)`, and `logAuthError("forgot-password", error)`.

- [ ] **Step 2: Test forgot password in browser**

Expected browser console:

```txt
[auth/forgot-password] response
```

or:

```txt
[auth/forgot-password] error
```

- [ ] **Step 3: User reports actual forgot password response**

Update `ForgotPasswordResponse` after observing the real response.

---

## Task 11: Implement Reset Password

**Files:**

- Create: `src/features/auth/ui/ResetPasswordForm.tsx`
- Modify: `src/features/auth/ui/AuthPage.tsx`
- Modify: `src/features/auth/api/auth-types.ts` if reset password response is known

- [ ] **Step 1: Add reset password form**

Create a form for:

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "newPassword": "NewSecureP@ssw0rd12"
}
```

Use `resetPassword`, `useMutation`, `logAuthSuccess("reset-password", response)`, and `logAuthError("reset-password", error)`.

- [ ] **Step 2: Test reset password in browser**

Expected browser console:

```txt
[auth/reset-password] response
```

or:

```txt
[auth/reset-password] error
```

- [ ] **Step 3: User reports actual reset password response**

Update `ResetPasswordResponse` after observing the real response.

---

## Task 12: UI Polish

**Files:**

- Modify: `src/features/auth/ui/AuthPage.tsx`
- Modify: `src/features/auth/ui/RegisterForm.tsx`
- Modify: `src/features/auth/ui/VerifyEmailForm.tsx`
- Modify: `src/features/auth/ui/LoginForm.tsx`
- Modify: `src/features/auth/ui/ForgotPasswordForm.tsx`
- Modify: `src/features/auth/ui/ResetPasswordForm.tsx`

- [ ] **Step 1: Match the provided design**

Apply the real design after endpoint behavior is working.

- [ ] **Step 2: Add final form UX**

Add:

- Disabled submit while pending.
- Clear errors before each new submit.
- Readable success messages.
- Password show/hide if present in design.
- Mobile and desktop responsive states.

- [ ] **Step 3: Remove or gate temporary logs**

Keep logs only in development or remove them after response contracts are typed.

---

## Task 13: Final Verification

**Files:**

- Verify all created/modified files.

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: no ESLint errors.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: production build completes successfully.

- [ ] **Step 3: Manual endpoint QA**

Verify:

- Register success and error states.
- Verify email success and error states.
- Login success and error states.
- Forgot password success and error states.
- Reset password success and error states.
- Browser console logs show actual endpoint responses during development.
- Passwords are not logged.
- Layout works on mobile and desktop.

---

## Implementation Order

1. Read local Next.js 16 docs required by `AGENTS.md`.
2. Create API types and API functions.
3. Create temporary dev response logger.
4. Create `/login-register` page shell.
5. Implement register endpoint and wait for actual response.
6. Implement verify email after register response is known.
7. Implement login after verify flow is known.
8. Implement session handling only after login response is known.
9. Implement forgot password.
10. Implement reset password.
11. Apply final design polish.
12. Run lint, build, and manual QA.

---

## Implementation Status — 2026-06-02

**Done (code-complete, `npm run lint` and `npm run build` both pass):**

- Task 1: Read local Next.js 16 docs (layouts/pages, server/client components). Constraint recorded: context providers must be Client Components rendered around `{children}`.
- Infra (not in original plan, required for `useMutation`): `src/shared/providers/query-provider.tsx` `QueryProvider`, exported from `src/shared`, wired into `src/app/layout.tsx`.
- Task 2: `auth-types.ts` — request types + `unknown` response types.
- Task 3: `auth-api.ts` — Axios functions. Step 2: `NEXT_PUBLIC_API_URL` does **not** exist; documented in `.env.local.example`.
- Task 4: `log-auth-response.ts` — dev-only success/error loggers.
- Task 5: `parse-auth-error.ts` — readable error parser.
- Task 6: `/login-register` route, `AuthPage` shell, feature barrel.
- Tasks 7–11, Step 1: all five forms built (register, verify-email, login, forgot-password, reset-password) with mutations + dev logging. Full flow wiring in `AuthPage`.
- Task 13, Steps 1–2: lint clean, production build succeeds.

**Blocked on you (browser-observed responses):**

1. Set `NEXT_PUBLIC_API_URL` in `.env.local`, then `npm run dev` and open `/login-register`.
2. Submit each endpoint; report the console-logged `status` + `data` so we can:
   - Replace each `unknown` response type with the real shape (Tasks 8–11).
   - Confirm whether register returns a `verificationToken` (currently entered manually in verify step).
   - Implement session handling after the login response is known (Task 9, Step 4) — token vs httpOnly cookie, user payload, redirect target.
3. Task 12 (design polish) and Task 13 Step 3 (manual QA) follow once contracts are confirmed.

