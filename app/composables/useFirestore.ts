import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./useAuth";
import type { Record } from "~~/types";

export function useFirestore() {
  const { $firestoreDb } = useNuxtApp();
  const { group } = useAuth();

  async function fetchCollection(groupId: string) {}
  async function fetchWishlist(groupId: string) {}

  /**
   * Add a record to the collection
   * @param data Partial data for the record
   */
  async function addToCollection(data: Record) {
    if (!group.value) throw new Error("No group loaded");

    return addDoc(collection($firestoreDb, "collections"), {
      ...data,
      groupId: group.value.id,
      createdAt: serverTimestamp(),
    });
  }

  return {
    addToCollection,
  };
}
