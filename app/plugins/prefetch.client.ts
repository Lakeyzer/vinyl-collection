export default defineNuxtPlugin(async (nuxtApp) => {
  const { group } = useAuth();
  const { fetchCollection, fetchWishlist } = useFirestore();
  const collectionData = useState("collection", () => []);
  const wishlistData = useState("wishlist", () => []);

  watch(group, async (g) => {
    if (g?.id) {
      collectionData.value = await fetchCollection(g.id);
      wishlistData.value = await fetchWishlist(g.id);
    }
  });
});
