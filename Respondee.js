var RespondeeScriptFileName = 'Respondee.js';

var RespondeeScriptReferenceId = 'ctl00_MainContent_Respondee_';

var RespondeeServerReferenceId = 'MainContent_Respondee_';

/******************************************************************************************************************/
///
/// Document Changes
/// ----------------
///
/// Author: Paul Djimritsch
/// Requestor: Serge Boyko
/// Date: 2 July 2014
/// Amendments: The infrastructure with the reference number for the respondee(s), particularily linked members,
/// has been altered from a reference number per respondee to a reference number for all respondees.
///
/******************************************************************************************************************/

/*
*  Initializes the respondee user control appearance according to the business rules
*/
function OnInitializeRespondee() {

    var attributes = getSecurityRequestAttributesForRespondee();

    // Display the current respondee type selection

    ShowRespondeeTypeSelection(attributes);


    // Apply the visibility / read-write rules as per functional specifications

    ApplyBusinessRulesForRespondee(attributes.stage, attributes.status, attributes.securityRequestOwner, attributes.currentEmployeeNo);

    /*
     *  Check the visibility for the respondee response. 
     *   If visible, populate the registered respondees within the respondee drop-down list for selection.
    */

    InitializeRespondeeResponse(attributes);
    
    /*
    *  Apply event handlers to the respondee form controls.
    */

    SetRespondeeEventHandlers();

}

/*
*
*/
function gvMortgageDischarge_Load(sender, eventArgs) {

    /*
    *   Initialize the appearance of the discharge mortgage grid view
    */
    InitializeDischargeMortgage();

}

/*
*   Toggle the display for the Mortgage Discharge received grid view
*/
function MortgageDischargeReceivedCheckedChange(chkbox) {

    if ((chkbox !== undefined) && (chkbox != null)) {

        var checked = chkbox.checked;

        var disabled = chkbox.disabled;

        var trMortgageDischarge = document.getElementById('trMortgageDischarge');

        if ((checked === true) && (disabled === false) && (trMortgageDischarge !== null)) {

            trMortgageDischarge.style.display = 'inline-block';

        } else if (trMortgageDischarge !== null) {

            trMortgageDischarge.style.display = 'none';
        }

        UpdateRespondeeMortgageDischargeReceived(document.getElementById('hdnSecurityRequestId').value,checked);
    }
}

