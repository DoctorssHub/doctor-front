export type RewardsPaginationItem = number | "ellipsis";

export function getRewardsPaginationItems(
  currentPage: number,
  totalPages: number,
): RewardsPaginationItem[] {
  if (totalPages <= 1) {
    return [];
  }

  if (totalPages <= 6) {
    return createPageRange(1, totalPages);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      ...createPageRange(totalPages - 3, totalPages),
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

function createPageRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
