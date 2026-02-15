import { defineEventHandler } from "h3";
import type { DiscogsGetReleaseResponse } from "~~/types";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = event.context.params as { id: string };

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Release ID is required",
    });
  }

  const headers = {
    Authorization: `Discogs token=${config.discogsToken}`,
    "User-Agent": config.discogsUserAgent,
  };
  const response = await $fetch<DiscogsGetReleaseResponse>(
    `https://api.discogs.com/releases/${id}`,
    {
      headers,
    },
  );

  return response;
});
