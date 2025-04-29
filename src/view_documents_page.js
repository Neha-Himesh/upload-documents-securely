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
                <div class="col-6">
                    <h3>${doc.documentName}</h3>
                </div>
                <div class="col-2">
                    <img class="view-documents-edit-icon" src="images/edit_icon.png" width="10%" style="cursor: pointer;">
                </div>
                <div class="col-2">
                    <img class="view-documents-share-icon" data-url="${doc.fileUrl}" src="images/share_icon.png" width="10%" style="cursor: pointer;">
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

            if(navigator.share && isMobile){
                navigator.share({
                    title: 'Secure Document',
                    text: 'Here is the document you asked for:',
                    url: documentUrl
                }).catch((err) => console.error("Share failed:", err));
            } else {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(documentUrl)}`;
                const mailUrl = `mailto:?subject=Shared Document&body=${encodeURIComponent(documentUrl)}`;

                const shareOptions = `
                <div style="padding: 1em;">
                <button onclick="navigator.clipboard.writeText('${documentUrl}'); alert('Copied to clipboard!');" class="btn btn-sm btn-outline-secondary mb-2">📎 Copy Link</button><br>
                <a href="${whatsappUrl}" target="_blank" class="btn btn-sm btn-outline-success mb-2">💬 WhatsApp</a><br>
                <a href="${mailUrl}" class="btn btn-sm btn-outline-primary">📧 Email</a>
                </div>`;

                const shareWindow = window.open("", "_blank", "width=300,height=300");
            //     shareWindow.document.write(`<!DOCTYPE html>
            //                                 <html>
            //                                     <head><title>Share Document</title></head>
            //                                     <body>
            //                                         <div style="padding: 1em; font-family: sans-serif;">
            //                                             <button id="copyBtn" class="btn btn-sm btn-outline-secondary mb-2">📎 Copy Link</button><br>
            //                                             <a href="https://wa.me/?text=${encodedUrl}" target="_blank" class="btn btn-sm btn-outline-success mb-2">💬 WhatsApp</a><br>
            //                                             <a href="mailto:?subject=Shared Document&body=${encodedUrl}" class="btn btn-sm btn-outline-primary">📧 Email</a>
            //                                         </div>
            //                                         <script>
            //                                             document.getElementById('copyBtn').addEventListener('click', function() {
            //                                             navigator.clipboard.writeText("${escapedUrl}")
            //                                                 .then(() => alert('Copied to clipboard!'))
            //                                                 .catch(err => alert('Failed to copy: ' + err));
            //                                             });
            //                                         </script>
            //                                     </body>
            //                                 </html>    
            //                                 `);

                shareWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <title>Share Document</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 10px; }
                                .btn { display: inline-block; margin-top: 5px; text-decoration: none; padding: 5px 10px; border-radius: 5px; }
                                .btn-outline-success { color: green; border: 1px solid green; }
                                .btn-outline-primary { color: blue; border: 1px solid blue; }
                                .btn-outline-secondary { color: grey; border: 1px solid grey; }
                            </style>
                        </head>
                        <body>
                            ${shareOptions}
                        </body>
                    </html>`);
            }
        });

        // Add card to the page
        documentsListDiv.appendChild(documentCard);
        // documentsListDiv.appendChild(document.createElement('hr'));

    });
    
}

displayDocuments();