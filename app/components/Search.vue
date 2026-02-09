<script setup lang="ts">
const { search } = useDiscogs();
const query = ref();
const results = ref();

const searchRecords = async (event: Event) => {
  results.value = await search(event.target?.value);
};

const album = (title: string) => {
  return title.split(" - ")?.[1];
};
const artist = (title: string) => {
  return title.split(" - ")?.[0];
};
</script>

<template>
  <UModal title="Search Records" @after:leave="query = null">
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
        @keyup.enter="searchRecords"
      />
    </template>
    <template #body>
      <div
        v-for="{ id, title, thumb } in results?.results"
        :key="id"
        class="list-item"
      >
        <img :src="thumb" loading="lazy" />
        <div class="grow min-w-0">
          <div class="truncate min-w-0">{{ album(title) }}</div>
          <div class="truncate min-w-0 text-sm text-dimmed">
            {{ artist(title) }}
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
  </UModal>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.list-item {
  @apply flex gap-4 items-center w-full mb-2;

  img {
    @apply w-16;
  }
  .actions {
    @apply flex gap-2 items-center;
  }
}
</style>
