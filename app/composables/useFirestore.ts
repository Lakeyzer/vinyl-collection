import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./useAuth";
import type { Record } from "~~/types";

export function useFirestore() {
  const { $firestoreDb } = useNuxtApp();
  const { user } = useAuth();

  /**
   * Add a record to the collection
   * @param data Partial data for the record
   */
  async function addToCollection(data: Record) {
    if (!user.value) {
      throw new Error("User not signed in");
    }

    const docRef = await addDoc(collection($firestoreDb, "collection"), {
      ...data,
      userId: user.value.uid,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  }

  return {
    addToCollection,
  };
}
