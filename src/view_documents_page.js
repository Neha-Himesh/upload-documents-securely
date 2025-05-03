import { db } from './setup.js';
import { collection, getDocs, query, where } from "firebase/firestore";
import { deleteDocument } from './delete_document.js';


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
    if(!documents.length){
        alert("No document to display");
        window.location.href='user_home_page.html';
    }
    const documentsListDiv = document.getElementById('documents-list');

    if (documents.length % 2 == 0){
        documents.forEach((doc, index) => {
            const documentToBeEditedData = encodeURIComponent(JSON.stringify(doc)); 
            // Create a real div element
            const documentCard = document.createElement('div');
             /*         <div class="row">*/
            if(index % 2 == 0){
                documentCard.className = 'document-card mb-3 row';
                documentCard.innerHTML = `
           
                        <div class="col-sm-4">
                            <div class="card">
                                <div class="text-center">
                                    <img src="${doc.fileUrl}" alt="${doc.documentName}" width="100" />
                                </div>
                                <div class="card-body">
                                    <h3 class="card-title text-center mb-3">${doc.documentName}</h3>
                                    <p class="card-text text-center fs-5">Type: ${doc.documentType}</p>
                                    <p class="card-text text-center fs-5">Uploaded At: ${doc.uploadedAt?.toDate().toLocaleString() || "Unknown"}</p>
                                    <p class="card-text text-center fs-5">Updated At: ${doc.updatedAt?.toDate().toLocaleString() || " - "}</p>
                                     <div class="row justify-content-center mb-4">
                                        <div class="col-5 offset-1">
                                            <a href="${doc.fileUrl}" class="btn btn-primary">View the image</a>
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
            } else{
                documentCard.className = 'document-card mb-3 col-sm-4';
                documentCard.innerHTML = `
                       
                            <div class="card">
                               <div class="text-center">
                                    <img src="${doc.fileUrl}" alt="${doc.documentName}" width="100" />
                                </div>
                                <div class="card-body">
                                    <h3 class="card-title text-center mb-3">${doc.documentName}</h3>
                                    <p class="card-text text-center fs-5">Type: ${doc.documentType}</p>
                                    <p class="card-text text-center fs-5">Uploaded At: ${doc.uploadedAt?.toDate().toLocaleString() || "Unknown"}</p>
                                    <p class="card-text text-center fs-5">Updated At: ${doc.updatedAt?.toDate().toLocaleString() || " - "}</p>
                                    <div class="row justify-content-center mb-4">
                                        <div class="col-5 offset-1">
                                            <a href="${doc.fileUrl}" class="btn btn-primary">View the image</a>
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
                        </div> 
                `;
            }
        
            // Find the edit icon inside the documentCard
            const editIcon = documentCard.querySelector('.view-documents-edit-icon');
            const deleteIcon = documentCard.querySelector('.view-documents-delete-icon');
            const shareIcon = documentCard.querySelector('.view-documents-share-icon');

            // Add click event programmatically
            editIcon.addEventListener('click', () => {
                openEditPage(documentToBeEditedData);
            });

            deleteIcon.addEventListener('click', () =>{
                deleteDocument(doc);
            });

            shareIcon.addEventListener('click', () =>{
                const documentUrl = shareIcon.getAttribute('data-url');
                const isMobile = /Mobi|Android/i.test(navigator.userAgent);

                // Set dynamic URLs
                document.getElementById('view-documents-page-whatsapp-share-button').href = `https://wa.me/?text=${encodeURIComponent(documentUrl)}`;
                document.getElementById('view-documents-page-email-share-button').href = `mailto:?subject=Shared Document&body=${encodeURIComponent(documentUrl)}`;

                document.getElementById('view-documents-page-copy-link-button').onclick = () => {
                    navigator.clipboard.writeText(documentUrl).then(() => {
                    alert('Copied to clipboard!');
                    });
                };

            });

            // Add card to the page
            documentsListDiv.appendChild(documentCard);
            // documentsListDiv.appendChild(document.createElement('hr'));

        });
    } else {
        documents.forEach((doc, index) => {
            const documentToBeEditedData = encodeURIComponent(JSON.stringify(doc)); 
            // Create a real div element
            const documentCard = document.createElement('div');
            
            if (index != documents.length - 1){
                if(index % 2 != 0){
                    documentCard.className = 'document-card mb-3 row';
                    documentCard.innerHTML = `
                        
                            <div class="col-sm-4">
                                <div class="card">
                                    <div class="text-center">
                                        <img src="${doc.fileUrl}" alt="${doc.documentName}" width="100" />
                                    </div>
                                    <div class="card-body">
                                        <h3 class="card-title text-center mb-3">${doc.documentName}</h3>
                                        <p class="card-text text-center fs-5">Type: ${doc.documentType}</p>
                                        <p class="card-text text-center fs-5">Uploaded At: ${doc.uploadedAt?.toDate().toLocaleString() || "Unknown"}</p>
                                        <p class="card-text text-center fs-5">Updated At: ${doc.updatedAt?.toDate().toLocaleString() || " - "}</p>
                                        <div class="row justify-content-center mb-4">
                                            <div class="col-5 offset-1">
                                                <a href="${doc.fileUrl}" class="btn btn-primary">View the image</a>
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
                } else{
                    documentCard.className = 'document-card mb-3 col-sm-4';
                    documentCard.innerHTML = `
                         
                                <div class="card border">
                                    <div class="text-center mb-2">
                                        <img src="${doc.fileUrl}" alt="${doc.documentName}" width="100" />
                                    </div>
                                    <div class="card-body">
                                        <h3 class="card-title text-center mb-3">${doc.documentName}</h3>
                                        <p class="card-text text-center fs-5">Type: ${doc.documentType}</p>
                                        <p class="card-text text-center fs-5">Uploaded At: ${doc.uploadedAt?.toDate().toLocaleString() || "Unknown"}</p>
                                        <p class="card-text text-center fs-5">Updated At: ${doc.updatedAt?.toDate().toLocaleString() || " - "}</p>

                                        <div class="row justify-content-center mb-4">
                                            <div class="col-5 offset-1">
                                                <a href="${doc.fileUrl}" class="btn btn-primary">View the image</a>
                                            </div> 
                                        </div>
                                        <div class="row justify-content-center mb-4">
                                            <div class="col-5 offset-1">
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
                            </div> 
                    `;
                }
            
            } else {
                documentCard.className = 'document-card mb-3 row justify-content-center';
                documentCard.innerHTML = `
     
                        <div class="col-sm-4">
                            <div class="card border">
                                <div class="text-center">
                                    <img src="${doc.fileUrl}" alt="${doc.documentName}" width="100" />
                                </div>
                                <div class="card-body">
                                    <h3 class="card-title text-center mb-3">${doc.documentName}</h3>
                                    <p class="card-text text-center fs-5">Type: ${doc.documentType}</p>
                                    <p class="card-text text-center fs-5">Uploaded At: ${doc.uploadedAt?.toDate().toLocaleString() || "Unknown"}</p>
                                    <p class="card-text text-center fs-5">Updated At: ${doc.updatedAt?.toDate().toLocaleString() || " - "}</p>
                                    <div class="row justify-content-center mb-4">
                                        <div class="col-5 offset-1">
                                            <a href="${doc.fileUrl}" class="btn btn-primary">View the image</a>
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
                        </div>
                `;
            }
            
            // Find the edit icon inside the documentCard
            const editIcon = documentCard.querySelector('.view-documents-edit-icon');
            const deleteIcon = documentCard.querySelector('.view-documents-delete-icon');
            const shareIcon = documentCard.querySelector('.view-documents-share-icon');

            // Add click event programmatically
            editIcon.addEventListener('click', () => {
                openEditPage(documentToBeEditedData);
            });

            deleteIcon.addEventListener('click', () =>{
                deleteDocument(doc);
            });

            shareIcon.addEventListener('click', () =>{
                const documentUrl = shareIcon.getAttribute('data-url');
                const isMobile = /Mobi|Android/i.test(navigator.userAgent);

                // Set dynamic URLs
                document.getElementById('view-documents-page-whatsapp-share-button').href = `https://wa.me/?text=${encodeURIComponent(documentUrl)}`;
                document.getElementById('view-documents-page-email-share-button').href = `mailto:?subject=Shared Document&body=${encodeURIComponent(documentUrl)}`;

                document.getElementById('view-documents-page-copy-link-button').onclick = () => {
                    navigator.clipboard.writeText(documentUrl).then(() => {
                    alert('Copied to clipboard!');
                    });
                };

            });

            // Add card to the page
            documentsListDiv.appendChild(documentCard);
            // documentsListDiv.appendChild(document.createElement('hr'));

        });
    }
}

displayDocuments();