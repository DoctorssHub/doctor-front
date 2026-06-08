---
name: pre-commit-review
description: Use when preparing, reviewing, staging, or creating a git commit in this project, especially before the user asks Codex to commit changes or verify what is staged.
---

# Pre-Commit Review

## Overview

Run a focused human-style review before committing. The goal is to catch
accidental files, secrets, generated artifacts, architectural drift, and missing
verification notes without repeating the normal post-task lint check.

## Workflow

1. Read `AGENTS.md` first and follow project-specific rules.
2. Inspect repository state:
   - `git status --short`
   - `git diff --cached --stat`
   - `git diff --cached`
3. If nothing is staged, inspect the working tree and ask whether to stage files.
   Do not stage unrelated files.
4. Confirm staged files form one coherent commit. Flag unrelated edits, generated
   files, or files likely changed by another person.
5. Check for forbidden or risky staged content:
   - `.env` or secrets
   - `.next/**`
   - `node_modules/**`
   - `tsconfig.tsbuildinfo`
   - auth tokens in client state, `localStorage`, logs, or comments
6. Review project-specific risks:
   - Next.js changes should respect the bundled docs in
     `node_modules/next/dist/docs/`.
   - Keep `"use client"` boundaries narrow.
   - Browser API calls should go through `/api`, not direct backend hosts.
   - Route handlers should follow Next 16 async params conventions.
7. Summarize readiness before committing:
   - staged files
   - verification already run
   - skipped verification with reason
   - risks or open questions

## Verification Rules

- Do not run `npm run lint` inside this skill by default. In this project, lint
  is the normal post-task verification and should not be repeated during
  pre-commit review unless the user asks.
- Do not run `npm run build` by default. Run it only when the user explicitly
  asks, when the staged changes are release-sensitive, or before claiming the
  commit is production-ready.
- If verification is missing, report that clearly instead of implying the commit
  is fully verified.

## Commit Rules

- Do not create a commit unless the user asked for a commit.
- Do not amend, reset, checkout, or discard changes unless the user explicitly
  requested that exact action.
- If committing, write a concise commit message that describes the staged
  behavior change, not the implementation mechanics.
