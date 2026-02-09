import { ref, onMounted } from "vue";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

export function useAuth() {
  const { $firebaseAuth } = useNuxtApp();

  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  onMounted(() => {
    onAuthStateChanged($firebaseAuth, (u) => {
      user.value = u;
      loading.value = false;
    });
  });

  async function signin(email: string, password: string) {
    error.value = null;
    try {
      await signInWithEmailAndPassword($firebaseAuth, email, password);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  async function logout() {
    await signOut($firebaseAuth);
  }

  return {
    user,
    loading,
    error,
    signin,
    logout,
  };
}
