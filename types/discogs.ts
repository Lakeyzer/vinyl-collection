export interface DiscogsSearchQuery {
  per_page?: number;
  page?: number;
  query?: string;
  type?: "artist" | "master" | "release" | "label";
  title?: string;
  release_title?: string;
  credit?: string;
  artist?: string;
  anv?: string;
  label?: string;
  genre?: string;
  style?: string;
  country?: string;
  year?: string | number;
  format?: string;
  catno?: string;
  barcode?: string;
  track?: string;
  submitter?: string;
  contributor?: string;
}

export interface DiscogsSearchMasterResult {
  style: string[];
  thumb: string;
  format: string[];
  country: string;
  barcode: string[];
  uri: string;
  master_url: string;
  label: string[];
  genre: string[];
  catno: string;
  community: {
    want: number;
    have: number;
  };
  year?: string;
  cover_image: string;
  title: string;
  resource_url: string;
  master_id: number;
  type: "master";
  id: number;
  user_data?: {
    in_collection: boolean;
    in_wantlist: boolean;
  };
}

export interface DiscogsSearchReleaseResult {
  style: string[];
  barcode: string[];
  thumb: string;
  title: string;
  type: "release";
  format: string[];
  uri: string;
  community: {
    want: number;
    have: number;
  };
  label: string[];
  country: string;
  cover_image: string;
  catno: string;
  master_url: null | string;
  year?: string;
  genre: string[];
  resource_url: string;
  master_id: number;
  format_quantity: number;
  id: number;
  formats: Format[];
  user_data?: {
    in_collection: boolean;
    in_wantlist: boolean;
  };
}

export interface DiscogsGetMasterResponse {
  styles?: string[];
  genres?: string[];
  num_for_sale: number;
  title: string;
  most_recent_release: number | null;
  main_release: number;
  notes?: string;
  main_release_url: string;
  uri: string;
  versions_url: string;
  data_quality: string;
  most_recent_release_url: string;
  year: number;
  resource_url: string;
  lowest_price: number | null;
  id: number;
}

export interface DiscogsGetReleaseResponse {
  artists: Artist[];
  year: number;
  images?: Image[];
  id: number;
  artists_sort: string;
  thumb: string;
  num_for_sale: number;
  title: string;
  country?: string;
  uri: string;
  formats: Format[];
  resource_url: string;
  estimated_weight?: number;
  master_id?: number;
  master_url?: string;
}

export interface DiscogsSearchResponse {
  pagination: Pagination;
  results: DiscogsSearchResult[];
}

export type DiscogsSearchResult =
  | DiscogsSearchMasterResult
  | DiscogsSearchReleaseResult;

interface Format {
  qty: string;
  descriptions?: string[];
  name: string;
  text?: string;
}

export interface Pagination {
  per_page: number;
  pages: number;
  page: number;
  urls: {
    last?: string;
    next?: string;
    prev?: string;
    first?: string;
  };
  items: number;
}

export interface Image {
  uri: string;
  height: number;
  width: number;
  resource_url: string;
  type: "primary" | "secondary";
  uri150: string;
}

export interface Artist {
  profile: string;
  releases_url: string;
  name: string;
  uri: string;
}