/*
*  Processes the <OK> button click on the ComponentArt popup dialog for <Financial Institution Or Solicitor> selection.
*/
function OnAcceptInstitutionOrSolicitor(button) {

    try {

        var ctrl = getRespondeeControl('securityRequestId');

        var securityRequestId = ((ctrl === undefined) || (ctrl == null)) ? null : ctrl.value;

        if (securityRequestId == null) {
            return;
        }

        var ddlRespondeeType = getRespondeeControl('ddlRespondeeType');

        if (ddlRespondeeType == null) {
            return;
        }

        var txtReferenceNumber = getRespondeeControl('txtRespondeeReferenceNo');
        if ((txtReferenceNumber !== undefined) && (txtReferenceNumber != null)) {

            txtReferenceNumber.value = '';
        }


        // get the drop down list selection for the respondee type.
        var selectionType = ddlRespondeeType.options[ddlRespondeeType.selectedIndex].text;

        var selection = getDropdownListResponse();

        if (typeof (ApplyRespondeeSelection) == 'function') {

            var response = ApplyRespondeeSelection(securityRequestId, selectionType, selection);

            if ((response == null) || (response.length == 0)) {

                hidden = getRespondeeControl('CurrentRespondeeType');

                if ((hidden !== undefined) && (hidden != null)) {

                    hidden.value = selectionType;
                }

                hidden = getRespondeeControl('dlgRespondeeAction');

                if ((hidden !== undefined) && (hidden != null)) {

                    hidden.value = selectionType;
                }
            }
        }

    } catch (err) {

        alert(RespondeeScriptFileName + '. Control: AcceptInstitutionOrSolicitor. Event: Click. Error: ' + err.description);

    }

    if ((dlgInstitutionOrSolicitor !== undefined) && (dlgInstitutionOrSolicitor != null)) {

        if (typeof (dlgInstitutionOrSolicitor.Close) == 'function') {

            try {

                dlgInstitutionOrSolicitor.Close();

            } catch (err) {

            }
        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Closes the ComponentArt pop up dialog fo the <Financial Institution Or Solicitor> selection.
*/
function OnCancelInstitutionOrSolicitor(button) {

    var hidden = getRespondeeControl('dlgRespondeeAction');

    if ((hidden !== undefined) && (hidden != null)) {

        hidden.value = '';
    }

    var ddlRespondeeType = getRespondeeControl('ddlRespondeeType');

    hidden = getRespondeeControl('CurrentRespondeeType');

    if ((ddlRespondeeType !== undefined) && (ddlRespondeeType != null) && (hidden !== undefined) && (hidden != null)) {

        if (hidden.value.length > 0) {

            var len = ddlRespondeeType.options.length;

            for (var index = 0; index < len; ++index) {

                if (ddlRespondeeType.options[index].text.trim() == hidden.value.trim()) {

                    ddlRespondeeType.selectedIndex = index;
                    break;
                }
            }

        }
    }

    if ((dlgInstitutionOrSolicitor !== undefined) && (dlgInstitutionOrSolicitor != null)) {

        if (typeof (dlgInstitutionOrSolicitor.Close) == 'function') {

            try {

                dlgInstitutionOrSolicitor.Close();

            } catch (err) {

            }
        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*  Processes the <OK> button click on the ComponentArt popup dialog for <Others> selection.
*/
function OnAcceptOthers(button) {

    try {

        var ctrl = getRespondeeControl('securityRequestId');

        var securityRequestId = ((ctrl === undefined) || (ctrl == null)) ? null : ctrl.value;

        if (securityRequestId == null) {
            return;
        }

        var txtReferenceNumber = getRespondeeControl('txtRespondeeReferenceNo');
        if ((txtReferenceNumber !== undefined) && (txtReferenceNumber != null)) {

            txtReferenceNumber.value = '';
        }

        var ddlRespondeeType = getRespondeeControl('ddlRespondeeType');

        if (ddlRespondeeType == null) {
            return;
        }

        var hidden = null;

        // get the drop down list selection for the respondee type.
        var selectionType = ddlRespondeeType.options[ddlRespondeeType.selectedIndex].text;

        var selection = getInputFieldsResponse();

        if (typeof (ApplyRespondeeSelection) == 'function') {

            var response = ApplyRespondeeSelection(securityRequestId, selectionType, selection);

            if ((response == null) || (response.length == 0)) {

                hidden = getRespondeeControl('CurrentRespondeeType');

                if ((hidden !== undefined) && (hidden != null)) {

                    hidden.value = selectionType;
                }

                hidden = getRespondeeControl('dlgRespondeeAction');

                if ((hidden !== undefined) && (hidden != null)) {

                    hidden.value = selectionType;
                }
            }
        }

    } catch (err) {

        hidden = getRespondeeControl('dlgRespondeeAction');

        if ((hidden !== undefined) && (hidden != null)) {

            hidden.value = '';
        }

        alert(RespondeeScriptFileName + '. Control: AcceptOthers. Event: Click. Error: ' + err.description);
    }

    if ((dlgOthers !== undefined) && (dlgOthers != null)) {

        if (typeof (dlgOthers.Close) == 'function') {

            try {

                dlgOthers.Close();

            } catch (err) {

            }
        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Closes the ComponentArt pop up dialog fo the respondee selection.
*/
function OnCancelOthers(button) {

    var hidden = getRespondeeControl('dlgRespondeeAction');

    if ((hidden !== undefined) && (hidden != null)) {

        hidden.value = '';
    }

    var ddlRespondeeType = getRespondeeControl('ddlRespondeeType');

    hidden = getRespondeeControl('CurrentRespondeeType');

    if ((ddlRespondeeType !== undefined) && (ddlRespondeeType != null) && (hidden !== undefined) && (hidden != null)) {

        if (hidden.value.length > 0) {

            var len = ddlRespondeeType.options.length;

            for (var index = 0; index < len; ++index) {

                if (ddlRespondeeType.options[index].text.trim() == hidden.value.trim()) {

                    ddlRespondeeType.selectedIndex = index;
                    break;
                }
            }

        }
    }

    if ((dlgOthers !== undefined) && (dlgOthers != null)) {

        if (typeof (dlgOthers.Close) == 'function') {

            try {

                dlgOthers.Close();

            } catch (err) {

            }
        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Accepts and processes the end-user respondee type selection.
*/
function OnAcceptRespondees(button) {

    try {

        var ctrl = getRespondeeControl('securityRequestId');

        var securityRequestId = ((ctrl === undefined) || (ctrl == null)) ? null : ctrl.value;

        if (securityRequestId == null) {
            return;
        }

        var txtReferenceNumber = getRespondeeControl('txtRespondeeReferenceNo');
        if ((txtReferenceNumber !== undefined) && (txtReferenceNumber != null)) {

            txtReferenceNumber.value = '';
        }

        var ddlRespondeeType = getRespondeeControl('ddlRespondeeType');

        if (ddlRespondeeType == null) {
            return;
        }

        var hidden = null;

        // get the drop down list selection for the respondee type.
        var selectionType = ddlRespondeeType.options[ddlRespondeeType.selectedIndex].text;

        var selection = getCheckBoxListResponse();

        if (typeof (ApplyRespondeeSelection) == 'function') {

            var response = ApplyRespondeeSelection(securityRequestId, selectionType, selection);

            if ((response == null) || (response.length == 0)) {

                hidden = getRespondeeControl('CurrentRespondeeType');

                if ((hidden !== undefined) && (hidden != null)) {

                    hidden.value = selectionType;
                }

                hidden = getRespondeeControl('dlgRespondeeAction');

                if ((hidden !== undefined) && (hidden != null)) {

                    hidden.value = selectionType;
                }
            }
        }

    } catch (err) {

        hidden = getRespondeeControl('dlgRespondeeAction');

        if ((hidden !== undefined) && (hidden != null)) {

            hidden.value = '';
        }

        alert(RespondeeScriptFileName + '. Control: AcceptRespondees. Event: Click. Error: ' + err.description);
    }

    if ((dlgRespondees !== undefined) && (dlgRespondees != null)) {

        if (typeof (dlgRespondees.Close) == 'function') {

            try {

                dlgRespondees.Close();

            } catch (err) {

            }
        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Closes the ComponentArt pop up dialog fo the respondee selection.
*/
function OnCancelRespondees(button) {

    var hidden = getRespondeeControl('dlgRespondeeAction');

    if ((hidden !== undefined) && (hidden != null)) {

        hidden.value = '';
    }

    var ddlRespondeeType = getRespondeeControl('ddlRespondeeType');

    hidden = getRespondeeControl('CurrentRespondeeType');

    if ((ddlRespondeeType !== undefined) && (ddlRespondeeType != null) && (hidden !== undefined) && (hidden != null)) {

        if (hidden.value.length > 0) {

            var len = ddlRespondeeType.options.length;

            for (var index = 0; index < len; ++index) {

                if (ddlRespondeeType.options[index].text.trim() == hidden.value.trim()) {

                    ddlRespondeeType.selectedIndex = index;
                    break;
                }
            }

        }
    }

    if ((dlgRespondees !== undefined) && (dlgRespondees != null)) {

        if (typeof (dlgRespondees.Close) == 'function') {

            try {

                dlgRespondees.Close();

            } catch (err) {

            }
        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Displays the mandatory popup for sending the email notifications 
*   during the selection change with the financial institution.
*/
function OnChangeFinancialInstitution(ddlFinancialInstitution) {

    if ((ddlFinancialInstitution === undefined) || (ddlFinancialInstitution == null)) {

        return;
    }

    if (ddlFinancialInstitution.options.selectedIndex == 0 /* Please select */) {

        return;
    }

    var institution = ddlFinancialInstitution.options[ddlFinancialInstitution.options.selectedIndex].text.trim();

    if ((institution == null) || (institution.length == 0)) {

        return;
    }

    var response = confirm('Do you wish to send a email for the\nfinancial institution selection ( ' + institution + ' ) ?');

    if ((response == true) && (typeof (displayEmailDialog) == 'function')) {

        var comments = 'Securities have received a Notice of Intention to Refinance from ' + institution.trim() + '.';

        // display the email notification popup dialog.

        displayEmailDialog(comments, 'Respondee'); // refer to the ActionMenu.js for function declaration.
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   The change event is associated with the respondee response drop down list.
*   This event will only be triggered when the security request has progressed
*   to a settlement booked stage.
*
*    This event will call a web service to extract the registered respondee types
*    for the security request and populate the <Posted To> drop down list with the
*    extracted response types for the security request.
*
*    A onchange event handler for the <Posted To> drop down list will be added
*    within the function.
*/
function OnResponseTypesChange(ddl) {

    try {

        var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

        var ddlResponseTypes = ((ddl === undefined) || (ddl == null)) ? getRespondeeControl('divRespondeeResponse', 'ddlResponseTypes') : ddl;

        if (ddlResponseTypes === null) {

            if (typeof (stopEventBubbling) == 'function') {

                stopEventBubbling(window.event);
            }

            return false;
        }

        // get the drop down list selection for the respondee type.
        var responseType = ddlResponseTypes.options[ddlResponseTypes.selectedIndex].text;

        var div = document.getElementById('divRespondeeResponse');

        if (div === null) {

            if (typeof (stopEventBubbling) == 'function') {

                stopEventBubbling(window.event);
            }

            return false;
        }

        var hidden = getRespondeeControl('securityRequestId');

        var securityRequestId = ((hidden === undefined) || (hidden === null)) ? null : hidden.value;

        if ((responseType !== null) && (responseType == 'Documents to be collected from Head Office.')) {

            if (isInternetExplorer11OrAbove == false) {

                var ddlPostedTo = div.all(getRespondeeServerControlId('ddlPostedTo'));
                ddlPostedTo = (ddlPostedTo === null) ? div.all('ddlPostedTo') : ddlPostedTo;
                DisplayRespondeeField(ddlPostedTo, false);
                ClearSelectElement(ddlPostedTo);

                var txtThirdPartyName = div.all(getRespondeeServerControlId('txtThirdPartyName'));
                txtThirdPartyName = (txtThirdPartyName === null) ? div.all('txtThirdPartyName') : txtThirdPartyName;
                DisplayRespondeeField(txtThirdPartyName, false);

                var txtThirdPartyAddress = div.all.item(getRespondeeServerControlId('txtThirdPartyAdress'));
                txtThirdPartyAddress = (txtThirdPartyAddress === null) ? div.all('txtThirdPartyAddress') : txtThirdPartyAddress;
                DisplayRespondeeField(txtThirdPartyAddress, false);

                var txtArticleNumber = div.all.item(getRespondeeServerControlId('txtArticleNumber'));
                txtArticleNumber = (txtThirdPartyName === null) ? div.all('txtArticleNumber') : txtArticleNumber;
                DisplayRespondeeField(txtArticleNumber, false);

            } else {

                var ddlPostedTo = getRespondeeControl('ddlPostedTo');
                DisplayRespondeeField(ddlPostedTo, false);
                ClearSelectElement(ddlPostedTo);

                var txtThirdPartyName = getRespondeeControl('txtThirdPartyName');
                DisplayRespondeeField(txtThirdPartyName, false);

                var txtThirdPartyAddress = getRespondeeControl('txtThirdPartyAdress');
                DisplayRespondeeField(txtThirdPartyAddress, false);

                var txtArticleNumber = getRespondeeControl('txtArticleNumber');
                DisplayRespondeeField(txtArticleNumber, false);
            }

        } else if ((responseType !== null) && (responseType === 'Member requested documents to be posted.')) {

            if (isInternetExplorer11OrAbove == false) {

                var ddlPostedTo = div.all(getRespondeeServerControlId('ddlPostedTo'));
                ddlPostedTo = (ddlPostedTo === null) ? div.all('ddlPostedTo') : ddlPostedTo;

                DisplayRespondeeField(ddlPostedTo, true);
                GetPostedToRecipients(ddlPostedTo, securityRequestId);

                if (ddlPostedTo.options.length > 1) {

                    ddlPostedTo.value = 'Others';
                    ddlPostedTo.addEventListener('change', function () {

                        OnPostedToChange(this, securityRequestId);

                        this.style.borderColor = '';
                        this.style.borderWidth = '1px';
                    });
                }

            } else {

                var ddlPostedTo = getRespondeeControl('ddlPostedTo');
                DisplayRespondeeField(ddlPostedTo, true);
                GetPostedToRecipients(ddlPostedTo, securityRequestId);

                if (ddlPostedTo.options.length > 1) {

                    ddlPostedTo.value = 'Others';
                    ddlPostedTo.addEventListener('change', function () {

                        OnPostedToChange(this, securityRequestId);

                        this.style.borderColor = '';
                        this.style.borderWidth = '1px';
                    });
                }

            }

        } else if ((responseType !== null) && (responseType === 'No response from Members. Documents to be posted.')) {

            if (isInternetExplorer11OrAbove == false) {

                var ddlPostedTo = div.all(getRespondeeServerControlId('ddlPostedTo'));
                ddlPostedTo = (ddlPostedTo === null) ? div.all('ddlPostedTo') : ddlPostedTo;
                DisplayRespondeeField(ddlPostedTo, false);
                ClearSelectElement(ddlPostedTo);

                var txtThirdPartyName = div.all(getRespondeeServerControlId('txtThirdPartyName'));
                txtThirdPartyName = (txtThirdPartyName === null) ? div.all('txtThirdPartyName') : txtThirdPartyName;
                DisplayRespondeeField(txtThirdPartyName, false);

                var txtThirdPartyAddress = div.all(getRespondeeServerControlId('txtThirdPartyAdress'));
                txtThirdPartyAddress = (txtThirdPartyAddress === null) ? div.all('txtThirdPartyAddress') : txtThirdPartyAddress;
                DisplayRespondeeField(txtThirdPartyAddress, false);

                var txtArticleNumber = div.all(getRespondeeServerControlId('txtArticleNumber'));
                txtArticleNumber = (txtThirdPartyName === null) ? div.all('txtArticleNumber') : txtArticleNumber;
                DisplayRespondeeField(txtArticleNumber, true);

            } else {

                var ddlPostedTo = getRespondeeControl('ddlPostedTo');
                DisplayRespondeeField(ddlPostedTo, false);
                ClearSelectElement(ddlPostedTo);

                var txtThirdPartyName = getRespondeeControl('txtThirdPartyName');
                DisplayRespondeeField(txtThirdPartyName, false);

                var txtThirdPartyAddress = getRespondeeControl('txtThirdPartyAdress');
                DisplayRespondeeField(txtThirdPartyAddress, false);

                var txtArticleNumber = getRespondeeControl('txtArticleNumber');
                DisplayRespondeeField(txtArticleNumber, true);

            }
        }


    } catch (err) {

        alert(RespondeeScriptFileName + '. Control: ddlRespondeeResponse. Event: Change. Error: ' + err.description);

    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Displays the appropiate popup display for the respondee type selection.
*/
function OnRespondeeTypeChange(ddl) {

    try {

        var ddlRespondeeType = ((ddl === undefined) || (ddl === null)) ? getRespondeeControl('ddlRespondeeType') : ddl;

        if (ddlRespondeeType == null) {
            return;
        }

        // get the drop down list selection for the respondee type.
        var selection = ddlRespondeeType.options[ddlRespondeeType.selectedIndex].text;

        // gets the popup dialog caption.
        var caption = getRespondeeDialogCaption(selection);

        // initialize the appearance of the popup window
        var dlg = initializeRespondeeDialog(caption);

        if ((dlg != null) && (dlg.window !== undefined) && (dlg.window != null)) {

            if (dlg.canDisplay == true) {

                dlg.window.Show();
            }

        }

    } catch (err) {

        alert(RespondeeScriptFileName + '. Control: ddlRespondeeType. Event: Change. Error: ' + err.description);
    }

}

/*
* Triggers the associated ComponentArt callback event handler for the FinancialInstitution drop down list.
*/
function OnFinancialInstitutionChange(ddl) {

    try {

        var ddlFinancialInstitution = ((ddl === undefined) || (ddl == null)) ? document.getElementById('ddlFinancialInstitution') : ddl;

        if (ddlFinancialInstitution.disabled.length == 0) {

            var selection = (ddlFinancialInstitution == null) ? null : (ddlFinancialInstitution.options.length > 0) ? ddlFinancialInstitution.options[ddlFinancialInstitution.selectedIndex].value : null;

            if (selection != null) {

                // display the details of the selected financial institution
            }

            if (ddlFinancialInstitution != null) {

                ddlFinancialInstitution.style.display = 'inline-block';
            }
        }

    } catch (err) {

        alert(RespondeeScriptFileName + '. Control: ddlFinancialInstitution. Error: ' + err.description);
    }

}

/*
* Triggers the associated ComponentArt callback event handler for Mortgage Discharge Received checkbox.
*/
function MortgageDischargeReceivedChange(chkBox) {

    try {

        var chkMortgageDischargeReceived = ((chkBox === undefined) || (chkBox == null)) ? document.getElementById('chkMortgageDischargeReceived') : chkBox;

        var selected = (chkMortgageDischargeReceived != null) ? chkMortgageDischargeReceived.checked : null;

        if (selected != null) {

            var callerId = getRespondeeControlId('cbMortgageDischargeReceived');

            var caller = eval(callerId);

            if ((caller !== undefined) && (caller != null)) {

                if (typeof (caller.Callback) == 'function') {

                    caller.Callback(selected);

                } else if ((caller.control !== undefined) && (caller.control != null) && (typeof (caller.control.Callback) == 'function')) {

                    caller.control.Callback(selected);
                }
            }

        }

        if (chkMortgageDischargeReceived != null) {

            chkMortgageDischargeReceived.style.display = 'inline-block';
        }

    } catch (err) {

        alert(RespondeeScriptFileName + '. Control: chkMortgageDischargeReceived. Error: ' + err.description);
    }

}

/*
*  Triggers the associated ComponentArt callback event handler for the PostedTo drop down list.
*/
function OnPostedToChange(ddlPostedTo, securityRequestId) {

    try {

        if ((ddlPostedTo === undefined) || (ddlPostedTo === null) || (securityRequestId === undefined) || (securityRequestId === null)) {

            return;
        }

        /*
        *   Get the Posted To selection.
        */
        var selection = ddlPostedTo.options[ddlPostedTo.selectedIndex].text;

        if ((selection == null) || (selection.length == 0)) {

            return;
        }

        var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

        if (selection === 'Member requested documents to be posted.') {

            var div = document.getElementById('divRespondeeResponse');

            if (div !== null) {

                if (typeof (getPostedToDetails) == 'function') {

                    getPostedToDetails(div, ddlPostedTo, securityRequestId);

                }

            } else {

                if (isInternetExplorer11OrAbove == false) {

                    var txtThirdPartyName = div.all(getRespondeeServerControlId('txtThirdPartyName'));
                    txtThirdPartyName = (txtThirdPartyName === null) ? div.all('txtThirdPartyName') : txtThirdPartyName;
                    DisplayRespondeeField(txtThirdPartyName, false);

                    var txtThirdPartyAddress = div.all(getRespondeeServerControlId('txtThirdPartyAdress'));
                    txtThirdPartyAddress = (txtThirdPartyAddress === null) ? div.all('txtThirdPartyAddress') : txtThirdPartyAddress;
                    DisplayRespondeeField(txtThirdPartyAddress, false);

                    var txtArticleNumber = div.all(getRespondeeServerControlId('txtArticleNumber'));
                    txtArticleNumber = (txtThirdPartyName === null) ? div.all('txtArticleNumber') : txtArticleNumber;
                    DisplayRespondeeField(txtArticleNumber, false);

                } else {

                    var txtThirdPartyName = getRespondeeControl('txtThirdPartyName');
                    DisplayRespondeeField(txtThirdPartyName, false);

                    var txtThirdPartyAddress = getRespondeeControl('txtThirdPartyAdress');
                    DisplayRespondeeField(txtThirdPartyAddress, false);

                    var txtArticleNumber = getRespondeeControl('txtArticleNumber');
                    DisplayRespondeeField(txtArticleNumber, false);

                }

            }
        }

    } catch (err) {

        alert(RespondeeScriptFileName + '. Control: ddlPostedTo. Error: ' + err.description);
    }
}

/*
*   Initializes the appearance of the modal popup respondees dialog.
*/
function OnShowRespondees(dlg) {

    if ((dlg === undefined) || (dlg == null)) {

        return;
    }

    var ctrl = getRespondeeControl('securityRequestId');

    var securityRequestId = ((ctrl === undefined) || (ctrl === null)) ? null : ctrl.value;

    if (typeof (dlg.set_alignmentElement) == 'function') {

        var div = getRespondeeControl('divRespondee');

        if ((div !== undefined) && (div != null)) {

            dlg.set_alignmentElement(div.id)
        }
    }

    if (dlg.get_id() == getRespondeeControlId('dlgRespondees')) {

        var ddlRespondeeType = getRespondeeControl('ddlRespondeeType');

        var selection = ((ddlRespondeeType === undefined) || (ddlRespondeeType == null)) ? '' : (ddlRespondeeType.selectedIndex < 0) ? '' : ddlRespondeeType.options[ddlRespondeeType.selectedIndex].text;

        var callerId = getRespondeeControlId('cbdlgRespondees');

        var caller = eval(callerId);

        if ((caller !== undefined) && (caller != null) && (selection.length > 0)) {

            if (typeof (caller.Callback) == 'function') {

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(true);

                caller.Callback(selection, securityRequestId);

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(false);

            } else if ((caller.control !== undefined) && (caller.control != null) && (typeof (caller.control.Callback) == 'function')) {

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(true);

                caller.control.Callback(selection, securityRequestId);

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(false);
            }
        }

    } else if (dlg.get_id() == getRespondeeControlId('dlgOthers')) {

        var callerId = getRespondeeControlId('cbdlgOthers');

        var caller = eval(callerId);

        if ((caller !== undefined) && (caller != null)) {

            if (typeof (caller.Callback) == 'function') {

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(true);

                caller.Callback(securityRequestId);

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(false);

            } else if ((caller.control !== undefined) && (caller.control != null) && (typeof (caller.control.Callback) == 'function')) {

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(true);

                caller.control.Callback(securityRequestId);

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(false);
            }
        }

    } else if (dlg.get_id() == getRespondeeControlId('dlgInstitutionOrSolicitor')) {

        var ddlRespondeeType = getRespondeeControl('ddlRespondeeType');

        var selection = ((ddlRespondeeType === undefined) || (ddlRespondeeType == null)) ? '' : (ddlRespondeeType.selectedIndex < 0) ? '' : ddlRespondeeType.options[ddlRespondeeType.selectedIndex].text;

        var callerId = getRespondeeControlId('cbdlgInstitutionOrSolicitor');

        var caller = eval(callerId);

        if ((caller !== undefined) && (caller != null) && (selection.length > 0)) {

            if (typeof (caller.Callback) == 'function') {

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(true);

                caller.Callback(selection, securityRequestId);

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(false);

            } else if ((caller.control !== undefined) && (caller.control != null) && (typeof (caller.control.Callback) == 'function')) {

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(true);

                caller.control.Callback(selection, securityRequestId);

                if (typeof (ShowDialogActivity) == 'function') ShowDialogActivity(false);
            }
        }
    }
}

/*
*   Conditionally provides an partial update to the respondee details section 
*   and closes the ComponentArt modal popup dialog box.
*/
function OnCloseRespondees(dlg) {

    var hidden = getRespondeeControl('dlgRespondeeAction');

    if ((hidden !== undefined) && (hidden != null) && (hidden.value.length > 0)) {

        var doRespondeeUpdate = (typeof (__doPostBack) == 'function') ? true : false;

        var respondeeUpdater = getRespondeeControl('pnlRespondeeUpdater');

        if (doRespondeeUpdate == true) {

            doRespondeeUpdate = ((respondeeUpdater === undefined) || (respondeeUpdater == null)) ? false : (respondeeUpdater.id.length == 0) ? false : true;;
        }

        if (doRespondeeUpdate == true) {

            try {

                __doPostBack(respondeeUpdater.id, ''); // perform partial postback within the <Respondee Details> region

                doRespondeeUpdate = true;

            } catch (err) {

                doRespondeeUpdate = false;
            }
        }

        if (doRespondeeUpdate == false) {

            var ctrl = getRespondeeControl('securityRequestId');

            var securityRequestId = ((ctrl === undefined) || (ctrl === null)) ? null : ctrl.value;

            if ((securityRequestId == null) || (securityRequestId.length == 0)) {

                if (typeof (stopEventBubbling) == 'function') {

                    stopEventBubbling(window.event);
                }

                return false;
            }

            var url = window.location.pathname;

            window.location.href = url + '?' + 'SecurityRequestId=' + securityRequestId;

        }

        hidden.value = '';
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
*   Applies the stage / status business rules for the respondee.
*/
function ApplyBusinessRulesForRespondee(stage, status, securityRequestOwner, currentEmployeeNo) {

    if ((securityRequestOwner === undefined) || (securityRequestOwner === null)) {

        return;
    }

    if ((currentEmployeeNo === undefined) || (currentEmployeeNo === null)) {

        return;
    }

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    if (securityRequestOwner === currentEmployeeNo) {

        // provide read/write access for the security owner

        if (stage === 'Create / Edit') {

            if ((status === 'Request Started') ||
                (status === 'Awaiting Business Solutions Approval') ||
                (status == 'Submit for Business Solutions Approval') ||
                (status === 'Approval Received From Business Solutions')) {

                try {

                    if (isInternetExplorer11OrAbove == false) {

                        // display the respondee detail section as read-write mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('ddlRespondeeType'), false);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('txtRespondeeReferenceNo'), false);

                        // display the respondee response section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all.item('ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all.item('txtArticleNumber'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all.item('ddlPostedTo'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all.item('txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all.item('txtThirdPartyAddress'), true);

                        // hide the respondee response section
                        document.getElementById('divRespondeeResponse').style.display = 'none';

                        // display the financial institution section as read-write mode.

                        var ddlFinancialInstitution = document.getElementById('divFinancialInstitution').all('ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== undefined) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, false);

                            ddlFinancialInstitution.onchange = function () {

                                if (typeof (OnChangeFinancialInstitution) == 'function') {

                                    OnChangeFinancialInstitution(this);
                                }

                                if (typeof (stopEventBubbling) == 'function') {

                                    stopEventBubbling(window.event);
                                }

                                return false;
                            };
                        }

                        // display the discharge of mortgage section as read-write mode.

                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all('chkMortgageDischargeReceived'), false);
                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all(getRespondeeControlId('gvMortgageDischarge')), false);

                    } else {

                        // display the respondee detail section as read-write mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'ddlRespondeeType'), false);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'txtRespondeeReferenceNo'), false);

                        // display the respondee response section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtArticleNumber'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlPostedTo'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyAddress'), true);

                        // hide the respondee response section
                        document.getElementById('divRespondeeResponse').style.display = 'none';

                        // display the financial institution section as read-write mode.

                        var ddlFinancialInstitution = getRespondeeControl('divFinancialInstitution', 'ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== undefined) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, false);

                            ddlFinancialInstitution.onchange = function () {

                                if (typeof (OnChangeFinancialInstitution) == 'function') {

                                    OnChangeFinancialInstitution(this);
                                }

                                if (typeof (stopEventBubbling) == 'function') {

                                    stopEventBubbling(window.event);
                                }

                                return false;
                            };
                        }

                        // display the discharge of mortgage section as read-write mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'chkMortgageDischargeReceived'), false);
                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'gvMortgageDischarge'), false);

                    }

                } catch (err) {

                    alert(RespondeeScriptFileName + '. Function: ApplyBusinessRulesForRespondee. Event: Initialize. Error: ' + err.description);
                }

            } else if (status === 'Awaiting Additional Info') {

                try {

                    if (isInternetExplorer11OrAbove == false) {

                        // display the respondee detail section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('ddlRespondeeType'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('txtRespondeeReferenceNo'), true);

                        // display the respondee response section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtArticleNumber'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlPostedTo'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyAddress'), true);

                        // hide the respondee response section
                        document.getElementById('divRespondeeResponse').style.display = 'none';

                        // display the financial institution section as read-write mode.

                        var ddlFinancialInstitution = document.getElementById('divFinancialInstitution').all('ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== undefined) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, false);

                            ddlFinancialInstitution.onchange = function () {

                                if (typeof (OnChangeFinancialInstitution) == 'function') {

                                    OnChangeFinancialInstitution(this);
                                }

                                if (typeof (stopEventBubbling) == 'function') {

                                    stopEventBubbling(window.event);
                                }

                                return false;
                            };
                        }

                        // display the discharge of mortgage section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all('chkMortgageDischargeReceived'), true);
                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all(getRespondeeControlId('gvMortgageDischarge')), true);

                    } else {

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'ddlRespondeeType'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'txtRespondeeReferenceNo'), true);

                        // display the respondee response section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtArticleNumber'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlPostedTo'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyAddress'), true);

                        // hide the respondee response section
                        document.getElementById('divRespondeeResponse').style.display = 'none';

                        // display the financial institution section as read-write mode.

                        var ddlFinancialInstitution = getRespondeeControl('divFinancialInstitution', 'ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== undefined) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, false);

                            ddlFinancialInstitution.onchange = function () {

                                if (typeof (OnChangeFinancialInstitution) == 'function') {

                                    OnChangeFinancialInstitution(this);
                                }

                                if (typeof (stopEventBubbling) == 'function') {

                                    stopEventBubbling(window.event);
                                }

                                return false;
                            };
                        }

                        // display the discharge of mortgage section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'chkMortgageDischargeReceived'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'gvMortgageDischarge'), true);

                    }

                } catch (err) {

                    alert(RespondeeScriptFileName + '. Function: ApplyBusinessRulesForRespondee. Event: Initialize. Error: ' + err.description);
                }

            } else if (status === 'Additional Info Received') {

                try {

                    if (isInternetExplorer11OrAbove == false) {

                        // display the respondee detail section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('ddlRespondeeType'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('txtRespondeeReferenceNo'), true);

                        // display the respondee response section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtArticleNumber'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlPostedTo'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyAddress'), true);

                        // hide the respondee response section
                        document.getElementById('divRespondeeResponse').style.display = 'none';

                        // display the financial institution section as read-only mode.

                        var ddlFinancialInstitution = document.getElementById('divFinancialInstitution').all('ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== null) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, true);

                            if ((typeof (ddlFinancialInstitution.hasAttribute) == 'function') && (ddlFinancialInstitution.hasAttribute('onchange') != null)) {

                                var fn = function () {

                                    if (typeof (OnChangeFinancialInstitution) == 'function') {

                                        OnChangeFinancialInstitution(this);
                                    }

                                    if (typeof (stopEventBubbling) == 'function') {

                                        stopEventBubbling(window.event);
                                    }

                                    return false;
                                };

                                if (ddlFinancialInstitution.hasAttribute('onchange') == true) {

                                    if (typeof (ddlFinancialInstitution.removeEventListener) == 'function') {

                                        ddlFinancialInstitution.removeEventListener('onchange', fn);
                                    }
                                }
                            }

                        }

                        // display the discharge of mortgage section as read-write mode.

                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all('chkMortgageDischargeReceived'), false);
                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all(getRespondeeControlId('gvMortgageDischarge')), false);

                    } else {

                        // display the respondee detail section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'ddlRespondeeType'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'txtRespondeeReferenceNo'), true);

                        // display the respondee response section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtArticleNumber'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlPostedTo'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyAddress'), true);

                        // hide the respondee response section
                        document.getElementById('divRespondeeResponse').style.display = 'none';

                        // display the financial institution section as read-only mode.

                        var ddlFinancialInstitution = getRespondeeControl('divFinancialInstitution', 'ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== null) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, true);

                            if ((typeof (ddlFinancialInstitution.hasAttribute) == 'function') && (ddlFinancialInstitution.hasAttribute('onchange') != null)) {

                                var fn = function () {

                                    if (typeof (OnChangeFinancialInstitution) == 'function') {

                                        OnChangeFinancialInstitution(this);
                                    }

                                    if (typeof (stopEventBubbling) == 'function') {

                                        stopEventBubbling(window.event);
                                    }

                                    return false;
                                };

                                if (ddlFinancialInstitution.hasAttribute('onchange') == true) {

                                    if (typeof (ddlFinancialInstitution.removeEventListener) == 'function') {

                                        ddlFinancialInstitution.removeEventListener('onchange', fn);
                                    }
                                }
                            }

                        }

                        // display the discharge of mortgage section as read-write mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'chkMortgageDischargeReceived'), false);
                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'gvMortgageDischarge'), false);

                    }

                } catch (err) {

                    alert(RespondeeScriptFileName + '. Function: ApplyBusinessRulesForRespondee. Event: Initialize. Error: ' + err.description);

                }

            } else {

                try {

                    if (isInternetExplorer11OrAbove == false) {

                        // display the respondee detail section as read-write mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('ddlRespondeeType'), false);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('txtRespondeeReferenceNo'), false);

                        // display the respondee response section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtArticleNumber'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlPostedTo'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyAddress'), true);

                        // hide the respondee response section
                        document.getElementById('divRespondeeResponse').style.display = 'none';

                        // display the financial institution section as read-write mode.

                        var ddlFinancialInstitution = document.getElementById('divFinancialInstitution').all('ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== undefined) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, false);

                            ddlFinancialInstitution.onchange = function () {

                                if (typeof (OnChangeFinancialInstitution) == 'function') {

                                    OnChangeFinancialInstitution(this);
                                }

                                if (typeof (stopEventBubbling) == 'function') {

                                    stopEventBubbling(window.event);
                                }

                                return false;
                            };
                        }

                        // display the discharge of mortgage section as read-write mode.

                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all('chkMortgageDischargeReceived'), false);
                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all(getRespondeeControlId('gvMortgageDischarge')), false);

                    } else {

                        // display the respondee detail section as read-write mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'ddlRespondeeType'), false);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'txtRespondeeReferenceNo'), false);

                        // display the respondee response section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtArticleNumber'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlPostedTo'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyAddress'), true);

                        // hide the respondee response section
                        document.getElementById('divRespondeeResponse').style.display = 'none';

                        // display the financial institution section as read-write mode.

                        var ddlFinancialInstitution = getRespondeeControl('divFinancialInstitution', 'ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== undefined) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, false);

                            ddlFinancialInstitution.onchange = function () {

                                if (typeof (OnChangeFinancialInstitution) == 'function') {

                                    OnChangeFinancialInstitution(this);
                                }

                                if (typeof (stopEventBubbling) == 'function') {

                                    stopEventBubbling(window.event);
                                }

                                return false;
                            };
                        }

                        // display the discharge of mortgage section as read-write mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'chkMortgageDischargeReceived'), false);
                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'gvMortgageDischarge'), false);

                    }

                } catch (err) {

                    alert(RespondeeScriptFileName + '. Function: ApplyBusinessRulesForRespondee. Event: Initialize. Error: ' + err.description);

                }

            }


        } else if (stage === 'Settlement Booking') {

            if ((status === 'Redemptions Confirmed') ||
                (status === 'Awaiting Supervisor Approval') ||
                (status === 'Ready for Settlement') ||
                (status === 'Request Settled')) {

                try {

                    if (isInternetExplorer11OrAbove == false) {

                        // display the respondee detail section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('ddlRespondeeType'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('txtRespondeeReferenceNo'), true);

                        // display the respondee response section as read-write mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlRespondeeResponse'), false);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtArticleNumber'), false);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlPostedTo'), false);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyName'), false);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyAddress'), false);

                        // display the financial institution section as read-only mode.

                        var ddlFinancialInstitution = document.getElementById('divFinancialInstitution').all('ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== null) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, true);

                            if ((typeof (ddlFinancialInstitution.hasAttribute) == 'function') && (ddlFinancialInstitution.hasAttribute('onchange') != null)) {

                                var fn = function () {

                                    if (typeof (OnChangeFinancialInstitution) == 'function') {

                                        OnChangeFinancialInstitution(this);
                                    }

                                    if (typeof (stopEventBubbling) == 'function') {

                                        stopEventBubbling(window.event);
                                    }

                                    return false;
                                };

                                if (ddlFinancialInstitution.hasAttribute('onchange') == true) {

                                    if (typeof (ddlFinancialInstitution.removeEventListener) == 'function') {

                                        ddlFinancialInstitution.removeEventListener('onchange', fn);

                                    }
                                }
                            }

                        }

                        // display the discharge of mortgage section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all('chkMortgageDischargeReceived'), true);
                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all(getRespondeeControlId('gvMortgageDischarge')), true);

                    } else {

                        // display the respondee detail section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'ddlRespondeeType'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'txtRespondeeReferenceNo'), true);

                        // display the respondee response section as read-write mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlRespondeeResponse'), false);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtArticleNumber'), false);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlPostedTo'), false);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyName'), false);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyAddress'), false);

                        // display the financial institution section as read-only mode.

                        var ddlFinancialInstitution = getRespondeeControl('divFinancialInstitution', 'ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== null) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, true);

                            if ((typeof (ddlFinancialInstitution.hasAttribute) == 'function') && (ddlFinancialInstitution.hasAttribute('onchange') != null)) {

                                var fn = function () {

                                    if (typeof (OnChangeFinancialInstitution) == 'function') {

                                        OnChangeFinancialInstitution(this);
                                    }

                                    if (typeof (stopEventBubbling) == 'function') {

                                        stopEventBubbling(window.event);
                                    }

                                    return false;
                                };

                                if (ddlFinancialInstitution.hasAttribute('onchange') == true) {

                                    if (typeof (ddlFinancialInstitution.removeEventListener) == 'function') {

                                        ddlFinancialInstitution.removeEventListener('onchange', fn);

                                    }
                                }
                            }

                        }

                        // display the discharge of mortgage section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'chkMortgageDischargeReceived'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'gvMortgageDischarge'), true);

                    }


                } catch (err) {

                    alert(RespondeeScriptFileName + '. Function: ApplyBusinessRulesForRespondee. Event: Initialize. Error: ' + err.description);

                }

            } else {

                try {

                    if (isInternetExplorer11OrAbove == false) {

                        // display the respondee detail section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('ddlRespondeeType'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('txtRespondeeReferenceNo'), true);

                        // display the respondee response section as read-only mode.

                        document.getElementById('divRespondeeResponse').style.display = 'block';
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtArticleNumber'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlPostedTo'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyAddress'), true);

                        // display the financial institution section as read-only mode.

                        var ddlFinancialInstitution = document.getElementById('divFinancialInstitution').all('ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== null) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, true);

                            if ((typeof (ddlFinancialInstitution.hasAttribute) == 'function') && (ddlFinancialInstitution.hasAttribute('onchange') != null)) {

                                var fn = function () {

                                    if (typeof (OnChangeFinancialInstitution) == 'function') {

                                        OnChangeFinancialInstitution(this);
                                    }

                                    if (typeof (stopEventBubbling) == 'function') {

                                        stopEventBubbling(window.event);
                                    }

                                    return false;
                                };

                                if (ddlFinancialInstitution.hasAttribute('onchange') == true) {

                                    if (typeof (ddlFinancialInstitution.removeEventListener) == 'function') {

                                        ddlFinancialInstitution.removeEventListener('onchange', fn);
                                    }

                                }
                            }

                        }

                        // display the discharge of mortgage section as read-only mode.

                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all('chkMortgageDischargeReceived'), true);
                        SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all(getRespondeeControlId('gvMortgageDischarge')), true);

                    } else {

                        // display the respondee detail section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'ddlRespondeeType'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'txtRespondeeReferenceNo'), true);

                        // display the respondee response section as read-only mode.

                        document.getElementById('divRespondeeResponse').style.display = 'block';
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlRespondeeResponse'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtArticleNumber'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlPostedTo'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyName'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyAddress'), true);

                        // display the financial institution section as read-only mode.

                        var ddlFinancialInstitution = getRespondeeControl('divFinancialInstitution', 'ddlFinancialInstitution');

                        if ((ddlFinancialInstitution !== null) && (ddlFinancialInstitution != null)) {

                            SetReadOnlyForRespondee(ddlFinancialInstitution, true);

                            if ((typeof (ddlFinancialInstitution.hasAttribute) == 'function') && (ddlFinancialInstitution.hasAttribute('onchange') != null)) {

                                var fn = function () {

                                    if (typeof (OnChangeFinancialInstitution) == 'function') {

                                        OnChangeFinancialInstitution(this);
                                    }

                                    if (typeof (stopEventBubbling) == 'function') {

                                        stopEventBubbling(window.event);
                                    }

                                    return false;
                                };

                                if (ddlFinancialInstitution.hasAttribute('onchange') == true) {

                                    if (typeof (ddlFinancialInstitution.removeEventListener) == 'function') {

                                        ddlFinancialInstitution.removeEventListener('onchange', fn);
                                    }

                                }
                            }

                        }

                        // display the discharge of mortgage section as read-only mode.

                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'chkMortgageDischargeReceived'), true);
                        SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'gvMortgageDischarge'), true);

                    }

                } catch (err) {

                    alert(RespondeeScriptFileName + '. Function: ApplyBusinessRulesForRespondee. Event: Initialize. Error: ' + err.description);

                }

            }

        } else {

            try {

                if (isInternetExplorer11OrAbove == false) {

                    // display the respondee detail section as read-write mode.

                    SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('ddlRespondeeType'), false);
                    SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('txtRespondeeReferenceNo'), false);

                    // display the respondee response section as read-only mode.

                    SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlRespondeeResponse'), true);
                    SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtArticleNumber'), true);
                    SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlPostedTo'), true);
                    SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyName'), true);
                    SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyAddress'), true);

                    // hide the respondee response section
                    document.getElementById('divRespondeeResponse').style.display = 'none';

                    // display the financial institution section as read-write mode.

                    var ddlFinancialInstitution = document.getElementById('divFinancialInstitution').all('ddlFinancialInstitution');

                    if ((ddlFinancialInstitution !== undefined) && (ddlFinancialInstitution != null)) {

                        SetReadOnlyForRespondee(ddlFinancialInstitution, false);

                        ddlFinancialInstitution.onchange = function () {

                            if (typeof (OnChangeFinancialInstitution) == 'function') {

                                OnChangeFinancialInstitution(this);
                            }

                            if (typeof (stopEventBubbling) == 'function') {

                                stopEventBubbling(window.event);
                            }

                            return false;
                        };
                    }

                    // display the discharge of mortgage section as read-write mode.

                    SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all('chkMortgageDischargeReceived'), false);
                    SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all(getRespondeeControlId('gvMortgageDischarge')), false);

                } else {

                    // display the respondee detail section as read-write mode.

                    SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'ddlRespondeeType'), false);
                    SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'txtRespondeeReferenceNo'), false);

                    // display the respondee response section as read-only mode.

                    SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlRespondeeResponse'), true);
                    SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtArticleNumber'), true);
                    SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlPostedTo'), true);
                    SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyName'), true);
                    SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyAddress'), true);

                    // hide the respondee response section
                    document.getElementById('divRespondeeResponse').style.display = 'none';

                    // display the financial institution section as read-write mode.

                    var ddlFinancialInstitution = getRespondeeControl('divFinancialInstitution', 'ddlFinancialInstitution');

                    if ((ddlFinancialInstitution !== undefined) && (ddlFinancialInstitution != null)) {

                        SetReadOnlyForRespondee(ddlFinancialInstitution, false);

                        ddlFinancialInstitution.onchange = function () {

                            if (typeof (OnChangeFinancialInstitution) == 'function') {

                                OnChangeFinancialInstitution(this);
                            }

                            if (typeof (stopEventBubbling) == 'function') {

                                stopEventBubbling(window.event);
                            }

                            return false;
                        };
                    }

                    // display the discharge of mortgage section as read-write mode.

                    SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all('chkMortgageDischargeReceived'), false);
                    SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all(getRespondeeControlId('gvMortgageDischarge')), false);

                }

            } catch (err) {

                alert(RespondeeScriptFileName + '. Function: ApplyBusinessRulesForRespondee. Event: Initialize. Error: ' + err.description);

            }

        }


    } else {

        // provide read-access only for non-security owners

        // display the respondee detail section as read-only mode.

        try {

            if (isInternetExplorer11OrAbove == false) {

                SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('ddlRespondeeType'), true);
                SetReadOnlyForRespondee(document.getElementById('divRespondeeDetails').all('txtRespondeeReferenceNo'), true);

                // display the respondee response section as read-only mode.

                document.getElementById('divRespondeeResponse').style.display = 'block';
                SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlRespondeeResponse'), true);
                SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtArticleNumber'), true);
                SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('ddlPostedTo'), true);
                SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyName'), true);
                SetReadOnlyForRespondee(document.getElementById('divRespondeeResponse').all('txtThirdPartyAddress'), true);

                // display the financial institution section as read-only mode.

                var ddlFinancialInstitution = document.getElementById('divFinancialInstitution').all('ddlFinancialInstitution');

                if ((ddlFinancialInstitution !== null) && (ddlFinancialInstitution != null)) {

                    SetReadOnlyForRespondee(ddlFinancialInstitution, true);

                    if ((typeof (ddlFinancialInstitution.hasAttribute) == 'function') && (ddlFinancialInstitution.hasAttribute('onchange') != null)) {

                        var fn = function () {

                            if (typeof (OnChangeFinancialInstitution) == 'function') {

                                OnChangeFinancialInstitution(this);
                            }

                            if (typeof (stopEventBubbling) == 'function') {

                                stopEventBubbling(window.event);
                            }

                            return false;
                        };

                        if (ddlFinancialInstitution.hasAttribute('onchange') == true) {

                            if (typeof (ddlFinancialInstitution.removeEventListener) == 'function') {

                                ddlFinancialInstitution.removeEventListener('onchange', fn);
                            }

                        }
                    }

                }

                // display the discharge of mortgage section as read-only mode.

                SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all('chkMortgageDischargeReceived'), true);
                SetReadOnlyForRespondee(document.getElementById('divMortgageDischarge').all(getRespondeeControlId('gvMortgageDischarge')), true);

            } else {

                SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'ddlRespondeeType'), true);
                SetReadOnlyForRespondee(getRespondeeControl('divRespondeeDetails', 'txtRespondeeReferenceNo'), true);

                // display the respondee response section as read-only mode.

                document.getElementById('divRespondeeResponse').style.display = 'block';
                SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlRespondeeResponse'), true);
                SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtArticleNumber'), true);
                SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'ddlPostedTo'), true);
                SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyName'), true);
                SetReadOnlyForRespondee(getRespondeeControl('divRespondeeResponse', 'txtThirdPartyAddress'), true);

                // display the financial institution section as read-only mode.

                var ddlFinancialInstitution = getRespondeeControl('divFinancialInstitution', 'ddlFinancialInstitution');

                if ((ddlFinancialInstitution !== null) && (ddlFinancialInstitution != null)) {

                    SetReadOnlyForRespondee(ddlFinancialInstitution, true);

                    if ((typeof (ddlFinancialInstitution.hasAttribute) == 'function') && (ddlFinancialInstitution.hasAttribute('onchange') != null)) {

                        var fn = function () {

                            if (typeof (OnChangeFinancialInstitution) == 'function') {

                                OnChangeFinancialInstitution(this);
                            }

                            if (typeof (stopEventBubbling) == 'function') {

                                stopEventBubbling(window.event);
                            }

                            return false;
                        };

                        if (ddlFinancialInstitution.hasAttribute('onchange') == true) {

                            if (typeof (ddlFinancialInstitution.removeEventListener) == 'function') {

                                ddlFinancialInstitution.removeEventListener('onchange', fn);
                            }

                        }
                    }

                }

                // display the discharge of mortgage section as read-only mode.

                SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'chkMortgageDischargeReceived'), true);
                SetReadOnlyForRespondee(getRespondeeControl('divMortgageDischarge', 'gvMortgageDischarge'), true);

            }

        } catch (err) {

            alert(RespondeeScriptFileName + '. Function: ApplyBusinessRulesForRespondee. Event: Initialize. Error: ' + err.description);

        }
    }

    if (document.getElementById('hdnIsMortgageDischargeRequestRcvd').value == 'true') {
        var trMortgageDischarge = document.getElementById('trMortgageDischarge');

        if ((trMortgageDischarge !== null)) {

            trMortgageDischarge.style.display = 'inline-block';

        }

        document.getElementById('chkMortgageDischargeReceived').checked = true;
    }
}

