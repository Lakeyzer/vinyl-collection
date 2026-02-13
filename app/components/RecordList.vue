<script lang="ts" setup>
import { useElementSize } from "@vueuse/core";
import type { ReleaseDoc, SortOption } from "~~/types";

export interface RecordListProps {
  list: ReleaseDoc[];
  type?: "collection" | "wishlist";
}

const props = withDefaults(defineProps<RecordListProps>(), {
  type: "collection",
});

const sort: SortOption[] = [
  { key: "artist", dir: "asc" },
  { key: "album", dir: "asc" },
];

const search = ref();
const sortedList = computed(() => sortRecords(props.list, sort));
const filteredList = computed(() =>
  filterRecords(sortedList.value, search.value),
);

const scrollArea = ref<HTMLElement | null>(null);
const { width } = useElementSize(scrollArea);
const { removeFromCollection, removeFromWishlist, moveWishToCollection } =
  useFirestore();

const lanes = computed(() => {
  if (width.value > 1536) return 11;
  if (width.value > 1280) return 9;
  if (width.value > 1024) return 7;
  if (width.value > 768) return 5;
  if (width.value > 640) return 3;
  return 2;
});

const openModals = useState<Record<string, boolean>>("open-modals", () => ({}));

const remove = async (docId: ReleaseDoc["docId"]) => {
  if (props.type === "collection") {
    await removeFromCollection(docId);
  }
  if (props.type === "wishlist") {
    await removeFromWishlist(docId);
  }
  openModals.value[docId] = false;
};

const move = async (docId: ReleaseDoc["docId"]) => {
  moveWishToCollection(docId);
  openModals.value[docId] = false;
};
</script>

<template>
  <div v-if="list" class="record-list" ref="scrollArea">
    <UContainer>
      <div class="flex justify-between items-center gap-2">
        <UInput
          v-model="search"
          type="search"
          placeholder="Search album or artist"
          icon="fa7-solid:magnifying-glass"
        />
        <div class="tabular-nums">{{ filteredList?.length }}</div>
      </div>
    </UContainer>
    <UScrollArea
      v-if="filteredList?.length"
      :items="filteredList"
      v-slot="{ item }"
      :virtualize="{
        lanes,
        gap: 16,
      }"
      class="scroll-area"
    >
      <UModal
        v-model:open="openModals[item.docId]"
        :title="item.album"
        :description="item.artist"
      >
        <div class="record">
          <img :src="item.cover_image" loading="lazy" />
        </div>
        <template #body>
          <img
            :src="item.cover_image"
            class="object-center object-contain h-52 w-full"
          />
        </template>
        <template #footer>
          <div class="flex justify-between w-full gap-2">
            <UButton
              :href="`https://discogs.com${item.discogs_uri}`"
              target="_blank"
              rel="noopener"
              label="View on Discogs"
              color="neutral"
              variant="link"
              size="sm"
              trailing-icon="fa7-solid:external-link"
              external
            />
            <div class="flex justify-end gap-2">
              <UButton
                :label="`Remove from ${type}`"
                color="error"
                icon="fa7-solid:trash-alt"
                @click="remove(item.docId)"
              />
              <UButton
                v-if="type === 'wishlist'"
                label="Got it!"
                @click="move(item.docId)"
              />
            </div>
          </div>
        </template>
      </UModal>
    </UScrollArea>
    <div v-else class="w-full p-4 text-center text-dimmed text-lg">
      Nothing found
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.record-list {
  @apply pt-4 h-[calc(100vh-var(--ui-header-height))];

  .scroll-area {
    @apply w-full p-4;
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
