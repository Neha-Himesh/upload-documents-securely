import { db } from './setup.js';
import { collection, getDocs, query, where } from "firebase/firestore";
import { deleteDocument } from './delete_document.js';
import { highlightActiveNav } from './navbar.js';
import { logoutUserSession } from './logout_session.js';

document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();
   
});

async function fetchDocuments() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData || !userData.phone) {
        alert("User session expired. Please log in again.");
        window.location.href = "index.html";
        return;
    }
    const q = query(
        collection(db, "documents"),
        where("userPhoneNumber", "==", userData.phone)
      );
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
}

function openEditPage(docString) {
    const documentToBeEdited = JSON.parse(decodeURIComponent(docString));
    localStorage.setItem('documentToBeEdited', JSON.stringify(documentToBeEdited));  // Save the doc object
    window.location.href = "edit_document_page.html"; // Go to new page
}

async function displayDocuments() {
    const documents = await fetchDocuments();
    console.log(`documents: ${documents}`);
    if (!documents.length) {
        alert("No document to display");
        window.location.href = 'user_home_page.html';
        return;
    }

    const documentsListDiv = document.getElementById('documents-list');
    
    for (let i = 0; i < documents.length; i += 2) {
        const isLastSingle = i === documents.length - 1;
        const row = document.createElement('div');
        row.className = 'row mb-5 gap-5 justify-content-center'; // always center content

        // First card
        const doc1 = documents[i];
        row.appendChild(createDocumentCard(doc1));

        // Second card, if it exists
        if (!isLastSingle) {
            const doc2 = documents[i + 1];
            row.appendChild(createDocumentCard(doc2));
        }

        documentsListDiv.appendChild(row); /*#d3c7b7*/
    }

    function createDocumentCard(doc) {
        const cardCol = document.createElement('div');
        cardCol.className = 'col-lg-5 col-12';
        cardCol.innerHTML = `
            <div class="card" style="background: #e5d7c5"> 
                <div class="text-center">
                    <img src="${doc.fileUrl}" alt="${doc.documentName}" width="100" />
                </div>
                <div class="card-body">
                    <h3 class="card-title text-center mb-3">${doc.documentName}</h3>
                    <p class="card-text text-center fs-5">Type: ${doc.documentType}</p>
                    <p class="card-text text-center fs-5">Uploaded At: ${doc.uploadedAt?.toDate().toLocaleString() || "Unknown"}</p>
                    <p class="card-text text-center fs-5">Updated At: ${doc.updatedAt?.toDate().toLocaleString() || " - "}</p>
                    <div class="row justify-content-center mb-4">
                        <div class="col-6 offset-2">
                            <a href="${doc.fileUrl}" class="btn btn-secondary">View the Image</a>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-2 offset-1">
                            <img class="view-documents-edit-icon" src="images/edit_icon.png" width="40%" style="cursor: pointer;">
                        </div>
                        <div class="col-2">
                            <img class="view-documents-share-icon" data-url="${doc.fileUrl}" data-bs-toggle="modal" data-bs-target="#view-documents-page-share-modal" src="images/share_icon.png" width="40%" style="cursor: pointer;">
                        </div>
                        <div class="col-2">
                            <img class="view-documents-delete-icon" src="images/delete_icon.png" width="40%" style="cursor: pointer;">
                        </div>
                    </div>
                </div>
            </div>
        `;

        const documentToBeEditedData = encodeURIComponent(JSON.stringify(doc));
        const editIcon = cardCol.querySelector('.view-documents-edit-icon');
        const deleteIcon = cardCol.querySelector('.view-documents-delete-icon');
        const shareIcon = cardCol.querySelector('.view-documents-share-icon');

        editIcon.addEventListener('click', () => openEditPage(documentToBeEditedData));
        deleteIcon.addEventListener('click', () => deleteDocument(doc));
        shareIcon.addEventListener('click', () => {
            const documentUrl = shareIcon.getAttribute('data-url');
            document.getElementById('view-documents-page-whatsapp-share-button').href = `https://wa.me/?text=${encodeURIComponent(documentUrl)}`;
            document.getElementById('view-documents-page-email-share-button').href = `mailto:?subject=Shared Document&body=${encodeURIComponent(documentUrl)}`;
            document.getElementById('view-documents-page-copy-link-button').onclick = () => {
                navigator.clipboard.writeText(documentUrl).then(() => {
                    alert('Copied to clipboard!');
                });
            };
        });

        return cardCol;
    }
}

logoutUserSession();
displayDocuments();