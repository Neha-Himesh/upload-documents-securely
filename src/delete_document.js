import { parseDocumentToBeEdited } from "./edit_document_page";
import { db, storage } from './setup.js';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc as firestoreDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";


window.onload = parseDocumentToBeEdited;


function getFilePathFromURL(url) {
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/upload-25f01.appspot.com/o/";
    const pathWithToken = url.replace(baseUrl, "");
    const path = decodeURIComponent(pathWithToken.split("?")[0]);
    return path;
}

export async function deleteDocument(doc){
    const confirmDelete = confirm(`Are you sure you want to permanently delete "${doc.documentName}"?`);
    
    if (!confirmDelete) {
        return; // User canceled deletion
    }
    try{
        if(doc.fileUrl){
            const documentToBeDeletedFilePath = getFilePathFromURL(doc.fileUrl);
            const documentToBeDeletedFileRef = storageRef(storage, documentToBeDeletedFilePath);
            await deleteObject(documentToBeDeletedFileRef);
            console.log("File deleted from Storage!");
        }
        // Then delete from Firestore
        const documentToBeDeletedRef = firestoreDoc(db, "documents", doc.id);
        await deleteDoc(documentToBeDeletedRef);
        console.log("Document metadata deleted from Firestore!");
    
        alert("Document deleted successfully!");
        window.location.reload();  // Reload the page after deletion
    } catch(error){
        console.error("Error deleting document:", error);
        alert("Failed to delete document!");
    }
   
}
