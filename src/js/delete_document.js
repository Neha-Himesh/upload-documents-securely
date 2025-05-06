// Import function to parse and populate the document details to be edited
import { parseDocumentToBeEdited } from "./edit_document_page.js";

// Import initialized Firebase Firestore and Storage instances
import { db, storage } from './setup.js';

// Import Firebase Storage functions
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Import Firestore document manipulation functions
import { doc as firestoreDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

// Import function to visually highlight the active navigation tab
import { highlightActiveNav  } from "./navbar.js";

// Run this function when the window has fully loaded
window.onload = parseDocumentToBeEdited;

// Check if user is authenticated on DOM content load
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    // If user data is missing or phone is not found, redirect to login page
    if (!userData || !userData.phone) {
        alert("User session expired. Please log in again.");
        window.location.href = "index.html";
        return;
    }

    // Highlight the current page in the navigation bar
    highlightActiveNav();
});

// Utility function to extract file path from a Firebase Storage download URL
function getFilePathFromURL(url) {
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/upload-25f01.appspot.com/o/";
    const pathWithToken = url.replace(baseUrl, "");
    const path = decodeURIComponent(pathWithToken.split("?")[0]); // Remove URL token and decode
    return path;
}

// Exported async function to delete a document from both Firebase Storage and Firestore
export async function deleteDocument(doc){
    // Confirm user's intent to delete
    const confirmDelete = confirm(`Are you sure you want to permanently delete "${doc.documentName}"?`);
    
    if (!confirmDelete) {
        return; // Exit if user cancels the deletion
    }

    try {
        // If file URL exists, delete the file from Firebase Storage
        if (doc.fileUrl) {
            const documentToBeDeletedFilePath = getFilePathFromURL(doc.fileUrl); // Get path from URL
            const documentToBeDeletedFileRef = storageRef(storage, documentToBeDeletedFilePath); // Reference to the file
            await deleteObject(documentToBeDeletedFileRef); // Delete file
            console.log("File deleted from Storage!");
        }

        // Delete the document metadata from Firestore
        const documentToBeDeletedRef = firestoreDoc(db, "documents", doc.id); // Get Firestore doc reference
        await deleteDoc(documentToBeDeletedRef); // Delete document metadata
        alert("Document deleted successfully!");
        window.location.reload();  // Refresh the page to reflect changes
    } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete document!");
    }
}
