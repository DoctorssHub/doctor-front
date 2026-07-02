"use client";

type BetHistoryPaginationProps = {
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
};

type PaginationItem = number | "ellipsis";

const SIBLING_COUNT = 1;

function getPaginationItems(page: number, totalPages: number): PaginationItem[] {
  const pages = new Set<number>([1, totalPages]);

  for (let p = page - SIBLING_COUNT; p <= page + SIBLING_COUNT; p++) {
    if (p >= 1 && p <= totalPages) {
      pages.add(p);
    }
  }

  const sortedPages = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  let previousPage = 0;

  for (const currentPage of sortedPages) {
    if (currentPage - previousPage > 1) {
      items.push("ellipsis");
    }

    items.push(currentPage);
    previousPage = currentPage;
  }

  return items;
}

export function BetHistoryPagination({
  onPageChange,
  page,
  totalPages,
}: BetHistoryPaginationProps) {

  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(page, totalPages);

  return (
    <nav
      aria-label="Bet history pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <button
        aria-label="Previous page"
        className="flex size-9 items-center justify-center rounded-lg border border-(--color-border-strong) bg-(--color-surface-icon)/40 text-sm font-semibold text-(--color-text-muted) transition hover:bg-(--color-surface-hover) hover:text-white disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => {
          onPageChange(page - 1);
        }}
        type="button"
      >
        &lt;
      </button>
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center text-sm font-semibold text-(--color-text-subtle)"
            key={`ellipsis-${index}`}
          >
            ...
          </span>
        ) : (
          <button
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={`flex size-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
              item === page
                ? "bg-(--color-accent-red) text-white shadow-[0_0_24px_rgb(239_68_68/28%)]"
                : "border border-(--color-border-strong) bg-(--color-surface-icon)/40 text-(--color-text-muted) hover:bg-(--color-surface-hover) hover:text-white"
            }`}
            key={item}
            onClick={() => {
              onPageChange(item);
            }}
            type="button"
          >
            {item}
          </button>
        ),
      )}
      <button
        aria-label="Next page"
        className="flex size-9 items-center justify-center rounded-lg border border-(--color-border-strong) bg-(--color-surface-icon)/40 text-sm font-semibold text-(--color-text-muted) transition hover:bg-(--color-surface-hover) hover:text-white disabled:opacity-40"
        disabled={page >= totalPages}
        onClick={() => {
          onPageChange(page + 1);
        }}
        type="button"
      >
        &gt;
      </button>
    </nav>
  );
}
