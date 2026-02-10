# Vinyl Collection Tracker

Track your vinyl collection and manage a wish list.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

### Firebase

Start a new project on [firebase](https://console.firebase.google.com/).

### Discogs API

Create a discogs account at [discogs.com](https://www.discogs.com) and request a **personal access token** for the API from [settings/developers](https://www.discogs.com/settings/developers).

### Environment variables

Create a `.env` file

```
NUXT_FIREBASE_API_KEY=
NUXT_FIREBASE_AUTH_DOMAIN=
NUXT_FIREBASE_PROJECT_ID=
NUXT_FIREBASE_STORAGE_BUCKET=
NUXT_FIREBASE_MESSAGING_SENDER_ID=
NUXT_FIREBASE_APP_ID=
DISCOGS_ACCESS_TOKEN=
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

After the build the .env file is copied to .output/server, because it is required there.

## Deployment to Firebase

Check out the [deployment documentation](https://nuxt.com/deploy/firebase) for more information.

Replace the key in `firebase.json` with your project ID.

```
{
  ...
  "hosting": [
    {
      "site": "YOUR PROJECT ID"
    }
  ]
}
```

Globally install Firebase tools

```
pnpm install -g firebase-tools@latest
```

Login. No need to initialize, that has been done.

```
firebase login
```

### Deploy

```
firebase deploy
```

There are some issues with the server in `.output/server`. A solution is to install a specific package `@google-cloud/functions-framework` there, but this is done automatically in the postbuild script.

```
cd .output/server
pnpm add @google-cloud/functions-framework
cd ../../
```
