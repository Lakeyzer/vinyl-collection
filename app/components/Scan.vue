<script lang="ts" setup>
import type { DiscogsSearchResult } from "~~/types";

const loading = ref(false);
const video = ref<HTMLVideoElement | null>(null);
const error = ref();
const barcode = ref();
const { startScan, stopScan } = useBarcodeScanner();
const { search } = useDiscogs();
const results = ref<DiscogsSearchResult[] | undefined>([]);
const pagination = ref();

async function scan() {
  await nextTick();

  if (!video.value) return;

  try {
    await startScan(video.value, async (code) => {
      loading.value = true;
      barcode.value = code;
      const response = await search({
        page: 1,
        per_page: 100,
        type: "release",
        barcode: code,
      });
      pagination.value = response?.pagination;
      results.value = response?.results;
      loading.value = false;
    });
  } catch (err: any) {
    error.value = err.message;
  }
}

function scanAgain() {
  reset();
  scan();
}

function reset() {
  stopScan(video.value);
  results.value = [];
  barcode.value = null;
}
</script>

<template>
  <UModal
    title="Scan Barcode"
    :ui="{ body: 'p-0 sm:p-0' }"
    @update:open="scan"
    @after:leave="reset"
  >
    <UButton
      icon="mdi:barcode-scan"
      aria-label="Scan Barcode"
      color="neutral"
      variant="ghost"
    />
    <template #body>
      <template v-if="!barcode">
        <video v-if="!error" ref="video" class="w-full rounded" />
        <div v-if="error" class="text-warning text-center p-4">
          {{ error }}
        </div>
      </template>
      <template v-else>
        <div
          class="p-2 flex items-center justify-center gap-4 border-b border-muted"
        >
          <UIcon name="fa7-solid:barcode" class="size-6" />
          <span class="tabular-nums text-2xl">{{ barcode }}</span>
          <UIcon name="fa7-solid:barcode" class="size-6" />
        </div>
        <UScrollArea
          v-if="results?.length"
          :items="results"
          v-slot="{ item }"
          virtualize
          class="max-h-96"
        >
          <Result :item="item" />
        </UScrollArea>
      </template>
      <div
        v-if="barcode && results?.length === 0"
        class="text-dimmed text-center"
      >
        Nothing found
      </div>
    </template>
    <template v-if="barcode" #footer>
      <UButton
        label="Scan again"
        block
        icon="mdi:barcode-scan"
        @click="scanAgain"
      />
    </template>
  </UModal>
</template>
