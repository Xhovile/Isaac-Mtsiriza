/// <reference types="vite/client" />

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { initializeFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Strict config validation to avoid “half-initialized” Firebase issues
const requiredKeys = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

export const isConfigValid = requiredKeys.every(Boolean);

if (!isConfigValid) {
  console.error(
    "Firebase configuration is incomplete. Please set the required VITE_FIREBASE_* environment variables."
  );
}

export let app: FirebaseApp | undefined;
export let auth: Auth | undefined;
export let db: Firestore | undefined;

if (isConfigValid) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Long polling helps in proxied/restricted networks; can be revisited for production hosting.
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
}
