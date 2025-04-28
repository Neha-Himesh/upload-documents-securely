import { db } from './setup.js';
import { collection, getDocs } from "firebase/firestore";
import { deleteDocument } from './delete_document.js';


async function fetchDocuments() {
    const querySnapshot = await getDocs(collection(db, "documents"));
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
    const documentsListDiv = document.getElementById('documents-list');

    documents.forEach((doc) => {
        const documentToBeEditedData = encodeURIComponent(JSON.stringify(doc)); 

        // Create a real div element
        const documentCard = document.createElement('div');
        documentCard.className = 'document-card mb-3';

        documentCard.innerHTML = `
            <div class="row">
                <div class="col-8">
                    <h3>${doc.documentName}</h3>
                </div>
                <div class="col-2">
                    <img class="view-documents-edit-icon" src="images/edit_icon.png" width="10%">
                </div>
                <div class="col-2">
                    <img class="view-documents-delete-icon" src="images/delete_icon.png" width="10%" style="cursor: pointer;">
                </div>
            </div>
            <p>Type: ${doc.documentType}</p>
            <img src="${doc.fileUrl}" alt="${doc.documentName}" width="200" />
            <p>Uploaded At: ${doc.uploadedAt?.toDate().toLocaleString() || "Unknown"}</p>
            <p>Updated At: ${doc.updatedAt?.toDate().toLocaleString() || " - "}</p>
            <hr/>
        `;

        // Find the edit icon inside the documentCard
        const editIcon = documentCard.querySelector('.view-documents-edit-icon');
        const deleteIcon = documentCard.querySelector('.view-documents-delete-icon');

        // Add click event programmatically
        editIcon.addEventListener('click', () => {
            openEditPage(documentToBeEditedData);
        });

        deleteIcon.addEventListener('click', () =>{
            deleteDocument(doc);
        })

        // Add card to the page
        documentsListDiv.appendChild(documentCard);
        // documentsListDiv.appendChild(document.createElement('hr'));

    });
    
}

displayDocuments();