<script lang="ts" setup>
const { wishlist } = useCollectionGuards();
</script>

<template>
  <NuxtLayout>
    <RecordList :list="wishlist" type="wishlist" />
  </NuxtLayout>
</template>
