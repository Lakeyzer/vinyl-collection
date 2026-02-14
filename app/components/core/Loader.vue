<script lang="ts" setup></script>

<template>
  <div class="loader full">
    <img src="/images/vinyl-collection.svg" />
    <div class="loader__label" v-if="$slots['default']">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

.loader {
  @apply flex gap-2;

  &.full {
    @apply h-full w-full bg-muted;
    @apply items-center justify-center flex-col;

    img {
      @apply w-24;
    }
  }
  img {
    @apply animate-spin;
  }
}
</style>
