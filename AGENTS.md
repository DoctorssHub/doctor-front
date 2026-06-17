<!-- BEGIN:nextjs-agent-rules -->
# Next.js: ALWAYS read docs before coding

This project uses Next.js 16, which may differ from older Next.js APIs,
conventions, and file structure. Before any Next.js work, read the relevant
version-matched guide in `node_modules/next/dist/docs/`. Heed deprecation
notices and prefer the bundled docs over training-data assumptions.
<!-- END:nextjs-agent-rules -->

# Project Agent Instructions

## Project overview

- This is a TypeScript Next.js App Router frontend in `src/`.
- The current stack is Next.js 16.2.6, React 19.2.4, Tailwind CSS 4,
  TanStack React Query 5, Zustand 5, Axios, and Google reCAPTCHA.
- The app uses `@/*` as an alias for `src/*`.
- Keep root files for configuration and generated framework artifacts. Keep
  application code under `src/`.

## Project skills

- Keep repository-specific Codex skills in `.agents/skills/<skill-name>/`.
- Do not add new project skills under `.codex/skills`; use `.agents/skills`
  as the single shared location.
- Each project skill must include `SKILL.md`. When the skill is exposed in the
  UI, keep `agents/openai.yaml` in sync with the skill description.
- Current project skills:
  - `.agents/skills/pre-commit-review`: review staged changes before commits.
  - `.agents/skills/responsive-adaptive-safe`: adapt UI for 1024px, 768px, and
    375px while preserving 1920px and 1440px desktop baselines.

## Architecture

- Treat `src/app` as the Next.js routing and application shell layer.
  Route files, layouts, global CSS, and route handlers belong here.
- Keep route pages thin. Compose real screens from `src/screens`.
- Put user-facing feature behavior in `src/features/<feature>/`.
  Use the existing subfolders: `api`, `model`, `lib`, and `ui`.
- Put reusable cross-feature UI, providers, utilities, and public exports in
  `src/shared`.
- Reserve `src/entities` for domain entities and `src/widgets` for composed
  cross-feature blocks when those layers are actually needed.
- Prefer local feature imports inside a feature. Export only the stable public
  surface from each layer's `index.ts`.

## Feature code organization

- Do not put large feature implementations into a single component file.
- Before writing or refactoring feature UI, split code by responsibility:
  - `api/` for backend requests and API types.
  - `model/` for domain state, constants, stores, and business entities.
  - `lib/` for pure helper functions, formatters, mappers, calculations, and
    reusable non-React logic.
  - `ui/<block-name>/` for composed UI blocks and their private subcomponents.
- Keep route and screen files thin. Screens should compose feature-level blocks,
  not contain implementation details.
- If a component needs more than one responsibility, extract:
  - presentational subcomponents into nearby `ui/<block-name>/...` files;
  - animation or stateful React logic into `useSomething.ts`;
  - pure calculations into `lib/*` or local `*-utils.ts`;
  - constants into `*-constants.ts`.
- Prefer folder-level `index.ts` files for stable public imports from a UI
  block.
- Do not expose internal subcomponents outside their block unless another block
  genuinely needs them.
- A feature UI folder should not become a flat list of unrelated files. Group
  files by user-facing block or workflow.
- When refactoring structure, preserve behavior first, update imports, then run
  `npm run lint`.

## Next.js rules

- Components are Server Components by default. Add `"use client"` only to files
  that need state, effects, browser APIs, event handlers, Zustand, React Query,
  or other client-only libraries.
- Keep client boundaries as small as practical. Do not mark `layout.tsx` or
  broad route files as client components unless the design requires it.
- Providers that use React context or React Query must be client components and
  should be rendered as deep as practical in the tree.
- For route handlers, use Web `Request`/`Response` APIs or `NextRequest` from
  `next/server`. In Next 16, dynamic route context params are async promises.
- Do not mix Pages Router patterns into this app unless a task explicitly adds
  `src/pages`.

## API and auth conventions

- Browser-side backend calls should go through the local Next route proxy at
  `/api`, not directly to the backend host.
- The catch-all proxy lives at `src/app/api/[...path]/route.ts` and depends on
  `BACKEND_API_URL`.
- Auth cookies handled by the proxy are `access_token`, `refresh_token`, and
  `socket_token`. Do not expose these tokens to client state or localStorage.
- Auth API calls live in `src/features/auth/api/auth-api.ts`.
- Auth UI state lives in Zustand stores under `src/features/auth/model`.

## Styling

- Use Tailwind CSS utilities and the CSS variables already defined in
  `src/app/globals.css`.
- Keep global CSS limited to design tokens, resets, and genuinely global
  primitives. Prefer component-local Tailwind classes for layout and styling.
- Do not introduce another styling system unless the task explicitly requires
  it.

## Code style

- Use strict TypeScript. Avoid `any`; prefer explicit request/response and prop
  types.
- Use named exports for project modules unless a Next.js file convention
  requires a default export.
- Use double quotes and semicolons to match the existing code.
- Keep changes scoped. Do not refactor unrelated files while implementing a
  feature or fix.
- Do not edit generated files such as `.next/**`, `next-env.d.ts`, or
  `tsconfig.tsbuildinfo`.

## Commands

- Install dependencies with `npm install` when `package.json` changes.
- Run the dev server with `npm run dev`.
- Run linting with `npm run lint` as the standard post-task verification.
- Do not run `npm run build` automatically after every task. Run it only when
  the user explicitly asks for it, before committing release-sensitive changes,
  or before claiming that a change is production-ready.
- The pre-commit review skill should not run lint again, because lint is already
  part of normal post-task verification.

## Environment

- Required runtime configuration is stored in environment variables. At minimum,
  the API proxy expects `BACKEND_API_URL`.
- Do not commit secrets. Keep local-only values in ignored environment files.
