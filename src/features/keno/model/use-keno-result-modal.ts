import { useCallback, useEffect, useState } from "react";

const RESULT_MODAL_CLOSE_DELAY_MS = 2000;

export function useKenoResultModal() {
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);

  const hideResultModal = useCallback(() => {
    setIsResultModalVisible(false);
  }, []);

  const showResultModal = useCallback(() => {
    setIsResultModalVisible(true);
  }, []);

  useEffect(() => {
    if (!isResultModalVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsResultModalVisible(false);
    }, RESULT_MODAL_CLOSE_DELAY_MS);

    function dismissResultModal() {
      setIsResultModalVisible(false);
    }

    document.addEventListener("pointerdown", dismissResultModal);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("pointerdown", dismissResultModal);
    };
  }, [isResultModalVisible]);

  return {
    hideResultModal,
    isResultModalVisible,
    showResultModal,
  };
}
