<script lang="ts" setup>
import { useElementSize } from "@vueuse/core";
import type { ReleaseDoc, SortOption, Filter } from "~~/types";

export interface RecordListProps {
  list: ReleaseDoc[];
  type?: "collection" | "wishlist";
  group: string | undefined;
  groupId?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<RecordListProps>(), {
  type: "collection",
  loading: false,
});

const { syncRelease } = useFirestore();
const { profile, user } = useAuth();
const isOpen = useShareModal();

const recordId = ref<ReleaseDoc["docId"] | null>(null);
const record = computed<ReleaseDoc | null>(
  () => props.list.find((item) => item.docId === recordId.value) ?? null,
);
const showRecord = ref<boolean>(false);
const sort: SortOption[] = [
  { key: "artist_sort", dir: "asc" },
  { key: "master_year", dir: "asc" },
];
const search = ref();
const filterOptions = {
  format: [
    {
      value: "Album",
      label: "Albums",
    },
    {
      value: "Single",
      label: "Singles",
    },
  ],
};
const syncing = ref(false);
const filter = ref<Filter>({});
const sortedList = computed(() => sortRecords(props.list, sort));
const filteredList = computed(() =>
  filterRecords(sortedList.value, {
    text_search: search.value,
    filter: filter.value,
  }),
);

const scrollArea = ref<HTMLElement | null>(null);
const { width } = useElementSize(scrollArea);
const {
  removeFromCollection,
  removeFromWishlist,
  moveWishToCollection,
  joinWish,
  leaveWish,
  getUsernames,
} = useFirestore();

const usernames = ref<Record<string, string>>({});

const iWantThis = computed(() =>
  record.value?.wantedBy?.includes(user.value?.uid ?? ""),
);

const toggleWant = async () => {
  if (!record.value) return;
  if (iWantThis.value) {
    if (record.value.wantedBy?.length === 1) {
      await removeFromWishlist(record.value.docId);
      showRecord.value = false;
      recordId.value = null;
    } else {
      await leaveWish(record.value.docId);
    }
  } else {
    await joinWish(record.value.docId);
  }
};

const gap = 16;
const lanes = computed(() =>
  Math.max(2, Math.min(7, Math.floor(width.value / 200))),
);
const laneWidth = computed(
  () => (width.value - (lanes.value - 1) * gap) / lanes.value,
);
const estimateSize = computed(() => laneWidth.value);

const listOwner = computed(() => {
  return profile.value?.groupId === props.groupId;
});

const showRecordDetails = async (item: ReleaseDoc) => {
  recordId.value = item.docId;
  showRecord.value = true;
};

watch(
  record,
  async (item) => {
    if (props.type !== "wishlist" || !item) return;

    const uids = [
      ...(item.createdBy ? [item.createdBy] : []),
      ...(item.wantedBy ?? []),
    ].filter((uid) => !(uid in usernames.value));

    if (uids.length) {
      Object.assign(usernames.value, await getUsernames(uids));
    }
  },
  { immediate: true },
);

const remove = async (docId: ReleaseDoc["docId"]) => {
  if (props.type === "collection") {
    await removeFromCollection(docId);
  }
  if (props.type === "wishlist") {
    await removeFromWishlist(docId);
  }
  showRecord.value = false;
  recordId.value = null;
};

