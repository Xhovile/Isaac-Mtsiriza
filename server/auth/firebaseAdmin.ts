import admin from "firebase-admin";

/**
 * Priority:
 * 1) FIREBASE_SERVICE_ACCOUNT_JSON (recommended for Codespaces / CI)
 * 2) GOOGLE_APPLICATION_CREDENTIALS / ADC (fallback for servers that support it)
 */
function getCredential() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (json && json.trim().length > 0) {
    // The secret value is a full JSON string
    const serviceAccount = JSON.parse(json);

    return admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      // Handle escaped newlines in the private key
      privateKey: (serviceAccount.private_key as string).replace(/\\n/g, "\n"),
    });
  }

  // Fallback (works if GOOGLE_APPLICATION_CREDENTIALS is set or on GCP)
  return admin.credential.applicationDefault();
}

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: getCredential(),
    });
  }
  return admin;
}

export async function verifyIdToken(idToken: string) {
  const adminApp = getFirebaseAdmin();
  return adminApp.auth().verifyIdToken(idToken);
}