/*
*  Removes the options currently present within the HTML select element.
*/
function ClearSelectElement(selector) {

    if ((selector === undefined) || (selector === null)) {

        return;
    }

    if ((selector.tagName.toLowerCase() === 'select') && (selector.id == 'ddlPostedTo')) {

        for (var index = selector.options.length - 1; index >= 1 /* Does not remove the <Please select..> entry */; --index) {

            selector.remove(index);
        }

    }
}


/*
*  Displays or hides the HTML element, depending on the value of the shown parameter.
*/
function DisplayRespondeeField(element, shown) {

    var hidden = ((shown === undefined) || (shown == null)) ? true : (shown === false);

    if ((element === undefined) || (element === null)) {

        return;
    }

    element.style.display = (hidden === true) ? 'none' : 'block';
}


/*
*   Gets the popup dialog caption that is based on the selection
*/
function getRespondeeDialogCaption(selection) {

    var caption = '';

    if (selection == 'Members') {

        caption = 'Registered Linked Members';

    } else if (selection == 'Solicitor') {

        caption = 'Registered Solicitors';

    } else if (selection == 'Financial Institution') {

        caption = 'Registered Financial Institutions';

    } else if (selection == 'Others') {

        caption = 'Others';
    }

    return caption;

}

/*
*   Gets the end-user selection from the checkbox list.
*/
function getCheckBoxListResponse() {

    var response = '';

    var chkboxlist = getRespondeeControl('chklstRespondees');

    var len = ((chkboxlist === undefined) || (chkboxlist === null)) ? -1 : chkboxlist.rows.length;

    for (var index = 0; index < len; ++index) {

        if ((chkboxlist.rows[index].children.length > 0) && (chkboxlist.rows[index].children[0].children.length > 0)) {

            var selected = chkboxlist.rows[index].children[0].children[0].checked;

            if (selected == true) {

                var respondee = chkboxlist.rows[index].outerText.trim();

                if ((respondee != null) && (respondee.length > 0)) {

                    if (response.length > 0) {
                        response += ',';
                    }

                    response += respondee;
                }
            }
        }
    }

    return response;
}

