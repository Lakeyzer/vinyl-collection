import { defineEventHandler, getQuery } from "h3";

const headers = {
  Authorization: `Discogs token=${process.env.DISCOGS_ACCESS_TOKEN}`,
  "User-Agent": "VinylCollection/0.1 +https://vinyl.keyroos.nl",
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event).q;

  const res = await $fetch("https://api.discogs.com/database/search", {
    headers,
    params: {
      q: query,
      type: "master",
      per_page: 10,
    },
  });

  return res;
});
