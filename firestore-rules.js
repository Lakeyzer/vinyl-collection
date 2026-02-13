rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthed() {
      return request.auth != null;
    }

    function userGroup() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.groupId;
    }

    function sameGroup(groupId) {
      return isAuthed() && userGroup() == groupId;
    }

    match /users/{uid} {
      allow read: if isAuthed() && request.auth.uid == uid;
      allow write: if false;
    }

    match /groups/{groupId} {
      allow read: if isAuthed() && userGroup() == groupId;
      allow write: if false;
    }

    match /collections/{docId} {
      allow read: if true;

      allow create: if sameGroup(request.resource.data.groupId);

      allow update: if
        sameGroup(resource.data.groupId) &&
        request.resource.data.groupId == resource.data.groupId;

      allow delete: if sameGroup(resource.data.groupId);
    }

    match /wishlists/{docId} {
      allow read: if true;

      allow create: if sameGroup(request.resource.data.groupId);

      allow update: if
        sameGroup(resource.data.groupId) &&
        request.resource.data.groupId == resource.data.groupId;

      allow delete: if sameGroup(resource.data.groupId);
    }
  }
}
