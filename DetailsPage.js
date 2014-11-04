var DetailsScriptFileName = 'DetailsPage.js';

var DetailsScriptReferenceId = 'ctl00_MainContent_SecurityRequestDetails_';

var DetailsServerReferenceId = 'MainContent_SecurityRequestDetails_';

var SecurityRequestId = '';

/*
*   Events
*/

/*
*  Initializes the details page user control appearance according to the business rules
*/
function OnInitializeDetailsPage() {

    //ShowDetailsTab();
}

/*
*   Functions
*/

/*
*   Gets the reference to the HTML element by element ID.
*/
function getDetailsControl(id, childId) {

    var ctrl = null;

    if ((id === undefined) || (id == null)) {

        return ctrl;
    }

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    if ((childId === undefined) || (childId == null)) {

        if (isInternetExplorer11OrAbove == true) {

            ctrl = document.getElementById(getDetailsServerControlId(id));

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getDetailsControlId(id)) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

        } else {

            ctrl = document.getElementById(getDetailsServerControlId(id));

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getDetailsControlId(id)) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.all(id) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

        }

    } else {

        if (isInternetExplorer11OrAbove == true) {

            if ((childId !== undefined) && (childId != null) && (typeof (childId) == 'string')) {

                childId = childId.trim();

                ctrl = document.getElementById(getDetailsControlId(childId));

                ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getDetailsControlId(childId)) : ctrl;

                ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(childId) : ctrl;

            }

        } else {

            var el = document.getElementById(getDetailsServerControlId(id));

            el = ((el === undefined) || (el == null)) ? document.getElementById(getDetailsControlId(id)) : el;

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
function getDetailsControlId(partialId) {

    return DetailsScriptReferenceId + partialId;
}

/*
*  Gets the control identity with respect to the enclosing web page.
*/
function getDetailsServerControlId(partialId) {

    return DetailsServerReferenceId + partialId;
}

function HideAll() {

    ShowDiv(getDetailsControl('divDetails'), false);

    ShowDiv(getDetailsControl('divRespondee'), false);

    ShowDiv(getDetailsControl('divFees'), false);

    ShowDiv(getDetailsControl('divAccount'), false);


    /*
    *   The Valuation tab only appears for 'Consents' security request type 
    *   and for 'Discharge' security request type / 'Mortgage - Partial Discharge' security request subtype combination.
    */

    var securityRequestType = getDetailsControl('hdnSecurityRequestTypeId');

    var securityRequestSubType = getDetailsControl('hdnSecurityRequestSubTypeId');

    if ((securityRequestType != null) && (securityRequestSubType != null)) {

        if ((securityRequestType.value == '2' /* Consents */) ||
            ((securityRequestType.value == '1' /* Discharge */) && (securityRequestSubType.value == '5' /* Mortgage - Partial Discharge */))) {

            ShowDiv(getDetailsControl('divValuation'), false);

        }

    }

    ShowDiv(getDetailsControl('divRedemption'), false);

    ShowDiv(getDetailsControl('divSettlement'), false);

    ShowDiv(getDetailsControl('divDocumentGeneration'), false);

    ShowDiv(getDetailsControl('divHistory'), false);

    ShowDiv(getDetailsControl('divNotes'), false);

    ShowDiv(getDetailsControl('divAttachments'), false);

}

/*
*   Dispalys or hides the div element based on the shown parameter value.
*/
function ShowDiv(div, shown) {

    if ((div === undefined) || (div == null)) {

        return;
    }

    var hidden = ((shown === undefined) || (shown == null)) ? true : (shown == false);

    div.style.display = (hidden == true) ? 'none' : 'block';
}

function ShowDetailsTab() {

    HideAll();

    ShowDiv(getDetailsControl('divDetails'), true);
}

function ShowRespondeeTab() {

    HideAll();

    ShowDiv(getDetailsControl('divRespondee'), true);

    if (typeof (OnInitializeRespondee) === 'function') {

        OnInitializeRespondee();
    }
}

function ShowFeesTab() {

    HideAll();

    ShowDiv(getDetailsControl('divFees'), true);
}

function ShowAccountTab() {

    HideAll();

    ShowDiv(getDetailsControl('divAccount'), true);
}

function ShowValuationTab() {

    HideAll();

    ShowDiv(getDetailsControl('divValuation'), true);

    //if (typeof (OnInitializeValuation) === 'function') {

    //    OnInitializeValuation();
    //}

    refreshValuationTab();
}

function ShowRedemptionTab() {

    HideAll();

    ShowDiv(getDetailsControl('divRedemption'), true);

    cbRedemptionTab.Callback();

    //if (typeof (OnInitializeRedemption) === 'function') {

    //    OnInitializeRedemption();
    //}
}

function ShowSettlementTab() {

    HideAll();

    ShowDiv(getDetailsControl('divSettlement'), true);

}

function ShowDocumentGenerationTab() {

    HideAll();

    ShowDiv(getDetailsControl('divDocumentGeneration'), true);

}

function ShowHistoryTab() {

    HideAll();

    refreshHistoryTab();

    ShowDiv(getDetailsControl('divHistory'), true);
}

function ShowNotesTab() {

    HideAll();

    ShowDiv(getDetailsControl('divNotes'), true);
}

function ShowAttachmentsTab() {

    HideAll();

    ShowDiv(getDetailsControl('divAttachments'), true);
}

// ============================= History and Notes ======================== //

// Show history 
function showHistory(id) {
    var callback = eval('ctl00_MainContent_History_cbPopupHistory');
    callback.Callback(id);
    dPopupHistory.Show();
}

// Refresh history tab
function refreshHistoryTab() {
    var callback = eval('ctl00_MainContent_History_cbHistoryTab');
    callback.Callback();
}

// Refresh Valuation tab
function refreshValuationTab() {
    var callback = eval('ctl00_MainContent_Valuation_cbValuationTab');
    callback.Callback();
}

// show add note dialog
function showAddNotePopup() {
    // reset popup elements
    document.getElementById('txtAddNote').value = "";

    dPopupAddNote.Show();

    return false;
}

function addNote() {

    var note = document.getElementById('txtAddNote').value;

    if (note == "") {
        alert("Please enter a note");
        return false;
    }

    cbNotesTab.Callback("ADD", note);

    dPopupAddNote.Close();

    return false;
}

/*
*   Document Generation Facility
*/


/*
*   Initializes the appearance of the ComponentArt modal popup dialog
*   for document generation.
*/
function OnShowDocumentGenerator(dlg) {

    if ((dlg === undefined) || (dlg == null)) {

        return false;
    }

    var securityRequestId = getDetailsControl('hdnSecurityRequestId');

    var hidden = getDetailsControl('documentPrintEnquiry');

    var enquiry = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    if (typeof (dlg.set_alignmentElement) == 'function') {

        var div = getDetailsControl('divMain');

        if ((div !== undefined) && (div != null)) {

            dlg.set_alignmentElement(div.id)
        }
    }

    var callerId = 'ctl00_MainContent_cbdlgDocumentGenerator';

    var caller = eval(callerId);

    if ((caller !== undefined) && (caller != null)) {

        if (typeof (caller.Callback) == 'function') {

            if (typeof (ShowPageActivity) == 'function') ShowPageActivity(true);

            /*
            *   The end-user will select the particular document(s) that will be generated
            *   from the displayed list of security request documents.
            *
            *   Review the function [OnAcceptDocumentGeneration] for document generation acceptance
            *   and the function [OnCancelDocumentGeneration] to cancel document generation.
            */

            caller.Callback(securityRequestId, enquiry);

            if (typeof (ShowPageActivity) == 'function') ShowPageActivity(false);

        } else if ((caller.control !== undefined) && (caller.control != null) && (typeof (caller.control.Callback) == 'function')) {

            if (typeof (ShowPageActivity) == 'function') ShowPageActivity(true);

            /*
            *   The end-user will select the particular document(s) that will be generated
            *   from the displayed list of security request documents.
            *
            *   Review the function [OnAcceptDocumentGeneration] for document generation acceptance
            *   and the function [OnCancelDocumentGeneration] to cancel document generation.
            */

            caller.control.Callback(securityRequestId, enquiry);

            if (typeof (ShowPageActivity) == 'function') ShowPageActivity(false);
        }
    }

}

/*
*   Progresses the security request workflow to the next stage / status. 
*/
function OnCloseDocumentGenerator(dlg) {

    var hidden = getDetailsControl('hdnSecurityRequestId');

    var securityRequestId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

    hidden = getDetailsControl('triggeredButton');

    var buttonId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

    var clickedButton = getDetailsControl(buttonId);

    if ((clickedButton !== undefined) && (clickedButton != null) && (securityRequestId.length > 0)) {

        // process the clicked action button

        if (typeof (OnProcessAction) == 'function') {

            var response = OnProcessAction(securityRequestId, clickedButton);

            if (response == '') {

                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + securityRequestId;

            } else {

                OpenSaveErrorDialog(response);
            }
        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

}

/*
*   End-user has clicked the <Accept> button for document generation.
*   The document generation request has been posted to the SecurityRequestsDocumentsBLC.
*/
function OnAcceptDocumentGeneration(button) {

    hidden = getDetailsControl('hdnSecurityRequestId');

    var securityRequestId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

    // we require the reference to the HTML button that was formerly clicked.

    hidden = getDetailsControl('triggeredButton');

    var buttonId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

    hidden = getDetailsControl('hdnCurrentEmployeeId');

    var currentEmployeeId = ((hidden === undefined) || (hidden == null)) ? -1 : (hidden.value.length == 0) ? -1 : window.parseInt(hidden.value.trim());

    hidden = getDetailsControl('hdnOwnerEmployeeNo');

    var ownerEmployeeId = ((hidden === undefined) || (hidden == null)) ? -1 : (hidden.value.length == 0) ? -1 : window.parseInt(hidden.value.trim());

    var selection = getDocumentCheckBoxListResponse();

    if ((selection !== undefined) && (selection != null)) {

        selection.CurrentEmployeeId = currentEmployeeId;
        selection.OwnerEmployeeId = ownerEmployeeId;
        selection.SecurityRequestId = (securityRequestId.length == 0) ? -1 : window.parseInt(securityRequestId.trim());
    }

    var canCreateDocuments = false;

    if (typeof (CanCreateDocuments) == 'function') {

        canCreateDocuments = CanCreateDocuments(selection);
    }

    if (canCreateDocuments == true) {

        var enquiryResponse = ((selection === undefined) || (selection == null)) ? '' : JSON.stringify(selection);

        var generatedResponse = '';

        if (typeof (GenerateAsposeDocuments) == 'function') {

            /*
            *   Generate (publish) the selected Aspose (Mail Merge) documents.
            */

            generatedResponse = GenerateAsposeDocuments(securityRequestId, buttonId, enquiryResponse);
        }

        hidden = getActionControl('canprintDocuments');

        /*
        *   Reset the hidden field value that indicates we can generate documents
        */
        if ((hidden !== undefined) && (hidden != null)) {

            hidden.value = 'false';
        }

        if (generatedResponse.length == 0) {

            if (typeof (stopEventBubbling) == 'function') {

                stopEventBubbling(window.event);
            }

            return false;
        }

        var generatedTemplates = null;

        try {

            /*
            *   Obtain the DocumentTemplates object reference.
            */

            generatedTemplates = JSON.parse(generatedResponse.trim());

        } catch (err) {

            generatedTemplates = null;
        }

        if (generatedTemplates == null) {

            // We could not obtain the processed document templates reference.

            if (typeof (stopEventBubbling) == 'function') {

                stopEventBubbling(window.event);
            }

            return false;
        }

        if ((generatedTemplates.Documents === undefined) || (generatedTemplates.Documents == null)) {

            // No documents were processed successfully and optionally stored within File Storage.

            if ((generatedTemplates.Errors !== undefined) && (generatedTemplates.Errors != null) && (generatedTemplates.Errors instanceof Array)) {

                if (generatedTemplates.Errors.length > 0) {

                    var errorMessages = (typeof (getErrorMessages) == 'function') ? getErrorMessages(generatedTemplates.Errors) : '';

                    if (errorMessages.length > 0) {
                        alert(ActionScriptFileName + '. Control: Accept Button for Document Generation Dialog. Event: Click. Error: ' + errorMessages);
                    }
                }
            }

        } else if (!(generatedTemplates.Documents instanceof Array)) {

            if ((generatedTemplates.Errors !== undefined) && (generatedTemplates.Errors != null) && (generatedTemplates.Errors instanceof Array)) {

                if (generatedTemplates.Errors.length > 0) {

                    var errorMessages = (typeof (getErrorMessages) == 'function') ? getErrorMessages(generatedTemplates.Errors) : '';

                    if (errorMessages.length > 0) {
                        alert(ActionScriptFileName + '. Control: Accept Button for Document Generation Dialog. Event: Click. Error: ' + errorMessages);
                    }
                }
            }
        }

    }

    var dlg = dlgDocumentGenerator;

    dlg = ((dlg === undefined) || (dlg == null)) ? getDetailsControl('dlgDocumentGenerator') : dlg;

    if ((dlg !== undefined) && (dlg != null)) {

        if (typeof (dlg.Close) == 'function') {

            dlg.Close();
        }
    }

    return false;
}

/*
*   Cancels the request to generate security request documents.
*/
function OnCancelDocumentGeneration(button) {

    try {

        var dlg = dlgDocumentGenerator;

        dlg = ((dlg === undefined) || (dlg == null)) ? getDetailsControl('dlgDocumentGenerator') : dlg;

        if ((dlg !== undefined) && (dlg != null)) {

            if (typeof (dlg.Close) == 'function') {

                dlg.Close();
            }
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Control: Cancel Button for Document Generation Dialog. Event: Click. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;

}

/*
*   Displays the loading image for a particular task.
*/
function ShowPageActivity(showActivity) {

    var dlg = dPopupLoading;

    if ((dlg === undefined) || (dlg == null)) {

        dlg = getDetailsControl('dPopupLoading');
    }

    if ((dlg === undefined) || (dlg == null)) {

        return;
    }

    var hideActivity = true;

    try {

        hideActivity = ((showActivity === undefined) || (showActivity == null)) ? true : (new Boolean(showActivity) == false);

    } catch (err) {

        hideActivity = true;
    }

    if (hideActivity == true) {

        try {

            if (typeof (dlg.Close) == 'function') {

                dlg.Close();
            }

        } catch (err) {


        }

    } else {

        try {

            if (typeof (dlg.Show) == 'function') {

                dlg.Show();
            }

        } catch (err) {


        }
    }
}

/*
*   Verifies whether the end-user has selected a document to generate.
*/
function CanCreateDocuments(selection) {

    var response = false;

    if ((selection === undefined) || (selection == null)) {

        return response;
    }

    if ((selection.Documents !== undefined) && (selection.Documents != null)) {

        if (selection.Documents instanceof Array) {

            for (var index = 0; index < selection.Documents.length; ++index) {

                if (selection.Documents[index] != null) {

                    try {

                        if (selection.Documents[index].IsSelected == true) {
                            response = true;
                            break;
                        }

                    } catch (err) {

                    }
                }
            }
        }
    }

    return response;
}

/*
*   Returns the end-user document selection for document generation.
*/
function getDocumentCheckBoxListResponse() {

    var response = {};

    response.Documents = new Array();

    var chkboxlist = getDetailsControl('divDocumentGenerator', 'chklstDocuments');

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

                    var document = {};

                    document.IsSelected = true;

                    var publication = chkboxlist.rows[index].children[0].children[0].innerText.trim();

                    document.DocumentName = ((publication == null) || (publication.length == 0)) ? '' : publication;

                    document.DocumentTypeId = 0; // to be assigned during document generation.

                    document.IsAvailable = false; // document generation indicator

                    document.CreationDate = null; // document generation date/time

                    document.IsRequired = true; // document is required for generation

                    response.Documents.push(document);

                }

            } else if ((chkboxlist.rows[index].children[0].children[0].children != null) && (chkboxlist.rows[index].children[0].children[0].children.length == 0)) {

                /*
                *   Enabled elements within a checkbox list does not contain a additional SPAN element
                */

                if ((chkboxlist.rows[index].children[0].children[0].tagName.toLowerCase() == 'input') && (chkboxlist.rows[index].children[0].children[0].type.toLowerCase() == 'checkbox')) {

                    var document = {};

                    document.IsSelected = chkboxlist.rows[index].children[0].children[0].checked;

                    var publication = chkboxlist.rows[index].children[0].innerText.trim();

                    document.DocumentName = ((publication == null) || (publication.length == 0)) ? '' : publication;

                    document.DocumentTypeId = 0; // to be assigned during document generation.

                    document.IsAvailable = false; // document generation indicator

                    document.CreationDate = null; // document generation date/time

                    document.IsRequired = false; // optional document generation

                    response.Documents.push(document);

                }
            }

        }
    }

    return response;
}

/*
*   Gets the encountered processing violations
*/
function getErrorMessages(errors) {

    var response = '';

    try {

        var builder = new stringBuilder();

        if (errors instanceof Array) {

            var len = errors.length;

            for (var index = 0; index < len; ++index) {

                builder.appendLine(errors[index]);
            }

        } else if (typeof (errors) == 'string') {

            builder.appendLine(errors);
        }

        response = builder.toString();

    } catch (violation) {

        response = violation.message;
    }

    return response;
}