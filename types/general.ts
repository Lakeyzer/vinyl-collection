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
  master_id?: number;
  cover_image: string;
  thumb: string;
  title: string;
  artist: string;
  album: string;
  year?: string;
  discogs_uri: string;
}
