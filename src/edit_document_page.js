import { db, storage } from './setup.js';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc as firestoreDoc, updateDoc, serverTimestamp } from "firebase/firestore";

window.onload = function() {
    const docString = localStorage.getItem('documentToBeEdited');
    if (docString) {
        const doc = JSON.parse(docString);
        editDocument(doc); 
    } else {
        alert("No document found to edit!");
    }
}
/*
`
    <form action="" id="edit-document-page-form">
        <div class="row mb-3">
            <label for="edit-document-page-document-name" class="col-sm-4 col-form-label">Enter name of the document</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="edit-document-page-document-name" value="${doc.documentName}">
            </div>
        </div>
        <div class="row mb-3">
            <label for="edit-document-page-type-of-document" class="col-sm-4 col-form-label">Select the type of the document</label>
            <div class="col-sm-8">
                <select class="form-select form-select-sm" aria-label=".form-select-sm example" id="edit-document-page-type-of-document" >
                    <option selected>Select the type of document</option>
                    <option value="1">Aadhaar card</option>
                    <option value="2">Arms license</option>
                    <option value="3">Bank passbook</option>
                    <option value="4">Bank statements</option>
                    <option value="5">Birth certificate</option>
                    <option value="6">Domicile certificate issued by government</option>
                    <option value="7">Driving License</option>
                    <option value="8">Educational certificate</option>
                    <option value="9">Electors photo identity card</option>
                    <option value="10">Electricity bill</option>
                    <option value="11">Gazetted officer issued documents</option>
                    <option value="12">Gas connection details</option>
                    <option value="13">Letter from employer</option>
                    <option value="14">Marriage certificate</option>
                    <option value="15">MNREGA Job card</option>
                    <option value="16">PAN card</option>
                    <option value="17">Passport</option>
                    <option value="18">Pension card</option>
                    <option value="19">Photo credit card</option>
                    <option value="20">Rent agreement</option>
                    <option value="21">Ration card</option>
                    <option value="22">Tax card</option>
                    <option value="23">Telephone bill</option>
                    <option value="24">Voter ID</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <label for="edit-document-page-document-upload" class="col-sm-4">Upload your document</label>
            <div class="col-sm-8">
                 ${
                    doc.fileUrl
                        ? `<p>Already uploaded: <a href="${doc.fileUrl}" target="_blank">${doc.documentName}</a></p>`
                        : ''
                }
                <input type="file" id="edit-document-page-document-upload" name="document" accept="pdf, image/*">
            </div>
        </div>
        <div class="row">
            <div class="col-sm-8"></div>
        </div>
        <button id="edit-document-page-submit-button" type="submit" class="col-sm-1 offset-4 mt-4">Submit</button>
    </form>` */

function editDocument(doc){
    document.getElementById('edit-document-page-container').innerHTML = 
    ` 
    <div class="container">
        <div class="row m-3">
            <div class="col-12 row mb-5 align-items-center justify-content-center">
                <div id="edit-document-form-wrapper" class="col-lg-7 col-md-10 col-12 my-3 p-md-5 p-3 border border-2 rounded shadow">
                    <h2 class="text-center mb-4">Edit Document</h2>
                    <form action="" id="edit-document-page-form">
                        <!-- Document Name -->
                        <div class="mb-4">
                            <label for="edit-document-page-document-name" class="form-label">Enter name of the document</label>
                            <input type="text" class="form-control" id="edit-document-page-document-name" value="${doc.documentName}">
                        </div>

                        <!-- Document Type -->
                        <div class="mb-4">
                            <label for="edit-document-page-type-of-document" class="form-label">Select the type of the document</label>
                            <select class="form-select" id="edit-document-page-type-of-document">
                                <option selected>Select the type of document</option>
                                <option value="1">Aadhaar card</option>
                                <option value="2">Arms license</option>
                                <option value="3">Bank passbook</option>
                                <option value="4">Bank statements</option>
                                <option value="5">Birth certificate</option>
                                <option value="6">Domicile certificate issued by government</option>
                                <option value="7">Driving License</option>
                                <option value="8">Educational certificate</option>
                                <option value="9">Electors photo identity card</option>
                                <option value="10">Electricity bill</option>
                                <option value="11">Gazetted officer issued documents</option>
                                <option value="12">Gas connection details</option>
                                <option value="13">Letter from employer</option>
                                <option value="14">Marriage certificate</option>
                                <option value="15">MNREGA Job card</option>
                                <option value="16">PAN card</option>
                                <option value="17">Passport</option>
                                <option value="18">Pension card</option>
                                <option value="19">Photo credit card</option>
                                <option value="20">Rent agreement</option>
                                <option value="21">Ration card</option>
                                <option value="22">Tax card</option>
                                <option value="23">Telephone bill</option>
                                <option value="24">Voter ID</option>
                            </select>
                        </div>

                        <!-- File Upload -->
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
    // Now select the option based on TEXT
    const selectElement = document.getElementById('edit-document-page-type-of-document');
    const options = selectElement.options;

    const editDocumentPageForm = document.getElementById('edit-document-page-form');

    for (let i = 0; i < options.length; i++) {
        if (options[i].text === doc.documentType) {
            selectElement.selectedIndex = i;
            break;
        }
    }

    editDocumentPageForm.addEventListener('submit', async function (e){
        e.preventDefault();

        const docString = localStorage.getItem('editDoc');
        if (!docString) {
            alert('No document to edit.');
            return;
        }
       
        const editDocumentPageNameOfDocument = document.getElementById("edit-document-page-document-name").value;
        const editDocumentPageTypeOfDocumentOptions = document.getElementById("edit-document-page-type-of-document");
        const editDocumentPageTypeOfDocumentSelected = editDocumentPageTypeOfDocumentOptions.options[editDocumentPageTypeOfDocumentOptions.selectedIndex].text;

        const oldDoc = JSON.parse(docString);
        let newFileURL = oldDoc.fileUrl;

        const editDocumentPageFileInput = document.getElementById('edit-document-page-document-upload');
        var editDocumentPageFileUploaded;
        var editDocumentPageDownloadURL;

        if(editDocumentPageFileInput.files.length){
            editDocumentPageFileUploaded = editDocumentPageFileInput.files[0];

            if (editDocumentPageFileUploaded.size > 2 * 1024 * 1024) {
                alert("File size must be less than 2MB.");
                return;
            }
        
           
            // Proceed with upload to Firebase Storage
            const newStorageRef = storageRef(storage, `documents/${editDocumentPageFileUploaded.name}_${Date.now()}`);
            await uploadBytes(newStorageRef, editDocumentPageFileUploaded);
            editDocumentPageDownloadURL = await getDownloadURL(newStorageRef);
            newFileURL = editDocumentPageDownloadURL;
        }
       
        const docRef = firestoreDoc(db, "documents", oldDoc.id);
       
        // Then save metadata to Firestore
        await updateDoc(docRef, {
            documentName: editDocumentPageNameOfDocument,
            documentType: editDocumentPageTypeOfDocumentSelected,
            fileName: editDocumentPageFileUploaded ? editDocumentPageFileUploaded.name : oldDoc.fileName,
            fileType: editDocumentPageFileUploaded ? editDocumentPageFileUploaded.type : oldDoc.fileType,
            fileSize: editDocumentPageFileUploaded ? editDocumentPageFileUploaded.size : oldDoc.fileSize,
            fileUrl: newFileURL,
            updatedAt: serverTimestamp()
        });
    
        alert("Document updated successfully!");
        window.location.href = 'view_documents_page.html';  // Redirect back
    })

}
