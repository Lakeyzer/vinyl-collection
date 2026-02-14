import type { ReleaseDoc } from "~~/types";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { profile } = useAuth();
  const { onCollection, onWishlist } = useFirestore();
  const collections = useState<{ [key: string]: ReleaseDoc[] }>(
    "collections",
    () => ({}) as { [key: string]: ReleaseDoc[] },
  );
  const wishlists = useState<{ [key: string]: ReleaseDoc[] }>(
    "wishlists",
    () => ({}) as { [key: string]: ReleaseDoc[] },
  );
  const collectionsLoading = useState<Record<string, boolean>>(
    "collectionsLoading",
    () => ({}) as Record<string, boolean>,
  );
  const wishlistsLoading = useState<Record<string, boolean>>(
    "wishlistsLoading",
    () => ({}) as Record<string, boolean>,
  );

  watch(profile, async (p) => {
    if (!p?.groupId) return;

    const groupId = p.groupId;

    const unsubCollection = onCollection(groupId, (data) => {
      collections.value[groupId] = data;
      collectionsLoading.value[groupId] = false;
    });

    const unsubWishlist = onWishlist(groupId, (data) => {
      wishlists.value[groupId] = data;
      wishlistsLoading.value[groupId] = false;
    });

    // cleanup when user changes
    onScopeDispose(() => {
      unsubCollection();
      unsubWishlist();
    });
  });
});
