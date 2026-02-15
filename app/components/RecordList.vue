<script lang="ts" setup>
import { useElementSize } from "@vueuse/core";
import type { ReleaseDoc, SortOption } from "~~/types";

export interface RecordListProps {
  list: ReleaseDoc[];
  type?: "collection" | "wishlist";
  group: string | undefined;
  loading?: boolean;
}

const props = withDefaults(defineProps<RecordListProps>(), {
  type: "collection",
  loading: false,
});

const { syncRelease } = useFirestore();

const sort: SortOption[] = [
  { key: "artist", dir: "asc" },
  { key: "album", dir: "asc" },
];
const search = ref();
const syncing = ref(false);
const sortedList = computed(() => sortRecords(props.list, sort));
const filteredList = computed(() =>
  filterRecords(sortedList.value, search.value),
);

const scrollArea = ref<HTMLElement | null>(null);
const { width } = useElementSize(scrollArea);
const { removeFromCollection, removeFromWishlist, moveWishToCollection } =
  useFirestore();

const lanes = computed(() => {
  if (width.value > 1536) return 9;
  if (width.value > 1280) return 7;
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

const syncAll = async () => {
  syncing.value = true;
  for (const item of props.list) {
    console.log(item);
  }
  syncing.value = false;
};

const sync = async (
  docId: ReleaseDoc["docId"],
  id: ReleaseDoc["id"],
  master_id: ReleaseDoc["master_id"],
) => {
  syncRelease(`${props.type}s`, docId, id, master_id);
};
</script>

<template>
  <div class="record-list" ref="scrollArea">
    <CoreLoader v-if="loading || syncing" />
    <template v-else>
      <UContainer class="pt-4 flex flex-col gap-4">
        <div class="flex justify-between">
          <div class="truncate min-w-0">{{ group }} {{ type }}</div>
          <div class="tabular-nums font-bold">
            {{ list?.length }}
          </div>
        </div>
        <div class="flex justify-between items-center gap-2">
          <UInput
            v-model="search"
            type="search"
            placeholder="Search album or artist"
            icon="fa7-solid:magnifying-glass"
            class="w-full"
          />
          <div v-if="search" class="text-dimmed">
            {{ filteredList?.length }}
          </div>
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
        <UChip
          color="primary"
          :show="item.format?.includes('Limited Edition')"
          inset
        >
          <UModal v-model:open="openModals[item.docId]" :title="item.album">
            <div class="record" :class="{ single: isSingle(item.format) }">
              <img :src="item.cover_image" loading="lazy" />
            </div>
            <template #title>
              <div class="flex justify-between w-full gap-2">
                <UTooltip
                  :text="`Remove from ${type}`"
                  :content="{ side: 'top' }"
                >
                  <UButton
                    color="error"
                    icon="fa7-solid:trash-alt"
                    variant="subtle"
                    @click="remove(item.docId)"
                  />
                </UTooltip>
                <UTooltip
                  :text="`Sync with Discogs`"
                  :content="{ side: 'top' }"
                >
                  <UButton
                    color="neutral"
                    icon="fa7-solid:arrows-rotate"
                    variant="subtle"
                    @click="sync(item.docId, item.id, item.master_id)"
                  />
                </UTooltip>
                <UButton
                  v-if="type === 'wishlist'"
                  label="Got it!"
                  color="success"
                  @click="move(item.docId)"
                />
              </div>
            </template>
            <template #body>
              <div class="flex gap-6 flex-col md:flex-row">
                <img
                  :src="item.cover_image"
                  class="object-top object-contain rounded w-full md:w-56 h-full bg-neutral-100 dark:bg-neutral-800"
                  :class="{ 'p-16 md:p-10': isSingle(item.format) }"
                />
                <div>
                  <div class="text-lg">{{ item.album }}</div>
                  <div class="text-dimmed">
                    {{ item.artist }}
                  </div>
                  <UBadge
                    v-if="isSingle(item.format)"
                    color="info"
                    variant="subtle"
                    class="mr-2"
                    >Single</UBadge
                  >
                  <UBadge
                    v-if="item.format?.includes('Limited Edition')"
                    color="primary"
                    variant="subtle"
                  >
                    Limited Edition
                  </UBadge>
                  <ul class="text-sm mt-2">
                    <li v-if="item.year">
                      This Release: <strong>{{ item.year }}</strong>
                    </li>
                    <li v-if="item.master_year">
                      First release: <strong>{{ item.master_year }}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
            <template #footer>
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
            </template>
          </UModal>
        </UChip>
      </UScrollArea>
      <div v-else class="w-full p-4 text-center text-dimmed text-lg">
        Nothing found
      </div>
    </template>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.record-list {
  @apply h-[calc(100vh-var(--ui-header-height))];

  .scroll-area {
    @apply w-full p-4;
    @apply lg:px-8;
    @apply xl:px-[calc((100vw-1280px)/1.85)];

    .record {
      @apply aspect-square relative rounded;

      &.single {
        @apply p-12 lg:p-8 xl:p-4 bg-neutral-100 dark:bg-neutral-800;
      }
      img {
        @apply rounded size-full object-cover drop-shadow;
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
