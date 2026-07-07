type ScrollLockTarget = {
  style: {
    overflow: string;
  };
};

export function lockPageScroll(
  body: ScrollLockTarget,
  documentElement: ScrollLockTarget,
) {
  const previousBodyOverflow = body.style.overflow;
  const previousDocumentElementOverflow = documentElement.style.overflow;

  body.style.overflow = "hidden";
  documentElement.style.overflow = "hidden";

  return () => {
    body.style.overflow = previousBodyOverflow;
    documentElement.style.overflow = previousDocumentElementOverflow;
  };
}
