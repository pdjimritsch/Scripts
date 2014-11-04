var ActionScriptFileName = 'ActionMenu.js';

var ActionScriptReferenceId = 'ctl00_MainContent_ActionMenu_';

var ActionServerReferenceId = 'MainContent_ActionMenu_';


/*
*   Events
*/

/*
*   Initializes the appearance of the action buttons
*/
function OnInitializeActionMenu() {

    var pnl = getActionControl('pnlActionButtons');

    if ((pnl === undefined) || (pnl == null)) {

        return;
    }

    var response = null;

    var buttons = null;

    var attribute = getActionAttributes();

    if (typeof (GetActionsBySecurityRequest) == 'function') {

        response = GetActionsBySecurityRequest(attribute.securityRequestId);
    }

    if (response != null) {

        try {

            buttons = JSON.parse(response);
        }
        catch (err) {

            buttons = null;
        }
    }

    var cellAction = getActionControl('cellAction');

    if ((buttons !== null) && (buttons.length > 0)) {

        clearPanel(pnl);

        var len = buttons.length;

        for (var index = 0; index < len; ++index) {

            var entity = buttons[index];

            var button = document.createElement('input');

            button.id = entity.UIButtonName;
            button.type = 'button'
            button.value = entity.Name;
            button.title = getButtonTitle(entity);
            button.className = 'buttonWide';
            button.style.display = 'block';
            button.style.color = 'blue';
            button.style.height = '30px';
            button.style.width = ((cellAction === undefined) || (cellAction == null)) ? '240px' : cellAction.style.width;

            if (entity.UIButtonName == 'AddNote') {

                var visibility = (typeof (HasOperationPermission) == 'function') ? ((new Boolean(HasOperationPermission(8 /* CAPSAddNote */)) == true) ? 'block' : 'none') : 'none';

                button.style.display = visibility;

            } else if (entity.UIButtonName == 'UnassignRequest') {

                var visibility = (typeof (HasOperationPermission) == 'function') ? ((new Boolean(HasOperationPermission(6 /* CAPSUnassingRequest */)) == true) ? 'block' : 'none') : 'none';

                button.style.display = visibility;

            } else if (entity.UIButtonName == 'AssignRequest') {

                if (attribute.ownerEmployeeNo == 0) {

                    if (attribute.securityRequestStageId == 3 /* Supervisor Approval */) {

                        var visibility = (typeof (HasOperationPermission) == 'function') ? ((new Boolean(HasOperationPermission(4 /* CAPSAuthoriseDeclineRequest */)) == true) ? 'block' : 'none') : 'none';

                        button.style.display = visibility;

                    } else if ((attribute.securityRequestStageId != 3) &&
                        (attribute.securityRequestStatusId != 18 /* Closed */) &&
                        (attribute.securityRequestStatusId != 19 /* Cancelled */)) {

                        var visibility = (typeof (HasOperationPermission) == 'function') ? ((new Boolean(HasOperationPermission(1 /* CAPSCreateEditRequest */)) == true) ? 'block' : 'none') : 'none';

                        button.style.display = visibility;
                    }
                }

            }

            if (attribute.currentEmployeeNo == attribute.ownerEmployeeNo) {

                if (entity.UIButtonName == 'CancelRequest') {

                    var visibility = (typeof (HasOperationPermission) == 'function') ? ((new Boolean(HasOperationPermission(5 /* CAPSCancelRequest */)) == true) ? 'block' : 'none') : 'none';

                    button.style.display = visibility;

                } else if ((entity.UIButtonName == 'DeclineRequest') || (entity.UIButtonName == 'ApproveRequest') || (entity.UIButtonName == 'ResetRequest')) {

                    var visibility = (typeof (HasOperationPermission) == 'function') ? ((new Boolean(HasOperationPermission(4 /* CAPSAuthoriseDeclineRequest */)) == true) ? 'block' : 'none') : 'none';

                    button.style.display = visibility;
                }
            }

            if (button.style.display != 'none') {

                button.onclick = function () {

                    if (entity.UIButtonName == 'AddNote') {

                        if (typeof (showAddNotePopup) == 'function') {

                            return showAddNotePopup();
                        }

                    } else {

                        if (typeof (processActionMenuClick) == 'function') {

                            return processActionMenuClick(this);
                        }
                    }

                    if (typeof (stopEventBubbling) == 'function') {

                        stopEventBubbling(window.event);
                    }

                    return false;
                };

                pnl.appendChild(button);

            }

        }
    }
}

