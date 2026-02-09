import { ref, onMounted } from "vue";
import { doc, getDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

export function useAuth() {
  const { $firebaseAuth, $firestoreDb } = useNuxtApp();

  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const profile = useState("profile", () => null);

  onMounted(() => {
    onAuthStateChanged($firebaseAuth, async (firebaseUser) => {
      user.value = firebaseUser;

      if (!user.value) {
        profile.value = null;
        loading.value = false;
        return;
      }

      if (!firebaseUser) {
        profile.value = null;
        loading.value = false;
        return;
      }

      try {
        const ref = doc($firestoreDb, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          console.warn("No profile found for user", firebaseUser.uid);
        } else {
          profile.value = snap.data();
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        profile.value = null;
      } finally {
        loading.value = false;
      }
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
    profile,
    loading,
    error,
    signin,
    logout,
  };
}
