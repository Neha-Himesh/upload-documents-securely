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

async function displayDocuments() {
    const documents = await fetchDocuments();
    const documentsListDiv = document.getElementById('documents-list');

    documents.forEach((doc) => {
        const documentCard = `
            <div class="document-card mb-3" >
                <dic class="row">
                    <div class="col-8">
                        <h3>${doc.documentName}</h3>
                    </div>
                    <div class="col-2" onclick="openEditPage(${docData})">
                        <img src="images/edit_icon.png" width="50%">
                    </div>
                    <div class="col-2">
                        <img src="images/delete_icon.png" width="50%">
                    </div>
                </div>
                <p>Type: ${doc.documentType}</p>
                <img src="${doc.fileUrl}" alt="${doc.documentName}" width="200" />
                <p>Uploaded At: ${doc.uploadedAt?.toDate().toLocaleString() || "Unknown"}</p>
            </div>
            <hr/>
        `;
        documentsListDiv.innerHTML += documentCard;
    });
}

function openEditPage(docString) {
    const doc = JSON.parse(decodeURIComponent(docString));
    localStorage.setItem('editDoc', JSON.stringify(doc));  // Save the doc object
    window.location.href = "edit_document_page.html"; // Go to new page
}

displayDocuments();