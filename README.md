# Secure & Share Govt Document with Family Members

This web app allows users to securely upload, manage, and share government ID documents with their family members using Firebase.  

## 📄 Overview

This project enables users to securely upload documents after verifying their identity through OTP. The application includes:

- User Authentication: Login via phone number with OTP.  
- Profile Completion: Users provide their name and email post-OTP verification.  
- Document Upload: Securely upload various document types.  

---

## 🚀 Features

- OTP verification and user authentication via Firebase  

- Secure upload, update, and deletion of government documents  

- Document sharing with family members  

- File size restrictions (e.g., max image size)  

- Redirect after login  

- Fully modular, testable, and maintainable codebase  

---

## 🛠 Tech Stack

- HTML, CSS, JavaScript  

- Firebase (Auth, Firestore, Storage, Hosting)  
- Webpack  

---

## 🔧 Setup & Installation

### Prerequisites

- Firebase account  
- Firebase project with Authentication and Firestore enabled  
- Firebase Web SDK keys  

### Steps

1. Clone the repository:  
   ```bash  
    git clone https://github.com/Neha-Himesh/upload-documents-securely.git  
    cd upload-documents-securely  
  
2. Include Firebase SDK:  
    - Add Firebase SDK scripts to your HTML files:  
    ``` html
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script> ```

3. Initialize Firebase

    In your JavaScript file, initialize Firebase with your project's credentials:  

    ``` javascript const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
    };
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore(); ```

4. Implement OTP Authentication:  

    Follow Firebase documentation to implement phone number authentication with OTP:  
    Firebase Phone Authentication  

5. Set Up Firestore:
    Create Firestore collections for user profiles and uploaded documents as per your application's requirements.  

---

## 🧪 Testing
- OTP Verification: Test the OTP flow using Firebase Emulator Suite or by deploying to Firebase Hosting.  

- Profile Completion: Ensure that after OTP verification, users are prompted to complete their profile.  

- Document Upload: Verify that documents are uploaded securely and metadata is stored in Firestore.  

--- 


## 📌 Notes
- Ensure that Firebase Authentication and Firestore rules are configured correctly to secure user data.  

- For production, consider implementing additional security measures like Firebase Hosting and Firestore security rules.  

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.  
