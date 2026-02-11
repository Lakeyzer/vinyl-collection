export interface Profile {
  email: string;
  username: string;
}

export interface Record {
  id: number;
  cover_image: string;
  thumb: string;
  title: string;
  artist: string;
  album: string;
  year?: string;
  resource_url: string;
}
