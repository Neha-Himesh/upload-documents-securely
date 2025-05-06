// Import necessary modules from Firebase
import { db } from './setup.js'; // Firestore setup
import { collection, getDocs, query, where } from "firebase/firestore"; // Firebase Firestore query methods
import { deleteDocument } from './delete_document.js'; // Custom deleteDocument function
import { highlightActiveNav } from './navbar.js'; // Function to highlight the active navbar item
import { logoutUserSession } from './logout_session.js'; // Function to handle user logout session

// Once the DOM is fully loaded, highlight the active navigation link
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav(); // This ensures the correct navbar item is highlighted
});

// Fetch documents from Firestore related to the current user
async function fetchDocuments() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    // If no user data is found, redirect to login page
    if (!userData || !userData.phone) {
        alert("User session expired. Please log in again.");
        window.location.href = "index.html";
        return;
    }

    // Firestore query to fetch documents by the user's phone number
    const q = query(
        collection(db, "documents"),
        where("userPhoneNumber", "==", userData.phone)
    );

    // Get the documents and push them into an array
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
    });
    return documents; // Return the list of documents
}

// Open the edit page for the selected document
function openEditPage(docString) {
    const documentToBeEdited = JSON.parse(decodeURIComponent(docString));
    localStorage.setItem('documentToBeEdited', JSON.stringify(documentToBeEdited));  // Save the document data to localStorage
    window.location.href = "edit_document_page.html"; // Redirect to the edit page
}

// Display the fetched documents on the page
async function displayDocuments() {
    const documents = await fetchDocuments(); // Get the documents for the logged-in user
    
    // If no documents exist, alert the user and redirect to home page
    if (!documents.length) {
        alert("No document to display");
        window.location.href = 'user_home_page.html';
        return;
    }

    const documentsListDiv = document.getElementById('documents-list'); // Container to display documents
    
    // Loop through documents in pairs of two for layout purposes
    for (let i = 0; i < documents.length; i += 2) {
        const isLastSingle = i === documents.length - 1;
        const row = document.createElement('div');
        row.className = 'row mb-5 gap-5 justify-content-center'; // Align documents in the center

        // Create card for the first document
        const doc1 = documents[i];
        row.appendChild(createDocumentCard(doc1));

        // If there is a second document, create the card for it
        if (!isLastSingle) {
            const doc2 = documents[i + 1];
            row.appendChild(createDocumentCard(doc2));
        }

        documentsListDiv.appendChild(row); // Add the row of cards to the document list
    }

    // Function to create the card for displaying document data
    function createDocumentCard(doc) {
        const cardCol = document.createElement('div');
        cardCol.className = 'col-lg-5 col-12'; // Set column size
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

        // Event listeners for editing, deleting, and sharing document
        const documentToBeEditedData = encodeURIComponent(JSON.stringify(doc));
        const editIcon = cardCol.querySelector('.view-documents-edit-icon');
        const deleteIcon = cardCol.querySelector('.view-documents-delete-icon');
        const shareIcon = cardCol.querySelector('.view-documents-share-icon');

        // Edit document event
        editIcon.addEventListener('click', () => openEditPage(documentToBeEditedData));
        // Delete document event
        deleteIcon.addEventListener('click', () => deleteDocument(doc));
        // Share document event
        shareIcon.addEventListener('click', () => {
            const documentUrl = shareIcon.getAttribute('data-url');
            // Set up the sharing options (WhatsApp, Email, Copy link)
            document.getElementById('view-documents-page-whatsapp-share-button').href = `https://wa.me/?text=${encodeURIComponent(documentUrl)}`;
            document.getElementById('view-documents-page-email-share-button').href = `mailto:?subject=Shared Document&body=${encodeURIComponent(documentUrl)}`;
            document.getElementById('view-documents-page-copy-link-button').onclick = () => {
                navigator.clipboard.writeText(documentUrl).then(() => {
                    alert('Copied to clipboard!');
                });
            };
        });

        return cardCol; // Return the card element to be added to the row
    }
}

// Handle user session logout and display the documents
logoutUserSession();
displayDocuments(); // Call the function to display the documents
