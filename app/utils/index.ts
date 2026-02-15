import type {
  SortOption,
  ReleaseDoc,
  DiscogsGetReleaseResponse,
  Filter,
} from "~~/types";

export const album = (title: string): string => {
  return String(title.split(" - ")?.[1]);
};
export const artist = (title: string): string => {
  return String(title.split(" - ")?.[0]);
};
export const isSingle = (format?: string[]) => {
  return format?.includes('7"') || format?.includes("Single");
};

export function compareValues(a: any, b: any, dir: "asc" | "desc") {
  if (a == null && b == null) return 0;
  if (a == null) return dir === "asc" ? 1 : -1;
  if (b == null) return dir === "asc" ? -1 : 1;

  if (typeof a === "string" && typeof b === "string") {
    return dir === "asc" ? a.localeCompare(b) : b.localeCompare(a);
  }

  return dir === "asc" ? a - b : b - a;
}

export function sortRecords<T extends Record<string, any>>(
  list: T[],
  sort: SortOption[],
) {
  return [...list].sort((a, b) => {
    for (const { key, dir } of sort) {
      const result = compareValues(a[key], b[key], dir);
      // if (key === "master_year" && !)
      if (result !== 0) return result;
    }
    return 0;
  });
}

export function filterRecords(
  list: ReleaseDoc[],
  query: {
    text_search?: string;
    filter?: Filter;
  },
) {
  if (!query.text_search && !query.filter) return list;

  const q = query.text_search?.toLowerCase().trim();
  if (q) {
    list = list.filter((r) => {
      const artist = r.artist?.toLowerCase() || "";
      const album = r.album?.toLowerCase() || "";

      return artist.includes(q) || album.includes(q);
    });
  }
  const f = query.filter?.format;
  console.log(f);
  if (f) {
    list = list.filter((r) => {
      const format = r.format;

      return f === "Single" ? isSingle(format) : format.includes(f);
    });
  }
  return list;
}

/**
 * Remove "the" from the start of strings
 * @param value
 * @returns
 */
function normalizeSortString(value: string) {
  return value
    .trim()
    .replace(/^the\s+/i, "")
    .toLowerCase();
}

export const itemToRecord = (
  item: DiscogsGetReleaseResponse,
  master_year?: number,
) => {
  // find primary cover
  let cover_image = item.images?.find(
    (image) => image.type === "primary",
  )?.resource_url;

  if (!cover_image) {
    cover_image = item.images?.[0]?.resource_url ?? "";
  }

  return {
    id: item.id,
    master_id: item.master_id || null,
    master_year: master_year || null,
    master_url: item.master_url || null,
    cover_image: cover_image,
    thumb: item.thumb,
    title: item.title,
    artist: item.artists.map((artist) => artist.name).join(", "),
    artist_sort: item.artists_sort,
    album: item.title,
    year: item.year,
    discogs_uri: item.uri,
    format: item.formats[0]?.descriptions || [],
  };
};
