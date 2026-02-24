export const useShareModal = () =>
  useState<boolean>("share-modal-open", () => false);
