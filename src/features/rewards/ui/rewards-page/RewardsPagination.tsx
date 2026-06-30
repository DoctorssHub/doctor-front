import { getRewardsPaginationItems } from "../../lib/reward-pagination";

type RewardsPaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
};

export function RewardsPagination({
  currentPage,
  onPageChange,
  totalPages,
}: RewardsPaginationProps) {
  const items = getRewardsPaginationItems(currentPage, totalPages);

  if (items.length === 0) {
    return null;
  }

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return (
    <nav
      aria-label="Rewards pagination"
      className="flex items-center justify-center gap-1"
    >
      <PaginationArrow
        direction="previous"
        disabled={!canGoBack}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center text-[20px] font-semibold text-(--color-text-muted)"
            key={`ellipsis-${index}`}
          >
            ...
          </span>
        ) : (
          <button
            aria-current={item === currentPage ? "page" : undefined}
            className={`flex size-10 items-center justify-center rounded-[6px] text-[20px] font-semibold transition ${
              item === currentPage
                ? "bg-(--color-surface-icon) text-(--color-text-primary)"
                : "text-(--color-text-muted) hover:bg-(--color-surface-icon)/70 hover:text-(--color-text-primary)"
            }`}
            key={item}
            onClick={() => onPageChange(item)}
            type="button"
          >
            {item}
          </button>
        ),
      )}
      <PaginationArrow
        direction="next"
        disabled={!canGoForward}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  );
}

type PaginationArrowProps = {
  direction: "next" | "previous";
  disabled: boolean;
  onClick: () => void;
};

function PaginationArrow({
  direction,
  disabled,
  onClick,
}: PaginationArrowProps) {
  return (
    <button
      aria-label={direction === "previous" ? "Previous page" : "Next page"}
      className="flex size-10 items-center justify-center rounded-[6px] text-[#64748b] transition hover:bg-(--color-surface-icon)/70 hover:text-(--color-text-muted) disabled:pointer-events-none disabled:opacity-45"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span
        aria-hidden="true"
        className={`size-3 rotate-45 border-[#64748b] ${
          direction === "previous"
            ? "border-b-[3px] border-l-[3px]"
            : "border-t-[3px] border-r-[3px]"
        }`}
      />
    </button>
  );
}
