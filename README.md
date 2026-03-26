# 🎶 Vinyl Collection Tracker

Track your vinyl collection and manage your wishlist.  
Built for small groups/households who want to track and share their collection and wish list.

## ✨ Features

- 💿 Maintain vinyl collection
- ⭐ Maintain Wishlist
- 🔎 Discogs search integration
- 📷 Scan barcode to find records on Discogs
- ☁️ Hosted on Vercel

## 🧱 Tech Stack

- **Node**: `24`

**Frontend**

- **Nuxt**: `4`
- **Nuxt UI**: `4`
- **Vue**: `3`
- **TypeScript**

**Backend / Infra**

- **Firebase Authentication**
- **Firestore Database**
- **Firebase Functions**
- **Firebase Hosting**

**External APIs**

- **Discogs API**

**Package Manager**

- **pnpm**: `10`

## 🚀 Setup

### Install dependencies

```bash
pnpm install
```

## 🔥 Firebase Setup

1. Create a new Firebase project  
   👉 https://console.firebase.google.com/
2. Enable:
   - **Authentication → Sign-in method → Email/Password**
   - **Firestore Database**
   - **Hosting**
   - **Functions**

### 🔐 Firestore Security Rules

This project assumes:

- Users belong to exactly one group
- Collections & wishlists belong to groups
- Users can only add for their own group
- Collections and Wishlists are publicly readable

#### Copy Firestore Rules

Copy rules from `firestore-rules.js` to **Firestore Database → Rules**.

### 🧪 First-Time Setup (Important)

Because sign-ups are not public:

1. Manually create users: **Authentication → Users → Add user**
2. Create user documents in **Firestore Database → Data**:

```json
/users/{uuid}: {
  "email": "user@example.com",
  "username": "Username",
  "groupId": "groupId",
  "passwordChanged": false,
}
```

3. Create group document

```json
/groups/{groupId}: {
  "name": "Group name",
}
```

Without this, users will get “**Missing or insufficient permissions**” errors.

## 💿 Discogs API

Create a Discogs account:
👉 https://www.discogs.com  
Generate a Personal Access Token:
👉 https://www.discogs.com/settings/developers

## 🔐 Environment Variables

Create a .env file in the project root:

```
NUXT_FIREBASE_API_KEY=
NUXT_FIREBASE_AUTH_DOMAIN=
NUXT_FIREBASE_PROJECT_ID=
NUXT_FIREBASE_STORAGE_BUCKET=
NUXT_FIREBASE_MESSAGING_SENDER_ID=
NUXT_FIREBASE_APP_ID=

DISCOGS_ACCESS_TOKEN=
```

> ℹ️ DISCOGS_ACCESS_TOKEN is used on the server (Nitro/Firebase Functions).  
> The Nuxt Firebase keys are safe to expose publicly. Data is secured by rules.

## 🧑‍💻 Development

Run the dev server:

```bash
pnpm dev
```

App runs on:

```
https://localhost:3000
```

## 🏗️ Production Build

```bash
pnpm run build
```

After building, the .env file is copied to:

```bash
.output/server
```

This is required for Firebase Functions to access the Discogs token.

## ☁️ Hosted on Vercel

This project can very easy be hosted on Vercel. Simply link your repository and see the magic happen.
👉 https://vercel.com/

## 🧠 Notes

- This app is designed for **self-hosting / private use**
- No public sign-ups
- Discogs API is rate-limited, don’t spam it
