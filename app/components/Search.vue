<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";

const { search } = useDiscogs();
const pageSize = 5;
const loading = ref(false);
const scrollArea = ref();
const query = ref();
const pagination = ref();
const results = ref([]);

const searchRecords = async (event: Event) => {
  loading.value = true;
  results.value = [];
  const response = await search(event.target?.value, 1, pageSize);
  pagination.value = response.pagination;
  results.value = response.results;
  loading.value = false;
};

const loadMore = async () => {
  loading.value = true;
  pagination.value.page++;

  const response = await search(query.value, pagination.value.page, pageSize);
  results.value = results.value.concat(response.results);

  loading.value = false;
};

const album = (title: string) => {
  return title.split(" - ")?.[1];
};
const artist = (title: string) => {
  return title.split(" - ")?.[0];
};

const reset = () => {
  query.value = null;
  pagination.value = null;
  results.value = [];
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
    @after:leave="reset"
    :ui="{ body: 'p-0 sm:p-0', wrapper: 'w-full' }"
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
        class="w-full"
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
        <UPageCard
          class="rounded-none"
          :ui="{
            body: 'w-full',
            wrapper: 'overflow-hidden',
            container: 'p-2 sm:p-4',
          }"
        >
          <template #body>
            <div class="list-item">
              <img :src="item.thumb" loading="lazy" />
              <div class="grow min-w-0">
                <div class="truncate">{{ album(item.title) }}</div>
                <div class="truncate text-sm text-dimmed">
                  {{ artist(item.title) }}
                </div>
              </div>
              <div class="actions">
                <UButton
                  variant="ghost"
                  icon="fa7-solid:heart"
                  color="neutral"
                  aria-labeled-by="Add to favorites"
                />
                <UButton
                  variant="ghost"
                  icon="fa7-solid:plus"
                  color="neutral"
                  aria-labeled-by="Add to collection"
                />
              </div>
            </div>
          </template>
        </UPageCard>
      </UScrollArea>
    </template>
    <template v-if="results.length" #footer>
      <UButton :loading="loading" variant="ghost" color="neutral" class="p-0">
        <template v-if="!loading">{{ pagination.page * pageSize }}</template> /
        {{ pagination.items }}
      </UButton>
    </template>
  </UModal>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.list-item {
  @apply flex gap-4 items-center w-full;

  img {
    @apply w-16;
  }
  .actions {
    @apply flex gap-2 items-center;
  }
}
</style>
