import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoqxXKVmwzQn8M_LB53Ww5qMaCrBRi1ss",
  authDomain: "oi-triage-app.firebaseapp.com",
  projectId: "oi-triage-app",
  storageBucket: "oi-triage-app.appspot.com",
  messagingSenderId: "827950811018",
  appId: "1:827950811018:web:08b0273423d359392d6a73",
};

// Initialize the Firebase app itself
const app = initializeApp(firebaseConfig);
export default app;
export const storage = getStorage(app);
export const auth = getAuth(app);

/** Sign in to an anomymous user */
export async function login() {
  return await signInAnonymously(auth);
}
