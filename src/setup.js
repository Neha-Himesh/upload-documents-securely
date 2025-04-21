import {initializeApp} from 'firebase/app';
import {getAuth, RecaptchaVerifier} from 'firebase/auth';

// const firebaseConfig = {
// 	apiKey: "AIzaSyDEbX-gQ6FwJD5oZGnaoiJu9qIaAG2LZ0M",
// 	authDomain: "upload-25f01.firebaseapp.com",
// 	projectId: "upload-25f01",
// 	storageBucket: "upload-25f01.firebasestorage.app",
// 	messagingSenderId: "97167487690",
// 	appId: "1:97167487690:web:88409aded0a1dd13f87a33",
// 	measurementId: "G-3Y94K1XCBK"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// Firebase Configuration
// Firebase Configuration
const firebaseConfig = {
	apiKey: "AIzaSyDEbX-gQ6FwJD5oZGnaoiJu9qIaAG2LZ0M",
	authDomain: "upload-25f01.firebaseapp.com",
	projectId: "upload-25f01",
	storageBucket: "upload-25f01.firebasestorage.app",
	messagingSenderId: "97167487690",
	appId: "1:97167487690:web:88409aded0a1dd13f87a33",
	measurementId: "G-3Y94K1XCBK"
  };
  
  // Initialize Firebase
const app =initializeApp(firebaseConfig);
const auth = getAuth(app); // Use compat version of auth

export{app, auth, RecaptchaVerifier}