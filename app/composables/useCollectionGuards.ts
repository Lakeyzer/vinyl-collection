import type { Release } from "~~/types";

export function useCollectionGuards() {
  const { profile } = useAuth();
  const collections = useState<{ [key: string]: Release[] }>("collections");
  const wishlists = useState<{ [key: string]: Release[] }>("wishlists");

  const collection = computed(() => {
    if (!profile.value?.groupId) return [];
    return collections.value[profile.value?.groupId] || [];
  });

  const wishlist = computed(() => {
    if (!profile.value?.groupId) return [];
    return wishlists.value[profile.value?.groupId] || [];
  });

  const releaseIds = computed(() => {
    return new Set(collection.value.map((r) => r.id));
  });

  const masterIds = computed(() => {
    return new Set(collection.value.map((r) => r.master_id));
  });

  const wantedRecords = computed(() => {
    const set = new Set<string>();

    for (const r of wishlist.value) {
      if (r.id) set.add(`r:${r.id}`); // release
      if (r.master_id) set.add(`m:${r.master_id}`); // master
    }

    return set;
  });

  function hasRelease(releaseId: number) {
    return releaseIds.value.has(releaseId);
  }

  function hasMaster(masterId: number) {
    return masterIds.value.has(masterId);
  }

  function isWanted(releaseId: number, masterId: number) {
    if (masterId && wantedRecords.value.has(`m:${masterId}`)) return true;
    if (releaseId && wantedRecords.value.has(`r:${releaseId}`)) return true;
    return false;
  }

  return {
    collection,
    wishlist,
    releaseIds,
    masterIds,
    hasRelease,
    hasMaster,
    isWanted,
  };
}
