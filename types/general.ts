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
  cover_image: string;
  thumb: string;
  title: string;
  artist: string;
  album: string;
  year?: string | null;
  discogs_uri: string;
}

export interface ReleaseDoc extends Release {
  docId: string;
}
