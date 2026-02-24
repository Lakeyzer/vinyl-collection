<script setup>
const toaster = { position: "top-center" };
const { profile } = useAuth();
const isOpen = useShareModal();

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

const title = "Vinyl Collection";
const description = "Checkout my Vinyl Collection and Wishlist";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "",
  twitterImage: "",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtPage />
    <Share v-if="profile" v-model:open="isOpen" />
  </UApp>
</template>