const move = async (docId: ReleaseDoc["docId"]) => {
  moveWishToCollection(docId);
  showRecord.value = false;
  recordId.value = null;
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
        <div class="flex justify-between gap-4 items-center">
          <UButton
            v-if="listOwner"
            icon="fa7-solid:share"
            variant="soft"
            color="primary"
            @click="isOpen = !isOpen"
          />
          <div class="truncate min-w-0 grow">{{ group }} {{ type }}</div>
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
            size="xl"
            class="w-full"
          />
          <USelectMenu
            v-model="filter.format"
            placeholder="All formats"
            :items="filterOptions.format"
            :search-input="false"
            value-key="value"
            size="xl"
            clear
          />
          <div v-if="search || filter.format" class="text-dimmed">
            {{ filteredList?.length }}
          </div>
        </div>
      </UContainer>
      <UScrollArea
        v-if="filteredList?.length"
        v-slot="{ item }"
        :items="filteredList"
        :virtualize="{
          lanes,
          gap,
          estimateSize,
        }"
        class="scroll-area"
      >
        <div
          class="record"
          :class="{ single: isSingle(item.format) }"
          @click="showRecordDetails(item)"
        >
          <UChip
            class="w-full h-full"
            color="primary"
            :show="item.format?.includes('Limited Edition')"
            size="2xl"
          >
            <img
              :src="item.cover_image"
              :alt="item.title"
              width="430"
              height="430"
              loading="lazy"
            />
          </UChip>
        </div>
      </UScrollArea>
      <div v-else class="w-full p-4 text-center text-dimmed text-lg">
        Nothing found
      </div>
    </template>
    <UModal v-model:open="showRecord" :title="record?.album">
      <template #title>
        <div
          v-if="listOwner && record"
          class="flex justify-between w-full gap-2"
        >
          <UTooltip :text="`Remove from ${type}`" :content="{ side: 'top' }">
            <UButton
              color="error"
              icon="fa7-solid:trash-alt"
              variant="subtle"
              @click="remove(record?.docId)"
            />
          </UTooltip>
          <UTooltip :text="`Sync with Discogs`" :content="{ side: 'top' }">
            <UButton
              color="neutral"
              icon="fa7-solid:arrows-rotate"
              variant="subtle"
              @click="sync(record?.docId, record?.id, record?.master_id)"
            />
          </UTooltip>
          <UButton
            v-if="type === 'wishlist'"
            label="Got it!"
            color="success"
            @click="move(record?.docId)"
          />
        </div>
      </template>
      <template #body>
        <div class="flex gap-6 flex-col md:flex-row">
          <img
            :src="record?.cover_image"
            class="object-top object-contain rounded w-full md:w-56 h-full bg-neutral-100 dark:bg-neutral-800"
            :class="{ 'p-16 md:p-10': isSingle(record?.format) }"
          />
          <div>
            <div class="text-lg">{{ record?.album }}</div>
            <div class="text-dimmed">
              {{ record?.artist }}
            </div>
            <UBadge
              v-if="isSingle(record?.format)"
              color="info"
              variant="subtle"
              class="mr-2"
              >Single</UBadge
            >
            <UBadge
              v-if="record?.format?.includes('Limited Edition')"
              color="primary"
              variant="subtle"
            >
              Limited Edition
            </UBadge>
            <ul class="text-sm mt-2">
              <li v-if="record?.year">
                This Release: <strong>{{ record?.year }}</strong>
              </li>
              <li v-if="record?.master_year">
                First release: <strong>{{ record?.master_year }}</strong>
              </li>
            </ul>
            <div v-if="type === 'wishlist'" class="mt-4 flex flex-col gap-2">
              <div v-if="record?.wantedBy?.length" class="text-sm">
                <div class="text-dimmed">Wanted by:</div>
                <strong>{{
                  record.wantedBy.map((uid) => usernames[uid]).join(", ")
                }}</strong>
              </div>
              <UButton
                v-if="listOwner"
                :label="
                  iWantThis ? 'I no longer want this' : 'I want this too!'
                "
                :color="iWantThis ? 'neutral' : 'primary'"
                :variant="iWantThis ? 'subtle' : 'solid'"
                size="sm"
                class="self-start"
                @click="toggleWant"
              />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <UButton
          :href="record?.discogs_uri"
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
      @apply size-full rounded aspect-square drop-shadow;
      @apply bg-neutral-100 dark:bg-neutral-800;

      &.single {
        @apply p-12 lg:p-8 xl:p-6;
      }
      img {
        @apply w-full h-full object-cover rounded;
      }
    }
  }
}
</style>
