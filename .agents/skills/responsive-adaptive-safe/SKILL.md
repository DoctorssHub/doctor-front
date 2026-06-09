---
name: responsive-adaptive-safe
description: Adapt existing frontend styles or element descriptions for responsive viewports while preserving the current 1920px and 1440px desktop appearance. Use when the user provides CSS, Tailwind classes, JSX/TSX markup, screenshots, or a text description of an element and asks to make it adaptive for 1024px, 768px, and 375px without changing desktop layouts.
---

# Responsive Adaptive Safe

## Core Rule

Treat 1920px and 1440px as protected desktop baselines. Do not change how the element looks at either width unless the user explicitly asks for a desktop change.

When adapting an element, target only:

- 1024px: desktop-to-tablet transition
- 768px: tablet layout
- 375px: narrow mobile layout

If the user provides only styles or a description, produce scoped responsive changes and explain which viewport each change targets.

## Workflow

1. Identify the current desktop contract.
   - Preserve existing unprefixed, `xl:`, `2xl:`, and any styles that define the 1440/1920 appearance.
   - Flag fixed widths, large gaps, oversized typography, absolute positioning, and non-wrapping text as responsive risks.

2. Choose bounded responsive rules.
   - Prefer changes that apply below desktop, such as `max-[1279px]:...`, `max-[1023px]:...`, and `max-[767px]:...`.
   - Use `min-[1024px]:max-[1279px]:...` for rules intended only for 1024-class screens.
   - Avoid using plain `lg:` for fixes that must not affect 1440, because default `lg:` applies from 1024px upward.

3. Adapt in this order.
   - First handle 1024px: reduce columns, gaps, paddings, and oversized media while keeping the composition close to desktop.
   - Then handle 768px: stack cramped horizontal layouts, simplify navigation/sidebar behavior, and reduce section spacing.
   - Last handle 375px: use one-column flow, safe text wrapping, compact paddings, and avoid horizontal scroll.

4. Protect desktop during output.
   - State that 1920/1440 are unchanged.
   - If a proposed class or CSS rule could affect 1440, rewrite it with a bounded media range.
   - If preserving desktop is impossible with the provided snippet, ask for the missing parent/container context.

5. Verify conceptually or with tools when code is available.
   - Check 1920, 1440, 1024, 768, and 375.
   - Look for horizontal scroll, overlapping text, clipped buttons, broken grids, unreadable typography, and layout jumps.
   - Re-check 1920 and 1440 after mobile/tablet changes.

## Response Format

When the user sends styles or an element description, respond with:

1. A short diagnosis of what will break at 1024/768/375.
2. The adapted CSS/Tailwind/JSX snippet.
3. A viewport note:
   - `1920/1440`: unchanged
   - `1024`: what changes
   - `768`: what changes
   - `375`: what changes
4. Any context needed if the snippet is not enough to guarantee desktop preservation.

Keep the answer practical. Prefer concrete classes or CSS over broad theory.

## Tailwind Guidance

Use this pattern when the existing desktop styles are already correct:

```tsx
className="
  desktop-existing-classes
  max-[1279px]:tablet-transition-change
  max-[1023px]:tablet-change
  max-[767px]:mobile-change
"
```

Use bounded 1024-only logic when the 1024 layout needs a change that should not affect 768 or 1440:

```tsx
className="
  desktop-existing-classes
  min-[1024px]:max-[1279px]:grid-cols-2
  max-[767px]:grid-cols-1
"
```

Do not replace a known-good desktop class with a smaller unprefixed value if that would alter 1440/1920. Add a lower-width override instead.

## Reference

For the viewport checklist and common fixes, read `references/breakpoint-checklist.md` when the task involves a full component or multiple styles.
