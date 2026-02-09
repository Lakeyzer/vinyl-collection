export function useDiscogs() {
  async function search(
    query: string,
    pageSize: number = 10,
    page: number = 1,
  ) {
    try {
      const res = await $fetch("/api/discogs/search", {
        params: {
          q: query,
          type: "release",
          per_page: pageSize,
        },
      });
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  return {
    search,
  };
}