/*
*   Gets the end-user selection from the checkbox list.
*/
function getDropdownListResponse() {

    var response = '';

    var ddl = document.getElementById(getRespondeeServerControlId('ddlInstitutionOrSolicitor'));

    if ((ddl === undefined) || (ddl == null)) {

        ddl = document.getElementById(getRespondeeControlId('ddlInstitutionOrSolicitor'));
    }

    if ((ddl === undefined) || (ddl == null)) {

        return response;
    }

    if (ddl.options.selectedIndex == 0) {

        return response;
    }

    response = ddl.options[ddl.selectedIndex].text.trim();

    return response;
}



/*
*   Gets the end-user selection from the "Others" popup dialog.
*/
function getInputFieldsResponse() {

    var response = '';

    var txtName = document.getElementById(getRespondeeServerControlId('txtEnquiryName'));
    if (txtName == null) {
        txtName = document.getElementById('txtEnquiryName');
    }
    if (txtName != null) {

        if (response.length == 0) {
            response = 'Name=' + txtName.value;
        } else {
            response += 'Name=' + txtName.value;
        }
    }

    var txtPhone = document.getElementById(getRespondeeServerControlId('txtEnquiryPhone'));
    if (txtPhone == null) {
        txtPhone = document.getElementById('txtEnquiryPhone');
    }
    if (txtPhone != null) {

        if (response.length == 0) {
            response = 'Phone=' + txtPhone.value;
        } else {
            response += ',Phone=' + txtPhone.value;
        }
    }

    var txtReferenceNumber = document.getElementById(getRespondeeServerControlId('txtEnquiryReferenceNumber'));
    if (txtReferenceNumber == null) {
        txtReferenceNumber = document.getElementById('txtEnquiryReferenceNumber');
    }
    if (txtReferenceNumber != null) {

        if (response.length == 0) {
            response = 'ReferenceNumber=' + txtReferenceNumber.value;
        } else {
            response += ',ReferenceNumber=' + txtReferenceNumber.value;
        }
    }

    var txtAddress = document.getElementById(getRespondeeServerControlId('txtEnquiryAddress'));
    if (txtAddress == null) {
        txtAddress = document.getElementById('txtEnquiryAddress');
    }
    if (txtAddress != null) {

        if (response.length == 0) {
            response = 'Address=' + txtAddress.value;
        } else {
            response += ',Address=' + txtAddress.value;
        }

    }

    var txtFacsimile = document.getElementById(getRespondeeServerControlId('txtEnquiryFacsimile'));
    if (txtFacsimile == null) {
        txtFacsimile = document.getElementById('txtEnquiryFacsimile');
    }
    if (txtFacsimile != null) {

        if (response.length == 0) {
            response = 'Facsimile=' + txtFacsimile.value;
        } else {
            response += ',Facsimile=' + txtFacsimile.value;
        }
    }

    return response;
}

