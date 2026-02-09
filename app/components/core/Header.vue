<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
const { user, profile, logout } = useAuth();
const signInModal = ref(false);

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: profile.value?.username,
      icon: "fa7-solid:user",
      type: "label",
    },
  ],
  [
    {
      label: "Sign Out",
      icon: "fa7-solid:sign-out",
      onSelect: () => logout(),
    },
  ],
]);
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">Vinyl Collection</NuxtLink>
    </template>

    <template #right>
      <UColorModeButton />
      <UModal
        v-if="!user"
        v-model="signInModal"
        title="Sign In"
        description="Only available for selected users"
      >
        <UButton
          icon="fa7-solid:sign-in"
          aria-label="Sign In"
          color="neutral"
          variant="ghost"
        />

        <template #content>
          <SignIn @success="signInModal = false" />
        </template>
      </UModal>
      <template v-else>
        <Search />
        <UDropdownMenu :items="items">
          <UButton
            icon="fa7-solid:user"
            aria-label="Sign out"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </template>
  </UHeader>
</template>
