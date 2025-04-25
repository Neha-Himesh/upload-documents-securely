import {db, storage} from './setup.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInputForm = document.getElementById("document-upload-form");
    const fileInput = document.getElementById('document-upload');
    const fileUploaded = fileInput.files[0];
    const nameOfDocument = document.getElementById("document-name").value;
    const typeOfDocumentOptions = document.getElementById("type-of-document");
    const typeOfDocumentSelected = typeOfDocumentOptions.options[typeOfDocumentOptions.selectedIndex].text;

    if(!fileUploaded){
        alert("Please select a file to upload");
    }
    
    if(fileUploaded.size > 2 * 1024 * 1024){
        alert('File size must be less than 2MB');
    }

    // Size Restriction: Max 2MB
    if (fileUploaded.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB.");
        return;
    }

    // Proceed with upload to Firebase Storage
    const storageRef = ref(storage, `documents/${fileUploaded.name}`);
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

    alert("Document uploaded successfully!");
});
