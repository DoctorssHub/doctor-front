# Breakpoint Checklist

## Protected Desktop

- 1920px: preserve the current wide layout, spacing, typography, and section composition.
- 1440px: preserve the current desktop layout. Treat this as the main baseline.
- Do not use plain `lg:` or unprefixed replacements for tablet fixes if they would change 1440px.

## 1024px

Goal: keep the desktop feel but remove compression.

Check:

- Navigation still fits without wrapping awkwardly.
- Grids usually move from 4 columns to 2 or from 3 columns to 2.
- Large decorative/media blocks shrink or move behind content.
- Section padding and gaps reduce, but content still has breathing room.
- Sidebar layouts either narrow safely or switch to a compact/drawer pattern.

Common fixes:

```tsx
className="grid grid-cols-4 min-[1024px]:max-[1279px]:grid-cols-2"
```

```tsx
className="gap-10 max-[1279px]:gap-6"
```

## 768px

Goal: tablet layout that can scan vertically.

Check:

- Dense horizontal rows stack or become two-column layouts.
- Text blocks and media do not compete for the same narrow row.
- Header actions remain tappable.
- Cards keep stable heights only when needed; avoid equal-height traps that create huge empty spaces.
- Padding often becomes 24px or 20px.

Common fixes:

```tsx
className="flex items-center max-[1023px]:flex-col max-[1023px]:items-stretch"
```

```tsx
className="px-10 max-[1023px]:px-6"
```

## 375px

Goal: narrow mobile without horizontal scroll.

Check:

- One-column layout by default.
- Horizontal padding usually 16px.
- Buttons either become full-width or compact icon/text controls.
- Long words, numbers, and labels wrap or truncate intentionally.
- Absolute-positioned decorative elements do not cover content.
- No `w-[500px]`, `min-w-[400px]`, large negative margins, or fixed left/right offsets that exceed the viewport.

Common fixes:

```tsx
className="px-10 max-[1023px]:px-6 max-[767px]:px-4"
```

```tsx
className="grid grid-cols-3 max-[1023px]:grid-cols-2 max-[767px]:grid-cols-1"
```

```tsx
className="text-5xl max-[767px]:text-3xl"
```

## Final Verification Order

1. Check 1440px before changes or preserve the known class contract.
2. Fix 1024px.
3. Fix 768px.
4. Fix 375px.
5. Re-check 1920px and 1440px.

If desktop changed, revert the broad rule and replace it with a bounded `max-[1279px]` or `min-[...]:max-[...]` rule.
