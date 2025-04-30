import {db, storage} from './setup.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const documentUploadPageSubmitButton = document.getElementById('document-upload-page-submit');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('document-upload-form');
    if (!form.dataset.listenerAttached){
        form.dataset.listenerAttached = "true";
        document.querySelector("#document-upload-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            documentUploadPageSubmitButton.disabled = true;
            documentUploadPageSubmitButton.innerText = "Uploading..."; 
            const documentUploadPageForm = document.getElementById("document-upload-form");
            const documentUploadPageFileInput = document.getElementById('document-upload');
            const fileUploaded = documentUploadPageFileInput.files[0];
            const nameOfDocument = document.getElementById("document-name").value;
            const typeOfDocumentOptions = document.getElementById("type-of-document");
            const typeOfDocumentSelected = typeOfDocumentOptions.options[typeOfDocumentOptions.selectedIndex].text;
    
            if(!fileUploaded){
                alert("Please select a file to upload");
                documentUploadPageSubmitButton.disabled = false;
                documentUploadPageSubmitButton.innerText = "Submit"; 
                return;
            }
            
            // Size Restriction: Max 2MB
            if (fileUploaded.size > 2 * 1024 * 1024) {
                alert("File size must be less than 2MB.");
                documentUploadPageSubmitButton.disabled = false;
                documentUploadPageSubmitButton.innerText = "Submit"; 
                return;
            }
    
            try{
                // Proceed with upload to Firebase Storage
                const storageRef = ref(storage, `documents/${fileUploaded.name}_${Date.now()}`);
                await uploadBytes(storageRef, fileUploaded);
    
                // Optionally get download URL
                const downloadURL = await getDownloadURL(storageRef);
    
                // Then save metadata to Firestore
                await addDoc(collection(db, "documents"), {
                    documentName: nameOfDocument,
                    documentType: typeOfDocumentSelected,
                    fileName: fileUploaded.name,
                    fileType: fileUploaded.type,
                    fileSize: fileUploaded.size,
                    fileUrl: downloadURL,
                    uploadedAt: serverTimestamp()
                });
                documentUploadPageForm.reset();
                alert("Document uploaded successfully!");
                window.location.href='view_documents_page.html';
            } catch(error){
                console.error("Upload error:", error);
                alert("An error occurred during upload.");
            } finally{
                documentUploadPageSubmitButton.disabled = false;
                documentUploadPageSubmitButton.innerText = "Submit"; 
            }
    
            console.log("Submit event triggered");
        });
    }
        
});