/*
*   Gets the reference to the HTML element by element ID.
*/
function getRespondeeControl(id, childId) {

    var ctrl = null;

    if ((id === undefined) || (id == null)) {

        return ctrl;
    }

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    if ((childId === undefined) || (childId == null)) {

        if (isInternetExplorer11OrAbove == true) {

            ctrl = document.getElementById(getRespondeeServerControlId(id));

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getRespondeeControlId(id)) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

        } else {

            ctrl = document.getElementById(getRespondeeServerControlId(id));

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getRespondeeControlId(id)) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.all(id) : ctrl;

            ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

        }

    } else {

        if (isInternetExplorer11OrAbove == true) {

            if ((childId !== undefined) && (childId != null) && (typeof (childId) == 'string')) {

                childId = childId.trim();

                ctrl = document.getElementById(getRespondeeServerControlId(childId));

                ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getRespondeeControlId(childId)) : ctrl;

                ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(childId) : ctrl;

            }

        } else {

            var el = document.getElementById(getRespondeeServerControlId(id));

            el = ((el === undefined) || (el == null)) ? document.getElementById(getRespondeeControlId(id)) : el;

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
function getRespondeeControlId(partialId) {

    return RespondeeScriptReferenceId + partialId;
}

/*
*   Gets the server based hidden input HTML element.
*/
function getRespondeeHiddenField(ctrlId) {

    var ctrl = null;

    try {

        if (typeof (ctrlId) == 'string') {

            ctrl = document.getElementById(getRespondeeServerControlId(ctrlId));
        }

    } catch (err) {

        ctrl = null;
    }

    return ctrl;
}

/*
*   Gets the current AJAX HTTP service renderer for the respondee user control.
*/
function getRespondeeHttpService() {

    var xhr = null;

    try {

        if (window.XMLHttpRequest) {

            xhr = new window.XMLHttpRequest();

        } else if (window.ActiveXObject) {

            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

    } catch (err) {

        alert(RespondeeScriptFileName + '. Function: getHttpService. Error: ' + err.description);

    }

    return xhr;
}

/*
*   Gets the registered financial institution address from the
*   provided financial institution entity.
*/
function getFinancialInstitutionAddress(institution) {

    var myAddress = '';

    if ((institution == undefined) || (institution == null)) {

        return myAddress;
    }

    if ((institution.AddressLine1 !== undefined) && (institution.AddressLine1 !== null)) {
        myAddress = institution.AddressLine1.trim();
    }

    if ((institution.AddressLine2 !== undefined) && (institution.AddressLine2 !== null)) {

        if (myAddress.length == 0) {

            myAddress = institution.AddressLine2.trim();

        } else {

            myAddress += ' ' + institution.AddressLine2.trim();
        }

    }

    return myAddress;
}

/*
*   Creates the javascript form based object from the financial institution section form content.
*/
function getFinancialInstitutionForm(attributes, response) {

    var newline = '\r\n';

    response.ddlFinancialInstitution = {};

    var ddlFinancialInstitution = document.getElementById('ddlFinancialInstitution');

    ddlFinancialInstitution = (ddlFinancialInstitution == null) ? document.getElementById(getRespondeeServerControlId('ddlFinancialInstitution')) : ddlFinancialInstitution;

    if (ddlFinancialInstitution == null) {

        response.ddlFinancialInstitution.Value = -1;
        response.ddlFinancialInstitution.Text = '';
        response.ddlFinancialInstitution.Enabled = false;
        response.ddlFinancialInstitution.Selected = false;

        if (response.validationErrors.length == 0) {

            response.validationErrors = '<li>Financial Institution.<br/>Please select from the Financial Institution dropdown list.</li>';

        } else {

            response.validationErrors += '<br/><li>Financial Institution.<br/>Please select from the Financial Institution dropdown list.</li>';
        }

        return reponse;

    } else if (ddlFinancialInstitution.options.length < 1) {

        response.ddlFinancialInstitution.Value = -1;
        response.ddlFinancialInstitution.Text = '';
        response.ddlFinancialInstitution.Enabled = false;
        response.ddlFinancialInstitution.Selected = false;

        ddlFinancialInstitution.style.borderColor = 'red';
        ddlFinancialInstitution.style.borderWidth = '3px';
        ddlFinancialInstitution.title = 'Please select from the Financial Institution dropdown list.';

        ddlFinancialInstitution.onchange = function () {

            this.style.borderColor = '';
            this.style.borderWidth = '1px';
            this.title = '';
        };

        if (response.validationErrors.length == 0) {

            response.validationErrors = '<li>Financial Institution.<br/>Please select from the Financial Institution dropdown list.</li>';

        } else {

            response.validationErrors += '<br/><li>Financial Institution.<br/>Please select from the Financial Institution dropdown list.</li>';
        }

        return reponse;
    }

    ddlFinancialInstitution.style.borderColor = '';
    ddlFinancialInstitution.style.borderWidth = '1px';

    response.ddlFinancialInstitution.Text = ddlFinancialInstitution.options[ddlFinancialInstitution.selectedIndex].text;
    response.ddlFinancialInstitution.Value = window.parseInt(ddlFinancialInstitution.options[ddlFinancialInstitution.selectedIndex].value);
    response.ddlFinancialInstitution.Enabled = true;
    response.ddlFinancialInstitution.Selected = (ddlFinancialInstitution.options.selectedIndex !== -1);

    return response;
}

/*
*   Gets the registered linked member address from the
*   provided linked member entity.
*/
function getLinkedMemberAddress(linkedMember) {

    var myAddress = '';

    if ((linkedMember == undefined) || (linkedMember == null)) {

        return myAddress;
    }

    if ((linkedMember.AddressLine1 !== undefined) && (linkedMember.AddressLine1 !== null)) {
        myAddress = linkedMember.AddressLine1.trim();
    }

    if ((linkedMember.AddressLine2 !== undefined) && (linkedMember.AddressLine2 !== null)) {

        if (myAddress.length == 0) {

            myAddress = linkedMember.AddressLine2.trim();

        } else {

            myAddress += ' ' + linkedMember.AddressLine2.trim();
        }

    }

    if ((linkedMember.Suburb !== undefined) && (linkedMember.Suburb !== null)) {

        if (myAddress.length == 0) {

            myAddress = linkedMember.Suburb.trim();

        } else {

            myAddress += ' ' + linkedMember.Suburb.trim();
        }

    }

    if ((linkedMember.State !== undefined) && (linkedMember.State !== null)) {

        if (myAddress.length == 0) {

            myAddress = linkedMember.State.trim();

        } else {

            myAddress += ' ' + linkedMember.State.trim();
        }

    }

    if ((linkedMember.Postcode !== undefined) && (linkedMember.Postcode !== null)) {

        if (myAddress.length == 0) {

            myAddress = linkedMember.Postcode.trim();

        } else {

            myAddress += ' ' + linkedMember.Postcode.trim();
        }

    }

    return myAddress;
}

/*
*   Creates the javascript form based object from the mortgage discharge section form content.
*/
function getMortgageDischargeContent(div, response) {

    var newline = '\r\n';

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    var isInternetExplorer7 = !!(navigator.userAgent.match(/Mozilla/) && navigator.userAgent.match(/MSIE 7.0/));

    var chkbox = null;

    if (isInternetExplorer11OrAbove == false) {

        chkbox = div.all('chkMortgageDischargeReceived');

        chkbox = ((chkbox === undefined) || (chkbox == null)) ? getRespondeeControl('chkMortgageDischargeReceived') : chkbox;

    } else {

        chkbox = getRespondeeControl('chkMortgageDischargeReceived');
    }

    response.mortgageDischarged = false;

    if ((chkbox !== undefined) && (chkbox != null)) {

        response.mortgageDischarged = chkbox.checked;
    }

    response.discharges = new Array();

    if ((div === undefined) || (div === null)) {

        if (response.validationErrors.length == 0) {

            response.validationErrors = '<li>Mortgage Discharge.<br/>Cannot access the mortgage discharge form content.</li>';

        } else {

            response.validationErrors += '<br/><li>Mortgage Discharge.<br/>Cannot access the mortgage discharge form content.</li>';
        }

        return response;
    }

    var elements = div.getElementsByTagName('table');

    if ((elements === undefined) || (elements == null) || (elements.length == 0)) {

        // The linked members may not have been assigned to registered document types.

        return response;
    }

    // The ComponentArt gridview is represented by a single HTML table within the second HTML DIV element.

    var trMortgageDischarge = document.getElementById('trMortgageDischarge');

    if ((trMortgageDischarge == null) || (trMortgageDischarge.cells.length == 0)) {

        if (response.validationErrors.length == 0) {

            response.validationErrors = '<li>Mortgage Discharge.<br/>Cannot access the mortgage discharge form content.</li>';

        } else {

            response.validationErrors += '<br/><li>Mortgage Discharge.<br/>Cannot access the mortgage discharge form content.</li>';
        }

        return response;
    }

    //var divs = trMortgageDischarge.getElementsByTagName('div');

    //var size = ((divs === undefined) || (divs == null)) ? 0 : divs.length;

    //if (size == 0) {

    //    if (response.validationErrors.length == 0) {

    //        response.validationErrors = '<li>Mortgage Discharge.<br/>Cannot access the mortgage discharge form content.</li>';

    //    } else {

    //        response.validationErrors += '<br/><li>Mortgage Discharge.<br/>Cannot access the mortgage discharge form content.</li>';
    //    }

    //    return response;
    //}

    //var containers = null;

    //var idPrefix = 'ctl00_MainContent_Respondee_gvMortgageDischarge_0_4';

    //for (var jndex = 0; jndex < size; ++jndex) {

    //    var container = divs[jndex];

    //    if ((container !== undefined) && (container != null) && (container.children.length > 0)) {

    //        if ((container.id.indexOf(idPrefix) == 0) && (container.id.length > idPrefix.length)) {

    //            if (containers == null) {

    //                containers = new Array();
    //            }

    //            containers.push(container);
    //        }
    //    }
    //}

    //if ((containers == null) || (containers.length == 0)) {

    //    if (response.validationErrors.length == 0) {

    //        response.validationErrors = '<li>Mortgage Discharge.<br/>Cannot access the mortgage discharge form content.</li>';

    //    } else {

    //        response.validationErrors += '<br/><li>Mortgage Discharge.<br/>Cannot access the mortgage discharge form content.</li>';
    //    }

    //    return response;

    //}

    //var data = ctl00_MainContent_Respondee_gvMortgageDischarge.Data;

    //var prefix = 'ctl00_MainContent_Respondee_gvMortgageDischarge_0_4';

    //for (var index = 0; index < containers.length; ++index) {

    //    var discharge = {};

    //    var row = data[index];

    //    var controlName = prefix;

    //    controlName += '_' + (index) + '_';

    //    controlName += 'lblVerificationDocument'

    //    var selector = document.getElementById(controlName);

    //    if ((selector === undefined) || (selector == null)) {

    //        discharge.VerificationDocument = null;

    //        discharge.MemberName = '';

    //        response.discharges.push(discharge);

    //    } else {

    //        discharge.VerificationDocument = selector.innerText.trim();

    //        if (isInternetExplorer7 == true) {

    //            if ((row instanceof Array == true) && (row.length > 0)) {

    //                discharge.MemberName = row[1].trim();

    //            } else {

    //                discharge.MemberName = '';
    //            }

    //        } else {

    //            if ((Array.isArray(row) === true) && (row.length > 0)) {

    //                discharge.MemberName = row[1].trim();

    //            } else {

    //                discharge.MemberName = '';
    //            }
    //        }

    //        response.discharges.push(discharge);
    //    }

    //}

    return response;
}

/*
*   Creates the javascript form based object from the mortgage discharge section form content.
*/
function getMortgageDischargeForm(attributes, response) {

    var div = getRespondeeControl('divMortgageDischarge');

    response = getMortgageDischargeContent(div, response);
}

/*
*   Display the associated posted to information that corresponds to the respondee request
*   for 'Member requested documents to be posted'. within the Posted To drop down list.
*/
function getPostedToDetails(div, ddlPostedTo, securityRequestId) {

    if ((div === undefined) || (div == null)) {

        return;
    }

    if ((ddlPostedTo === undefined) || (ddlPostedTo == null)) {

        return;
    }

    if ((securityRequestId === undefined) || (securityRequestId == null)) {

        return;
    }

    /*
    *   Get the Posted To selection.
    */

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    var cellPostedTo = null;

    if (isInternetExplorer11OrAbove == false) {

        cellPostedTo = div.all('cellPostedTo');

    } else {

        cellPostedTo = getRespondeeControl(div.id, 'cellPostedTo');
    }

    if ((cellPostedTo !== undefined) && (cellPostedTo != null)) {

        if (cellPostedTo.style.display != 'inline-block') {
            cellPostedTo.style.display = 'inline-block';
        }

    }

    var selection = ddlPostedTo.options[ddlPostedTo.selectedIndex].text;

    var cellThirdPartyName = null;

    if (isInternetExplorer11OrAbove == false) {

        cellThirdPartyName = div.all('cellThirdPartyName');

    } else {

        cellThirdPartyName = getRespondeeControl(div.id, 'cellThirdPartyName');
    }

    if ((cellThirdPartyName !== undefined) && (cellThirdPartyName != null)) {

        if (cellThirdPartyName.style.display != 'inline-block') {
            cellThirdPartyName.style.display = 'inline-block';
        }

    }

    var txtThirdPartyName = null;

    if (isInternetExplorer11OrAbove == false) {

        txtThirdPartyName = div.all(getRespondeeServerControlId('txtThirdPartyName'));

        txtThirdPartyName = ((txtThirdPartyName === undefined) || (txtThirdPartyName == null)) ? div.all('txtThirdPartyName') : txtThirdPartyName;

    } else {

        txtThirdPartyName = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyName'));
    }

    DisplayRespondeeField(txtThirdPartyName, true);

    if ((txtThirdPartyName !== undefined) && (txtThirdPartyName != null)) {

        txtThirdPartyName.value = '';
    }

    var cellThirdPartyAddress = null;

    if (isInternetExplorer11OrAbove == false) {

        cellThirdPartyAddress = div.all('cellThirdPartyAddress');

    } else {

        cellThirdPartyAddress = getRespondeeControl(div.id, 'cellThirdPartyAddress');

    }

    if ((cellThirdPartyAddress !== undefined) && (cellThirdPartyAddress != null)) {

        if (cellThirdPartyAddress.style.display != 'inline-block') {
            cellThirdPartyAddress.style.display = 'inline-block';
        }

    }

    var txtThirdPartyAddress = null;

    if (isInternetExplorer11OrAbove == false) {

        txtThirdPartyAddress = div.all(getRespondeeServerControlId('txtThirdPartyAdress'));

        txtThirdPartyAddress = ((txtThirdPartyAddress === undefined) || (txtThirdPartyAddress == null)) ? div.all('txtThirdPartyAddress') : txtThirdPartyAddress;

    } else {

        txtThirdPartyAddress = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyAdress'));
    }

    DisplayRespondeeField(txtThirdPartyAddress, true);

    if ((txtThirdPartyAddress !== undefined) && (txtThirdPartyAddress != null)) {

        txtThirdPartyAddress.value = '';
    }

    var cellArticleNumber = null;

    if (isInternetExplorer11OrAbove == false) {

        cellArticleNumber = div.all('cellArticleNumber');

    } else {

        cellArticleNumber = getRespondeeControl(div.id, 'cellArticleNumber');
    }

    if ((cellArticleNumber !== undefined) && (cellArticleNumber != null)) {

        if (cellArticleNumber.style.display != 'inline-block') {
            cellArticleNumber.style.display = 'inline-block';
        }
    }

    var txtArticleNumber = null;

    if (isInternetExplorer11OrAbove == false) {

        txtArticleNumber = div.all(getRespondeeServerControlId('txtArticleNumber'));

        txtArticleNumber = ((txtArticleNumber === undefined) || (txtArticleNumber == null)) ? div.all('txtArticleNumber') : txtArticleNumber;

    } else {

        txtArticleNumber = getRespondeeControl(div.id, getRespondeeServerControlId('txtArticleNumber'));
    }

    DisplayRespondeeField(txtArticleNumber, true);

    if ((txtArticleNumber !== undefined) && (txtArticleNumber != null)) {

        txtArticleNumber.value = '';

    }

    if (typeof (GetRespondeesBySecurityRequestAndResponseType) == 'function') {

        var respondees = GetRespondeesBySecurityRequestAndResponseType(securityRequestId, selection);

        // Note: We can have multiple registered linked member respondees.

        if (respondees.length == 1) {

            // get the response article id number from the single respondee that resides within the collection.

            txtArticleNumber.value = respondees[0].ResponseArticleIDNumber.trim();

        } else if (respondees.length > 1) {

            txtArticleNumber.value = respondees[respondees.length - 1].ResponseArticleIDNumber.trim();
        }
    }

    if (typeof (GetRespondeeContactDetailsBySecurityRequestAndResponseType) == 'function') {

        // get the registered respondee response contact details

        // Note: We can have multiple registered linked member respondees.

        var response = GetRespondeeContactDetailsBySecurityRequestAndResponseType(securityRequestId, selection);

        if ((response != null) && (response.length > 0)) {

            var contactDetails = JSON.parse(response);

            if ((contactDetails != null) && (contactDetails.length == 1)) {

                if (contactDetails[0].SolicitorID != null) {

                    var solicitor = null;

                    if (typeof (GetSolicitor) == 'function') {

                        var serialized = GetSolicitor(contactDetails[0].SolicitorID);

                        if ((serialized !== null) && (serialized.length > 0)) {

                            solicitor = JSON.parse(serialized);
                        }
                    }

                    if (solicitor != null) {

                        txtThirdPartyName.value = solicitor.Name;

                        if (typeof (getSolicitorAddress) == 'function') {
                            txtThirdPartyAddress.value = getSolicitorAddress(solicitor);
                        }
                    }

                } else if (contactDetails[0].FinancialInstitutionID != null) {

                    var institution = null;

                    if (typeof (GetFinancialInstitution) == 'function') {

                        var serialized = GetFinancialInstitution(contactDetails[0].FinancialInstitutionID);

                        if ((serialized !== null) && (serialized.length > 0)) {

                            institution = JSON.parse(serialized);
                        }
                    }

                    if ((txtThirdPartyName !== undefined) && (txtThirdPartyName != null) && (institution != null)) {

                        txtThirdPartyName.value = institution.Name;

                        if ((txtThirdPartyAddress !== undefined) && (txtThirdPartyAddress != null) && (typeof (getFinancialInstitutionAddress) == 'function')) {

                            txtThirdPartyAddress.value = getFinancialInstitutionAddress(institution);
                        }

                    }

                } else if (contactDetails[0].LinkedMemberID != null) {

                    var linkedMember = null;

                    if (typeof (GetLinkedMember) == 'function') {

                        linkedMember = GetLinkedMember(contactDetails[0].LinkedMemberID);
                    }

                    if (linkedMember !== null) {

                        if ((txtThirdPartyName !== undefined) && (txtThirdPartyName != null)) {

                            txtThirdPartyName.value = linkedMember.MemberName;

                        }

                        if (typeof (getLinkedMemberAddress) == 'function') {

                            if ((txtThirdPartyAddress !== undefined) && (txtThirdPartyAddress != null)) {

                                txtThirdPartyAddress.value = getLinkedMemberAddress(linkedMember);
                            }
                        }
                    }

                } else {

                    if ((txtThirdPartyName !== undefined) && (txtThirdPartyName != null)) {
                        txtThirdPartyName.value = contactDetails[0].FullName.trim();
                    }

                    if ((txtThirdPartyAddress !== undefined) && (txtThirdPartyAddress != null)) {
                        txtThirdPartyAddress.value = contactDetails[0].Address.trim();
                    }
                }

            }

        }
    }

}

/*
*   Creates the javascript form based object from the respondee detail section form content.
*/
function getRespondeeDetailsForm(attributes, response) {

    var div = document.getElementById('divRespondeeDetails');

    response = getRespondeeDetailsContent(div, response);
}

/*
*  Acculumates the respondee details section form content into a javascript object.
*/
function getRespondeeDetailsContent(div, response) {

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    var ddlRespondeeType = null;

    if (isInternetExplorer11OrAbove == false) {

        ddlRespondeeType = div.all('ddlRespondeeType');

    } else {

        ddlRespondeeType = getRespondeeControl('ddlRespondeeType');
    }

    if ((ddlRespondeeType !== undefined) && (ddlRespondeeType != null) && (ddlRespondeeType.options.length > 0)) {

        // exists within the first HTML table

        var option = ddlRespondeeType.options[ddlRespondeeType.options.selectedIndex].text;

        response.ddlRespondeeType = option;
    }

    var txtRespondeeReferenceNo = getRespondeeControl('txtRespondeeReferenceNo');

    var containers = div.getElementsByTagName('table');

    var builder = new stringBuilder();

    var newline = '\r\n';

    if (containers.length > 1 /* ddlRespondeeType resides within the first table. */) {

        var prefix = 'ctl00$MainContent$Respondee$rptRespondees$ctl';

        response.repeaters = new Array();

        for (var index = 1; index < containers.length; ++index) {

            var repeater = {};

            repeater.ErrorMessage = '';

            var controlName = prefix;

            if (index <= 10) {
                controlName += '0' + (index - 1) + '$';
            } else {
                controlName += (index - 1) + '$';
            }

            {
                var elements = null;

                elements = document.getElementsByName(controlName + 'txtRespondeeName');
                if ((elements != null) && (elements.length == 1)) {

                    repeater.txtRespondeeName = elements[0].value.trim();

                    if (repeater.txtRespondeeName.length == 0) {
                        elements[0].style.borderColor += 'red';
                        elements[0].style.borderWidth += '3px';
                        elements[0].title = 'Please provide the respondee name.';
                    }

                    elements[0].onkeypress = function () {

                        this.style.borderColor = '';
                        this.style.borderWidth = '1px';
                        this.title = '';
                    };

                    elements = null;
                }

                /// Author: Paul Djimritsch
                /// Requestor: Serge Boyko
                /// Date: 2 July 2014
                /// Amendments: The infrastructure with the reference number for the respondee(s), particularily linked members,
                /// has been altered from a reference number per respondee to a reference number for all respondees.

                /*
                elements = document.getElementsByName(controlName + 'txtRespondeeReferenceNo');
                if ((elements != null) && (elements.length == 1)) {

                    repeater.txtRespondeeReferenceNo = elements[0].value.trim();

                    if (repeater.txtRespondeeReferenceNo.length < 10) {
                        elements[0].style.borderColor += 'red';
                        elements[0].style.borderWidth += '3px';
                        elements[0].title = 'Please provide the respondee reference number.';
                    }

                    elements[0].onkeypress = function () {

                        this.style.borderColor = '';
                        this.style.borderWidth = '1px';
                        this.title = '';

                    };

                    elements = null;
                }
                */

                if (repeater.txtRespondeeName !== undefined) {

                    repeater.txtRespondeeReferenceNo = '';

                    if ((txtRespondeeReferenceNo !== undefined) && (txtRespondeeReferenceNo != null) && (txtRespondeeReferenceNo.value.length > 0)) {

                        repeater.txtRespondeeReferenceNo = txtRespondeeReferenceNo.value.trim();
                    }

                    elements = document.getElementsByName(controlName + 'txtRespondeePhone');
                    if ((elements != null) && (elements.length == 1)) {
                        repeater.txtRespondeePhone = elements[0].value.trim();
                        elements = null;
                    }

                    elements = document.getElementsByName(controlName + 'txtRespondeeAddress');
                    if ((elements != null) && (elements.length == 1)) {
                        repeater.txtRespondeeAddress = elements[0].value.trim();
                        elements = null;
                    }

                    elements = document.getElementsByName(controlName + 'txtRespondeeFacsimile');
                    if ((elements != null) && (elements.length == 1)) {
                        repeater.txtRespondeeFacsimile = elements[0].value.trim();
                        elements = null;
                    }

                    elements = document.getElementsByName(controlName + 'RespondeeId'); // hidden field
                    if ((elements != null) && (elements.length == 1)) {
                        repeater.RespondeeId = elements[0].value;
                        elements = null;
                    }

                    elements = document.getElementsByName(controlName + 'RespondeeType'); // hidden field
                    if ((elements != null) && (elements.length == 1)) {
                        repeater.RespondeeType = elements[0].value;
                        elements = null;
                    }

                    elements = document.getElementsByName(controlName + 'RespondeeSubType'); // hidden field
                    if ((elements != null) && (elements.length == 1)) {
                        repeater.RespondeeSubType = elements[0].value;
                        elements = null;
                    }

                    elements = document.getElementsByName(controlName + 'RespondeeSubTypeId'); // hidden field
                    if ((elements != null) && (elements.length == 1)) {
                        repeater.RespondeeSubTypeId = elements[0].value;
                        elements = null;
                    }
                }
            }

            if (repeater.txtRespondeeName !== undefined) {

                if ((repeater.txtRespondeeName == null) || (repeater.txtRespondeeName.length == 0)) {

                    if (repeater.ErrorMessage.length == 0) {

                        repeater.ErrorMessage = '<li>Respondee Name.<br/>Please provide the respondee name.</li>';

                    } else {

                        repeater.ErrorMessage += '<br/><li>Respondee Name.<br/>Please provide the respondee name.</li>';
                    }

                }

                /*
                if ((repeater.txtRespondeeReferenceNo === undefined) || (repeater.txtRespondeeReferenceNo === null)) {
    
                    if (repeater.ErrorMessage.length == 0) {
    
                        repeater.ErrorMessage = '<li>Respondee Reference Number.<br/>Please provide the respondee reference number.</li>';
    
                    } else {
    
                        repeater.ErrorMessage += '<br/><li>Respondee Reference Number.<br/>Please provide the respondee reference number.</li>';
                    }
    
                } else if (repeater.txtRespondeeReferenceNo.length == 0) {
    
                    if (repeater.ErrorMessage.length == 0) {
    
                        repeater.ErrorMessage = '<li>Respondee Reference Number.<br/>Please provide the respondee reference number.</li>';
    
                    } else {
    
                        repeater.ErrorMessage += '<br/><li>Respondee Reference Number.<br/>Please provide the respondee reference number.</li>';
                    }
    
                } else if (repeater.txtRespondeeReferenceNo.length < 10) {
    
                    if (repeater.ErrorMessage.length == 0) {
    
                        repeater.ErrorMessage = '<li>Respondee Reference Number.<br/>Please provide the respondee reference number.</li>';
    
                    } else {
    
                        repeater.ErrorMessage += '<br/><li>Respondee Reference Number.<br/>Please provide the respondee reference number.</li>';
                    }
                }
                */

                if ((repeater.txtRespondeeAddress === undefined) || (repeater.txtRespondeeAddress == null)) {

                    if (repeater.ErrorMessage.length == 0) {

                        repeater.ErrorMessage = '<li>Respondee Address.<br/>Please provide the respondee address.</li>';

                    } else {

                        repeater.ErrorMessage += '<br/><li>Respondee Address.<br/>Please provide the respondee address.</li>';
                    }

                } else if (repeater.txtRespondeeAddress.length == 0) {

                    if (repeater.ErrorMessage.length == 0) {

                        repeater.ErrorMessage = '<li>Respondee Address.<br/>Please provide the respondee address.</li>';

                    } else {

                        repeater.ErrorMessage += '<br/><li>Respondee Address.<br/>Please provide the respondee address.</li>';
                    }

                }

                response.repeaters.push(repeater);

                if (repeater.ErrorMessage.length > 0) {

                    if (builder.length() == 0) {

                        builder.appendLine(repeater.ErrorMessage);

                    } else {

                        builder.trim();

                        if ((builder.toString() != repeater.ErrorMessage) || (builder.toString().indexOf(repeater.ErrorMessage) < 0)) {

                            builder.appendLine(repeater.ErrorMessage);
                        }

                    }
                }

            }

        }

    }

    if (builder.length() > 0) {

        response.validationErrors = builder.toString();
    }

    return response;
}

/*
*  Creates the javascript form based object from the respondee response section form content.
*/
function getRespondeeResponseContent(div, response) {

    var newline = '\r\n';

    var ddlResponseTypes = div.all('ddlResponseTypes');

    ddlResponseTypes = (ddlResponseTypes == null) ? document.getElementById('ddlResponseTypes') : ddlResponseTypes;

    response.RespondeeResponse = {};

    // get the respondee response type selection
    response.RespondeeResponse.ResponseTypes = {};
    response.RespondeeResponse.ResponseTypes.Index = window.parseInt(ddlResponseTypes.options[ddlResponseTypes.options.selectedIndex].value);
    response.RespondeeResponse.ResponseTypes.Text = ddlResponseTypes.options[ddlResponseTypes.options.selectedIndex].text.trim();

    if (response.RespondeeResponse.ResponseTypes.Text.length === 0) {

        if (response.validationErrors.length == 0) {

            response.validationErrors = '<li>Respondee Response.<br/>Please select the repondee response type.</li>';

        } else {

            response.validationErrors += '<br/><li>Respondee Response.<br/>Please select the repondee response type.</li>';
        }

        return response;

    } else if (response.RespondeeResponse.ResponseTypes.Index <= 0) {

        if (response.validationErrors.length == 0) {

            response.validationErrors = '<li>Respondee Response.<br/>Please select the repondee response type.</li>';

        } else {

            response.validationErrors += '<br/><li>Respondee Response.<br/>Please select the repondee response type.</li>';
        }

        return response;

    }

    if (response.RespondeeResponse.ResponseTypes.Text === 'Documents to be collected from Head Office.') {

        return response;
    }

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    if (response.RespondeeResponse.ResponseTypes.Text === 'Member requested documents to be posted.') {

        var txtArticleNumber = null;

        if (isInternetExplorer11OrAbove == false) {

            txtArticleNumber = div.all('txtArticleNumber');

            txtArticleNumber = (txtArticleNumber == null) ? document.getElementById('txtArticleNumber') : txtArticleNumber;

        } else {

            txtArticleNumber = getRespondeeControl(div.id, 'txtArticleNumber');
        }


        response.RespondeeResponse.ArticleNumber = ((txtArticleNumber === undefined) || (txtArticleNumber == null)) ? '' : txtArticleNumber.value.trim();

        if (response.RespondeeResponse.ArticleNumber.length === 0) {

            if (response.validationErrors.length == 0) {

                response.validationErrors = '<li>Respondee Response.<br/>Please provide the Certified Post Details - Article ID Number.</li>';

            } else {

                response.validationErrors += '<br/><li>Respondee Response.<br/>Please provide the Certified Post Details - Article ID Number.</li>';
            }

            if ((txtArticleNumber !== undefined) && (txtArticleNumber != null)) {

                txtArticleNumber.style.borderColor = 'red';
                txtArticleNumber.style.borderWidth = '3px';
            }
        }
        else {

            if ((txtArticleNumber !== undefined) && (txtArticleNumber != null)) {

                txtArticleNumber.style.borderColor = '';
                txtArticleNumber.style.borderWidth = '1px';

            }
        }

        if ((txtArticleNumber !== undefined) && (txtArticleNumber != null)) {

            txtArticleNumber.onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };

        }

        var ddlPostedTo = null;

        if (isInternetExplorer11OrAbove == false) {

            ddlPostedTo = div.all('ddlPostedTo');

            ddlPostedTo = (ddlPostedTo == null) ? document.getElementById('ddlPostedTo') : ddlPostedTo;

        } else {

            ddlPostedTo = getRespondeeControl(div.id, 'ddlPostedTo');
        }

        response.RespondeeResponse.PostedTo = {};

        if ((ddlPostedTo !== undefined) && (ddlPostedTo != null)) {

            response.RespondeeResponse.PostedTo.Index = window.parseInt(ddlPostedTo.options[ddlPostedTo.options.selectedIndex].value);
            response.RespondeeResponse.PostedTo.Text = ddlPostedTo.options[ddlPostedTo.options.selectedIndex].text;

        } else {

            response.RespondeeResponse.PostedTo.Index = -1;
            response.RespondeeResponse.PostedTo.Text = '';

        }

        if (response.RespondeeResponse.PostedTo.Index <= 0) {

            if (response.validationErrors.length == 0) {

                response.validationErrors = '<li>Respondee Response Posted To.<br/>.Please select a <Posted To> option.</li>';

            } else {

                response.validationErrors += '<br/><li>Respondee Response Posted To.<br/>.Please select a <Posted To> option.</li>';
            }

            if ((ddlPostedTo !== undefined) && (ddlPostedTo != null)) {

                ddlPostedTo.style.borderColor = 'red';
                ddlPostedTo.style.borderWidth = '3px';
            }

        }

        var txtThirdPartyName = null;

        if (isInternetExplorer11OrAbove == false) {

            txtThirdPartyName = div.all('txtThirdPartyName');

            txtThirdPartyName = (txtThirdPartyName == null) ? document.getElementById('txtThirdPartyName') : txtThirdPartyName;

        } else {

            txtThirdPartyName = getRespondeeControl(div.id, 'txtThirdPartyName');
        }

        response.RespondeeResponse.ThirdPartyName = ((txtThirdPartyName === undefined) || (txtThirdPartyName == null)) ? '' : txtThirdPartyName.value.trim();

        if (response.RespondeeResponse.ThirdPartyName.length == 0) {

            if (response.validationErrors.length == 0) {

                response.validationErrors = '<li>Respondee Response.<br/>Please provide the Third Party Name.</li>';

            } else {

                response.validationErrors += '<br/><li>Respondee Response.<br/>Please provide the Third Party Name.</li>';

            }

            if ((txtThirdPartyName !== undefined) && (txtThirdPartyName != null)) {

                txtThirdPartyName.style.borderColor = 'red';
                txtThirdPartyName.style.borderWidth = '3px';

            }

        } else {

            if ((txtThirdPartyName !== undefined) && (txtThirdPartyName != null)) {

                txtThirdPartyName.style.borderColor = '';
                txtThirdPartyName.style.borderWidth = '1px';

            }
        }

        if ((txtThirdPartyName !== undefined) && (txtThirdPartyName != null)) {

            txtThirdPartyName.onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };
        }

        var txtThirdPartyAddress = null;

        if (isInternetExplorer11OrAbove == false) {

            txtThirdPartyAddress = div.all('txtThirdPartyAddress');

            txtThirdPartyAddress = (txtThirdPartyAddress == null) ? document.getElementById('txtThirdPartyAddress') : txtThirdPartyAddress;

        } else {

            txtThirdPartyAddress = getRespondeeControl(div.id, 'txtThirdPartyAddress');
        }

        response.RespondeeResponse.ThirdPartyAddress = ((txtThirdPartyAddress === undefined) || (txtThirdPartyAddress == null)) ? '' : txtThirdPartyAddress.value.trim();

        if (response.RespondeeResponse.ThirdPartyAddress.length == 0) {

            if (response.validationErrors.length == 0) {

                response.validationErrors = '<li>Respondee Response.<br/>Please provide the Third Party Address.</li>';

            } else {

                response.validationErrors += '<br/><li>Respondee Response.<br/>Please provide the Third Party Address.</li>';

            }

            if ((txtThirdPartyAddress !== undefined) && (txtThirdPartyAddress != null)) {

                txtThirdPartyAddress.style.borderColor = 'red';
                txtThirdPartyAddress.style.borderWidth = '3px';
            }

        } else {

            if ((txtThirdPartyAddress !== undefined) && (txtThirdPartyAddress != null)) {

                txtThirdPartyAddress.style.borderColor = '';
                txtThirdPartyAddress.style.borderWidth = '1px';
            }
        }

        if ((txtThirdPartyAddress !== undefined) && (txtThirdPartyAddress != null)) {

            txtThirdPartyAddress.onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };
        }
    }

    if (response.RespondeeResponse.ResponseTypes.Text === 'No response from Members. Documents to be posted.') {

        var txtArticleNumber = null;

        if (isInternetExplorer11OrAbove == false) {

            txtArticleNumber = div.all('txtArticleNumber');

            txtArticleNumber = (txtArticleNumber == null) ? document.getElementById('txtArticleNumber') : txtArticleNumber;

        } else {

            txtArticleNumber = getRespondeeControl(div.id, 'txtArticleNumber');
        }

        response.RespondeeResponse.ArticleNumber = ((txtArticleNumber === undefined) || (txtArticleNumber == null)) ? '' : txtArticleNumber.value.trim();

        if (response.RespondeeResponse.ArticleNumber.length === 0) {

            if (response.validationErrors.length == 0) {

                response.validationErrors = '<li>Respondee Response.<br/>Please provide the Certified Post Details - Article ID Number.</li>';

            } else {

                response.validationErrors += '<br/><li>Respondee Response.<br/>Please provide the Certified Post Details - Article ID Number.</li>';
            }

            if ((txtArticleNumber !== undefined) && (txtArticleNumber != null)) {

                txtArticleNumber.style.borderColor = 'red';
                txtArticleNumber.style.borderWidth = '3px';
            }
        }
        else {

            if ((txtArticleNumber !== undefined) && (txtArticleNumber != null)) {

                txtArticleNumber.style.borderColor = '';
                txtArticleNumber.style.borderWidth = '1px';
            }
        }

        if ((txtArticleNumber !== undefined) && (txtArticleNumber != null)) {

            txtArticleNumber.onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };
        }
    }

    return response;
}

