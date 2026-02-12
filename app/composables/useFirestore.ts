import {
  doc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "./useAuth";
import type { Release } from "~~/types";

export function useFirestore() {
  const { $firestoreDb } = useNuxtApp();
  const { profile, user } = useAuth();

  /**
   * Add a record to the collection
   * @param data Partial data for the record
   */
  async function addToCollection(data: Release) {
    if (!profile.value?.groupId) throw new Error("No group loaded");

    return addDoc(collection($firestoreDb, "collections"), {
      ...data,
      groupId: profile.value.groupId,
      createdBy: user.value?.uid,
      createdAt: serverTimestamp(),
    });
  }

  /**
   * Add a record to the wishlist
   * @param data Partial data for the record
   */
  async function addToWishlist(data: Release) {
    if (!profile.value?.groupId) throw new Error("No group loaded");

    return addDoc(collection($firestoreDb, "wishlists"), {
      ...data,
      groupId: profile.value.groupId,
      wantedBy: [user.value?.uid],
      createdBy: user.value?.uid,
      createdAt: serverTimestamp(),
    });
  }

  /**
   * Join a record on the wishlist
   * @param wishId
   */
  async function joinWish(wishId: string) {
    if (!user.value) return;

    const ref = doc($firestoreDb, "wishlists", wishId);
    await updateDoc(ref, {
      wantedBy: arrayUnion(user.value.uid),
    });
  }

  /**
   * Leave a record on the wishlist
   * @param wishId
   */
  async function leaveWish(wishId: string) {
    if (!user.value) return;

    const ref = doc($firestoreDb, "wishlists", wishId);
    await updateDoc(ref, {
      wantedBy: arrayRemove(user.value.uid),
    });
  }

  function onCollection(groupId: string, callback: (data: any[]) => void) {
    const q = query(
      collection($firestoreDb, "collections"),
      where("groupId", "==", groupId),
    );

    // Listen for realtime changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(docs);
    });

    return unsubscribe; // you can call this to stop listening
  }

  function onWishlist(groupId: string, callback: (data: any[]) => void) {
    const q = query(
      collection($firestoreDb, "wishlists"),
      where("groupId", "==", groupId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(docs);
    });

    return unsubscribe;
  }

  return {
    onCollection,
    onWishlist,
    addToCollection,
    addToWishlist,
    joinWish,
    leaveWish,
  };
}
