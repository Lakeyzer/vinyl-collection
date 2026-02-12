<script lang="ts" setup>
const { wishlist } = useCollectionGuards();
</script>

<template>
  <NuxtLayout>
    <RecordList :list="wishlist" />
  </NuxtLayout>
</template>
