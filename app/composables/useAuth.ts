import { ref, onMounted } from "vue";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import type { Profile, Group } from "../../types";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  type User,
} from "firebase/auth";

export function useAuth() {
  const { $firebaseAuth, $firestoreDb } = useNuxtApp();

  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const profile = useState<Profile | null>("profile", () => null);

  onMounted(() => {
    onAuthStateChanged($firebaseAuth, async (firebaseUser) => {
      user.value = firebaseUser;
      loading.value = true;

      if (!firebaseUser) {
        profile.value = null;
        loading.value = false;
        return;
      }

      try {
        const userRef = doc($firestoreDb, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          throw new Error("User profile missing");
        }

        profile.value = userSnap.data() as Profile;

        const groupId = profile.value.groupId;
        if (!groupId) {
          throw new Error("User has no groupId");
        }

        const group = await getGroup(groupId);
        profile.value.group = group?.name;
      } catch (err) {
        console.error("Failed to load auth context", err);
        profile.value = null;
      } finally {
        loading.value = false;
      }
    });
  });

  async function getGroup(groupId: string) {
    const groupRef = doc($firestoreDb, "groups", groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      throw new Error("Group not found");
    }
    return groupSnap.data();
  }

  async function listGroups(): Promise<Group[]> {
    const snap = await getDocs(collection($firestoreDb, "groups"));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Group, "id">) }));
  }

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

  async function changePassword(
    currentPassword: string,
    newPassword: string,
  ) {
    error.value = null;

    if (!user.value?.email) {
      throw new Error("Not authenticated");
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.value.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user.value, credential);
      await updatePassword(user.value, newPassword);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    getGroup,
    listGroups,
    signin,
    logout,
    changePassword,
  };
}
