rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAllowedUser() {
      return request.auth != null
        && exists(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    match /users/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    match /collection/{docId} {
      allow read, write: if isAllowedUser();
    }

    match /wishlist/{docId} {
      allow read, write: if isAllowedUser();
    }
  }
}