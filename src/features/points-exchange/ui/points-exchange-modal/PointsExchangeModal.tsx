"use client";

import { usePointsExchangeModalStore } from "../../model/points-exchange-modal-store";
import { PointsExchangeModalContent } from "./PointsExchangeModalContent";

export function PointsExchangeModal() {
  const isOpen = usePointsExchangeModalStore((state) => state.isOpen);
  const openKey = usePointsExchangeModalStore((state) => state.openKey);
  const closePointsExchangeModal = usePointsExchangeModalStore(
    (state) => state.closePointsExchangeModal,
  );

  if (!isOpen) {
    return null;
  }

  return (
    <PointsExchangeModalContent
      key={openKey}
      onClose={closePointsExchangeModal}
    />
  );
}
