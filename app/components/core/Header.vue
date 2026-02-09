<script setup lang="ts">
const { user, logout } = useAuth();
const signInModal = ref(false);
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
        title="Sign in"
        description="Only available for selected users"
      >
        <UButton
          icon="fa7-solid:sign-in"
          aria-label="Sign in"
          color="neutral"
          variant="ghost"
        />

        <template #content>
          <SignIn @success="signInModal = false" />
        </template>
      </UModal>
      <UButton
        v-else
        icon="fa7-solid:sign-out"
        aria-label="Sign out"
        color="neutral"
        variant="ghost"
        @click="logout"
      />
    </template>
  </UHeader>
</template>
