// Import necessary functions from Firebase SDK
import { initializeApp } from 'firebase/app'; // Core function to initialize the Firebase app
import { getAuth, RecaptchaVerifier } from 'firebase/auth'; // For Firebase Authentication and reCAPTCHA

// Firestore imports for managing and storing structured data
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase Storage imports for uploading and accessing files
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase project configuration object
const firebaseConfig = {
	apiKey: "AIzaSyDEbX-gQ6FwJD5oZGnaoiJu9qIaAG2LZ0M",        // Public API key
	authDomain: "upload-25f01.firebaseapp.com",              // Auth domain used for Firebase Authentication
	projectId: "upload-25f01",                               // Unique Firebase project ID
	storageBucket: "upload-25f01.firebasestorage.app",       // Firebase Storage bucket
	messagingSenderId: "97167487690",                        // Sender ID for push notifications (if used)
	appId: "1:97167487690:web:88409aded0a1dd13f87a33",        // Unique identifier for the Firebase app
	measurementId: "G-3Y94K1XCBK"                             // Used for Firebase Analytics (optional)
};

// Initialize Firebase app with the above configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and reCAPTCHA
const auth = getAuth(app); // Firebase Auth service

// Initialize Firestore database for data storage
const db = getFirestore(app);

// Initialize Firebase Storage for file uploads and downloads
const storage = getStorage(app);

// Export Firebase services for use in other parts of the application
export { app, auth, RecaptchaVerifier, db, storage };
