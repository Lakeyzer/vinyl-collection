<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
const { user, profile, logout } = useAuth();
const isOpen = useShareModal();
const signInModal = ref(false);
const colorMode = useColorMode();

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: profile.value?.username,
      icon: "fa7-solid:user",
      type: "label",
    },
    {
      label: profile.value?.group,
      icon: "fa7-solid:home",
      type: "label",
    },
  ],
  [
    {
      label: "Profile",
      icon: "fa7-solid:user",
      to: "/profile",
    },
    {
      label: "Wishlist",
      icon: "fa7-solid:heart",
      to: "/wishlist",
    },
    {
      label: "Share",
      icon: "fa7-solid:share",
      onSelect: () => {
        isOpen.value = true;
      },
    },
  ],
  [
    {
      label: colorMode.value === "dark" ? "Light mode" : "Dark mode",
      icon: colorMode.value === "dark" ? "i-lucide-sun" : "i-lucide-moon",
      onSelect: () => {
        colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
      },
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
  <UHeader :toggle="false">
    <template #left>
      <NuxtLink to="/">Vinyl Collection</NuxtLink>
    </template>

    <template #right>
      <template v-if="!user">
        <UColorModeButton />
        <UModal
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
      </template>
      <template v-else>
        <Scan />
        <Search />
        <UDropdownMenu :items="items">
          <UButton
            icon="fa7-solid:user"
            aria-label="Sign out"
            color="neutral"
            variant="ghost"
            :loading="!profile"
          />
        </UDropdownMenu>
      </template>
    </template>
  </UHeader>
</template>
