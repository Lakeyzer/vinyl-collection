export function useDiscogs() {
  async function search(
    query: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    try {
      const res = await $fetch("/api/discogs/search", {
        params: {
          q: query,
          type: "release",
          per_page: pageSize,
          page,
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
