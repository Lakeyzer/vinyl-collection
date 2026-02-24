<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";

export interface ShareProps {
  type?: "collection" | "wishlist";
}

const props = withDefaults(defineProps<ShareProps>(), {
  type: "collection",
});

const { profile } = useAuth();
const { copy, copied } = useClipboard({ legacy: true });

const shareItems = [
  { label: "Collection", value: "collection" },
  { label: "Wishlist", value: "wishlist" },
];
const shareType = ref(props.type);
const shareLink = computed(() => {
  return `${window.location.origin}/share/${profile.value?.groupId}/${shareType.value}`;
});
</script>
<template>
  <UModal title="Share">
    <slot />
    <template #body>
      <div class="flex flex-col gap-4 items-center">
        <UFieldGroup class="w-full">
          <UInput :value="shareLink" readonly class="grow" size="xl" />
          <USelect
            v-model="shareType"
            orientation="horizontal"
            :items="shareItems"
          />
          <UTooltip
            :text="copied ? 'Copied!' : 'Click to copy'"
            :content="{ side: 'top' }"
          >
            <UButton
              color="primary"
              size="xl"
              :icon="copied ? 'fa7-solid:check' : 'fa7-solid:copy'"
              @click="copy(shareLink)"
            />
          </UTooltip>
        </UFieldGroup>
      </div>
    </template>
  </UModal>
</template>
