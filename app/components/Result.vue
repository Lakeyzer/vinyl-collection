<script lang="ts" setup>
import type { DiscogsSearchResult } from "~~/types";

export interface ResultsProps {
  item: DiscogsSearchResult;
}

const { addToCollection } = useFirestore();

const props = withDefaults(defineProps<ResultsProps>(), {});

const adding = ref<number[]>([]);

const add = async (item: DiscogsSearchResult) => {
  adding.value.push(item.id);
  try {
    await addToCollection({
      id: item.id,
      master_id: item.master_id,
      cover_image: item.cover_image,
      thumb: item.thumb,
      title: item.title,
      artist: artist(item.title),
      album: album(item.title),
      year: item.year,
      resource_url: item.resource_url,
    });
  } catch (e) {
    console.error(e);
  } finally {
    adding.value = adding.value.filter((id) => id !== item.id);
  }
};
</script>

<template>
  <UPageCard
    class="rounded-none"
    :ui="{
      body: 'w-full',
      wrapper: 'overflow-hidden',
      container: 'p-2 sm:p-3',
    }"
  >
    <template #body>
      <div class="result">
        <img :src="item.thumb" />
        <div class="grow min-w-0">
          <div class="truncate">{{ album(item.title) }}</div>
          <div class="truncate text-sm text-muted">
            {{ artist(item.title) }}
          </div>
          <div class="text-sm text-dimmed">
            <template v-if="item.year">{{ item.year }} |</template>
            {{ item.country }}
          </div>
        </div>
        <div class="actions">
          <UButton
            variant="ghost"
            icon="fa7-solid:heart"
            color="neutral"
            aria-labeled-by="Add to favorites"
            :loading="adding.includes(item.id)"
          />
          <UButton
            variant="ghost"
            icon="fa7-solid:plus"
            color="neutral"
            aria-labeled-by="Add to collection"
            :loading="adding.includes(item.id)"
            @click="add(item as DiscogsSearchResult)"
          />
        </div>
      </div>
    </template>
  </UPageCard>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.result {
  @apply flex gap-4 items-center w-full;

  img {
    @apply w-18 rounded object-cover;
  }
  .actions {
    @apply flex gap-2 items-center;
  }
}
</style>
