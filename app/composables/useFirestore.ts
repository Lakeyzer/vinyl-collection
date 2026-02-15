import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  arrayRemove,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";
import { useAuth } from "./useAuth";
import type { DiscogsSearchReleaseResult, Release, ReleaseDoc } from "~~/types";

export function useFirestore() {
  const { $firestoreDb } = useNuxtApp();
  const { profile, user } = useAuth();
  const { isWanted } = useCollectionGuards();
  const { fetchRelease, fetchMaster } = useDiscogs();

  function assertGroup() {
    if (!profile.value?.groupId) {
      throw new Error("No group loaded");
    }
    if (!user.value) {
      throw new Error("Not authenticated");
    }
    return {
      groupId: profile.value.groupId,
      uid: user.value.uid,
    };
  }

  /**
   * ADD TO COLLECTION
   */
  async function addToCollection(data: Release) {
    const { groupId, uid } = assertGroup();

    return addDoc(collection($firestoreDb, "collections"), {
      ...data,
      groupId,
      createdBy: uid,
      createdAt: serverTimestamp(),
    });
  }

  /**
   * REMOVE FROM COLLECTION
   */
  async function removeFromCollection(collectionId: string) {
    const ref = doc($firestoreDb, "collections", collectionId);
    return deleteDoc(ref);
  }

  /**
   * ADD TO WISHLIST
   */
  async function addToWishlist(data: Release) {
    const { groupId, uid } = assertGroup();

    return addDoc(collection($firestoreDb, "wishlists"), {
      ...data,
      groupId,
      wantedBy: [uid],
      createdBy: uid,
      createdAt: serverTimestamp(),
    });
  }

  /**
   * REMOVE FROM WISHLIST
   */
  async function removeFromWishlist(wishId: string) {
    const ref = doc($firestoreDb, "wishlists", wishId);
    return deleteDoc(ref);
  }

  /**
   * JOIN WISH
   */
  async function joinWish(wishId: string) {
    if (!user.value) return;

    const ref = doc($firestoreDb, "wishlists", wishId);
    await updateDoc(ref, {
      wantedBy: arrayUnion(user.value.uid),
    });
  }

  /**
   * LEAVE WISH
   */
  async function leaveWish(wishId: string) {
    if (!user.value) return;

    const ref = doc($firestoreDb, "wishlists", wishId);
    await updateDoc(ref, {
      wantedBy: arrayRemove(user.value.uid),
    });
  }

  /**
   * MOVE WISH → COLLECTION (ATOMIC)
   */
  async function moveWishToCollection(wishId: string) {
    const { groupId, uid } = assertGroup();

    const wishRef = doc($firestoreDb, "wishlists", wishId);
    const colRef = collection($firestoreDb, "collections");

    return runTransaction($firestoreDb, async (tx) => {
      const snap = await tx.get(wishRef);

      if (!snap.exists()) {
        throw new Error("Wish no longer exists");
      }

      const data = snap.data();

      // Add to collection
      tx.set(doc(colRef), {
        ...data,
        groupId,
        createdBy: uid,
        createdAt: serverTimestamp(),
      });

      // Remove from wishlist
      tx.delete(wishRef);
    });
  }

  /**
   * SYNC RELEASE
   */
  async function syncRelease(
    collection: "collections" | "wishlists",
    docId: ReleaseDoc["docId"],
    id: ReleaseDoc["id"],
    masterId?: ReleaseDoc["master_id"],
  ) {
    const { $firestoreDb } = useNuxtApp();

    try {
      // fetch the release from Discogs
      const release = await fetchRelease(id);

      if (!release) {
        console.warn("Release not found", id);
        return;
      }

      // optionally fetch master info
      let master;
      if (release.master_id && masterId) {
        master = await fetchMaster(masterId);
      }

      // build the partial update object
      const updateRecord = itemToRecord(release, master?.year);

      console.log("release", release);
      console.log("updateRecord", updateRecord);

      // update Firestore document (only the fields in updateRecord are changed)
      const ref = doc($firestoreDb, collection, docId);
      await updateDoc(ref, updateRecord);

      console.log(`Synced release ${id} (${docId}) successfully`);
    } catch (err) {
      console.error("Failed to sync release", err);
    }
  }

  /**
   * REALTIME COLLECTION
   */
  function onCollection(groupId: string, callback: (data: any[]) => void) {
    const q = query(
      collection($firestoreDb, "collections"),
      where("groupId", "==", groupId),
    );

    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((d) => ({ docId: d.id, ...d.data() })));
    });
  }

  /**
   * REALTIME WISHLIST
   */
  function onWishlist(groupId: string, callback: (data: any[]) => void) {
    const q = query(
      collection($firestoreDb, "wishlists"),
      where("groupId", "==", groupId),
    );

    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((d) => ({ docId: d.id, ...d.data() })));
    });
  }

  return {
    onCollection,
    onWishlist,
    addToCollection,
    removeFromCollection,
    addToWishlist,
    removeFromWishlist,
    joinWish,
    leaveWish,
    moveWishToCollection,
    syncRelease,
  };
}
