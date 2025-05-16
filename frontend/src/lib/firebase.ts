import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCezLpZYKhEriRUeHHoNSIl9DAUKaVC70g",
  authDomain: "qa-answer-generator.firebaseapp.com",
  projectId: "qa-answer-generator",
  // Fixed storage bucket URL format
  storageBucket: "qa-answer-generator.appspot.com",
  messagingSenderId: "751998086435",
  appId: "1:751998086435:web:ac5fa4c946d68f1fc9f096",
  measurementId: "G-K82PRNF5H8",
  // Add database URL for Realtime Database
  databaseURL: "https://qa-answer-generator-default-rtdb.firebaseio.com/"
};

// Initialize Firebase with needed services
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Database
export const database = getDatabase(app);

// Export app instance if needed elsewhere
export { app };