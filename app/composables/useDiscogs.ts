import type {
  DiscogsSearchQuery,
  DiscogsSearchResponse,
  ReleaseDoc,
} from "~~/types";

export function useDiscogs() {
  async function search({
    query,
    type,
    page,
    per_page,
    format,
    barcode,
  }: DiscogsSearchQuery): Promise<DiscogsSearchResponse | undefined> {
    try {
      const res = await $fetch("/api/discogs/search", {
        params: {
          query,
          type,
          per_page: per_page || 10,
          page: page || 1,
          format,
          barcode,
        },
      });
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchMaster(masterId: ReleaseDoc["master_id"]) {
    if (!masterId) return null;

    try {
      const res = await $fetch(`/api/discogs/master/${masterId}`);
      return res ?? null;
    } catch (e) {
      console.error("Failed fetching master year", e);
      return null;
    }
  }

  async function fetchRelease(id: ReleaseDoc["id"]) {
    if (!id) return null;

    try {
      const res = await $fetch(`/api/discogs/release/${id}`);
      return res ?? null;
    } catch (e) {
      console.error("Failed fetching master year", e);
      return null;
    }
  }

  return {
    search,
    fetchMaster,
    fetchRelease,
  };
}
