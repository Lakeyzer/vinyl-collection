<script lang="ts" setup>
import type { RecordListProps } from "~/components/RecordList.vue";
import type { ReleaseDoc } from "~~/types";

const route = useRoute();
const groupId: string = route.params.groupId as string;

const { onCollection, onWishlist } = useFirestore();
const { getGroup } = useAuth();

const group = ref();

const collections = useState<{ [key: string]: ReleaseDoc[] }>("collections");
const collectionsLoading: Ref<Record<string, boolean>> =
  useState("collectionsLoading");
const wishlists = useState<{ [key: string]: ReleaseDoc[] }>("wishlists");
const wishlistsLoading: Ref<Record<string, boolean>> =
  useState("wishlistsLoading");

const type = ref<RecordListProps["type"]>(
  (route.params.type as RecordListProps["type"]) || "collection",
);
const collection = computed(() => collections.value?.[groupId]);
const wishlist = computed(() => wishlists.value?.[groupId]);
const list = computed(() => {
  if (type.value === "collection") {
    return collection.value || [];
  } else {
    return wishlist.value || [];
  }
});

const isLoading = computed(() => {
  if (type.value === "collection") {
    return collectionsLoading.value[groupId] !== false;
  } else {
    return wishlistsLoading.value[groupId] !== false;
  }
});

onMounted(async () => {
  if (type.value === "collection") {
    if (collection.value) return;
    await onCollection(groupId, (data) => {
      collections.value[groupId] = data;
      collectionsLoading.value[groupId] = false;
    });
  } else if (type.value === "wishlist") {
    if (wishlist.value) return;
    await onWishlist(groupId, (data) => {
      wishlists.value[groupId] = data;
      wishlistsLoading.value[groupId] = false;
    });
  }
});

onMounted(async () => {
  if (!groupId) return;
  group.value = await getGroup(groupId);
});
</script>

<template>
  <NuxtLayout>
    <RecordList
      :list="list"
      :type="type"
      :group="group?.name"
      :groupId="groupId"
      :loading="isLoading"
    />
  </NuxtLayout>
</template>
