import { db } from './setup.js';
import { collection, getDocs } from "firebase/firestore";

async function fetchDocuments() {
    const querySnapshot = await getDocs(collection(db, "documents"));
    const documents = [];
    querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
}

function openEditPage(docString) {
    const doc = JSON.parse(decodeURIComponent(docString));
    localStorage.setItem('editDoc', JSON.stringify(doc));  // Save the doc object
    window.location.href = "edit_document_page.html"; // Go to new page
}

async function displayDocuments() {
    const documents = await fetchDocuments();
    const documentsListDiv = document.getElementById('documents-list');

    documents.forEach((doc) => {
        const docData = encodeURIComponent(JSON.stringify(doc)); 

        // Create a real div element
        const documentCard = document.createElement('div');
        documentCard.className = 'document-card mb-3';

        documentCard.innerHTML = `
            <div class="document-card mb-3" >
                <dic class="row">
                    <div class="col-8">
                        <h3>${doc.documentName}</h3>
                    </div>
                    <div class="col-2">
                        <img id="view-documents-edit-icon" src="images/edit_icon.png" width="10%">
                    </div>
                    <div class="col-2">
                        <img id="view-documents-delete-icon" src="images/delete_icon.png" width="10%" style="cursor: pointer;">
                    </div>
                </div>
                <p>Type: ${doc.documentType}</p>
                <img src="${doc.fileUrl}" alt="${doc.documentName}" width="200" />
                <p>Uploaded At: ${doc.uploadedAt?.toDate().toLocaleString() || "Unknown"}</p>
            </div>
            <hr/>
        `;

        // Find the edit icon inside the documentCard
        const editIcon = documentCard.querySelector('#view-documents-edit-icon');

        // Add click event programmatically
        editIcon.addEventListener('click', () => {
            openEditPage(docData);
        });

        // Add card to the page
        documentsListDiv.appendChild(documentCard);
        documentsListDiv.appendChild(document.createElement('hr'));

    });
    
}

displayDocuments();