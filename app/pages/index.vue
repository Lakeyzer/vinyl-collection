<script lang="ts" setup>
const { collection } = useCollectionGuards();
const { profile } = useAuth();
const collectionsLoading: Ref<Record<string, boolean>> =
  useState("collectionsLoading");

const isLoading = computed(() => {
  const groupId = profile.value?.groupId;
  if (!groupId) return true;
  return collectionsLoading.value[groupId] !== false;
});
</script>

<template>
  <NuxtLayout>
    <RecordList
      :list="collection"
      :group="profile?.group"
      :loading="isLoading"
    />
  </NuxtLayout>
</template>