/*
*  Creates the javascript form based object from the respondee response section form content.
*/
function getRespondeeResponseForm(attributes, response) {

    var div = document.getElementById('divRespondeeResponse');

    response = getRespondeeResponseContent(div, response);
}

/*
*   Gets the registered attributes of the security request.
*/
function getSecurityRequestAttributesForRespondee() {

    var attributes = {};

    var ctrl = null;

    ctrl = getRespondeeControl('securityRequestStage');

    attributes.stage = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRespondeeControl('securityRequestStatus');

    attributes.status = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRespondeeControl('currentEmployeeNo');

    attributes.currentEmployeeNo = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRespondeeControl('securityRequestOwner');

    attributes.securityRequestOwner = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRespondeeControl('securityRequestId');

    attributes.securityRequestId = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    return attributes;
}

/*
*  Gets the control identity with repsect to the enclosing web page.
*/
function getRespondeeServerControlId(partialId) {

    return RespondeeServerReferenceId + partialId;
}

/*
*   Gets the registered solicitor address from the provided
*   solicitor entity.
*/
function getSolicitorAddress(solicitor) {

    var myAddress = '';

    if ((solicitor == undefined) || (solicitor == null)) {

        return myAddress;
    }

    if ((solicitor.AddressLine1 !== undefined) && (solicitor.AddressLine1 !== null)) {
        myAddress = solicitor.AddressLine1.trim();
    }

    if ((solicitor.AddressLine2 !== undefined) && (solicitor.AddressLine2 !== null)) {

        if (myAddress.length == 0) {

            myAddress = solicitor.AddressLine2.trim();

        } else {

            myAddress += ' ' + solicitor.AddressLine2.trim();
        }

    }

    return myAddress;
}

/*
*  Initializes the appearance of the popup ComponentArt dialog
*/
function initializeRespondeeDialog(caption) {

    var dlg = {};

    if ((caption !== undefined) && (caption !== null) && (caption.length > 0)) {

        if (caption.indexOf('Others', 0) >= 0) {

            var spn = document.getElementById('spnOthers');

            if (spn == null) {
                spn = document.getElementById(getRespondeeControlId('spnOthers'));
            }

            if (spn != null) {
                spn.innerText = caption;
                dlg.caption = caption;
            }

            try {

                dlg.window = dlgOthers;
                dlg.canDisplay = true;

            } catch (err) {

                dlg.window = eval(document.getElementById(getRespondeeControlId('dlgRespondees')));
                dlg.canDisplay = false;

            }

        } else if (caption.indexOf('Registered Linked Members') >= 0) {

            var spn = document.getElementById('spnRespondees');

            if (spn == null) {
                spn = document.getElementById(getRespondeeControlId('spnRespondees'));
            }

            if (spn != null) {
                spn.innerText = caption;
                dlg.caption = caption;
            }

            var button = document.getElementById('AcceptRespondees');
            if (button != null) {

                if (caption === 'Registered Linked Members') {

                    button.value = 'Add Members';
                }
            }

            try {

                dlg.window = dlgRespondees;
                dlg.canDisplay = true;

            } catch (err) {

                dlg.window = eval(document.getElementById(getRespondeeControlId('dlgRespondees')));
                dlg.canDisplay = false;

            }

        } else if ((caption.indexOf('Registered Solicitors') >= 0) || (caption.indexOf('Registered Financial Institutions') >= 0)) {

            var spn = document.getElementById('spnInstitutionOrSolicitor');

            if (spn == null) {
                spn = document.getElementById(getRespondeeControlId('spnInstitutionOrSolicitor'));
            }

            if (spn != null) {
                spn.innerText = caption;
                dlg.caption = caption;
            }

            var button = document.getElementById('AcceptInstitutionOrSolicitor');
            if (button != null) {

                if (caption === 'Registered Solicitors') {

                    button.value = 'Add Solicitors';

                } else if (caption === 'Registered Financial Institutions') {

                    button.value = 'Add Institutions';
                }
            }

            try {

                dlg.window = dlgInstitutionOrSolicitor;
                dlg.canDisplay = true;

            } catch (err) {

                dlg.window = eval(document.getElementById(getRespondeeControlId('dlgInstitutionOrSolicitor')));
                dlg.canDisplay = false;

            }
        }

    }

    return dlg;
}

/*
*  Assigns the selected verify signature document for the linked member
*  within the verify document signature drop down list.
*/
function InitializeDischargeMortgage() {

    // The ComponentArt gridview is represented by a single HTML table within the second HTML DIV element.

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    var isInternetExplorer7 = !!(navigator.userAgent.match(/Mozilla/) && navigator.userAgent.match(/MSIE 7.0/));

    var row = document.getElementById('trMortgageDischarge');

    if ((row == null) || (row.cells.length == 0)) {

        return;
    }

    var divs = row.getElementsByTagName('div');

    var containers = divs[1].getElementsByTagName('div');

    if ((containers == null) || (containers.length == 0)) {

        return;
    }

    var data = ctl00_MainContent_Respondee_gvMortgageDischarge.Data;

    if ((data === undefined) || (data === null) || (data.length === 0)) {

        return;
    }

    var prefix = 'ctl00$MainContent$Respondee$ctl00_MainContent_Respondee_gvMortgageDischarge_0_4';

    for (var index = 0; index < containers.length; ++index) {

        var row = data[index];

        if (isInternetExplorer7 == true) {

            if ((row instanceof Array == true) || (row.length == 0)) {

                continue;
            }

        } else {

            if ((Array.isArray(row) === false) || (row.length === 0)) {

                continue;
            }

        }

        var verifySignatureId = row.length < 5 ? -1 : (row[4] === null) ? -1 : window.parseInt(row[4]);

        if (verifySignatureId <= 0) {

            continue;
        }

        var controlName = prefix;

        controlName += '_' + (index) + '$';

        controlName += 'ddlVerifySignatureDocument'

        var selectors = document.getElementsByName(controlName);

        if ((selectors !== null) && (selectors.length == 1)) {

            var selector = selectors[0];

            var pos = 0;

            for (; pos < selector.options.length; ++pos) {

                if ((typeof (selector.options[pos].value).toLowerCase() == 'number') && (selector.options[pos].value == verifySignatureId)) {

                    /*
                    *  If the document type identity match, then acknowledge the position of item witihn the drop-down list
                    */

                    break;
                }

            }

            if ((selector.options.length > 0) && (pos < selector.options.length)) {

                selector.options.selectedIndex = pos;
                selector.selectedIndex = pos;
            }
        }

    }

}

