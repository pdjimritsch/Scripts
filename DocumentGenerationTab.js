var DocumentGenerationTabScriptFileName = 'DocumentGenerationTab.js';

var DocumentGenerationTabScriptReferenceId = 'ctl00_MainContent_DocumentGeneration_';

var DocumentGenerationTabServerReferenceId = 'MainContent_DocumentGeneration_';

function uploadDocument() {
    if (document.getElementById("ddlDocumentTypes").options[document.getElementById("ddlDocumentTypes").selectedIndex].value == "-1") {
        alert("Please select a Document Type to upload from the dropdown list");
        return false;
    }

    document.getElementById("hdnDocumentGenerationDocumentTypeId").value = document.getElementById("ddlDocumentTypes").options[document.getElementById("ddlDocumentTypes").selectedIndex].value;
    document.getElementById("hdnDocumentGenerationDocumentTypeDescription").value = document.getElementById("ddlDocumentTypes").options[document.getElementById("ddlDocumentTypes").selectedIndex].text;

    return true;
}

function downloadDocument(id) {

    window.open("Documents.aspx?id=" + id);
}

/*
*   Returns the end-user document selection for document generation.
*/
function getDocumentGenerationCheckBoxListResponse() {

    var response = {};

    response.Documents = new Array();

    var chkboxlist = document.getElementById('cblDocumentTypes');

    var len = ((chkboxlist === undefined) || (chkboxlist === null)) ? -1 : chkboxlist.rows.length;

    response.MaximumCount = len;

    for (var index = 0; index < len; ++index) {

        if ((chkboxlist.rows[index].children.length > 0) && (chkboxlist.rows[index].children[0].children.length > 0)) {

            if ((chkboxlist.rows[index].children[0].children[0].children != null) && (chkboxlist.rows[index].children[0].children[0].children.length > 0)) {

                /*
                *   Disabled elements within a checkbox list contains a additional SPAN element with disabled="disabled"
                */

                if ((chkboxlist.rows[index].children[0].children[0].children[0].tagName.toLowerCase() == 'input') &&
                    (chkboxlist.rows[index].children[0].children[0].children[0].type.toLowerCase() == 'checkbox')) {

                    var doc = {};

                    doc.IsSelected = true;

                    var publication = chkboxlist.rows[index].children[0].children[0].innerText.trim();

                    doc.DocumentName = ((publication == null) || (publication.length == 0)) ? '' : publication;

                    doc.DocumentTypeId = 0; // to be assigned during doc generation.

                    doc.IsAvailable = false; // doc generation indicator

                    doc.CreationDate = null; // doc generation date/time

                    doc.IsRequired = true; // doc is required for generation

                    response.Documents.push(doc);

                }

            } else if ((chkboxlist.rows[index].children[0].children[0].children != null) && (chkboxlist.rows[index].children[0].children[0].children.length == 0)) {

                /*
                *   Enabled elements within a checkbox list does not contain a additional SPAN element
                */

                if ((chkboxlist.rows[index].children[0].children[0].tagName.toLowerCase() == 'input') && (chkboxlist.rows[index].children[0].children[0].type.toLowerCase() == 'checkbox')) {

                    var doc = {};

                    doc.IsSelected = chkboxlist.rows[index].children[0].children[0].checked;

                    var publication = chkboxlist.rows[index].children[0].innerText.trim();

                    doc.DocumentName = ((publication == null) || (publication.length == 0)) ? '' : publication;

                    doc.DocumentTypeId = 0; // to be assigned during doc generation.

                    doc.IsAvailable = false; // doc generation indicator

                    doc.CreationDate = null; // doc generation date/time

                    doc.IsRequired = false; // optional doc generation

                    response.Documents.push(doc);

                }
            }

        }
    }

    return response;
}

