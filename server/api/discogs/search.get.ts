import { defineEventHandler, getQuery } from "h3";
import type { DiscogsSearchQuery, DiscogsSearchResponse } from "~~/types";

export default defineEventHandler(
  async (event): Promise<DiscogsSearchResponse> => {
    const config = useRuntimeConfig();
    const { query, page, per_page, type, format }: DiscogsSearchQuery =
      getQuery(event);

    const headers = {
      Authorization: `Discogs token=${config.discogsToken}`,
      "User-Agent": "VinylCollection/0.1 +https://vinyl.keyroos.nl",
    };

    const response: DiscogsSearchResponse = await $fetch(
      "https://api.discogs.com/database/search",
      {
        headers,
        params: {
          query,
          type,
          per_page: per_page,
          page,
          format,
        },
      },
    );

    return response;
  },
);
