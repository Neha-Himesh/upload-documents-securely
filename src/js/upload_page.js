// Import Firebase services and custom modules
import { db, storage, auth } from './setup.js'; // Firebase Firestore, Storage, and Auth setup
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Functions for uploading files
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore functions to store metadata
import { highlightActiveNav } from './navbar.js'; // Utility to highlight current page in navbar
import { logoutUserSession } from './logout_session.js'; // Session/logout handler

// Get reference to the submit button
const documentUploadPageSubmitButton = document.getElementById('document-upload-page-submit');

// Initialize logout/session check functionality
logoutUserSession();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('document-upload-form');

    // Add form submit event listener
    document.querySelector("#document-upload-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Disable submit button and show uploading status
        documentUploadPageSubmitButton.disabled = true;
        documentUploadPageSubmitButton.innerText = "Uploading..."; 

        // Get form elements and values
        const documentUploadPageForm = document.getElementById("document-upload-form");
        const documentUploadPageFileInput = document.getElementById('document-upload');
        const fileUploaded = documentUploadPageFileInput.files[0]; // Selected file
        const nameOfDocument = document.getElementById("document-name").value; // Document name
        const typeOfDocumentOptions = document.getElementById("type-of-document");
        const typeOfDocumentSelected = typeOfDocumentOptions.options[typeOfDocumentOptions.selectedIndex].text; // Selected document type

        // Check if file is selected
        if (!fileUploaded) {
            alert("Please select a file to upload");
            documentUploadPageSubmitButton.disabled = false;
            documentUploadPageSubmitButton.innerText = "Submit"; 
            return;
        }

        // Validate file size (max 2MB)
        if (fileUploaded.size > 2 * 1024 * 1024) {
            alert("File size must be less than 2MB.");
            documentUploadPageSubmitButton.disabled = false;
            documentUploadPageSubmitButton.innerText = "Submit"; 
            return;
        }

        try {
            // Create a reference to upload the file to Firebase Storage
            const storageRef = ref(storage, `documents/${fileUploaded.name}_${Date.now()}`);

            // Get user data from session
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            if (!userData) {
                alert("Session expired! Please login again");
                window.location.href = 'index.html';
                return;
            }

            // Upload the file to Firebase Storage
            await uploadBytes(storageRef, fileUploaded);

            // Get the file's download URL from Firebase Storage
            const downloadURL = await getDownloadURL(storageRef);

            // Store file metadata in Firestore
            await addDoc(collection(db, "documents"), {
                documentName: nameOfDocument,
                userName: userData.name,
                userPhoneNumber: userData.phone,
                documentType: typeOfDocumentSelected,
                fileName: fileUploaded.name,
                fileType: fileUploaded.type,
                fileSize: fileUploaded.size,
                fileUrl: downloadURL,
                uploadedAt: serverTimestamp() // Record the upload time
            });

            // Reset the form and notify the user
            documentUploadPageForm.reset();
            alert("Document uploaded successfully!");

            // Redirect to view documents page
            window.location.href = 'view_documents_page.html';

        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during upload.");
        } finally {
            // Re-enable the submit button
            documentUploadPageSubmitButton.disabled = false;
            documentUploadPageSubmitButton.innerText = "Submit"; 
        }

        console.log("Submit event triggered");
    });

    // Highlight active navigation link in navbar
    highlightActiveNav();
    
});
