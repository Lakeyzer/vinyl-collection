<script lang="ts" setup>
const { wishlist } = useCollectionGuards();
const { profile } = useAuth();
const wishlistsLoading: Ref<Record<string, boolean>> =
  useState("wishlistsLoading");

const isLoading = computed(() => {
  const groupId = profile.value?.groupId;
  if (!groupId) return true;
  return wishlistsLoading.value[groupId] !== false;
});
</script>

<template>
  <NuxtLayout>
    <RecordList
      :list="wishlist"
      type="wishlist"
      :group="profile?.group"
      :loading="isLoading"
    />
  </NuxtLayout>
</template>
