<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

const title = "Vinyl Collection";
const description = "Indira & Key's Vinyl Collection and Wish List";

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
  <UApp>
    <NuxtPage />
  </UApp>
</template>