/*
*  Initializes the appearance of the respondee response section.
*/
function InitializeRespondeeResponse(attributes) {

    var div = document.getElementById('divRespondeeResponse');

    if ((attributes == undefined) || (attributes == null)) {

        if ((div !== null) && (div.style.display != 'none')) {

            div.style.display = 'none';
        }

        return;
    }

    if (attributes.stage !== 'Settlement Booking') {

        if ((div !== null) && (div.style.display != 'none')) {

            div.style.display = 'none';
        }

        return;
    }

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    if ((attributes.status === 'Redemptions Confirmed') || (attributes.status === 'Awaiting Supervisor Approval') ||
        (attributes.status === 'Ready for Settlement') || (attributes.status === 'Request Settled')) {

        if ((div !== null) && (div.style.display != 'none')) {

            var ddlResponseTypes = null;

            if (isInternetExplorer11OrAbove == false) {

                ddlResponseTypes = div.all(getRespondeeServerControlId('ddlResponseTypes'));

                ddlResponseTypes = ((ddlResponseTypes == undefined) || (ddlResponseTypes == null)) ? div.all('ddlResponseTypes') : ddlResponseTypes;

            } else {

                ddlResponseTypes = getRespondeeControl(div.id, getRespondeeServerControlId('ddlResponseTypes'));
            }

            if ((ddlResponseTypes !== undefined) && (ddlResponseTypes !== null)) {

                if (typeof (SetResponseType) == 'function') {

                    SetResponseType(div, ddlResponseTypes, attributes);
                }

                ddlResponseTypes.onchange = function () {

                    if (typeof (SetResponseType) == 'function') {

                        SetResponseType(div, this, attributes);
                    }

                    if (typeof (stopEventBubbling) == 'function') {

                        stopEventBubbling(window.event);
                    }

                    return false;
                }
            }

        }

    } else {

        var cellPostedTo = (isInternetExplorer11OrAbove == false) ? div.all('cellPostedTo') : getRespondeeControl(div.id, 'cellPostedTo');

        if ((cellPostedTo !== undefined) && (cellPostedTo != null)) {

            cellPostedTo.style.display = 'none';
        }

        var ddlPostedTo = null;

        if (isInternetExplorer11OrAbove == false) {

            ddlPostedTo = div.all(getRespondeeServerControlId('ddlPostedTo'));

            ddlPostedTo = ((ddlPostedTo === undefined) || (ddlPostedTo === null)) ? div.all('ddlPostedTo') : ddlPostedTo;

        } else {

            ddlPostedTo = getRespondeeControl(div.id, getRespondeeServerControlId('ddlPostedTo'));
        }

        DisplayRespondeeField(ddlPostedTo, false);
        ClearSelectElement(ddlPostedTo);

        var cellThirdPartyName = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyName') : getRespondeeControl(div.id, 'cellThirdPartyName');
        if ((cellThirdPartyName !== undefined) && (cellThirdPartyName != null)) {
            cellThirdPartyName.style.display = 'none';
        }

        var txtThirdPartyName = null;

        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyName = div.all(getRespondeeServerControlId('txtThirdPartyName'));
            txtThirdPartyName = ((txtThirdPartyName === undefined) || (txtThirdPartyName === null)) ? div.all('txtThirdPartyName') : txtThirdPartyName;
        } else {
            txtThirdPartyName = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyName'));
        }

        DisplayRespondeeField(txtThirdPartyName, false);

        var cellThirdPartyAddress = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyAddress') : getRespondeeControl(div, id, 'cellThirdPartyAddress');
        if ((cellThirdPartyAddress !== undefined) && (cellThirdPartyAddress != null)) {
            cellThirdPartyAddress.style.display = 'none';
        }

        var txtThirdPartyAddress = null;
        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyAddress = div.all(getRespondeeServerControlId('txtThirdPartyAdress'));
            txtThirdPartyAddress = ((txtThirdPartyAddress === undefined) || (txtThirdPartyAddress === null)) ? div.all('txtThirdPartyAddress') : txtThirdPartyAddress;
        } else {
            txtThirdPartyAddress = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyAdress'));
        }

        DisplayRespondeeField(txtThirdPartyAddress, false);

        var cellArticleNumber = (isInternetExplorer11OrAbove == false) ? div.all('cellArticleNumber') : getRespondeeControl(div.id, 'cellArticleNumber');
        if ((cellArticleNumber !== undefined) && (cellArticleNumber != null)) {
            cellArticleNumber.style.display = 'none';
        }

        var txtArticleNumber = null;
        if (isInternetExplorer11OrAbove == false) {
            txtArticleNumber = div.all(getRespondeeServerControlId('txtArticleNumber'));
            txtArticleNumber = ((txtArticleNumber === undefined) || (txtArticleNumber === null)) ? div.all('txtArticleNumber') : txtArticleNumber;
        } else {
            txtArticleNumber = getRespondeeControl(div.id, getRespondeeServerControlId('txtArticleNumber'));
        }

        DisplayRespondeeField(txtArticleNumber, false);

    }
}

/*
*   Adds the options into the HTML select element for the PostedTo recipients
*/
function GetPostedToRecipients(selector, securityRequestId, responseType) {

    if ((selector === undefined) || (selector === null) || (selector.tagName.toLowerCase() !== 'select')) {

        return;
    }

    if ((selector.id === 'ddlPostedTo') && (securityRequestId !== undefined) && (securityRequestId != null) && (securityRequestId.length > 0)) {

        ClearSelectElement(selector);

        /*
        *   Gets the JSON format containing the selection of list items.
        */
        var respondeeTypes = null;

        var response = null;

        if (typeof (GetRespondeeTypes) == 'function') {

            response = GetRespondeeTypes();
        }

        if ((response != null) && (response.length > 0)) {

            respondeeTypes = JSON.parse(response);
        }

        /*
        *   Append the posted to types for the security request identity into the <Posted To> drop down list.
        */

        if ((respondeeTypes != null) && (respondeeTypes.length > 0)) {

            for (var index = 0; index < respondeeTypes.length; ++index) {

                var option = document.createElement('option');

                option.text = respondeeTypes[index].Text.trim();
                option.value = respondeeTypes[index].Value;

                selector.appendChild(option);
            }
        }

    }
}

/*
*   Attempts to save the current respondee details to the database
*   and provides feedback to any encountered validation errors.
*/
function SaveRespondeeDetailsTab() {

    var response = {};

    response.validationErrors = '';

    response.validationErrors = '<li>Undefined security request attributes</li>';

    var attributes = getSecurityRequestAttributesForRespondee();

    if ((attributes.securityRequestOwner === undefined) || (attributes.securityRequestOwner === null)) {
        return response.validationErrors;
    } else if ((attributes.currentEmployeeNo === undefined) || (attributes.currentEmployeeNo === null)) {
        return response.validationErrors;
    }

    response.validationErrors = '';

    response.securityRequestId = attributes.securityRequestId;

    if (attributes.currentEmployeeNo === attributes.securityRequestOwner) {

        if (attributes.stage === 'Create / Edit') {

            if ((attributes.status === 'Request Started') ||
                (attributes.status === 'Awaiting Business Solutions Approval') ||
                (attributes.status === 'Approval Received From Business Solutions')) {

                // The respondee detail section is displayed in a read-write mode.

                getRespondeeDetailsForm(attributes, response);

                // The Respondee Response section has been hidden.

                // The financial institution section has been presented in a read-write mode.

                getFinancialInstitutionForm(attributes, response);

                // The discharge of mortgage section has been presented in a read-write mode.

                getMortgageDischargeForm(attributes, response);

            } else if (attributes.status === 'Awaiting Additional Info') {

                // The respondee detail section is displayed in a read-only mode.

                // The Respondee Response section has been hidden.

                // The financial institution section has been presented in a read-only mode.

                // The discharge of mortgage section has been presented in a read-only mode.

            } else if (attributes.status === 'Additional Info Received') {

                // The respondee detail section is displayed in a read-only mode.

                // The Respondee Response section has been hidden.

                // The financial institution section has been presented in a read-only mode.

                // The discharge of mortgage section has been presented in a read-write mode.

            }

        } else if (attributes.stage === 'Settlement Booking') {

            if ((attributes.status === 'Redemptions Confirmed') || (attributes.status === 'Awaiting Supervisor Approval') ||
                (attributes.status === 'Ready for Settlement') || (attributes.status === 'Request Settled')) {

                // The respondee detail section is displayed in a read-only mode.

                // The Respondee Response section is displayed in a read-write mode.

                getRespondeeResponseForm(attributes, response);

                // The financial institution section has been presented in a read-only mode.

                // The discharge of mortgage section has been presented in a read-only mode.

            }
        }
    }

    if (response.validationErrors.length == 0) {

        var content = JSON.stringify(response);

        if (typeof (SaveClientRespondeeDetails) == 'function') {

            response.validationErrors = SaveClientRespondeeDetails(attributes.securityRequestId, content);
        }

    }

    response.validationErrors = response.validationErrors.replace(/(\r\n|\r|\n)/gm, '<br/>');

    return response.validationErrors;
}

/*
*   Assigns the readonly attribute for the HTML element.
*/
function SetReadOnlyForRespondee(ctrl, readonly) {

    if ((ctrl === undefined) || (ctrl === null)) {

        return;
    }

    var readwrite = ((readonly === undefined) || (readonly === null)) ? false : (readonly === false);

    var elementType = new String(ctrl.tagName);

    try {

        if (elementType.toLowerCase() == 'select') {

            ctrl.disabled = (readwrite === false);

        } else if (elementType.toLowerCase() == 'input') {

            if (ctrl.type.toLowerCase() == 'text') {

                ctrl.readonly = (readwrite === false);
                ctrl.disabled = (readwrite === true) ? '' : 'disabled';

            } else if (ctrl.type.toLowerCase() == 'checkbox') {

                ctrl.disabled = (readwrite === true) ? '' : 'disabled';
            }

        }

    } catch (err) {

    }

}

/*
*   Registers the event handlers for the respondee details section.
*/
function SetRepeaterContentEventHandlers() {

    var div = document.getElementById('divRespondeeDetails');

    var containers = div.getElementsByTagName('table');

    if (containers == null) {

        return;
    }

    if (containers.length == 0) {

        return;
    }

    var prefix = 'ctl00$MainContent$Respondee$rptRespondees$ctl';

    for (var index = 1; index < containers.length; ++index) {

        var controlName = prefix;

        if (index <= 10) {
            controlName += '0' + (index - 1) + '$';
        } else {
            controlName += (index - 1) + '$';
        }

        var elements = null;

        elements = document.getElementsByName(controlName + 'txtRespondeeName');
        if ((elements != null) && (elements.length == 1)) {
            elements[0].onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };
            elements = null;
        }

        elements = document.getElementsByName(controlName + 'txtRespondeePhone');
        if ((elements != null) && (elements.length == 1)) {
            elements[0].onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };
            elements = null;
        }

        elements = document.getElementsByName(controlName + 'txtRespondeeReferenceNo');
        if ((elements != null) && (elements.length == 1)) {
            elements[0].onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };
            elements = null;
        }

        elements = document.getElementsByName(controlName + 'txtRespondeeAddress');
        if ((elements != null) && (elements.length == 1)) {
            elements[0].onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };
            elements = null;
        }

        elements = document.getElementsByName(controlName + 'txtRespondeeFacsimile');
        if ((elements != null) && (elements.length == 1)) {
            elements[0].onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };
            elements = null;
        }

    }
}

