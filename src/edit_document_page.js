window.onload = function() {
    const docString = localStorage.getItem('editDoc');
    if (docString) {
        const doc = JSON.parse(docString);
        editDocument(doc); 
    } else {
        alert("No document found to edit!");
    }
}

function editDocument(doc){
    
    `
    <form action="" id="document-upload-form">
        <div class="row mb-3">
            <label for="document-name" class="col-sm-4 col-form-label">Enter name of the document</label>
            <div class="col-sm-8">
                <input type="text" class="form-control" id="document-name" value="${doc.documentName}">
            </div>
        </div>
        <div class="row mb-3">
            <label for="type-of-document" class="col-sm-4 col-form-label">Select the type of the document</label>
            <div class="col-sm-8">
                <select class="form-select form-select-sm" aria-label=".form-select-sm example" id="type-of-document" >
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
            <label for="document-upload" class="col-sm-4">Upload your document</label>
            <div class="col-sm-8">
                 ${
                    doc.documentUrl
                        ? `<p>Already uploaded: <a href="${doc.fileUrl}" target="_blank">${doc.documentName}</a></p>`
                        : ''
                }
                <input type="file" id="document-upload" name="document" accept="pdf, image/*">
            </div>
        </div>
        <div class="row">
            <div class="col-sm-8"></div>
        </div>
        <button type="submit" class="col-sm-1 offset-4 mt-4">Submit</button>
    </form>`
    document.getElementById('type-of-document').value = doc.documentType;

}
