import type { Release } from "~~/types";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { profile } = useAuth();
  const { onCollection, onWishlist } = useFirestore();
  const collections = useState<{ [key: string]: Release[] }>(
    "collections",
    () => ({}) as { [key: string]: Release[] },
  );
  const wishlists = useState<{ [key: string]: Release[] }>(
    "wishlists",
    () => ({}) as { [key: string]: Release[] },
  );

  watch(profile, async (p) => {
    if (p?.groupId) {
      const unsubCollection = onCollection(p.groupId, (data) => {
        collections.value[p.groupId] = data;
      });

      const unsubWishlist = onWishlist(p.groupId, (data) => {
        wishlists.value[p.groupId] = data;
      });

      // cleanup when user changes
      onScopeDispose(() => {
        unsubCollection();
        unsubWishlist();
      });
    }
  });
});
