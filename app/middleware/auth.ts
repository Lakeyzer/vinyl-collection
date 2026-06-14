import { onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;

  const { $firebaseAuth } = useNuxtApp();

  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged($firebaseAuth, (firebaseUser) => {
      unsubscribe();
      resolve(firebaseUser);
    });
  });

  if (!user) {
    return navigateTo("/");
  }
});
