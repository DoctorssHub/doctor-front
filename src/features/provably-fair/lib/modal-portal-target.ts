type ModalPortalDocument = {
  body: Element;
  fullscreenElement: Element | null;
};

export function getModalPortalTarget(documentRef: ModalPortalDocument) {
  return documentRef.fullscreenElement ?? documentRef.body;
}
