import { defineEventHandler, getQuery } from "h3";

const headers = {
  Authorization: `Discogs token=${process.env.DISCOGS_ACCESS_TOKEN}`,
  "User-Agent": "VinylCollection/0.1 +https://vinyl.keyroos.nl",
};

export default defineEventHandler(async (event) => {
  const { q, page, per_page } = getQuery(event);

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