/*
*   Displays the specific HTML elements according to the selected response type.
*/
function SetResponseType(div, ddlResponseTypes, attributes) {

    if ((div === undefined) || (div == null)) {

        return;
    }

    if ((ddlResponseTypes === undefined) || (ddlResponseTypes == null)) {

        return;
    }

    if ((attributes === undefined) || (attributes == null)) {

        return;
    }

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    // get the drop down list selection for the response type.

    var responseType = ddlResponseTypes.options[ddlResponseTypes.selectedIndex].text;

    if ((responseType !== null) && (responseType === 'Please select')) {

        var cellPostedTo = (isInternetExplorer11OrAbove == false) ? div.all('cellPostedTo') : getRespondeeControl(div.id, 'cellPostedTo');
        if ((cellPostedTo !== undefined) && (cellPostedTo != null)) {
            cellPostedTo.style.display = 'none';
        }

        var ddlPostedTo = null;
        if (isInternetExplorer11OrAbove == false) {
            ddlPostedTo = div.all(getRespondeeServerControlId('ddlPostedTo'));
            ddlPostedTo = ((ddlPostedTo === undefined) || (ddlPostedTo === null)) ? div.all('ddlPostedTo') : ddlPostedTo;
        } else {
            ddlPostedTo = getRespondeeControl(div.id, getRespondeeServerControlId('ddlPostedTo'));
        }

        DisplayRespondeeField(ddlPostedTo, false);
        ClearSelectElement(ddlPostedTo);

        if (typeof (OnPostedToChange) == 'function') {

            if (isInternetExplorer11OrAbove == false) {

                if ((typeof (ddlPostedTo.hasAttribute) == 'function') && (ddlPostedTo.hasAttribute('onchange') == true)) {

                    if (typeof (ddlPostedTo.detachEvent) == 'function') {

                        ddlPostedTo.detachEvent('onchange', function () { OnPostedToChange(this, attributes.securityRequestId); });
                    }
                }

            } else {

                if ((typeof (ddlPostedTo.getAttribute) == 'function') && (ddlPostedTo.getAttribute('onchange') != null)) {

                    if (typeof (ddlPostedTo.removeEventListener) == 'function') {

                        ddlPostedTo.removeEventListener('onchange', function () { OnPostedToChange(this, attributes.securityRequestId); });
                    }
                }

            }
        }

        var cellThirdPartyName = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyName') : getRespondeeControl(div.id, 'cellThirdPartyName');
        if ((cellThirdPartyName !== undefined) && (cellThirdPartyName != null)) {
            cellThirdPartyName.style.display = 'none';
        }

        var txtThirdPartyName = null;

        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyName = div.all(getRespondeeServerControlId('txtThirdPartyName'));
            txtThirdPartyName = ((txtThirdPartyName === undefined) || (txtThirdPartyName === null)) ? div.all('txtThirdPartyName') : txtThirdPartyName;
        } else {
            txtThirdPartyName = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyName'));
        }

        DisplayRespondeeField(txtThirdPartyName, false);

        var cellThirdPartyAddress = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyAddress') : getRespondeeControl(div.id, 'cellThirdPartyAddress');
        if ((cellThirdPartyAddress !== undefined) && (cellThirdPartyAddress != null)) {
            cellThirdPartyAddress.style.display = 'none';
        }

        var txtThirdPartyAddress = null;
        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyAddress = div.all(getRespondeeServerControlId('txtThirdPartyAdress'));
            txtThirdPartyAddress = ((txtThirdPartyAddress === undefined) || (txtThirdPartyAddress === null)) ? div.all('txtThirdPartyAddress') : txtThirdPartyAddress;
        } else {
            txtThirdPartyAddress = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyAdress'));
        }

        DisplayRespondeeField(txtThirdPartyAddress, false);

        var cellArticleNumber = (isInternetExplorer11OrAbove == false) ? div.all('cellArticleNumber') : getRespondeeControl(div.id, 'cellArticleNumber');
        if ((cellArticleNumber !== undefined) && (cellArticleNumber != null)) {
            cellArticleNumber.style.display = 'none';
        }

        var txtArticleNumber = null;
        if (isInternetExplorer11OrAbove == false) {
            txtArticleNumber = div.all(getRespondeeServerControlId('txtArticleNumber'));
            txtArticleNumber = ((txtArticleNumber === undefined) || (txtArticleNumber === null)) ? div.all('txtArticleNumber') : txtArticleNumber;
        } else {
            txtArticleNumber = getRespondeeControl(div.id, getRespondeeServerControlId('txtArticleNumber'));
        }

        DisplayRespondeeField(txtArticleNumber, false);

    } else if ((responseType !== null) && (responseType == 'Documents to be collected from Head Office.')) {

        var cellPostedTo = (isInternetExplorer11OrAbove == false) ? div.all('cellPostedTo') : getRespondeeControl(div.id, 'cellPostedTo');
        if ((cellPostedTo !== undefined) && (cellPostedTo != null)) {
            cellPostedTo.style.display = 'none';
        }

        var ddlPostedTo = null;
        if (isInternetExplorer11OrAbove == false) {
            ddlPostedTo = div.all(getRespondeeServerControlId('ddlPostedTo'));
            ddlPostedTo = ((ddlPostedTo === undefined) || (ddlPostedTo === null)) ? div.all('ddlPostedTo') : ddlPostedTo;
        } else {
            ddlPostedTo = getRespondeeControl(div.id, getRespondeeServerControlId('ddlPostedTo'));
        }

        DisplayRespondeeField(ddlPostedTo, false);
        ClearSelectElement(ddlPostedTo);

        if (typeof (OnPostedToChange) == 'function') {

            if (isInternetExplorer11OrAbove == false) {

                if ((typeof (ddlPostedTo.hasAttribute) == 'function') && (ddlPostedTo.hasAttribute('onchange') == true)) {

                    if (typeof (ddlPostedTo.detachEvent) == 'function') {

                        ddlPostedTo.detachEvent('onchange', function () { OnPostedToChange(this, attributes.securityRequestId); });
                    }
                }

            } else {

                if ((typeof (ddlPostedTo.getAttribute) == 'function') && (ddlPostedTo.getAttribute('onchange') != null)) {

                    if (typeof (ddlPostedTo.removeEventListener) == 'function') {

                        ddlPostedTo.removeEventListener('onchange', function () { OnPostedToChange(this, attributes.securityRequestId); });
                    }
                }
            }
        }

        var cellThirdPartyName = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyName') : getRespondeeControl(div.id, 'cellThirdPartyName');
        if ((cellThirdPartyName !== undefined) && (cellThirdPartyName != null)) {
            cellThirdPartyName.style.display = 'none';
        }

        var txtThirdPartyName = null;
        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyName = div.all(getRespondeeServerControlId('txtThirdPartyName'));
            txtThirdPartyName = ((txtThirdPartyName === undefined) || (txtThirdPartyName === null)) ? div.all('txtThirdPartyName') : txtThirdPartyName;
        } else {
            txtThirdPartyName = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyName'));
        }

        DisplayRespondeeField(txtThirdPartyName, false);

        var cellThirdPartyAddress = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyAddress') : getRespondeeControl(div.id, 'cellThirdPartyAddress');
        if ((cellThirdPartyAddress !== undefined) && (cellThirdPartyAddress != null)) {
            cellThirdPartyAddress.style.display = 'none';
        }

        var txtThirdPartyAddress = div.all(getRespondeeServerControlId('txtThirdPartyAdress'));
        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyAddress = div.all(getRespondeeServerControlId('txtThirdPartyAdress'));
            txtThirdPartyAddress = ((txtThirdPartyAddress === undefined) || (txtThirdPartyAddress === null)) ? div.all('txtThirdPartyAddress') : txtThirdPartyAddress;
        } else {
            txtThirdPartyAddress = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyAdress'));
        }

        DisplayRespondeeField(txtThirdPartyAddress, false);

        var cellArticleNumber = (isInternetExplorer11OrAbove == false) ? div.all('cellArticleNumber') : getRespondeeControl('cellArticleNumber');
        if ((cellArticleNumber !== undefined) && (cellArticleNumber != null)) {
            cellArticleNumber.style.display = 'none';
        }

        var txtArticleNumber = null;
        if (isInternetExplorer11OrAbove == false) {
            txtArticleNumber = div.all(getRespondeeServerControlId('txtArticleNumber'));
            txtArticleNumber = ((txtArticleNumber === undefined) || (txtArticleNumber === null)) ? div.all('txtArticleNumber') : txtArticleNumber;
        } else {
            txtArticleNumber = getRespondeeControl(div.id, getRespondeeServerControlId('txtArticleNumber'));
        }

        DisplayRespondeeField(txtArticleNumber, false);

    } else if ((responseType !== null) && (responseType === 'Member requested documents to be posted.')) {

        var cellPostedTo = (isInternetExplorer11OrAbove == false) ? div.all('cellPostedTo') : getRespondeeControl(div.id, 'cellPostedTo');
        if ((cellPostedTo !== undefined) && (cellPostedTo != null)) {
            cellPostedTo.style.display = 'inline-block';
        }

        var ddlPostedTo = null;
        if (isInternetExplorer11OrAbove == false) {
            ddlPostedTo = div.all(getRespondeeServerControlId('ddlPostedTo'));
            ddlPostedTo = ((ddlPostedTo === undefined) || (ddlPostedTo === null)) ? div.all('ddlPostedTo') : ddlPostedTo;
        } else {
            ddlPostedTo = getRespondeeControl(div.id, getRespondeeServerControlId('ddlPostedTo'));
        }

        DisplayRespondeeField(ddlPostedTo, true);

        if (typeof (OnPostedToChange) == 'function') {

            if ((isInternetExplorer11OrAbove == false) && (ddlPostedTo !== undefined) && (ddlPostedTo != null)) {

                ddlPostedTo.attachEvent('onchange', function () {

                    OnPostedToChange(this, attributes.securityRequestId);

                    if (typeof (stopEventBubbling) == 'function') {

                        stopEventBubbling(window.event);
                    }

                    return false;
                });

            } else if ((ddlPostedTo !== undefined) && (ddlPostedTo != null)) {

                ddlPostedTo.addEventListener('onchange', function () {

                    OnPostedToChange(this, attributes.securityRequestId);

                    if (typeof (stopEventBubbling) == 'function') {

                        stopEventBubbling(window.event);
                    }

                    return false;
                });

            }
        }

        if (typeof (GetPostedToRecipients) == 'function') {

            GetPostedToRecipients(ddlPostedTo, attributes.securityRequestId, responseType);

        }

        if ((ddlPostedTo !== undefined) && (ddlPostedTo != null) && (ddlPostedTo.options.length > 1)) {

            for (var pos = 0; pos < ddlPostedTo.options.length; ++pos) {

                ddlPostedTo.options.selectedIndex = pos;
                ddlPostedTo.selectedIndex = pos;

                if (ddlPostedTo.options[pos].text == 'Others') {

                    if (typeof (getPostedToDetails) == 'function') {

                        getPostedToDetails(div, ddlPostedTo, attributes.securityRequestId);
                    }

                    break;
                }
            }

            if (isInternetExplorer11OrAbove == false) {
                ddlPostedTo.attachEvent('change', function () { OnPostedToChange(this, attributes.securityRequestId); });
            } else {
                ddlPostedTo.addEventListener('change', function () { OnPostedToChange(this, attributes.securityRequestId); });
            }

            var cellArticleNumber = (isInternetExplorer11OrAbove == false) ? div.all('cellArticleNumber') : getRespondeeControl(div.id, 'cellArticleNumber');
            if ((cellArticleNumber !== undefined) && (cellArticleNumber != null)) {
                cellArticleNumber.style.display = 'inline-block';
            }

            var txtArticleNumber = null;
            if (isInternetExplorer11OrAbove == false) {
                txtArticleNumber = div.all(getRespondeeServerControlId('txtArticleNumber'));
                txtArticleNumber = ((txtArticleNumber === undefined) || (txtArticleNumber === null)) ? div.all('txtArticleNumber') : txtArticleNumber;
            } else {
                txtArticleNumber = getRespondeeControl(div.id, getRespondeeServerControlId('txtArticleNumber'));
            }

            DisplayRespondeeField(txtArticleNumber, true);
        }

    } else if ((responseType !== null) && (responseType === 'No response from Members. Documents to be posted.')) {

        var cellPostedTo = (isInternetExplorer11OrAbove == false) ? div.all('cellPostedTo') : getRespondeeControl(div.id, 'cellPostedTo');
        if ((cellPostedTo !== undefined) && (cellPostedTo != null)) {
            cellPostedTo.style.display = 'none';
        }

        var ddlPostedTo = null;
        if (isInternetExplorer11OrAbove == false) {
            ddlPostedTo = div.all(getRespondeeServerControlId('ddlPostedTo'));
            ddlPostedTo = ((ddlPostedTo === undefined) || (ddlPostedTo === null)) ? div.all('ddlPostedTo') : ddlPostedTo;
        } else {
            ddlPostedTo = getRespondeeControl(div.id, getRespondeeServerControlId('ddlPostedTo'));
        }

        DisplayRespondeeField(ddlPostedTo, false);
        ClearSelectElement(ddlPostedTo);

        if (typeof (OnPostedToChange) == 'function') {

            if (isInternetExplorer11OrAbove == false) {

                if ((typeof (ddlPostedTo.hasAttribute) == 'function') && (ddlPostedTo.hasAttribute('onchange') == true)) {

                    if (typeof (ddlPostedTo.detachEvent) == 'function') {

                        ddlPostedTo.detachEvent('onchange', function () { OnPostedToChange(this, attributes.securityRequestId); });
                    }
                }

            } else {

                if ((typeof (ddlPostedTo.getAttribute) == 'function') && (ddlPostedTo.getAttribute('onchange') != null)) {

                    if (typeof (ddlPostedTo.removeEventListener) == 'function') {

                        ddlPostedTo.removeEventListener('onchange', function () { OnPostedToChange(this, attributes.securityRequestId); });
                    }
                }

            }
        }

        var cellThirdPartyName = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyName') : getRespondeeControl(div.id, 'cellThirdPartyName');
        if ((cellThirdPartyName !== undefined) && (cellThirdPartyName != null)) {
            cellThirdPartyName.style.display = 'none';
        }

        var txtThirdPartyName = null;
        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyName = div.all(getRespondeeServerControlId('txtThirdPartyName'));
            txtThirdPartyName = ((txtThirdPartyName === undefined) || (txtThirdPartyName === null)) ? div.all('txtThirdPartyName') : txtThirdPartyName;
        } else {
            txtThirdPartyName = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyName'));
        }

        DisplayRespondeeField(txtThirdPartyName, false);

        var cellThirdPartyAddress = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyAddress') : getRespondeeControl(div.id, 'cellThirdPartyAddress');
        if ((cellThirdPartyAddress !== undefined) && (cellThirdPartyAddress != null)) {
            cellThirdPartyAddress.style.display = 'none';
        }

        var txtThirdPartyAddress = null;
        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyAddress = div.all(getRespondeeServerControlId('txtThirdPartyAdress'));
            txtThirdPartyAddress = ((txtThirdPartyAddress === undefined) || (txtThirdPartyAddress === null)) ? div.all('txtThirdPartyAddress') : txtThirdPartyAddress;
        } else {
            txtThirdPartyAddress = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyAdress'));
        }

        DisplayRespondeeField(txtThirdPartyAddress, false);

        var cellArticleNumber = div.all('cellArticleNumber');
        cellArticleNumber.style.display = 'inline-block';

        var txtArticleNumber = div.all(getRespondeeServerControlId('txtArticleNumber'));
        txtArticleNumber = ((txtArticleNumber === undefined) || (txtArticleNumber === null)) ? div.all('txtArticleNumber') : txtArticleNumber;
        DisplayRespondeeField(txtArticleNumber, true);

    } else {

        var cellPostedTo = (isInternetExplorer11OrAbove == false) ? div.all('cellPostedTo') : getRespondeeControl(div.id, 'cellPostedTo');
        if ((cellPostedTo !== undefined) && (cellPostedTo != null)) {
            cellPostedTo.style.display = 'none';
        }

        var ddlPostedTo = null;
        if (isInternetExplorer11OrAbove == false) {
            ddlPostedTo = div.all(getRespondeeServerControlId('ddlPostedTo'));
            ddlPostedTo = ((ddlPostedTo === undefined) || (ddlPostedTo === null)) ? div.all('ddlPostedTo') : ddlPostedTo;
        } else {
            ddlPostedTo = getRespondeeControl(div.id, getRespondeeServerControlId('ddlPostedTo'));
        }

        DisplayRespondeeField(ddlPostedTo, false);
        ClearSelectElement(ddlPostedTo);

        if ((ddlPostedTo != undefined) && (ddlPostedTo != null)) {

            if (isInternetExplorer11OrAbove == false) {

                if (typeof (OnPostedToChange) == 'function') {

                    if ((typeof (ddlPostedTo.hasAttribute) == 'function') && (ddlPostedTo.hasAttribute('onchange') == true)) {

                        if (typeof (ddlPostedTo.detachEvent) == 'function') {

                            ddlPostedTo.detachEvent('onchange', function () { OnPostedToChange(this, attributes.securityRequestId); });
                        }
                    }
                }

            } else {

                if (typeof (OnPostedToChange) == 'function') {

                    if ((typeof (ddlPostedTo.getAttribute) == 'function') && (ddlPostedTo.getAttribute('onchange') != null)) {

                        if (typeof (ddlPostedTo.removeEventListener) == 'function') {

                            ddlPostedTo.removeEventListener('onchange', function () { OnPostedToChange(this, attributes.securityRequestId); });
                        }
                    }
                }

            }
        }

        var cellThirdPartyName = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyName') : getRespondeeControl(div.id, 'cellThirdPartyName');
        if ((cellThirdPartyName !== undefined) && (cellThirdPartyName != null)) {
            cellThirdPartyName.style.display = 'none';
        }

        var txtThirdPartyName = null;
        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyName = div.all(getRespondeeServerControlId('txtThirdPartyName'));
            txtThirdPartyName = ((txtThirdPartyName === undefined) || (txtThirdPartyName === null)) ? div.all('txtThirdPartyName') : txtThirdPartyName;
        } else {
            txtThirdPartyName = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyName'));
        }

        DisplayRespondeeField(txtThirdPartyName, false);

        var cellThirdPartyAddress = (isInternetExplorer11OrAbove == false) ? div.all('cellThirdPartyAddress') : getRespondeeControl(div.id, 'cellThirdPartyAddress');
        if ((cellThirdPartyAddress !== undefined) && (cellThirdPartyAddress != null)) {
            cellThirdPartyAddress.style.display = 'none';
        }

        var txtThirdPartyAddress = null;
        if (isInternetExplorer11OrAbove == false) {
            txtThirdPartyAddress = div.all(getRespondeeServerControlId('txtThirdPartyAdress'));
            txtThirdPartyAddress = ((txtThirdPartyAddress === undefined) || (txtThirdPartyAddress === null)) ? div.all('txtThirdPartyAddress') : txtThirdPartyAddress;
        } else {
            txtThirdPartyAddress = getRespondeeControl(div.id, getRespondeeServerControlId('txtThirdPartyAdress'));
        }

        DisplayRespondeeField(txtThirdPartyAddress, false);

        var cellArticleNumber = (isInternetExplorer11OrAbove == false) ? div.all('cellArticleNumber') : getRespondeeControl(div.id, 'cellArticleNumber');
        if ((cellArticleNumber !== undefined) && (cellArticleNumber != null)) {
            cellArticleNumber.style.display = 'none';
        }

        var txtArticleNumber = null;
        if (isInternetExplorer11OrAbove == false) {
            txtArticleNumber = div.all(getRespondeeServerControlId('txtArticleNumber'));
            txtArticleNumber = ((txtArticleNumber === undefined) || (txtArticleNumber === null)) ? div.all('txtArticleNumber') : txtArticleNumber;
        } else {
            txtArticleNumber = getRespondeeControl(div.id, getRespondeeServerControlId('txtArticleNumber'));
        }

        DisplayRespondeeField(txtArticleNumber, false);

    }

}

/*
*   Dispatches the email that is associated with the financial institution selection.
*/
function SendRespondeeEmail(recipient, comments) {

    if ((recipient === undefined) || (recipient == null)) {

        return;
    }

    if (typeof (recipient) == 'string') {

        recipient = recipient.trim();
    }

    var commentaries = ((comments === undefined) || (comments == null)) ? '' : typeof (comments) == 'string' ? comments.trim() : comments.toString();

    try {

        if (typeof (SendRespondeeEmail) == 'function' /* ComponentArt Callback method */) {

            SendRespondeeEmail(recipient, commentaries);
        }

    } catch (err) {

        alert(RespondeeScriptFileName + '. Function: SendRespondeeEmail. Error: ' + err.description);
    }

}

/*
*   Registers the event handlers for the respondee form controls.
*/
function SetRespondeeEventHandlers() {

    SetRepeaterContentEventHandlers();
}

/*
*   Displays the loading image for a particular task.
*/
function ShowDialogActivity(showActivity) {

    var dlg = dlgActivityProgress;

    if ((dlg === undefined) || (dlg == null)) {

        dlg = getRespondeeControl('dlgActivityProgress');
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
*   Displays the respondee type selections.
*/
function ShowRespondeeTypeSelection(attributes) {

    if ((attributes === undefined) || (attributes === null)) {

        return;
    }

    var ddlRespondeeType = getRespondeeControl('ddlRespondeeType');

    if ((ddlRespondeeType === undefined) || (ddlRespondeeType == null) || (ddlRespondeeType.options.length <= 1)) {

        return;
    }

    var response = '';

    if (typeof (GetRespondeeTypesBySecurityRequestAndResponseType) == 'function') {

        response = GetRespondeeTypesBySecurityRequestAndResponseType(attributes.securityRequestId, null);
    }

    if (response.length == 0) {

        return;
    }

    var options = JSON.parse(response); // SELECT options collection.

    if (options.length > 0) {

        /*
         *   We will only take the first SELECT option within this collection and 
         *   assign the selected index of the first option to the HTML SELECT control
         */

        var option = options[0];

        var respondeeType = option.Text.trim();

        var hidden = getRespondeeControl('CurrentRespondeeType');

        if ((hidden !== undefined) && (hidden != null)) {

            hidden.value = respondeeType;
        }

        for (var index = 0; index < ddlRespondeeType.options.length; ++index) {

            var text = ddlRespondeeType.options[index].text.trim();

            if (text == respondeeType) {

                ddlRespondeeType.options.selectedIndex = index;
                break;

            }
        }
    }

}

/*
 - Function to save Verification Document for Discharge or Mortgage
 - Gerard Flood 3 July 2014
*/
function SaveRespondeeDocument() {

    var securityRequestId = document.getElementById('hdnSecurityRequestId').value;
    var verificationDocumentLinkedMemberId = document.getElementById('hdnVerificationDocumentLinkedMemberId').value;

    var signatureVerificstaionValue = document.getElementById('ddlSignatureVerificstaion').options[document.getElementById('ddlSignatureVerificstaion').selectedIndex].value;
    var signatureVerificstaionText = document.getElementById('ddlSignatureVerificstaion').options[document.getElementById('ddlSignatureVerificstaion').selectedIndex].text;

    var signatureVerificstaionDescription = document.getElementById('tbSignatureVerificstaionDescription').value;

    // required field validation for signature verification document
    if (signatureVerificstaionValue == '-1') {
        alert('Please complete signature verification document from the dropdown list');
        if (typeof (stopEventBubbling) == 'function') {
            stopEventBubbling(window.event);
        }
        return false;
    }

    if ((signatureVerificstaionValue == '3' || signatureVerificstaionValue == '4') && signatureVerificstaionDescription == '') {
        alert('Please enter a description for the selected document');
        if (typeof (stopEventBubbling) == 'function') {
            stopEventBubbling(window.event);
        }
        return false;
    }

    var verificationDocumentText = signatureVerificstaionText;
    if (signatureVerificstaionDescription != '') {
        verificationDocumentText += ' - ' + signatureVerificstaionDescription;
    }

    var result = SaveRespondeeVerificationDocument(securityRequestId, verificationDocumentLinkedMemberId, verificationDocumentText);
    if (result.indexOf('##ERROR##') > -1) {
        dSignatureVerification.Close();
        alert(result.replace('##ERROR##', ''));
    }
    else {
        cbVerificationDocumentGrid.Callback();
        dSignatureVerification.Close();
        alert('Verification Document Saved');
    }
}

function ShowRespondeeVerificationDocumentPopup(linkedMemberId) {
    document.getElementById('ddlSignatureVerificstaion').selectedIndex = 0;
    document.getElementById('tbSignatureVerificstaionDescription').value = '';

    document.getElementById('hdnVerificationDocumentLinkedMemberId').value = linkedMemberId;
    dSignatureVerification.Show();
}