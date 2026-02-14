<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import type { DiscogsSearchQuery, DiscogsSearchResult } from "~~/types";

const { search } = useDiscogs();

const pageSize = 15;
const loading = ref(false);
const scrollArea = ref();
const query = ref();
const pagination = ref();
const results = ref<DiscogsSearchResult[] | undefined>(undefined);

const filter = ref<DiscogsSearchQuery>({
  type: "release",
  format: "Vinyl",
});

const searchRecords = async (event: any) => {
  loading.value = true;
  results.value = undefined;
  const response = await search({
    query: event.target?.value,
    page: 1,
    per_page: pageSize,
    ...filter.value,
  });
  pagination.value = response?.pagination;
  results.value = response?.results;
  loading.value = false;
};

const loadMore = async () => {
  loading.value = true;
  pagination.value.page++;

  const response = await search({
    query: query.value,
    page: pagination.value.page,
    per_page: pageSize,
    ...filter.value,
  });

  if (response?.results?.length) {
    results.value = results.value?.concat(response.results);
  }

  loading.value = false;
};

const reset = () => {
  query.value = null;
  pagination.value = null;
  results.value = undefined;
};

onMounted(() => {
  useInfiniteScroll(
    scrollArea,
    () => {
      loadMore();
    },
    {
      distance: 10,
      canLoadMore: () => {
        return pagination.value.page < pagination.value.pages;
      },
    },
  );
});
</script>

<template>
  <UModal
    title="Search Records"
    :ui="{ body: 'p-0 sm:p-0', wrapper: 'w-full' }"
    @after:leave="reset"
  >
    <UButton
      icon="fa7-solid:magnifying-glass"
      aria-label="Search Records"
      color="neutral"
      variant="ghost"
    />
    <template #title>
      <UInput
        v-model="query"
        placeholder="Search Records"
        variant="none"
        icon="fa7-solid:magnifying-glass"
        class="w-full pr-6"
        type="search"
        :loading="loading"
        @keyup.enter="searchRecords"
      />
    </template>
    <template #body>
      <UScrollArea
        v-if="results?.length"
        ref="scrollArea"
        :items="results"
        v-slot="{ item }"
        virtualize
        class="max-h-96"
      >
        <Result :item="item" />
      </UScrollArea>
      <div
        v-if="query && results?.length === 0"
        class="p-4 text-dimmed text-center"
      >
        Nothing found
      </div>
    </template>
    <template v-if="results?.length" #footer>
      <UButton
        :loading="loading"
        variant="link"
        color="neutral"
        class="p-0 text-text"
      >
        <template v-if="!loading">{{ pagination.page * pageSize }}</template> /
        {{ pagination.items }}
      </UButton>
    </template>
  </UModal>
</template>
