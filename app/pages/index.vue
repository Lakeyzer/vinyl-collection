<script lang="ts" setup>
import type { Group } from "~~/types";

const { collection } = useCollectionGuards();
const { profile, loading, listGroups } = useAuth();
const collectionsLoading: Ref<Record<string, boolean>> =
  useState("collectionsLoading");

const isLoading = computed(() => {
  const groupId = profile.value?.groupId;
  if (!groupId) return true;
  return collectionsLoading.value[groupId] !== false;
});

const groups = ref<Group[]>([]);
const groupsLoading = ref(true);

onMounted(async () => {
  if (profile.value) return;
  try {
    groups.value = await listGroups();
  } finally {
    groupsLoading.value = false;
  }
});
</script>

<template>
  <NuxtLayout>
    <RecordList
      v-if="profile"
      :list="collection"
      :group="profile?.group"
      :groupId="profile?.groupId"
      :loading="isLoading"
    />
    <CoreLoader
      v-else-if="loading || groupsLoading"
      class="min-h-[calc(100vh-var(--ui-header-height))]"
    />
    <UContainer v-else class="pt-4 flex flex-col gap-4">
      <div class="text-lg">Vinyl Collections</div>
      <div class="flex flex-col gap-3">
        <div
          v-for="group in groups"
          :key="group.id"
          class="flex items-center justify-between gap-4 p-4 rounded bg-neutral-100 dark:bg-neutral-800"
        >
          <div class="truncate min-w-0 grow">{{ group.name }}</div>
          <div class="flex gap-2">
            <UButton
              :to="`/share/${group.id}`"
              label="Collection"
              color="primary"
              variant="soft"
            />
            <UButton
              :to="`/share/${group.id}/wishlist`"
              label="Wishlist"
              color="primary"
              variant="soft"
            />
          </div>
        </div>
      </div>
      <div v-if="!groups.length" class="text-center text-dimmed">
        No collections found
      </div>
    </UContainer>
  </NuxtLayout>
</template>
