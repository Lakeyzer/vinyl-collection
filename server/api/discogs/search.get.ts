import { defineEventHandler, getQuery } from "h3";
import type { DiscogsSearchQuery, DiscogsSearchResponse } from "~~/types";

export default defineEventHandler(
  async (event): Promise<DiscogsSearchResponse> => {
    const config = useRuntimeConfig();
    const { query, page, per_page, type, format, barcode }: DiscogsSearchQuery =
      getQuery(event);

    const headers = {
      Authorization: `Discogs token=${config.discogsToken}`,
      "User-Agent": config.discogsUserAgent,
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
          barcode,
        },
      },
    );

    return response;
  },
);