/*
*   Displays or hides the corresponding notes section within the textarea. 
*/
/*
function OnChangeDeedPacketSelector(ddl) {

    var row = getActionControl('trDeedPacketSection');

    if ((row === undefined) || (row == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    var ddlDeedPacket = null;

    if (isInternetExplorer11OrAbove == false) {

        ddlDeedPacket = row.all('ddlDeedPacket');

    } else {

        var els = row.getElementsByTagName('SELECT');

        if ((els !== undefined) && (els != null) && (els.length > 0)) {

            for (var index = 0; index < els.length; ++index) {

                if (els[index].id == 'ddlDeedPacket') {

                    ddlDeedPacket = els[index];
                    break;
                }
            }
        }
    }

    ddlDeedPacket = ((ddlDeedPacket === undefined) || (ddlDeedPacket == null)) ? getActionControl('ddlDeedPacket') : ddlDeedPacket;

    var trDeedPacketDocuments = null;

    if (isInternetExplorer11OrAbove == false) {

        trDeedPacketDocuments = row.all('trDeedPacketDocuments');

    } else {

        var els = row.getElementsByTagName('TR');

        if ((els !== undefined) && (els != null) && (els.length > 0)) {

            for (var index = 0; index < els.length; ++index) {

                if (els[index].id == 'trDeedPacketDocuments') {

                    trDeedPacketDocuments = els[index];
                    break;
                }
            }
        }

    }

    trDeedPacketDocuments = ((trDeedPacketDocuments === undefined) || (trDeedPacketDocuments == null)) ? getActionControl('trDeedPacketDocuments') : trDeedPacketDocuments;

    if ((ddlDeedPacket !== undefined) && (ddlDeedPacket != null) && (trDeedPacketDocuments !== undefined) && (trDeedPacketDocuments != null)) {

        var value = ddlDeedPacket.options[ddlDeedPacket.options.selectedIndex].value;

        if ((value == 0 ) || (value == 3 )) {

            trDeedPacketDocuments.style.display = 'block';

        } else {

            trDeedPacketDocuments.style.display = 'none';
        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}
*/
/*
*   Hides the data entry form for the migration of the Deed Packet to Storage.
*/
function OnHideDeedPacketToStorage(button) {

    var row = getActionControl('trDeedPacketSection');

    if ((row === undefined) || (row == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    row.style.display = 'none';

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Displays the data entry form for the migration of the Deed Packet to Storage.
*/
function OnShowDeedPacketToStorage(button) {

    var row = getActionControl('trDeedPacketSection');

    if ((row === undefined) || (row == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    row.style.display = 'block';

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

function toggleDeedPacketDocuments() {
    var row = getActionControl('trDeedPacketSection');
    if (document.getElementById('ddlAcceptDeedPacket').options[document.getElementById('ddlAcceptDeedPacket').selectedIndex].value == 'Yes') {
        row.style.display = 'block';
    }
    else {
        row.style.display = 'none';
    }
}

/*
*   Accepts the end-user request to close the security request account.
*/
function OnAcceptCloseRequestAccount(button) {

    /*
    *  Obtain the end-user response from the Close Request Account questionnaire that is 
    *  presented within the ComponentArt popup dialog.
    */

    var response = getCloseSecurityRequestAccountResponse();

    // Validate the security request account based questions.

    var errMsg = '';

    var ddlAcceptBankingInstructions = document.getElementById('ddlAcceptBankingInstructions').options[document.getElementById('ddlAcceptBankingInstructions').selectedIndex].value;
    if (ddlAcceptBankingInstructions == '-1' || ddlAcceptBankingInstructions == 'No') {

        errMsg += '- The funds must be banked before the Matter can be closed\n';
    }

    var ddlAcceptDepositSlip = document.getElementById('ddlAcceptDepositSlip').options[document.getElementById('ddlAcceptDepositSlip').selectedIndex].value;
    if (ddlAcceptDepositSlip == '-1' || ddlAcceptDepositSlip == 'No') {

        errMsg += '- You must confirm the Account details on the deposit slip.\n';
    }

    var ddlAcceptDocumentUpdates = document.getElementById('ddlAcceptDocumentUpdates').options[document.getElementById('ddlAcceptDocumentUpdates').selectedIndex].value;
    if (ddlAcceptDocumentUpdates == '-1' || ddlAcceptDocumentUpdates == 'No') {

        errMsg += '- You must save every document before the Matter can be closed.\n';
    }

    var ddlAcceptDeedRegister = document.getElementById('ddlAcceptDeedRegister').options[document.getElementById('ddlAcceptDeedRegister').selectedIndex].value;
    if (ddlAcceptDeedRegister == '-1' || ddlAcceptDeedRegister == 'No') {

        errMsg += '- The Deed Register must be updated before the Matter can be closed.\n';
    }

    var ddlAcceptForceCloseAccount = document.getElementById('ddlAcceptForceCloseAccount').options[document.getElementById('ddlAcceptForceCloseAccount').selectedIndex].value;
    if (ddlAcceptForceCloseAccount == '-1'){ //|| ddlAcceptForceCloseAccount == 'No') {

        errMsg += '- The security request account was not written off or closed.\n';
    }

    var ddlAcceptMatterClosure = document.getElementById('ddlAcceptMatterClosure').options[document.getElementById('ddlAcceptMatterClosure').selectedIndex].value;
    if (ddlAcceptMatterClosure == '-1' || ddlAcceptMatterClosure == 'No') {

        errMsg += '- You must acknowledge that the Matter can be closed.\n';
    }

    if (response.sendDeedPacketToStorage == "-1") {
        errMsg += '- Please select Does the Deed Packet need to go to the Storage?.\n';
    }
    else {
        if ((response.sendDeedPacketToStorage == "Yes") && (response.deedPacket.visible == true)) {

            if (response.deedPacket.documentType != "Please select") {

                if ((response.deedPacket.documentType == 'Loan Agreement') || (response.deedPacket.documentType == 'Other')) {

                    if ((response.deedPacket.notes == null) || (response.deedPacket.notes.length == 0)) {

                        errMsg += '- Please specify the mandatory notes for the Deed Packet Storage\n';
                    }

                    if ((response.deedPacket.storageBox == null) || (response.deedPacket.storageBox.length == 0)) {

                        errMsg += '- The Deed Packet Storage Box value must be provided.\n';
                    }
                }
            }
            else {
                errMsg += '- Please select a Storage Description for the Deed Packet.\n';
            }
        }
    }

    if (errMsg != '') {

        alert(errMsg);

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    if (typeof (generateCloseRequestDocuments) == 'function') {

        /*
        *  Generates the email-based correspondence and the associated <Close Request> documents for the security request.
        */
        button.id = getActionControl('triggeredButton').value;
        generateCloseRequestDocuments(response, button);
    }

    return OnCancelCloseRequestAccount(button);
}

/*
*   Aborts the closure of the security request account.
*/
function OnCancelCloseRequestAccount(button) {

    try {

        dlg = dlgCloseRequestAccount;

        dlg = ((dlg === undefined) || (dlg == null)) ? getActionControl('dlgCloseRequestAccount') : dlg;

        if ((dlg !== undefined) && (dlg != null)) {

            if (typeof (dlg.Close) == 'function') {

                dlg.Close();
            }
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Control: Cancel Button for Email Dialog. Event: Click. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}


/*
*   Accepts the end-user request to close the security request account.
*/
function OnAcceptAuthoriseRequestAccount(button) {

    /*
    *  Obtain the end-user response from the Close Request Account questionnaire that is 
    *  presented within the ComponentArt popup dialog.
    */

    var response = getAuthoriseSecurityRequestAccountResponse();

    // Validate the security request account based questions.

    var errMsg = '';

    var ddlDeedRegisterUpdated = document.getElementById('ddlDeedRegisterUpdated').options[document.getElementById('ddlDeedRegisterUpdated').selectedIndex].value;
    if (ddlDeedRegisterUpdated == '-1' || ddlDeedRegisterUpdated == 'No') {

        errMsg += '- The Deed Register must be updated\n';
    }

    var ddlMemberAuthoritySaved = document.getElementById('ddlMemberAuthoritySaved').options[document.getElementById('ddlMemberAuthoritySaved').selectedIndex].value;
    if (ddlMemberAuthoritySaved == '-1' || ddlMemberAuthoritySaved == 'No') {

        errMsg += '- The member\'s authority/ies must be saved\n';
    }

    var ddlSignaturesVerified = document.getElementById('ddlSignaturesVerified').options[document.getElementById('ddlSignaturesVerified').selectedIndex].value;
    if (ddlSignaturesVerified == '-1' || ddlSignaturesVerified == 'No') {

        errMsg += '- All signatures must be verified\n';
    }

    var ddlApprovalRequiredAndSaved = document.getElementById('ddlApprovalRequiredAndSaved').options[document.getElementById('ddlApprovalRequiredAndSaved').selectedIndex].value;
    if (ddlApprovalRequiredAndSaved == '-1' || ddlApprovalRequiredAndSaved == 'No') {

        errMsg += '- Approval is required and must be Saved\n';
    }

    var ddlSettlementFiguresCorrect = document.getElementById('ddlSettlementFiguresCorrect').options[document.getElementById('ddlSettlementFiguresCorrect').selectedIndex].value;
    if (ddlSettlementFiguresCorrect == '-1' || ddlSettlementFiguresCorrect == 'No') {

        errMsg += '- Ensure all settlement figures are correct\n';
    }

    var ddlTitleMortgageAttached = document.getElementById('ddlTitleMortgageAttached').options[document.getElementById('ddlTitleMortgageAttached').selectedIndex].value;
    if (ddlTitleMortgageAttached == '-1' || ddlTitleMortgageAttached == 'No') {

        errMsg += '- Ensure Title and Mortgage have been attached\n';
    }


    if (errMsg != '') {

        alert(errMsg);

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    if (typeof (generateAuthoriseRequestDocuments) == 'function') {

        /*
        *  Generates the email-based correspondence and the associated <Close Request> documents for the security request.
        */
        button.id = getActionControl('triggeredButton').value;
        generateAuthoriseRequestDocuments(response, button);
    }

    return OnCancelAuthoriseRequestAccount(button);
}

/*
*   Aborts the closure of the security request account.
*/
function OnCancelAuthoriseRequestAccount(button) {

    try {

        dlg = dAuthoriseRequest;

        dlg = ((dlg === undefined) || (dlg == null)) ? getActionControl('dAuthoriseRequest') : dlg;

        if ((dlg !== undefined) && (dlg != null)) {

            if (typeof (dlg.Close) == 'function') {

                dlg.Close();
            }
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Control: Cancel Button for Email Dialog. Event: Click. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Accepts the end-user request to forward the security request based email
*   to the nominated recipients.
*
*   The security request will progress to the next stage / status upon acceptance.
*/
function OnAcceptEmailServiceProvider(button) {

    try {

        var hidden = null;

        hidden = getActionControl('emailRequestor');

        var requestor = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

        hidden = null;

        var recipient = '';

        if (requestor.length == 0) {

            // we will assume that the <Send> button was clicked for the change of financial institution selection.

            var ddlEmailRecipientsTo = getActionControl('ddlEmailRecipientsTo');

            if ((ddlEmailRecipientsTo === undefined) || (ddlEmailRecipientsTo == null)) {

                OnCancelEmailServiceProvider(null);

                if (typeof (stopEventBubbling) == 'function') {

                    stopEventBubbling(window.event);
                }

                return false;
            }

            recipient = ddlEmailRecipientsTo.options[ddlEmailRecipientsTo.options.selectedIndex].text;

            if ((recipient == null) || (recipient.length == 0) || (recipient == 'Please select')) {

                alert('Please select the email recipient from the drop-down list.');

                OnCancelEmailServiceProvider(null);

                if (typeof (stopEventBubbling) == 'function') {

                    stopEventBubbling(window.event);
                }

                return false;
            }

        } else if (requestor == 'Respondee')  {

            // we will assume that the <Send> button was clicked for the change of financial institution selection.

            var ddlEmailRecipientsTo = getActionControl('ddlEmailRecipientsTo');

            if ((ddlEmailRecipientsTo === undefined) || (ddlEmailRecipientsTo == null)) {

                OnCancelEmailServiceProvider(null);

                if (typeof (stopEventBubbling) == 'function') {

                    stopEventBubbling(window.event);
                }

                return false;
            }

            recipientId = ddlEmailRecipientsTo.options[ddlEmailRecipientsTo.options.selectedIndex].value;

            if ((recipientId == null) || (recipientId.length == 0) || (recipientId == '-1')) {

                alert('Please select the email recipient from the drop-down list.');

                OnCancelEmailServiceProvider(null);

                if (typeof (stopEventBubbling) == 'function') {

                    stopEventBubbling(window.event);
                }

                return false;
            }
        }

        var txtEmailComments = getActionControl('txtEmailComments');

        var comments = '';

        if ((txtEmailComments !== undefined) && (txtEmailComments != null)) {

            comments = txtEmailComments.value.trim();
        }

        var response = '';

        if (requestor.length == 0 /* we will assume that the email request is associated with the financial institution drop-down list selection on the respondeee tab */) {

            if (typeof (SendRespondeeEmail) == 'function') {

                response = SendRespondeeEmail(recipientId, comments);
            }

        } else if (requestor == 'Respondee') {

            if (typeof (SendRespondeeEmail) == 'function') {

                response = SendRespondeeEmail(recipientId, comments);
            }

        } else if (requestor == 'ActionMenu') {

            if (typeof (SendActionButtonEmail) == 'function') {

                hidden = getActionControl('hdnSecurityRequestId');

                var securityRequestId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

                hidden = getActionControl('triggeredButton');

                var buttonId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

                hidden = getActionControl('currentEmployeeNo');

                var employeeNumber = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

                hidden = getActionControl('enquiryResponse');

                var enquiryResponse = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

                var ddlEmailRecipientsTo = getActionControl('ddlEmailRecipientsTo');

                if ((ddlEmailRecipientsTo !== undefined) && (ddlEmailRecipientsTo != null) && (ddlEmailRecipientsTo.options.selectedIndex > 0)) {

                    recipient = ddlEmailRecipientsTo.options[ddlEmailRecipientsTo.options.selectedIndex].text;

                } else {

                    recipient = '';
                }

                var chkbox = getActionControl('chkUseBusinessRules');

                var useBusinessRules = true;

                if ((chkbox !== undefined) && (chkbox != null) && (chkbox.style.display != 'none')) {

                    useBusinessRules = chkbox.checked;
                }

                var txtbox = getActionControl('txtSendEmailTo');

                if ((txtbox !== undefined) && (txtbox != null) && (txtbox.value.trim().length > 0)) {

                    if (recipient.length == 0) {

                        recipient = txtbox.value.trim();

                    } else {

                        recipient = recipient.trim();

                        if (recipient.charAt(recipient.length - 1) == ';') {

                            recipient += txtbox.value.trim();

                        } else {

                            recipient += ';' + txtbox.value.trim();
                        }
                    }
                }

                var destination = recipient.trim();

                response = SendActionButtonEmail(securityRequestId, buttonId, useBusinessRules, destination, comments, enquiryResponse);
            }
        }

        response = ((response == null) || (response.length == 0)) ? '' : response.trim()

        if ((response == null) || (response.length == 0)) {

            /*
            *   The email has been successfully dispatched to the email recipients.
            */

            hidden = getActionControl('enquiryResponse');

            if ((hidden !== undefined) && (hidden != null)) {

                hidden.value = '';
            }

        } else {

            hidden = getActionControl('enquiryResponse');

            var enquiryResponse = (requestor.length == 0) ? '' : (requestor == 'ActionMenu') ? (((hidden === undefined) || (hidden == null)) ? '' : hidden.value) : '';

            if ((hidden !== undefined) && (hidden != null)) {

                hidden.value = '';
            }

            if (response == 'The email recipients or the email requestor was not provided.') {

                alert(response);

            } else {

                /*
                *  We have encountered a send email problem, usually due to security access permissions with the MS Mail Exchange.
                *  We will use the local browser facility to create a representative SMTP client object.
                */

                var message = CreateActiveXObject('CDO.Message');

                var configuration = CreateActiveXObject('CDO.Configuration');

                hidden = getActionControl('emailServer');

                var emailServer = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

                if ((message != null) && (configuration != null) && (emailServer.length > 0)) {

                    var correspondence = null;

                    if (typeof (SendInternalEmail) == 'function') {

                        var component = SendInternalEmail(securityRequestId, buttonId, comments, enquiryResponse);

                        if ((component != null) && (component.length > 0)) {

                            try {

                                correspondence = JSON.parse(component);

                            } catch (err) {

                                correspondence = null;
                            }

                        }
                    }

                    if (correspondence != null) {

                        try {

                            if (typeof (configuration.Fields) == 'function') {

                                configuration.Fields('http://schemas.microsoft.com/cdo/configuration/sendusing') = 2;
                                configuration.Fields('http://schemas.microsoft.com/cdo/configuration/smptserver') = emailServer;
                                configuration.Fields('http://schemas.microsoft.com/cdo/configuration/smptserverport') = 25;
                                configuration.Fields('http://schemas.microsoft.com/cdo/configuration/smptauthenticate') = 1;
                                configuration.Fields.Update();
                            }

                            message.Configuration = configuration;
                            message.From = correspondence.From;

                            message.Subject = internalMail.Subject;
                            message.HTMLBody = internalMail.HTMLBody;

                            var mailbox = '';

                            var recipients = null;

                            if (typeof (GetRegisteredEmailAccounts) == 'function') {

                                mailbox = GetRegisteredEmailAccounts(securityRequestId);
                            }

                            if ((mailbox != undefined) && (mailbox != null) && (mailbox.length > 0)) {

                                try {

                                    recipients = JSON.parse(mailbox.trim());

                                } catch (err) {

                                    recipients = null;
                                }
                            }

                            if ((recipients != null) && (recipients.length > 0)) {

                                for (var index = 0; index < recipients.length; ++index) {

                                    var recipient = recipients[index];

                                    try {

                                        if (recipient != null) {

                                            message.To = recipient.To;

                                            message.CC = recipient.CC;

                                            message.Send();

                                        }

                                    } catch (err) {

                                    }
                                }

                            }

                        } catch (err) {

                        }
                    }
                }
            }
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Control: Accept  Email Service Provider Button. Event: Click. Error: ' + err.description);
    }

    OnCancelEmailServiceProvider(null);

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Cancels the end-user request to dispatch the security request based email
*   to the nominated recipients.
*
*   The security request will remain on the current stage / status upon caancellation.
*/
function OnCancelEmailServiceProvider(button) {

    try {

        dlg = dlgEmailServiceProvider;

        dlg = ((dlg === undefined) || (dlg == null)) ? getActionControl('dlgEmailServiceProvider') : dlg;

        if ((dlg !== undefined) && (dlg != null)) {

            if (typeof (dlg.Close) == 'function') {

                dlg.Close();
            }
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Control: Cancel Button for Email Dialog. Event: Click. Error: ' + err.description);
    }
}

/*
*   The end-user has entered an optional reason to cancel the complete security request entry.
*   The current security request will have a status of Cancelled.
*/
function OnAcceptProvideReasonsForCancelRequest(button) {

    var txtBox = getActionControl('txtProvideReasonsForCancelRequest');

    var reason = '';

    if ((txtBox !== undefined) && (txtBox != null)) {

        reason = txtBox.value.trim();
    }

    /*
    *   Close the popup modal dialog
    */
    OnCancelProvideReasonsForCancelRequest(button);

    // Display the progress popup dialog

    var dlg = ((dPopupLoading === undefined) || (dPopupLoading == null)) ? getActionControl('dPopupLoading') : dPopupLoading;

    if ((dlg !== null) && (dlg != null)) {

        if (typeof (dlg.Show) == 'function') {

            dlg.Show();
        }
    }

    var hidden = getActionControl('hdnSecurityRequestId');

    var securityRequestId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    var result = 'The ComponentArt AJAX callback function [ProcessActionButton] was not declared.';

    if (typeof (ProcessActionButton) == 'function') {

        result = ProcessActionButton(securityRequestId, 'CancelRequest', reason);
    }

    if (result == '') {

        location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + securityRequestId;

    } else {

        if ((dlg !== undefined) && (dlg != null)) {

            if (typeof(dlg.Close) == 'function') {

                dlg.Close();
            }
        }

        OpenSaveErrorDialog(result);
    }

}

/*
*   The end-user has cancelled the button action event to Cancel.
*/
function OnCancelProvideReasonsForCancelRequest(button) {

    var dlg = dlgProvideReasonsForCancelRequest;

    dlg = ((dlg === undefined) || (dlg == null)) ? getActionControl('dlgProvideReasonsForCancelRequest') : dlg;

    try {

        dlg.Close();

    } catch (err) {

        alert(ActionScriptFileName + '. Control: Cancel Button for Provide Reasons For Cancel Request. Event: Click. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   The end-user has entered an optional reason to unassign his/her assigned security request entry.
*   The current security request will have a status of Unassigned.
*/
function OnAcceptProvideReasonsForUnassignRequest(button) {

    var txtBox = getActionControl('txtProvideReasonsForUnassignRequest');

    var reason = '';

    if ((txtBox !== undefined) && (txtBox != null)) {

        reason = txtBox.value.trim();
    }

    /*
    *   Close the popup modal dialog
    */
    OnCancelProvideReasonsForUnassignRequest(button);

    // Display the progress popup dialog

    var dlg = ((dPopupLoading === undefined) || (dPopupLoading == null)) ? getActionControl('dPopupLoading') : dPopupLoading;

    if ((dlg !== null) && (dlg != null)) {

        if (typeof (dlg.Show) == 'function') {

            dlg.Show();
        }
    }

    var hidden = getActionControl('hdnSecurityRequestId');

    var securityRequestId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    var result = 'The ComponentArt AJAX callback function [ProcessActionButton] was not declared.';

    if (typeof (ProcessActionButton) == 'function') {

        result = ProcessActionButton(securityRequestId, 'UnassignRequest', reason);
    }

    if (result == '') {

        location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + securityRequestId;

    } else {

        if ((dlg !== undefined) && (dlg != null)) {

            if (typeof(dlg.Close) == 'function') {

                dlg.Close();
            }
        }

        OpenSaveErrorDialog(result);
    }

}

/*
*   The end-user has cancelled the button action event to UnassignRequest.
*/
function OnCancelProvideReasonsForUnassignRequest(button) {

    var dlg = dlgProvideReasonsForUnassignRequest;

    dlg = ((dlg === undefined) || (dlg == null)) ? getActionControl('dlgProvideReasonsForUnassignRequest') : dlg;

    try {

        dlg.Close();

    } catch (err) {

        alert(ActionScriptFileName + '. Control: Cancel Button for Provide Reasons For Unassign Request. Event: Click. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Handles the event for the selection change within the drop-down list for the email recipient.
*/
function OnChangeEmailRecipient(ddl) {

    var ddlEmailRecipientsTo = ((ddl === undefined) || (ddl == null)) ? getActionControl('ddlEmailRecipientsTo') : ddl;

    //TODO:

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Initializes the appearance of the close request popup dialog.
*/
function OnShowCloseRequestAccount(dlg) {

    try {

        var callerId = 'ctl00_MainContent_cbdlgCloseRequestAccount';

        var caller = eval(callerId);

        if ((caller !== undefined) && (caller != null)) {

            if (typeof (caller.Callback) == 'function') {

                caller.Callback();

            } else if (typeof (caller.control.Callback) == 'function') {

                caller.control.Callback();
            }

        }

    } catch (err) {

        alert(ActionScriptFileName + '. Control: Close Request Account Dialog. Event: OnShow. Error: ' + err.description);

    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Initializes the appearance of the email service provider popup dialog.
*/
function OnShowEmailServiceProvider(dlg) {

    var viewProgressDlg = null;

    try {

        viewProgressDlg = ((dPopupLoading === undefined) || (dPopupLoading == null)) ? getActionControl('dPopupLoading') : dPopupLoading;

        if ((viewProgressDlg !== null) && (viewProgressDlg != null)) {

            if (typeof (viewProgressDlg.Show) == 'function') {

                viewProgressDlg.Show();
            }
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Control: In Progress Dialog. Event: OnShow. Error: ' + err.description);
    }

    try {

        var hidden = getActionControl('contentForEmail');

        var emailRequestor = getActionControl('emailRequestor');

        var requestor = ((emailRequestor === undefined) || (emailRequestor == null)) ? '' : emailRequestor.value;

        var callerId = 'ctl00_MainContent_cbdlgEmailServiceProvider';

        var caller = eval(callerId);

        if ((caller !== undefined) && (caller != null)) {

            if (requestor == 'ActionMenu') {

                // hide the email recipient drop-down list

                var row = getActionControl('trEmailRecipientsTo');

                if ((row !== undefined) && (row != null)) {

                    //row.style.display = 'none';

                    /*
                    *   Date: 25 August 2014.
                    *   Amender: Paul Djimritsch (.NET contractor)
                    *   Comments:
                    *   The business unit was frustated with the provided business rules and decided that they desired to 
                    *   be provided with flexilibity with the choices of email recipients.
                    */

                    row.style.display = 'block';
                }

                var nextRow = getActionControl('trSendTo');

                if ((nextRow !== undefined) && (nextRow != null)) {

                    /*
                    *   Date: 25 August 2014.
                    *   Amender: Paul Djimritsch (.NET contractor)
                    *   Comments:
                    *   The business unit was frustated with the provided business rules and decided that they desired to 
                    *   be provided with flexilibity with the choices of email recipients.
                    */

                    nextRow.style.display = 'block';
                }

                var divider = getActionControl('trRowDivider');

                if ((divider !== undefined) && (divider != null)) {

                    //divider.style.display = 'none';

                    /*
                    *   Date: 25 August 2014.
                    *   Amender: Paul Djimritsch (.NET contractor)
                    *   Comments:
                    *   The business unit was frustated with the provided business rules and decided that they desired to 
                    *   be provided with flexilibity with the choices of email recipients.
                    */

                    divider.style.display = 'block';
                }

            } else if (requestor == 'Respondee') {

                // hide the email recipient drop-down list

                var row = getActionControl('trEmailRecipientsTo');

                if ((row !== undefined) && (row != null)) {

                    row.style.display = 'block';
                }

                var nextRow = getActionControl('trSendTo');

                if ((nextRow !== undefined) && (nextRow != null)) {

                    /*
                    *   Date: 25 August 2014.
                    *   Amender: Paul Djimritsch (.NET contractor)
                    *   Comments:
                    *   The business unit was frustated with the provided business rules and decided that they desired to 
                    *   be provided with flexilibity with the choices of email recipients.
                    */

                    nextRow.style.display = 'block';
                }

                var divider = getActionControl('trRowDivider');

                if ((divider !== undefined) && (divider != null)) {

                    divider.style.display = 'block';
                }
            }

            if (typeof (caller.Callback) == 'function') {

                if ((hidden === undefined) || (hidden == null) || (hidden.value == null)) {

                    caller.Callback(requestor);

                } else {

                    if (requestor == 'Respondee') {

                        caller.Callback(requestor, hidden.value);

                    } else {

                        caller.Callback(requestor);
                    }
                }

            } else if ((caller.control !== undefined) && (caller.control != null) && (typeof (caller.control.Callback) == 'function')) {

                if ((hidden === undefined) || (hidden == null) || (hidden.value == null)) {

                    caller.control.Callback(requestor);

                } else {

                    if (requestor == 'Respondee') {

                        caller.control.Callback(requestor, hidden.value);

                    } else {

                        caller.control.Callback(requestor);
                    }
                }
            }
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Control: Email Service Provider Dialog. Event: OnShow. Error: ' + err.description);

    }

    try {

        if ((viewProgressDlg !== undefined) && (viewProgressDlg != null)) {

            if (typeof (viewProgressDlg.Close) == 'function') {

                viewProgressDlg.Close();
            }
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Control: In Progress Dialog. Event: OnShow. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Closes the email service provider popup dialog and conditionally
*   processes the button click if the email dialog was the only dialog
*   that was displayed to the end-user.
*/
function OnCloseEmailServiceProvider(dlg) {

    var canPublishDocuments = getActionControl('canprintDocuments');

    if ((canPublishDocuments !== undefined) && (canPublishDocuments != null)) {

        if (document.getElementById('canprintDocuments').value == 'false') {

            var attribute = getActionAttributes();

            var hidden = getActionControl('triggeredButton');

            var button = null;

            if ((hidden !== undefined) && (hidden != null) && (hidden.value.length > 0)) {

                button = getActionControl(hidden.value.trim());
            }

            if ((attribute !== undefined) && (attribute != null) && (button !== undefined) && (button != null)) {

                if (typeof (OnProcessActionFromDialog) == 'function') {

                    OnProcessActionFromDialog(attribute, button);
                }
            }

        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Generates the appropriate activity from the clicked button
*/
function OnProcessAction(securityRequestId, button) {

    var response = '';

    if ((securityRequestId === undefined) || (securityRequestId == null)) {

        return response;
    }

    if ((button === undefined) || (button == null)) {

        return response;
    }

    var hidden = getActionControl('triggeredButton');

    if ((hidden !== undefined) && (hidden != null)) {

        hidden.value = button.id;
    }

    if (typeof (ProcessActionButton) == 'function') {

        response = ProcessActionButton(securityRequestId, button.id, '');
    }

    return response;
}

/*
*   Processes the button click event when the modal email dialog has been closed.
*/
function OnProcessActionFromDialog(attribute, button) {

    if ((attribute === undefined) || (attribute == null)) {

        return false;
    }

    if ((button === undefined) || (button == null)) {

        return false;
    }

    var dlg = ((dPopupLoading === undefined) || (dPopupLoading == null)) ? getActionControl('dPopupLoading') : dPopupLoading;

    if (typeof (OnProcessAction) == 'function') {

        var response = OnProcessAction(attribute.securityRequestId, button);

        if (response == '') {

            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

        } else {

            if ((dlg !== undefined) && (dlg != null)) {

                if (typeof (dlg.Close) == 'function') {

                    dlg.Close();
                }
            }

            OpenSaveErrorDialog(response);
        }
    }

    return false;
}

/*
*   Processes <Action Button> click event.
*/
function processActionMenuClick(button) {

    if ((button === undefined) || (button == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    var attributes = getActionAttributes();

    var hidden = null;

    hidden = getActionControl('triggeredButton');

    if ((hidden !== undefined) && (hidden != null) && (button !== undefined) && (button != null)) {

        hidden.value = button.id;
    }

    if (button.id == "SaveRequest") {

        var errMsg = '';

        var errMsgDetailsTab = (typeof (SaveDetailsTab) === 'function') ? SaveDetailsTab() : '';
        if (errMsgDetailsTab != '') {
            errMsg += '<b>Details Tab</b>:<ul>' + errMsgDetailsTab + '</ul>';
        }

        var errMsgAccountTab = (typeof (SaveAccountTab) === 'function') ? SaveAccountTab() : '';
        if (errMsgAccountTab != '') {
            errMsg += '<b>Account Tab</b>:<ul>' + errMsgAccountTab + '</ul>';
        }

        var errMsgRespondeeTab = (typeof (SaveRespondeeDetailsTab) === 'function') ? SaveRespondeeDetailsTab() : '';
        if (errMsgRespondeeTab != '') {
            errMsg += '<b>Respondee Tab</b>:<ul>' + errMsgRespondeeTab + '</ul>';
        }

        if ((attributes !== undefined) && (attributes != null) && (attributes.securityRequestTypeId != '2')) {

            var errMsgRedemptionTab = (typeof (SaveRedemptionTab) === 'function') ? SaveRedemptionTab() : '';
            if (errMsgRedemptionTab != '') {
                errMsg += '<b>Redemption Tab</b>:<ul>' + errMsgRedemptionTab + '</ul>';
            }
        }

        var errMsgSettlementTab = (typeof (SaveSettlementDetailsTab) === 'function') ? SaveSettlementDetailsTab() : '';
        if (errMsgSettlementTab != '') {
            errMsg += '<b>Settlement Tab</b>:<ul>' + errMsgSettlementTab + '</ul>';
        }

        if (errMsg == '') {

            alert("Changes saved to DB successfully");

            refreshHistoryTab();

        } else {

            if (typeof (OpenSaveErrorDialog) == 'function') {
                OpenSaveErrorDialog(errMsg.replace('##ERROR##', ''));
            }

            if (typeof (stopEventBubbling) == 'function') {

                stopEventBubbling(window.event);
            }

            return false;
        }

    } else if (button.id == 'CancelRequest') {

        if ((dlgProvideReasonsForCancelRequest !== undefined) && (dlgProvideReasonsForCancelRequest != null)) {

            if (typeof (dlgProvideReasonsForCancelRequest.Show) == 'function') {

                dlgProvideReasonsForCancelRequest.Show();
            }

            /*
            * Refer to javascript function OnAcceptProvideReasonsForCancelRequest / OnCancelProvideReasonsForCancelRequest
            * for end-user decision to continue or cancel the clicked button event.
            *
            */

        } else {

            var dlg = getActionControl('dlgProvideReasonsForCancelRequest');

            if ((dlg !== undefined) && (dlg != null)) {

                if (typeof (dlg.Show) == 'function') {

                    dlg.Show();
                }

                /*
                * Refer to javascript function OnAcceptProvideReasonsForUnassignRequest / OnCancelProvideReasonsForUnassignRequest
                * for end-user decision to continue or cancel the clicked button event.
                *
                */
            }
        }

    } else if (button.id == 'UnassignRequest') {

        if ((dlgProvideReasonsForUnassignRequest !== undefined) && (dlgProvideReasonsForUnassignRequest != null)) {

            if (typeof (dlgProvideReasonsForUnassignRequest.Show) == 'function') {

                dlgProvideReasonsForUnassignRequest.Show();

            }

            /*
            * Refer to javascript function OnAcceptProvideReasonsForUnassignRequest / OnCancelProvideReasonsForUnassignRequest
            * for end-user decision to continue or cancel the clicked button event.
            */

        } else {

            var dlg = getActionControl('dlgProvideReasonsForUnassignRequest');

            if ((dlg !== undefined) && (dlg != null)) {

                if (typeof (dlg.Show) == 'function') {

                    dlg.Show();
                }

                /*
                * Refer to javascript function OnAcceptProvideReasonsForUnassignRequest / OnCancelProvideReasonsForUnassignRequest
                * for end-user decision to continue or cancel the clicked button event.
                */
            }
        }
    } else if (button.id == "AddNote") {
        
        if (typeof (showAddNotePopup) == 'function') {

            showAddNotePopup();
        }

    } else {

        var dlg = ((dPopupLoading === undefined) || (dPopupLoading == null)) ? getActionControl('dPopupLoading') : dPopupLoading;
        
        if ((dlg !== null) && (dlg != null)) {

            if (typeof (dlg.Show) == 'function') {

                dlg.Show();
            }
        }
        
        var attribute = getActionAttributes();

        if (button.id == 'SubmitBusinessSolsApproval') {

            if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '1' /* Mortgage - Full Discharge */)) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    // TODO: VALIDATE DETAILS AND RESPONDEE
                    var detailsTabValidationResult = ValidateDetailsTabForApproval(attribute.securityRequestId, button.id);
                    if (detailsTabValidationResult != '') {

                        OpenSaveErrorDialog(detailsTabValidationResult);

                        if ((dlg !== undefined) && (dlg != null)) {

                            if (typeof (dlg.Close) == 'function') {

                                dlg.Close();
                            }
                        }

                        return false;
                    }

                    var respondeeValidation = "<b>Respondee Details Tab</b>:<ul>";
                    if (IsRespondeeDetailsTabValid() != '') {
                        OpenSaveErrorDialog(respondeeValidation + IsRespondeeDetailsTabValid() + '</ul>');

                        if ((dlg !== undefined) && (dlg != null)) {

                            if (typeof (dlg.Close) == 'function') {

                                dlg.Close();
                            }
                        }

                        return false;
                    }

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }
                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '2' /* Withdrawal of Caveat */)) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '3' /* Redeemed - Congrats */)) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '4' /* Redeemed - Caveat */)) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }

                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }
                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '5' /* Partial Discharge */)) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }

                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else if (attribute.securityRequestTypeId == '2' /* Consent */) {

                var detailsTabValidationResult = ValidateDetailsTabForApproval(attribute.securityRequestId, button.id);
                if (detailsTabValidationResult != '') {

                    OpenSaveErrorDialog(detailsTabValidationResult);

                    if ((dlg !== undefined) && (dlg != null)) {

                        if (typeof (dlg.Close) == 'function') {

                            dlg.Close();
                        }
                    }

                    return false;
                }

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else {

                if (typeof (OnProcessAction) == 'function') {

                    var response = OnProcessAction(attribute.securityRequestId, button);

                    if (response == '') {

                        location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                    } else {

                        if ((dlg !== undefined) && (dlg != null)) {

                            if (typeof (dlg.Close) == 'function') {

                                dlg.Close();
                            }
                        }

                        // check for supervisor approval assignment error
                        if (response.indexOf('Cannot authorise a request that is owned by yourself') >= 0) {
                            response = 'Cannot authorise a request that is owned by yourself';
                        }

                        OpenSaveErrorDialog(response);
                    }
                }

            }

        } else if (button.id == 'SubmitCreditAnalysisApproval') {

            if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '5' /* Partial Discharge */)) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else {

                if (typeof (OnProcessAction) == 'function') {

                    var response = OnProcessAction(attribute.securityRequestId, button);

                    if (response == '') {

                        location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                    } else {

                        if ((dlg !== undefined) && (dlg != null)) {

                            if (typeof (dlg.Close) == 'function') {

                                dlg.Close();
                            }
                        }

                        OpenSaveErrorDialog(response);
                    }
                }

            }

        } else if (button.id == 'AdditionalInfoRequired') {

            if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '1' /* Mortgage - Full Discharge */)) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (IsCommercialLoan) == 'function') {

                        var isCommercialVenture = IsCommercialLoan(attribute.securityRequestId);

                        if (isCommercialVenture == 'False') {

                            if (typeof (displayPublicationDialogs) == 'function') {

                                displayPublicationDialogs(attribute, button, dlg);

                            } else {

                                if (typeof (OnProcessAction) == 'function') {

                                    var response = OnProcessAction(attribute.securityRequestId, button);

                                    if (response == '') {

                                        location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                                    } else {

                                        if ((dlg !== undefined) && (dlg != null)) {

                                            if (typeof (dlg.Close) == 'function') {

                                                dlg.Close();
                                            }
                                        }

                                        OpenSaveErrorDialog(response);
                                    }
                                }
                            }

                        } else {

                            if (typeof (OnProcessAction) == 'function') {

                                var response = OnProcessAction(attribute.securityRequestId, button);

                                if (response == '') {

                                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                                } else {

                                    if ((dlg !== undefined) && (dlg != null)) {

                                        if (typeof (dlg.Close) == 'function') {

                                            dlg.Close();
                                        }
                                    }

                                    OpenSaveErrorDialog(response);
                                }
                            }
                        }

                    } else /* Cannot find the ComponentArt AJAX callback method IsCommercialLoan */ {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            // check for supervisor approval assignment error
                            if (response.indexOf('Cannot authorise a request that is owned by yourself') >= 0) {
                                response = 'Cannot authorise a request that is owned by yourself';
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }
                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '5' /* Mortgage - Partial Discharge */)) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (IsCommercialLoan) == 'function') {

                        var isCommercialVenture = IsCommercialLoan(attribute.securityRequestId);

                        if (isCommercialVenture == 'False') {

                            if (typeof (displayPublicationDialogs) == 'function') {

                                displayPublicationDialogs(attribute, button, dlg);

                            } else {

                                if (typeof (OnProcessAction) == 'function') {

                                    var response = OnProcessAction(attribute.securityRequestId, button);

                                    if (response == '') {

                                        location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                                    } else {

                                        if ((dlg !== undefined) && (dlg != null)) {

                                            if (typeof (dlg.Close) == 'function') {

                                                dlg.Close();
                                            }
                                        }

                                        OpenSaveErrorDialog(response);
                                    }
                                }
                            }

                        } else {

                            if (typeof (OnProcessAction) == 'function') {

                                var response = OnProcessAction(attribute.securityRequestId, button);

                                if (response == '') {

                                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                                } else {

                                    if ((dlg !== undefined) && (dlg != null)) {

                                        if (typeof (dlg.Close) == 'function') {

                                            dlg.Close();
                                        }
                                    }

                                    OpenSaveErrorDialog(response);
                                }
                            }
                        }

                    } else /* Cannot find the ComponentArt AJAX callback method IsCommercialLoan */ {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }

                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            // check for supervisor approval assignment error
                            if (response.indexOf('Cannot authorise a request that is owned by yourself') >= 0) {
                                response = 'Cannot authorise a request that is owned by yourself';
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }
                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && 
                ((attribute.securityRequestSubTypeId == '3' /* Mortgage - Redemptions (Congrats) */) || (attribute.securityRequestSubTypeId == '4' /* Mortgage - Redemptions (Caveat) */))) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (IsCommercialLoan) == 'function') {

                        var isCommercialVenture = IsCommercialLoan(attribute.securityRequestId);

                        if (isCommercialVenture == 'False') {

                            if (typeof (displayPublicationDialogs) == 'function') {

                                displayPublicationDialogs(attribute, button, dlg);

                            } else {

                                if (typeof (OnProcessAction) == 'function') {

                                    var response = OnProcessAction(attribute.securityRequestId, button);

                                    if (response == '') {

                                        location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                                    } else {

                                        if ((dlg !== undefined) && (dlg != null)) {

                                            if (typeof (dlg.Close) == 'function') {

                                                dlg.Close();
                                            }
                                        }

                                        OpenSaveErrorDialog(response);
                                    }
                                }
                            }

                        } else {

                            if (typeof (OnProcessAction) == 'function') {

                                var response = OnProcessAction(attribute.securityRequestId, button);

                                if (response == '') {

                                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                                } else {

                                    if ((dlg !== undefined) && (dlg != null)) {

                                        if (typeof (dlg.Close) == 'function') {

                                            dlg.Close();
                                        }
                                    }

                                    OpenSaveErrorDialog(response);
                                }
                            }
                        }

                    } else /* Cannot find the ComponentArt AJAX callback method IsCommericalLoan */ {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            // check for supervisor approval assignment error
                            if (response.indexOf('Cannot authorise a request that is owned by yourself') >= 0) {
                                response = 'Cannot authorise a request that is owned by yourself';
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }
                }

            } else if (attribute.securityRequestTypeId == '2' /* Consent category */) {

                if ((attribute.securityRequestStageId == '1' /* Create / Edit */) && (attribute.securityRequestStatusId == '1' /* Request started */)) {

                    if (typeof (IsCommercialLoan) == 'function') {

                        var isCommercialVenture = IsCommercialLoan(attribute.securityRequestId);

                        if (isCommercialVenture == 'False') {

                            if (typeof (displayPublicationDialogs) == 'function') {

                                displayPublicationDialogs(attribute, button, dlg);

                            } else {

                                if (typeof (OnProcessAction) == 'function') {

                                    var response = OnProcessAction(attribute.securityRequestId, button);

                                    if (response == '') {

                                        location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                                    } else {

                                        if ((dlg !== undefined) && (dlg != null)) {

                                            if (typeof (dlg.Close) == 'function') {

                                                dlg.Close();
                                            }
                                        }

                                        OpenSaveErrorDialog(response);
                                    }
                                }
                            }

                        } else {

                            if (typeof (OnProcessAction) == 'function') {

                                var response = OnProcessAction(attribute.securityRequestId, button);

                                if (response == '') {

                                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                                } else {

                                    if ((dlg !== undefined) && (dlg != null)) {

                                        if (typeof (dlg.Close) == 'function') {

                                            dlg.Close();
                                        }
                                    }

                                    OpenSaveErrorDialog(response);
                                }
                            }
                        }

                    } else /* Cannot find the CompnoentArt AJAX callback method IsCommercialLoan */ {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            // check for supervisor approval assignment error
                            if (response.indexOf('Cannot authorise a request that is owned by yourself') >= 0) {
                                response = 'Cannot authorise a request that is owned by yourself';
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }
                }

            }

        } else if (button.id == 'ConfirmRedemptions' /* Redemptions Confirmed */) {

            if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '1' /* Mortgage - Full Discharge */)) {

                if ((attribute.securityRequestStageId == '2' /* Settlement Booking */) && (attribute.securityRequestStatusId == '13' /* Redemptions Confirmed */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '2' /* Withdrawal of Caveat */)) {

                if ((attribute.securityRequestStageId == '2' /* Settlement Booking */) && (attribute.securityRequestStatusId == '13' /* Redemptions Confirmed */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '3' /* Redeemed - Congrats */)) {

                if ((attribute.securityRequestStageId == '2' /* Settlement Booking */) && (attribute.securityRequestStatusId == '13' /* Redemptions Confirmed */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '4' /* Redeemed - Caveat */)) {

                if ((attribute.securityRequestStageId == '2' /* Settlement Booking */) && (attribute.securityRequestStatusId == '13' /* Redemptions Confirmed */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '5' /* Partial Discharge */)) {

                if ((attribute.securityRequestStageId == '2' /* Settlement Booking */) && (attribute.securityRequestStatusId == '13' /* Redemptions Confirmed */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }
                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }
                }

            } else if (attribute.securityRequestTypeId == '2' /* Consent */) {

                if ((attribute.securityRequestStageId == '2' /* Settlement Booking */) && (attribute.securityRequestStatusId == '13' /* Redemptions Confirmed */)) {

                    if (typeof (displayPublicationDialogs) == 'function') {

                        displayPublicationDialogs(attribute, button, dlg);

                    } else {

                        if (typeof (OnProcessAction) == 'function') {

                            var response = OnProcessAction(attribute.securityRequestId, button);

                            if (response == '') {

                                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                            } else {

                                if ((dlg !== undefined) && (dlg != null)) {

                                    if (typeof (dlg.Close) == 'function') {

                                        dlg.Close();
                                    }
                                }

                                OpenSaveErrorDialog(response);
                            }
                        }

                    }

                } else {

                    if (typeof (OnProcessAction) == 'function') {

                        var response = OnProcessAction(attribute.securityRequestId, button);

                        if (response == '') {

                            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                        } else {

                            if ((dlg !== undefined) && (dlg != null)) {

                                if (typeof (dlg.Close) == 'function') {

                                    dlg.Close();
                                }
                            }

                            OpenSaveErrorDialog(response);
                        }
                    }

                }

            } else {

                if (typeof (OnProcessAction) == 'function') {

                    var response = OnProcessAction(attribute.securityRequestId, button);

                    if (response == '') {

                        location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                    } else {

                        if ((dlg !== undefined) && (dlg != null)) {

                            if (typeof (dlg.Close) == 'function') {

                                dlg.Close();
                            }
                        }

                        OpenSaveErrorDialog(response);
                    }
                }

            }

        } else if (button.id == 'ApproveRequest') {

            // Display popup window for Authorisation

            if ((dlg !== undefined) && (dlg != null)) {

                if (typeof (dlg.Close) == 'function') {

                    dlg.Close();
                }
            }

            if (typeof (displayAuthoriseRequestDialog) == 'function') {

                getActionControl('triggeredButton').value = button.id;

                displayAuthoriseRequestDialog();
            }

        } else if (button.id == 'DeclineRequest') {

            // reserve the button identifier within the hidden field
            getActionControl('triggeredButton').value = button.id;

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    if ((dlg !== undefined) && (dlg != null)) {

                        if (typeof (dlg.Close) == 'function') {

                            dlg.Close(); // closes the Loading popup dialog
                        }
                    }

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    if ((dlg !== undefined) && (dlg != null)) {

                        if (typeof (dlg.Close) == 'function') {

                            dlg.Close(); // closes the Loading popup dialog
                        }
                    }

                    OpenSaveErrorDialog(response);

                    if (typeof (stopEventBubbling) == 'function') {

                        stopEventBubbling(window.event);
                    }

                    return false;
                }

            }

        } else if (button.id == 'SettlementBooked') {

            // Save settlement tab
            var saveResult = SaveSettlementDetailsTab();
            if (saveResult != '') {
                OpenSaveErrorDialog('<b>Settlement Tab</b>:<ul>' + saveResult + '</ul>');

                if ((dlg !== undefined) && (dlg != null)) {

                    if (typeof (dlg.Close) == 'function') {

                        dlg.Close();
                    }
                }

                return false;
            }

            var settlementTabValidationResult = ValidateSettlementTabForBooking(attribute.securityRequestId, button.id);
            if (settlementTabValidationResult != '') {

                OpenSaveErrorDialog('<b>Settlement Tab</b>:<ul>' + settlementTabValidationResult + '</ul>');

                if ((dlg !== undefined) && (dlg != null)) {

                    if (typeof (dlg.Close) == 'function') {

                        dlg.Close();
                    }
                }

                return false;
            }

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    if ((dlg !== undefined) && (dlg != null)) {

                        if (typeof (dlg.Close) == 'function') {

                            dlg.Close();
                        }
                    }

                    OpenSaveErrorDialog(response);

                    if (typeof (stopEventBubbling) == 'function') {

                        stopEventBubbling(window.event);
                    }

                    return false;
                }
            }

        } else if (button.id == "SettleRequest") {

            var validateRedemptions = ValidateRedemptions(attribute.securityRequestId);
            if (validateRedemptions != '') {

                OpenSaveErrorDialog(validateRedemptions);

                if ((dlg !== undefined) && (dlg != null)) {

                    if (typeof (dlg.Close) == 'function') {

                        dlg.Close();
                    }
                }

                return false;
            }

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    if ((dlg !== undefined) && (dlg != null)) {

                        if (typeof (dlg.Close) == 'function') {

                            dlg.Close();
                        }
                    }

                    OpenSaveErrorDialog(response);

                    if (typeof (stopEventBubbling) == 'function') {

                        stopEventBubbling(window.event);
                    }

                    return false;
                }
            }

        } else if ((button.id == 'CloseRequest') && (0 == 0 /* Trigger: Close Request and checklist item selected "Do you neeed to write off or force close and account */)) {

            // Trigger: Close Request and checklist item selected "Do you need to write off or force close and account

            if ((dlg !== undefined) && (dlg != null)) {

                if (typeof (dlg.Close) == 'function') {

                    dlg.Close();
                }
            }

            if (typeof (displayCloseRequestDialog) == 'function') {
                getActionControl('triggeredButton').value = button.id;
                displayCloseRequestDialog();
            }

        } else {

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    if ((dlg !== undefined) && (dlg != null)) {

                        if (typeof (dlg.Close) == 'function') {

                            dlg.Close();
                        }
                    }

                    // check for supervisor approval assignment error
                    if (response.indexOf('Cannot authorise a request that is owned by yourself') >= 0) {
                        response = 'Cannot authorise a request that is owned by yourself';
                    }

                    OpenSaveErrorDialog(response);
                }
            }

        }

    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Functions
*/

/*
*   Displays validation error messages
*/
function alertActionValidationMessage(title, msgs) {

    var alertString = ((title !== undefined) && (title != null)) ? title + '\n' : '';

    if ((msgs !== undefined) && (msgs != null) && (msgs.length > 0 /* JS array */)) {

        for (var i = 0; i < msgs.length; i++) {

            alertString += " - " + msgs[i] + "\n";
        }
    }

    alert(alertString);
}

/*
*  Removes the inherent children within the panel container.
*/
function clearPanel(pnl) {

    if ((pnl === undefined) || (pnl == null)) {

        return;
    }

    var child = pnl.firstChild;

    while (child) {

        pnl.removeChild(child);

        child = pnl.firstChild;
    }

}

/*
*   Verifies whether there are documents to publish for the security request identity.
*/
function canPrintSecurityRequestDocuments(attribute) {

    var response = false;

    if ((attribute === undefined) || (attribute == null)) {

        return response;
    }

    if ((attribute.securityRequestId === undefined) || (attribute.securityRequestId == null)) {

        return response;
    }

    if (attribute.securityRequestId.length == 0) {

        return response;
    }

    if (typeof (CanPrintSecurityRequestDocuments) == 'function') {

        response = (CanPrintSecurityRequestDocuments(attribute.securityRequestId) == 'True' ? true : false);
    }

    return response;
}

/*
*   Creates the COM+ activator from the local browser (navigator) using
*   the specified program identifier for the COM+ object.
*/
function CreateActiveXObject(programId) {

    var activator = null;

    if ((programId === undefined) || (programId == null)) {

        return activator;

    } else if (!(typeof (programId) == 'string')) {

        return activator;
    }

    programId = programId.trim();

    try {

        activator = new ActiveXObject(programId);

    } catch (err) {

        activator = null;

    }

    return activator;
}

/*
*   Dispalys the ComponentArt poup dialog for the 
*   close security request account initiative.
*/
function displayAuthoriseRequestDialog() {

    var dlg = null;

    try {

        dlg = dAuthoriseRequest;

        dlg = ((dlg === undefined) || (dlg == null)) ? getActionControl('dAuthoriseRequest') : dlg;

    } catch (err) {

        dlg = null;
    }

    if (dlg == null) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    try {

        if (typeof (dlg.Show) == 'function') {

            dlg.Show();

        } else if ((dlg.control !== undefined) && (dlg.control != null) && (typeof (dlg.control.Show) == 'function')) {

            dlg.control.Show();
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Function. dAuthoriseRequest. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Dispalys the ComponentArt poup dialog for the 
*   close security request account initiative.
*/
function displayCloseRequestDialog() {

    var dlg = null;

    try {

        dlg = dlgCloseRequestAccount;

        dlg = ((dlg === undefined) || (dlg == null)) ? getActionControl('dlgCloseRequestAccount') : dlg;

    } catch (err) {

        dlg = null;
    }

    if (dlg == null) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    try {

        if (typeof (dlg.Show) == 'function') {

            dlg.Show();

        } else if ((dlg.control !== undefined) && (dlg.control != null) && (typeof (dlg.control.Show) == 'function')) {

            dlg.control.Show();
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Function. displayCloseRequestDialog. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Displays the ComponentArt popup dialog for document generation.
*   This document generation dialog contains <Accept> and <Cancel> document generation buttons.
*
*   For further information on the activity of these buttons, refer to: OnAcceptDocumentGeneration
*   and OnCancelDocumentGeneration javascript function for detailed information
*/
function displayDocumentDialog(requestor, enquiry) {

    var dlg = null;

    try {

        dlg = dlgDocumentGenerator;

        dlg = ((dlg === undefined) || (dlg == null)) ? getActionControl('dlgDocumentGenerator') : dlg;

    } catch (err) {

        dlg = null;
    }

    if (dlg == null) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    try {

        if ((enquiry !== undefined) && (enquiry != null) && (typeof (enquiry) == 'string') && (enquiry.length > 0)) {

            var hidden = getActionControl('documentPrintEnquiry');

            if ((hidden !== undefined) && (hidden != null)) {

                hidden.value = enquiry.trim();
            }
        }

        if (typeof (dlg.Show) == 'function') {

            /*
            *   The dialog will display the the security request documents for selection by the end-user.
            */

            dlg.Show();

        } else if ((dlg.control !== undefined) && (dlg.control != null) && (typeof (dlg.control.Show) == 'function')) {

            /*
            *   The dialog will display the the security request documents for selection by the end-user.
            */

            dlg.control.Show();
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Function. displayDocumentDialog. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Displays the ComponentArt popup dialog for email notifications.
*/
function displayEmailDialog(bodyText, requestor, enquiryResponse) {

    var hidden = null;

    hidden = getActionControl('contentForEmail');

    if ((hidden !== undefined) && (hidden != null)) {

        hidden.value = ((typeof(bodyText) == 'string') && (bodyText !== undefined) && (bodyText != null)) ? bodyText.trim() : '';
    }

    if ((requestor !== undefined) && (requestor != null)) {

        hidden = getActionControl('emailRequestor');

        if ((hidden !== undefined) && (hidden != null) && (typeof (requestor) == 'string')) {

            hidden.value = requestor.trim();
        }

    }

    if ((enquiryResponse !== undefined) && (enquiryResponse != null)) {

        hidden = getActionControl('enquiryResponse');

        if ((hidden !== undefined) && (hidden != null)) {

            hidden.value = JSON.stringify(enquiryResponse);
        }
    }

    var dlg = null;

    try {

        dlg = dlgEmailServiceProvider;

        dlg = ((dlg === undefined) || (dlg == null)) ? getActionControl('dlgEmailServiceProvider') : dlg;

    } catch (err) {

        dlg = null;
    }

    if (dlg == null) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    try {

        if (typeof (dlg.Show) == 'function') {

            dlg.Show();

        } else if ((dlg.control !== undefined) && (dlg.control != null) && (typeof (dlg.control.Show) == 'function')) {

            dlg.control.Show();
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Function. displayEmailDialog. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Displays the email and document generation dialog
*/
function displayPublicationDialogs(attribute, button, dlg) {

    try {

        if ((dlg !== undefined) && (dlg != null)) {

            if (typeof (dlg.Close) == 'function') {

                dlg.Close();
            }
        }

    } catch (err) {

        alert(ActionScriptFileName + '. Function. displayPublicationDialogs. Error: ' + err.description);
    }

    var readyForPublication = (typeof (canPrintSecurityRequestDocuments) == 'function') ? canPrintSecurityRequestDocuments(attribute) : false;

    var hidden = getActionControl('canprintDocuments');

    if ((hidden !== undefined) && (hidden != null)) {

        hidden.value = readyForPublication ? 'true' : 'false';
    }

    hidden = getActionControl('triggeredButton');

    if ((hidden !== undefined) && (hidden != null) && (button !== undefined) && (button != null)) {

        if (hidden.value.length == 0) {

            hidden.value = button.id;

        } else if (hidden.value != button.id) {

            hidden.value = button.id;
        }

    }

    if (readyForPublication == false) {

        if (typeof (displayEmailDialog) == 'function') {

            /*
            *  The acceptance to send email is handled within the local function OnAcceptEmailServiceProvider.
            *  Send email rejection is handled by the local function OnCancelEmailServiceProvider.
            */

            dlgEmailServiceProvider.set_modal(true);

            displayEmailDialog('', 'ActionMenu');
        }

    } else {

        var isInternetExplorer10OrAbove = !!(/MSIE (\d+\.\d+);/.test(navigator.userAgent) && (new Number(RegExp.$1) >= 10)) || (!!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/)));

        if (isInternetExplorer10OrAbove == true) {

            /*
            *   Web workers were introduced within Internet Explorer 10 and more recent Internet Explorer versions.
            */

        }

        // Internet Explorer 9 or earlier versions.

        var workManager = null;

        try {

            workManager = new WorkerThread();

        } catch (err) {

            workManager = null;
        }

        if (workManager == null) {

            if ((dlgDocumentGenerator !== undefined) && (dlgDocumentGenerator != null)) {

                dlgDocumentGenerator.set_modal(true);
            }

            if (typeof (displayDocumentDialog) == 'function') {

                /*
                *  The acceptance to generate documents is handled within the local function OnAcceptDocumentGeneration.
                *  The cancellation of the document generation is handled within the local function OnCancelDocumentGeneration.
                */

                displayDocumentDialog('ActionMenu');
            }

            if ((dlgEmailServiceProvider !== undefined) && (dlgEmailServiceProvider != null)) {

                dlgEmailServiceProvider.set_modal(true);
            }

            /*
            *   The activity will be launched synchronously within the current Javascript framework.
            */

            if (typeof (displayEmailDialog) == 'function') {

                /*
                *  The acceptance to send email is handled within the local function OnAcceptEmailServiceProvider.
                *  Send email rejection is handled by the local function OnCancelEmailServiceProvider.
                */

                displayEmailDialog('', 'ActionMenu');
            }

        } else {

            if (typeof (ShowPageActivity) == 'function') ShowPageActivity(true);

            if ((dlgDocumentGenerator !== undefined) && (dlgDocumentGenerator != null)) {

                dlgDocumentGenerator.set_modal(true);
            }

            if ((dlgEmailServiceProvider !== undefined) && (dlgEmailServiceProvider != null)) {

                dlgEmailServiceProvider.set_modal(true);
            }

            if (typeof (displayDocumentDialog) == 'function') {

                /*
                *  The acceptance to generate documents is handled within the local function OnAcceptDocumentGeneration.
                *  The cancellation of the document generation is handled within the local function OnCancelDocumentGeneration.
                */

                workManager.append(displayDocumentDialog('ActionMenu'), 10);
            }

            /*
            *   The activity will be launched asynchronously within the current Javascript framework.
            */

            if (typeof (displayEmailDialog) == 'function') {

                /*
                *  The acceptance to send email is handled within the local function OnAcceptEmailServiceProvider.
                *  Send email rejection is handled by the local function OnCancelEmailServiceProvider.
                */

                workManager.append(displayEmailDialog('', 'ActionMenu'), 30);
            }

            workManager.start();

            if (typeof (ShowPageActivity) == 'function') ShowPageActivity(false);
        }

    }

}

/*
*   Gets the security request based attribute.
*/
function getActionAttributes() {

    var attribute = {};

    var hidden = null;

    hidden = getActionControl('hdnSecurityRequestId');
    attribute.securityRequestId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    hidden = getActionControl('hdnSecurityRequestTypeId');
    attribute.securityRequestTypeId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    hidden = getActionControl('hdnSecurityRequestSubTypeId');
    attribute.securityRequestSubTypeId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    hidden = getActionControl('hdnSecurityRequestStageId');
    attribute.securityRequestStageId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    hidden = getActionControl('hdnSecurityRequestStatusId');
    attribute.securityRequestStatusId = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    hidden = getActionControl('hdnOwnerEmployeeNo');
    attribute.ownerEmployeeNo = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    hidden = getActionControl('hdnCurrentEmployeeId');
    attribute.currentEmployeeNo = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value.trim();

    return attribute;
}

/*
*   Gets the reference to the HTML element by element ID.
*/
function getActionControl(id, childId) {

    var ctrl = null;

    if ((id === undefined) || (id == null)) {

        return ctrl;
    }

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    if ((childId === undefined) || (childId == null)) {

        if (isInternetExplorer11OrAbove == true) {

            ctrl = document.getElementById(getActionServerControlId(id));

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getActionControlId(id)) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

        } else {

            ctrl = document.getElementById(getActionServerControlId(id));

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getActionControlId(id)) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.all(id) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

        }

    } else {

        if (isInternetExplorer11OrAbove == true) {

            if ((childId !== undefined) && (childId != null) && (typeof (childId) == 'string')) {

                childId = childId.trim();

                ctrl = document.getElementById(getActionServerControlId(childId));

                ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getActionControlId(childId)) : ctrl;

                ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(childId) : ctrl;

            }

        } else {

            var el = document.getElementById(getActionServerControlId(id));

            el = ((el === undefined) || (el == null)) ? document.getElementById(getActionControlId(id)) : el;

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
function getActionControlId(partialId) {

    return ActionScriptReferenceId + partialId;
}

/*
*  Gets the control identity with respect to the enclosing web page.
*/
function getActionServerControlId(partialId) {

    return ActionServerReferenceId + partialId;
}

/*
*   Creates a title for the action button based on the UIButtonName property.
*/
function getButtonTitle(button) {

    var title = '';

    var actionName = ((button === undefined) || (button == null)) ? '' : button.UIButtonName;

    if ((actionName == null) || (actionName.length == 0)) {

        return title;
    }

    if (actionName == 'SubmitBusinessSolsApproval') {

        title = 'Submit for Business Solution Approval';

    } else if (actionName == 'SubmitCreditAnalysisApproval') {

        title = 'Submit for Credit Analysis Approval';

    } else {

        title = button.Name;
    }

    return title;
}


/*
*   Obtains the response from the ComponentArt popup dialog
*   questionnaire for the close security request account.
*/
function getAuthoriseSecurityRequestAccountResponse() {

    var response = {};

    var ddlDeedRegisterUpdated = getActionControl('ddlDeedRegisterUpdated');
    response.DeedRegisterUpdated = getActionControl('ddlDeedRegisterUpdated').options[getActionControl('ddlDeedRegisterUpdated').selectedIndex].value; //((rbnAcceptBankingInstructions === undefined) || (rbnAcceptBankingInstructions == null)) ? false : rbnAcceptBankingInstructions.checked;

    var ddlMemberAuthoritySaved = getActionControl('ddlMemberAuthoritySaved');
    response.MemberAuthoritySaved = getActionControl('ddlMemberAuthoritySaved').options[getActionControl('ddlMemberAuthoritySaved').selectedIndex].value; //((rbnAcceptDepositSlip === undefined) || (rbnAcceptDepositSlip == null)) ? false : rbnAcceptDepositSlip.checked;

    var ddlSignaturesVerified = getActionControl('ddlSignaturesVerified');
    response.SignaturesVerified = getActionControl('ddlSignaturesVerified').options[getActionControl('ddlSignaturesVerified').selectedIndex].value; //((rbnAcceptDeedRegister === undefined) || (rbnAcceptDeedRegister == null)) ? false : rbnAcceptDeedRegister.checked;

    var ddlApprovalRequiredAndSaved = getActionControl('ddlApprovalRequiredAndSaved');
    response.ApprovalRequiredAndSaved = getActionControl('ddlApprovalRequiredAndSaved').options[getActionControl('ddlApprovalRequiredAndSaved').selectedIndex].value; //((rbnAcceptSendEmail === undefined) || (rbnAcceptSendEmail == null)) ? false : rbnAcceptSendEmail.checked;

    var ddlSettlementFiguresCorrect = getActionControl('ddlSettlementFiguresCorrect');
    response.SettlementFiguresCorrect = getActionControl('ddlSettlementFiguresCorrect').options[getActionControl('ddlSettlementFiguresCorrect').selectedIndex].value; //((rbnAcceptDocumentUpdates === undefined) || (rbnAcceptDocumentUpdates == null)) ? false : rbnAcceptDocumentUpdates.checked;

    var ddlTitleMortgageAttached = getActionControl('ddlTitleMortgageAttached');
    response.TitleMortgageAttached = getActionControl('ddlTitleMortgageAttached').options[getActionControl('ddlTitleMortgageAttached').selectedIndex].value; //((rbnAcceptDeedPacket === undefined) || (rbnAcceptDeedPacket == null)) ? false : rbnAcceptDeedPacket.checked;

    return response;
}


/*
*   Obtains the response from the ComponentArt popup dialog
*   questionnaire for the close security request account.
*/
function getCloseSecurityRequestAccountResponse() {

    var response = {};

    var rbnAcceptBankingInstructions = getActionControl('ddlAcceptBankingInstructions');
    response.acceptBankingInstructions = getActionControl('ddlAcceptBankingInstructions').options[getActionControl('ddlAcceptBankingInstructions').selectedIndex].value; //((rbnAcceptBankingInstructions === undefined) || (rbnAcceptBankingInstructions == null)) ? false : rbnAcceptBankingInstructions.checked;

    var rbnAcceptDepositSlip = getActionControl('ddlAcceptDepositSlip');
    response.acceptDepositSlip = getActionControl('ddlAcceptDepositSlip').options[getActionControl('ddlAcceptDepositSlip').selectedIndex].value; //((rbnAcceptDepositSlip === undefined) || (rbnAcceptDepositSlip == null)) ? false : rbnAcceptDepositSlip.checked;

    var rbnAcceptDeedRegister = getActionControl('ddlAcceptDeedRegister');
    response.acceptDeedRegister = getActionControl('ddlAcceptDeedRegister').options[getActionControl('ddlAcceptDeedRegister').selectedIndex].value; //((rbnAcceptDeedRegister === undefined) || (rbnAcceptDeedRegister == null)) ? false : rbnAcceptDeedRegister.checked;

    var rbnAcceptSendEmail = getActionControl('ddlAcceptSendEmail');
    response.acceptSendEmail = getActionControl('ddlAcceptSendEmail').options[getActionControl('ddlAcceptSendEmail').selectedIndex].value; //((rbnAcceptSendEmail === undefined) || (rbnAcceptSendEmail == null)) ? false : rbnAcceptSendEmail.checked;

    var rbnAcceptDocumentUpdates = getActionControl('ddlAcceptDocumentUpdates');
    response.acceptDocumentUpdates = getActionControl('ddlAcceptDocumentUpdates').options[getActionControl('ddlAcceptDocumentUpdates').selectedIndex].value; //((rbnAcceptDocumentUpdates === undefined) || (rbnAcceptDocumentUpdates == null)) ? false : rbnAcceptDocumentUpdates.checked;

    var rbnAcceptDeedPacket = getActionControl('ddlAcceptDeedPacket');
    response.sendDeedPacketToStorage = getActionControl('ddlAcceptDeedPacket').options[getActionControl('ddlAcceptDeedPacket').selectedIndex].value; //((rbnAcceptDeedPacket === undefined) || (rbnAcceptDeedPacket == null)) ? false : rbnAcceptDeedPacket.checked;

    response.deedPacket = {};
    response.deedPacket.visible = false;
    response.deedPacket.documentType = '';
    response.deedPacket.notes = '';
    response.deedPacket.storageBox = '';

    var trDeedPacketSection = getActionControl('trDeedPacketSection');

    if (trDeedPacketSection.style.display == 'block') {

        response.deedPacket.visible = true;

        /*var ddlDeedPacket = getActionControl('ddlDeedPacket');

        if ((ddlDeedPacket !== undefined) && (ddlDeedPacket != null)) {

            response.deedPacket.documentType = ddlDeedPacket.options[ddlDeedPacket.options.selectedIndex].text.trim();
            if (response.deedPacket.documentType == 'Please select') {
                response.deedPacket.documentType = '';
            }
        }*/

        var txtDeedPacketNotes = getActionControl('txtDeedPacketNotes');

        response.deedPacket.notes = ((txtDeedPacketNotes === undefined) || (txtDeedPacketNotes == null)) ? '' : txtDeedPacketNotes.value.trim();

        var txtStorageBoxNumber = getActionControl('txtStorageBoxNumber');

        response.deedPacket.storageBox = ((txtStorageBoxNumber === undefined) || (txtStorageBoxNumber == null)) ? '' : txtStorageBoxNumber.value.trim();
    }

    var rbnAcceptForceCloseAccount = getActionControl('ddlAcceptForceCloseAccount');
    response.acceptForceCloseAccount = getActionControl('ddlAcceptForceCloseAccount').options[getActionControl('ddlAcceptForceCloseAccount').selectedIndex].value; //((rbnAcceptForceCloseAccount === undefined) || (rbnAcceptForceCloseAccount == null)) ? false : rbnAcceptForceCloseAccount.checked;

    var rbnAcceptMatterClosure = getActionControl('ddlAcceptMatterClosure');
    response.acceptMatterClosure = getActionControl('ddlAcceptMatterClosure').options[getActionControl('ddlAcceptMatterClosure').selectedIndex].value; //((rbnAcceptMatterClosure === undefined) || (rbnAcceptMatterClosure == null)) ? false : rbnAcceptMatterClosure.checked;

    return response;
}

/*
*   Generates the email-based correspondence and the associated documents.
*/
function generateCloseRequestDocuments(response, button) {

    var attribute = getActionAttributes();

    if ((attribute == undefined) || (attribute == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    if ((response === undefined) || (response == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    generateCloseRequestCorrespondence(attribute, response, button);

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Generates the email-based correspondence and the associated documents.
*/
function generateAuthoriseRequestDocuments(response, button) {

    var attribute = getActionAttributes();

    if ((attribute == undefined) || (attribute == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    if ((response === undefined) || (response == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    generateAuthoriseRequestCorrespondence(attribute, response, button);

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Generates the email correspondence for the security request <Close Request> interaction.
*/
function generateCloseRequestCorrespondence(attribute, enquiryResponse, button) {

    if ((attribute == undefined) || (attribute == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    // save response to HistoryEvent table
    SaveCloseRequestResponseHistoryEventDataToSession(JSON.stringify(enquiryResponse));

    if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '1' /* Mortgage - Full Discharge */)) {

        if ((attribute.securityRequestStageId == '4' /* Closed */) && (attribute.securityRequestStatusId == '17' /*  Request Settled */)) {

            if (typeof (displayEmailDialog) == 'function') {

                /*
                *  The acceptance to send email is handled within the local function OnAcceptEmailServiceProvider.
                *  Send email rejection is handled by the local function OnCancelEmailServiceProvider.
                */

                displayEmailDialog('', 'ActionMenu', enquiryResponse);
            }

            /*
            *   Amendment By Paul Djimritsch.
            *   Date: 27 August 2014
            *   Bug: Settle request does not proceed the security request stage / status to the next status.
            */

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        } else {

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        }

    } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '2' /* Withdrawal of Caveat */)) {

        if ((attribute.securityRequestStageId == '4' /* Closed */) && (attribute.securityRequestStatusId == '17' /*  Request Settled */)) {

            if (typeof (displayEmailDialog) == 'function') {

                /*
                *  The acceptance to send email is handled within the local function OnAcceptEmailServiceProvider.
                *  Send email rejection is handled by the local function OnCancelEmailServiceProvider.
                */

                displayEmailDialog('', 'ActionMenu', enquiryResponse);
            }

            /*
            *   Amendment By Paul Djimritsch.
            *   Date: 27 August 2014
            *   Bug: Settle request does not proceed the security request stage / status to the next status.
            */

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        } else {

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        }

    } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '3' /* Redeemed - Congrats */)) {

        if ((attribute.securityRequestStageId == '4' /* Closed */) && (attribute.securityRequestStatusId == '17' /*  Request Settled */)) {

            if (typeof (displayEmailDialog) == 'function') {

                /*
                *  The acceptance to send email is handled within the local function OnAcceptEmailServiceProvider.
                *  Send email rejection is handled by the local function OnCancelEmailServiceProvider.
                */

                displayEmailDialog('', 'ActionMenu', enquiryResponse);
            }

            /*
            *   Amendment By Paul Djimritsch.
            *   Date: 27 August 2014
            *   Bug: Settle request does not proceed the security request stage / status to the next status.
            */

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        } else {

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        }

    } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '4' /* Redeemed - Caveat */)) {

        if ((attribute.securityRequestStageId == '4' /* Closed */) && (attribute.securityRequestStatusId == '17' /*  Request Settled */)) {

            if (typeof (displayEmailDialog) == 'function') {

                /*
                *  The acceptance to send email is handled within the local function OnAcceptEmailServiceProvider.
                *  Send email rejection is handled by the local function OnCancelEmailServiceProvider.
                */

                displayEmailDialog('', 'ActionMenu', enquiryResponse);
            }

            /*
            *   Amendment By Paul Djimritsch.
            *   Date: 27 August 2014
            *   Bug: Settle request does not proceed the security request stage / status to the next status.
            */

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        } else {

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        }

    } else if ((attribute.securityRequestTypeId == '1' /* Mortgage Discharge category */) && (attribute.securityRequestSubTypeId == '5' /* Partial Discharge */)) {

        if ((attribute.securityRequestStageId == '4' /* Closed */) && (attribute.securityRequestStatusId == '17' /*  Request Settled */)) {

            if (typeof (displayEmailDialog) == 'function') {

                /*
                *  The acceptance to send email is handled within the local function OnAcceptEmailServiceProvider.
                *  Send email rejection is handled by the local function OnCancelEmailServiceProvider.
                */

                displayEmailDialog('', 'ActionMenu', enquiryResponse);
            }

            /*
            *   Amendment By Paul Djimritsch.
            *   Date: 27 August 2014
            *   Bug: Settle request does not proceed the security request stage / status to the next status.
            */

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        } else {

            if (typeof (OnProcessAction) == 'function') {

                var response = OnProcessAction(attribute.securityRequestId, button);

                if (response == '') {

                    location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

                } else {

                    OpenSaveErrorDialog(response);
                }
            }

        }

    } else {

        if (typeof (OnProcessAction) == 'function') {

            var response = OnProcessAction(attribute.securityRequestId, button);

            if (response == '') {

                location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

            } else {

                OpenSaveErrorDialog(response);
            }
        }

    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}


/*
*   Generates the email correspondence for the security request <Authorise Request> interaction.
*/
function generateAuthoriseRequestCorrespondence(attribute, enquiryResponse, button) {

    if ((attribute == undefined) || (attribute == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    // save response to HistoryEvent table
    SaveAuthoriseRequestResponseHistoryEventDataToSession(JSON.stringify(enquiryResponse));


    if (typeof (OnProcessAction) == 'function') {

        var response = OnProcessAction(attribute.securityRequestId, button);

        if (response == '') {

            location.href = 'SecurityRequestDetails.aspx?SecurityRequestId=' + attribute.securityRequestId;

        } else {

            if ((dlg !== undefined) && (dlg != null)) {

                if (typeof (dlg.Close) == 'function') {

                    dlg.Close();
                }
            }

            OpenSaveErrorDialog(response);
        }
    }


    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}