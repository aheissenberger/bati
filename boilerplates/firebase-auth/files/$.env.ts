import { appendToEnv, type TransformerProps } from "@batijs/core";

export default async function getEnv(props: TransformerProps) {
  const envContent = await props.readfile?.();

  return appendToEnv(
    envContent,
    "GOOGLE_APPLICATION_CREDENTIALS",
    "firebase/service-account.json",
    `Your web app's Firebase configuration:
 VITE_FIREBASE_API_KEY="value",
 VITE_FIREBASE_AUTH_DOMAIN="value",
 VITE_FIREBASE_PROJECT_ID="value",
 VITE_FIREBASE_STORAGE_BUCKET="value",
 VITE_FIREBASE_MESSAGING_SENDER_ID="value",
 VITE_FIREBASE_APP_ID="value",

 Location of Your Firebase service account (use for firebase-admin).
 Download the file from https://console.firebase.google.com/u/0/project/{firebase-project-id}/settings/serviceaccounts/adminsdk`,
  );
}
