export const album = (title: string): string => {
  return String(title.split(" - ")?.[1]);
};
export const artist = (title: string): string => {
  return String(title.split(" - ")?.[0]);
};
