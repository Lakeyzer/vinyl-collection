<script lang="ts" setup>
import { useElementSize } from "@vueuse/core";
import type { Release } from "~~/types";

export interface RecordListProps {
  list: Release[];
}

const props = withDefaults(defineProps<RecordListProps>(), {});

const scrollArea = ref<HTMLElement | null>(null);
const { width } = useElementSize(scrollArea);

const lanes = computed(() => {
  if (width.value > 1536) return 11;
  if (width.value > 1280) return 9;
  if (width.value > 1024) return 7;
  if (width.value > 768) return 5;
  if (width.value > 640) return 3;
  return 2;
});
</script>

<template>
  <div v-if="list" class="record-list" ref="scrollArea">
    <UScrollArea
      :items="list"
      v-slot="{ item }"
      :virtualize="{
        lanes,
        gap: 16,
      }"
      class="scroll-area"
    >
      <div class="record">
        <img :src="item.cover_image" loading="lazy" class="" />
        <div class="overlay">
          <UTooltip text="View on Discogs" :content="{ side: 'top' }">
            <UButton
              :href="`https://discogs.com${item.discogs_uri}`"
              target="_blank"
              rel="noopener"
              color="neutral"
              variant="soft"
              icon="fa7-solid:external-link"
              size="sm"
            />
          </UTooltip>
        </div>
      </div>
    </UScrollArea>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.record-list {
  @apply pt-4 h-[calc(100vh-var(--ui-header-height))];

  .scroll-area {
    @apply w-full h-full p-4;
    @apply lg:px-8;
    @apply xl:px-[calc((100vw-1280px)/1.75)];

    .record {
      @apply aspect-square relative drop-shadow;

      img {
        @apply rounded size-full object-cover;
      }
      .overlay {
        @apply hidden;
        @apply absolute top-0 z-10;
        @apply w-full h-full;
        @apply p-2 justify-end items-start;
      }
      &:hover {
        .overlay {
          @apply flex;
        }
      }
    }
  }
}
</style>
