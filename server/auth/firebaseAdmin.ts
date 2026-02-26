import admin from "firebase-admin";

/**
 * Uses GOOGLE_APPLICATION_CREDENTIALS (recommended)
 * or falls back to default credentials if available.
 *
 * IMPORTANT:
 * - Do NOT commit your service account JSON to GitHub.
 * - For local dev: set GOOGLE_APPLICATION_CREDENTIALS to the file path.
 */
export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
  return admin;
}

export async function verifyIdToken(idToken: string) {
  const adminApp = getFirebaseAdmin();
  return adminApp.auth().verifyIdToken(idToken);
}