function GenerateDocuments(button) {

    hidden = getDetailsControl('hdnSecurityRequestId');
    var securityRequestId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

    hidden = getDetailsControl('hdnCurrentEmployeeId');
    var currentEmployeeId = ((hidden === undefined) || (hidden == null)) ? -1 : (hidden.value.length == 0) ? -1 : window.parseInt(hidden.value.trim());

    hidden = getDetailsControl('hdnOwnerEmployeeNo');
    var ownerEmployeeId = ((hidden === undefined) || (hidden == null)) ? -1 : (hidden.value.length == 0) ? -1 : window.parseInt(hidden.value.trim());

    var buttonId = button.id;

    var selection = getDocumentGenerationCheckBoxListResponse();

    if ((selection !== undefined) && (selection != null)) {

        selection.CurrentEmployeeId = currentEmployeeId;
        selection.OwnerEmployeeId = ownerEmployeeId;
        selection.SecurityRequestId = (securityRequestId.length == 0) ? -1 : window.parseInt(securityRequestId.trim());
    }


    var enquiryResponse = ((selection === undefined) || (selection == null)) ? '' : JSON.stringify(selection);

    var generatedResponse = '';

    if (typeof (GenerateAsposeDocuments) == 'function') {

        /*
        *   Generate (publish) the selected Aspose (Mail Merge) documents.
        */

        generatedResponse = GenerateAsposeDocuments(securityRequestId, buttonId, enquiryResponse);

        /*
        *   Refresh the grid view that displays the generated documents.
        */

        var securityRequestId = null;

        var hidden = getDocumentGenerationTabControl('hdnDocumentGenerationSecurityRequestId');

        if ((hidden !== undefined) && (hidden != null) && (hidden.value.length > 0)) {

            securityRequestId = hidden.value.trim();
        }

        if ((securityRequestId != null) && (securityRequestId.length > 0)) {

            var url = window.location.pathname;

            window.location.href = url + '?' + 'SecurityRequestId=' + securityRequestId;
        }
    }
}

/*
*   Gets the reference to the HTML element by element ID.
*/
function getDocumentGenerationTabControl(id, childId) {

    var ctrl = null;

    if ((id === undefined) || (id == null)) {

        return ctrl;
    }

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    if ((childId === undefined) || (childId == null)) {

        if (isInternetExplorer11OrAbove == true) {

            ctrl = document.getElementById(getDocumentGenerationTabServerControlId(id));

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getRespondeeControlId(id)) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

        } else {

            ctrl = document.getElementById(getDocumentGenerationTabServerControlId(id));

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getDocumentGenerationTabControlId(id)) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.all(id) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

        }

    } else {

        if (isInternetExplorer11OrAbove == true) {

            if ((childId !== undefined) && (childId != null) && (typeof (childId) == 'string')) {

                childId = childId.trim();

                ctrl = document.getElementById(getDocumentGenerationTabServerControlId(childId));

                ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getDocumentGenerationTabControlId(childId)) : ctrl;

                ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(childId) : ctrl;

            }

        } else {

            var el = document.getElementById(getDocumentGenerationTabServerControlId(id));

            el = ((el === undefined) || (el == null)) ? document.getElementById(getDocumentGenerationTabControlId(id)) : el;

            el = ((el === undefined) || (el == null)) ? document.all(id) : el;

            el = ((el === undefined) || (el == null)) ? document.getElementById(id) : el;

            if (childId.length == 0) {

                ctrl = el;

            } else if (typeof (childId) == 'string') {

                ctrl = el.all(childId.trim());

            } else {

                ctrl = el;
            }
        }
    }

    return ctrl;
}

/*
*  Gets the control identity with repsect to the enclosing web page.
*/
function getDocumentGenerationTabControlId(partialId) {

    return DocumentGenerationTabScriptReferenceId + partialId;
}

/*
*  Gets the control identity with repsect to the enclosing web page.
*/
function getDocumentGenerationTabServerControlId(partialId) {

    return DocumentGenerationTabServerReferenceId + partialId;
}


