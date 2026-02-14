import type { SortOption } from "~~/types";

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
    const aNorm = normalizeSortString(a);
    const bNorm = normalizeSortString(b);

    return dir === "asc"
      ? aNorm.localeCompare(bNorm)
      : bNorm.localeCompare(aNorm);
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
      if (result !== 0) return result;
    }
    return 0;
  });
}

export function filterRecords<T extends { artist?: string; album?: string }>(
  list: T[],
  query: string,
) {
  if (!query) return list;

  const q = query.toLowerCase().trim();

  return list.filter((r) => {
    const artist = r.artist?.toLowerCase() || "";
    const album = r.album?.toLowerCase() || "";

    return artist.includes(q) || album.includes(q);
  });
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
