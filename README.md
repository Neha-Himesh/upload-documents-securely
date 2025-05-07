# Secure & Share Govt Document with Family Members

This web app allows users to securely upload, manage, and share government ID documents with their family members using Firebase.  

## 📄 Overview

This project enables users to securely upload documents after verifying their identity through OTP. The application includes:

- User Authentication: Login via phone number with OTP.  
- Profile Completion: Users provide their name and email post-OTP verification.  
- Document Upload: Securely upload various document types.  


## 🚀 Features

- OTP verification and user authentication via Firebase  

- Secure upload, update, and deletion of government documents  

- Document sharing with family members  

- File size restrictions (e.g., max image size)  

- Redirect after login  

- Fully modular, testable, and maintainable codebase  


## 🛠 Tech Stack

- HTML, CSS, JavaScript  

- Firebase (Auth, Firestore, Storage, Hosting)  
- Webpack  


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
  
2. Install dependencies (if applicable)
    If you are using Node.js and have npm (Node Package Manager) installed, run the following command in the project directory to install any required dependencies:  
    npm install  
    This will install all dependencies listed in the package.json file. If you haven't set up a package.json file or are unsure if dependencies are needed, skip to the next step.  

3. Include Firebase SDK:  
    - Add Firebase SDK scripts to your HTML files:  
    ``` html
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script> ```

4. Initialize Firebase

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

4. Start the project locally
    To test the project in your browser locally, you need to start a development server.

    If you're using Webpack to bundle the project, you may already have a script to start the server. Try running this command:

    ``` bash npm run build ```

    Once the above is run, navigate to dist folder in the project and run the below command:  

    ``` bash npx serve ```

5. Open in browser  
    If the above works, the local server will start, and you can access the project in your browser at:  

    http://127.0.0.1:3000  

    Do not use http://localhost:3000    

6. Implement OTP Authentication:  

    Follow the instructions displayed on the webpage to implement phone number authentication with OTP:   

7. Register if new:
    Once the authentication is successfull, it will redirect to home page or register page based on whether the phone number used is new phone number or existing number in the database

8. Upload/edit/delete/share/view documents:
    Once redirected to home page navigate to the required links based on whether you want to upload a document, view a document, share a document or edit an existing document.  


## 🧪 Testing
- OTP Verification: Test the OTP flow using Firebase Emulator Suite or by deploying to Firebase Hosting.  

- Profile Completion: Ensure that after OTP verification, users are prompted to complete their profile.  

- Document Upload: Verify that documents are uploaded securely and metadata is stored in Firestore.  


## 📌 Notes
- Ensure that Firebase Authentication and Firestore rules are configured correctly to secure user data.  

- For production, consider implementing additional security measures like Firebase Hosting and Firestore security rules.  

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.  
