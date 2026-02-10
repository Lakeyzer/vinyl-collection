import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { q, page, per_page } = getQuery(event);

  const headers = {
    Authorization: `Discogs token=${config.discogsToken}`,
    "User-Agent": "VinylCollection/0.1 +https://vinyl.keyroos.nl",
  };

  const res = await $fetch("https://api.discogs.com/database/search", {
    headers,
    params: {
      q,
      type: "master",
      per_page: per_page,
      page,
    },
  });

  return res;
});
