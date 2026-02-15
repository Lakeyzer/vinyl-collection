<script lang="ts" setup>
import type { DiscogsSearchResult } from "~~/types";

export interface ResultsProps {
  item: DiscogsSearchResult;
}

const { hasRelease, hasMaster, isWanted } = useCollectionGuards();
const { addToCollection, addToWishlist } = useFirestore();
const { fetchRelease, fetchMaster } = useDiscogs();
const toast = useToast();

const props = withDefaults(defineProps<ResultsProps>(), {});
const sevenInch = '7"';

const adding = ref<number[]>([]);

const addCollection = async (item: DiscogsSearchResult) => {
  adding.value.push(item.id);
  try {
    const release = await fetchRelease(item.id);

    let master;
    if (item.master_id) {
      master = await fetchMaster(item.master_id);
    }
    if (release) {
      await addToCollection(itemToRecord(release, master?.year));
      toast.add({
        title: "Success",
        description: `${item.title} added to Collection`,
        color: "success",
      });
    }
  } catch (e: any) {
    console.error(e);
    toast.add({
      title: "Couldn't add",
      description: e.message,
      color: "error",
    });
  } finally {
    adding.value = adding.value.filter((id) => id !== item.id);
  }
};
const addWishlist = async (item: DiscogsSearchResult) => {
  adding.value.push(item.id);
  try {
    const release = await fetchRelease(item.id);

    let master;
    if (item.master_id) {
      master = await fetchMaster(item.master_id);
    }
    if (release) {
      await addToWishlist(itemToRecord(release, master?.year));
      toast.add({
        title: "Success",
        description: `${item.title} added to Wishlist`,
        color: "success",
      });
    }
  } catch (e: any) {
    console.error(e);
    toast.add({
      title: "Couldn't add",
      description: e.message,
      color: "error",
    });
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
      container: 'p-2 sm:p-3 overflow-hidden',
    }"
  >
    <template #body>
      <div class="result">
        <img :src="item.thumb" />
        <div class="grow min-w-0 flex flex-col">
          <div class="truncate">{{ album(item.title) }}</div>
          <div class="truncate text-sm text-muted">
            {{ artist(item.title) }}
          </div>
          <div class="truncate text-sm text-dimmed">
            <template v-if="item.year">{{ item.year }} |</template>
            {{ item.country }}
          </div>
          <div>
            <UBadge
              v-if="item.format?.includes(sevenInch)"
              color="info"
              variant="subtle"
              size="sm"
              class="mr-2"
              >Single</UBadge
            >
            <UBadge
              v-if="item.format?.includes('Limited Edition')"
              color="primary"
              size="sm"
              variant="subtle"
            >
              Limited Edition
            </UBadge>
          </div>
        </div>
        <div class="actions">
          <UTooltip
            :text="
              hasMaster(item.master_id) || hasRelease(item.id)
                ? 'You own this album'
                : 'Add to Wishlist'
            "
            :content="{ side: 'top' }"
          >
            <UButton
              variant="soft"
              icon="fa7-solid:heart"
              color="neutral"
              size="lg"
              aria-labeled-by="Add to favorites"
              :loading="adding.includes(item.id)"
              :disabled="
                hasMaster(item.master_id) ||
                hasRelease(item.id) ||
                isWanted(item.id, item.master_id)
              "
              @click="addWishlist(item as DiscogsSearchResult)"
            />
          </UTooltip>
          <UTooltip
            :disabled="hasRelease(item.id)"
            :text="
              hasMaster(item.master_id)
                ? 'You own another release'
                : 'Add to Collection'
            "
            :content="{ side: 'top' }"
          >
            <UButton
              :variant="'soft'"
              icon="fa7-solid:plus"
              size="lg"
              aria-labeled-by="Add to collection"
              :color="
                hasMaster(item.master_id) && !hasRelease(item.id)
                  ? 'error'
                  : 'neutral'
              "
              :loading="adding.includes(item.id)"
              :disabled="hasRelease(item.id)"
              @click="addCollection(item as DiscogsSearchResult)"
            />
          </UTooltip>
        </div>
      </div>
    </template>
  </UPageCard>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.result {
  @apply flex gap-4 items-center;

  img {
    @apply w-18 rounded object-cover self-start;
  }
  .actions {
    @apply flex gap-2 items-center;
  }
}
</style>
