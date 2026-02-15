export interface Profile {
  email: string;
  username: string;
  group: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface Release {
  id: number;
  master_id?: number | null;
  master_year?: number | null;
  master_url?: string | null;
  cover_image?: string;
  thumb: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  discogs_uri: string;
  format: string[];
}

export interface ReleaseDoc extends Release {
  docId: string;
}

export type SortKey = "artist" | "album" | "year" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  key: SortKey;
  dir: SortDirection;
}
