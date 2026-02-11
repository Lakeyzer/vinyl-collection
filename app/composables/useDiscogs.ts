import type { DiscogsSearchQuery, DiscogsSearchResponse } from "~~/types";

export function useDiscogs() {
  async function search({
    query,
    type,
    page,
    per_page,
    format,
  }: DiscogsSearchQuery): Promise<DiscogsSearchResponse | undefined> {
    try {
      const res = await $fetch("/api/discogs/search", {
        params: {
          query,
          type,
          per_page: per_page || 10,
          page: page || 1,
          format,
        },
      });
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  return {
    search,
  };
}
