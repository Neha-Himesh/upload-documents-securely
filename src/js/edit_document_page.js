// Import Firebase database and storage configurations
import { db, storage } from './setup.js';

// Import Firebase Storage functions
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Import Firestore functions to update document metadata
import { doc as firestoreDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// Import function to highlight the active navigation tab
import { highlightActiveNav } from './navbar.js';

// Triggered when the window finishes loading
window.onload = function() {
    // Retrieve user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    // If user session data is missing or invalid, redirect to login page
    if (!userData || !userData.phone) {
        alert("User session expired. Please log in again.");
        window.location.href = "index.html";
        return;
    }

    // Retrieve the document details from local storage to be edited
    const docString = localStorage.getItem('documentToBeEdited');
    if (docString) {
        const doc = JSON.parse(docString);
        editDocument(doc); // Load form with document details
    } else {
        alert("No document found to edit!");
    }
}

// Highlight the correct navigation link when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();
});

// Function to display the edit form and handle document editing logic
function editDocument(doc){
    // Dynamically inject the form into the page container with pre-filled values
    document.getElementById('edit-document-page-container').innerHTML = 
    ` 
    <div class="container">
        <div class="row m-3">
            <div class="col-12 row mb-5 align-items-center justify-content-center">
                <div id="edit-document-form-wrapper" class="col-lg-7 col-md-10 col-12 my-3 p-md-5 p-3 border border-2 rounded shadow">
                    <h2 class="text-center mb-4">Edit Document</h2>
                    <form action="" id="edit-document-page-form">
                        <!-- Document Name Input Field -->
                        <div class="mb-4">
                            <label for="edit-document-page-document-name" class="form-label">Enter name of the document</label>
                            <input type="text" class="form-control" id="edit-document-page-document-name" value="${doc.documentName}">
                        </div>

                        <!-- Document Type Selection Dropdown -->
                        <div class="mb-4">
                            <label for="edit-document-page-type-of-document" class="form-label">Select the type of the document</label>
                            <select class="form-select" id="edit-document-page-type-of-document">
                                <option selected>Select the type of document</option>
                                <!-- List of document types (truncated for brevity) -->
                                <option value="1">Aadhaar card</option>
                                <option value="2">Arms license</option>
                                ...
                                <option value="24">Voter ID</option>
                            </select>
                        </div>

                        <!-- File Upload Field -->
                        <div class="mb-4">
                            ${doc.fileUrl ? `<p>Already uploaded: <a href="${doc.fileUrl}" target="_blank">${doc.documentName}</a></p>` : ''}
                            <label for="edit-document-page-document-upload" class="form-label">Upload your new document</label>
                            <input type="file" class="form-control" id="edit-document-page-document-upload" name="document" accept="application/pdf, image/*">
                        </div>

                        <!-- Submit Button -->
                        <div class="d-grid">
                            <button id="edit-document-page-submit-button" type="submit" class="btn btn-primary btn-lg">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;

    // Pre-select the document type in dropdown by comparing with text
    const selectElement = document.getElementById('edit-document-page-type-of-document');
    const options = selectElement.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].text === doc.documentType) {
            selectElement.selectedIndex = i;
            break;
        }
    }

    // Handle form submission
    const editDocumentPageForm = document.getElementById('edit-document-page-form');
    editDocumentPageForm.addEventListener('submit', async function (e){
        e.preventDefault(); // Prevent default form submission

        // Retrieve previously saved document data for comparison
        const docString = localStorage.getItem('editDoc');
        if (!docString) {
            alert('No document to edit.');
            return;
        }

        // Extract updated form values
        const editDocumentPageNameOfDocument = document.getElementById("edit-document-page-document-name").value;
        const editDocumentPageTypeOfDocumentOptions = document.getElementById("edit-document-page-type-of-document");
        const editDocumentPageTypeOfDocumentSelected = editDocumentPageTypeOfDocumentOptions.options[editDocumentPageTypeOfDocumentOptions.selectedIndex].text;

        const oldDoc = JSON.parse(docString);
        let newFileURL = oldDoc.fileUrl;

        const editDocumentPageFileInput = document.getElementById('edit-document-page-document-upload');
        let editDocumentPageFileUploaded;
        let editDocumentPageDownloadURL;

        // If user uploads a new file, validate and upload to Firebase Storage
        if(editDocumentPageFileInput.files.length){
            editDocumentPageFileUploaded = editDocumentPageFileInput.files[0];

            // Check for file size limit (2MB)
            if (editDocumentPageFileUploaded.size > 2 * 1024 * 1024) {
                alert("File size must be less than 2MB.");
                return;
            }

            // Upload the new file to Firebase Storage
            const newStorageRef = storageRef(storage, `documents/${editDocumentPageFileUploaded.name}_${Date.now()}`);
            await uploadBytes(newStorageRef, editDocumentPageFileUploaded);

            // Get downloadable URL of the uploaded file
            editDocumentPageDownloadURL = await getDownloadURL(newStorageRef);
            newFileURL = editDocumentPageDownloadURL; // Update the new file URL
        }

        // Get reference to Firestore document
        const docRef = firestoreDoc(db, "documents", oldDoc.id);

        // Update the Firestore document metadata with new values
        await updateDoc(docRef, {
            documentName: editDocumentPageNameOfDocument,
            documentType: editDocumentPageTypeOfDocumentSelected,
            fileName: editDocumentPageFileUploaded ? editDocumentPageFileUploaded.name : oldDoc.fileName,
            fileType: editDocumentPageFileUploaded ? editDocumentPageFileUploaded.type : oldDoc.fileType,
            fileSize: editDocumentPageFileUploaded ? editDocumentPageFileUploaded.size : oldDoc.fileSize,
            fileUrl: newFileURL,
            updatedAt: serverTimestamp() // Automatically store update time
        });

        // Notify the user of success and redirect to the document view page
        alert("Document updated successfully!");
        window.location.href = 'view_documents_page.html';
    });
}
