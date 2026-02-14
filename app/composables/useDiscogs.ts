import type { DiscogsSearchQuery, DiscogsSearchResponse } from "~~/types";

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

  async function fetchMaster(masterId: number) {
    if (!masterId) return null;

    try {
      const res = await $fetch(`/api/discogs/master/${masterId}`);
      return res ?? null;
    } catch (e) {
      console.error("Failed fetching master year", e);
      return null;
    }
  }

  return {
    search,
    fetchMaster,
  };
}
