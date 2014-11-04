/* Respondee Type selection */
function showPopupRespondeeType() {
    var ddlRespondeeType = document.getElementById('ddlRespondeeType').options[document.getElementById('ddlRespondeeType').selectedIndex].value;

    if (ddlRespondeeType == '1' /*Members*/) {
        showMembersPopup();
    }

    if (ddlRespondeeType == '2' /*Solicitor*/) {
        showSolicitorPopup();
    }

    if (ddlRespondeeType == '3' /*FinancialInstitution*/)
    {
        showFinancialInstitutionPopup();
    }

    if (ddlRespondeeType == '4' /*Others*/) {
        showOthersPopup();
    }
}

/* Solicitor */
function showSolicitorPopup() {
    dSolicitor.Show();
    cbSolicitor.Callback();
}

function saveSolicitor() {
    var securityRequestId = document.getElementById('hdnSecurityRequestId').value;
    var ddlSolicitors = document.getElementById('ddlSolicitors').options[document.getElementById('ddlSolicitors').selectedIndex].value;
    var ddlSolicitorsName = document.getElementById('ddlSolicitors').options[document.getElementById('ddlSolicitors').selectedIndex].text;
    if (ddlSolicitors == '-1') {
        alert('Please select a Solicitor');
        return false;
    }

    cbRespondeeTypeName.Callback('SAVE_RESPONDEE_TYPE_SOLICITOR', securityRequestId, ddlSolicitors, ddlSolicitorsName);
    dSolicitor.Close();
}

/* FinancialInstitution */
function showFinancialInstitutionPopup() {
    dFinancialInstitution.Show();
    cbFinancialInstitution.Callback();
}

function saveFinancialInstitution() {
    var securityRequestId = document.getElementById('hdnSecurityRequestId').value;
    var ddlFinancialInstitutions = document.getElementById('ddlFinancialInstitutions').options[document.getElementById('ddlFinancialInstitutions').selectedIndex].value;
    var ddlFinancialInstitutionsName = document.getElementById('ddlFinancialInstitutions').options[document.getElementById('ddlFinancialInstitutions').selectedIndex].text;
    if (ddlFinancialInstitutions == '-1') {
        alert('Please select a Financial Institution');
        return false;
    }

    cbRespondeeTypeName.Callback('SAVE_RESPONDEE_TYPE_FINANCIALINSTITUTION', securityRequestId, ddlFinancialInstitutions, ddlFinancialInstitutionsName);
    dFinancialInstitution.Close();
}

/* Others */
function showOthersPopup() {
    dOthers.Show();
    //cbOthers.Callback();
}

function saveOthers() {
    var securityRequestId = document.getElementById('hdnSecurityRequestId').value;

    var txtEnquiryName = document.getElementById('txtEnquiryName').value;
    var txtEnquiryAddress = document.getElementById('txtEnquiryAddress').value;
    var txtEnquiryPhone = document.getElementById('txtEnquiryPhone').value;
    var txtEnquiryFacsimile = document.getElementById('txtEnquiryFacsimile').value;

    cbRespondeeTypeName.Callback('SAVE_RESPONDEE_TYPE_OTHERS', securityRequestId, txtEnquiryName, txtEnquiryAddress, txtEnquiryPhone, txtEnquiryFacsimile);
    dOthers.Close();
}

/* Members */
function showMembersPopup() {
    var securityRequestId = document.getElementById('hdnSecurityRequestId').value;
    dMembers.Show();
    cbMembers.Callback(securityRequestId);
}

function saveMembers() {
    var securityRequestId = document.getElementById('hdnSecurityRequestId').value;

    var response = '';
    var chkboxlist = document.getElementById('cblMembers');
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

    if (response == '') {
        alert('Please select at least one member');
        return false;
    }

    cbRespondeeTypeName.Callback('SAVE_RESPONDEE_TYPE_MEMBERS', securityRequestId, response);
    dMembers.Close();
}

/*
*   Toggle the display for the Mortgage Discharge received grid view
*/
function MortgageDischargeReceivedCheckedChange(chkbox) {

    if ((chkbox !== undefined) && (chkbox != null)) {

        var checked = chkbox.checked;
        var disabled = chkbox.disabled;
        var trMortgageDischarge = document.getElementById('pnlMortgageDischarge');

        if ((checked === true) && (disabled === false) && (trMortgageDischarge !== null)) {
            trMortgageDischarge.style.display = 'inline-block';
        } else if (trMortgageDischarge !== null) {
            trMortgageDischarge.style.display = 'none';
        }

        UpdateRespondeeMortgageDischargeReceived(document.getElementById('hdnSecurityRequestId').value, checked);
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

function SaveRespondeeDetailsTab() {
   
    // validate
    var isValid = IsRespondeeDetailsTabValid();

    // save
    if (isValid == '') {
        try {
            // if SecurityRequestType Stage is not in "Create/Edit" Stage do not save do not validate
            if (document.getElementById('hdnSecurityRequestStageId').value == 1) {

                var securityRequestId = document.getElementById('hdnSecurityRequestId').value;

                var ddlFinancialInstitution = document.getElementById('ddlFinancialInstitution').options[document.getElementById('ddlFinancialInstitution').selectedIndex].value;
                var txtReferenceNo = document.getElementById('txtRespondeeReferenceNo').value;

                var result = CallbackSaveRespondeeTab(securityRequestId, txtReferenceNo, ddlFinancialInstitution);

                if (result.indexOf('##ERROR##') == 0) {
                    return result.replace('##ERROR##', '');
                }

                if (document.getElementById('hdnSecurityRequestSubTypeId').value == 3 || document.getElementById('hdnSecurityRequestSubTypeId').value == 4) {
                    var securityRequestId = document.getElementById('hdnSecurityRequestId').value;

                    var ddlResponseTypes = document.getElementById('ddlResponseTypes').options[document.getElementById('ddlResponseTypes').selectedIndex].value;
                    var txtArticleNumber = document.getElementById('txtArticleNumber').value;

                    var removedPostedTo = 'true';
                    if (ddlResponseTypes == '2') {
                        removedPostedTo = 'false';
                    }

                    var result = SaveRespondeeResponseTabSettlementBooked(securityRequestId, ddlResponseTypes, txtArticleNumber, removedPostedTo);

                    if (result.indexOf('##ERROR##') == 0) {
                        return result.replace('##ERROR##', '');
                    }
                }
            }

        } catch (err) {
            return AccountTabFN + ' : SaveAccountTab :' + err.description;
        }
    }
    else {
        return isValid;
    }

    return '';
}

function IsRespondeeDetailsTabValid() {
    var errMsg = '';

    try {

        // if SecurityRequestType Stage is not in "Create/Edit" Stage do not save do not validate
        if (document.getElementById('hdnSecurityRequestStageId').value == 1) {
            var ddlFinancialInstitution = document.getElementById('ddlFinancialInstitution').options[document.getElementById('ddlFinancialInstitution').selectedIndex].value;
            var txtReferenceNo = document.getElementById('txtRespondeeReferenceNo').value;
            var ddlRespondeeType = document.getElementById('ddlRespondeeType').value;

            if (ddlRespondeeType == '-1') {
                errMsg += '<li>Please select a Respondee Type</li>';
            }
            //if (txtReferenceNo == '') {
            //    errMsg += '<li>Please enter a Reference Number</li>';
            //}

            //if (ddlFinancialInstitution == '-1') {
            //    errMsg += '<li>Please select a Financial Institution Details from the drop down list</li>';
            //}



            if (document.getElementById('hdnSecurityRequestSubTypeId').value == 3 || document.getElementById('hdnSecurityRequestSubTypeId').value == 4) {
                errMsg += IsRespondeeResponseTabValid();
            }
        }

    }
    catch (err) {
        errMsg += 'RespondeeTab.js : IsRespondeeDetailsTabValid :' + err.description;
    }

    return errMsg;
}

function CheckResponseType() {
    var ddlResponseTypes = document.getElementById('ddlResponseTypes').value;
    var pnlResponsePostedTo = document.getElementById('pnlResponsePostedTo');
    if (ddlResponseTypes == '2') {
        document.getElementById('ddlPostedTo').selectedIndex = 0;
        document.getElementById('txtThirdPartyName').value = '';
        document.getElementById('txtThirdPartyAddress').value = '';
        showResponsePopup();
    }
    else {
        if (pnlResponsePostedTo !== null) {
            pnlResponsePostedTo.style.display = 'none';
        }
    }
}

function showResponsePopup() {
    var securityRequestId = document.getElementById('hdnSecurityRequestId').value;
    dResponse.Show();
    //cbMembers.Callback(securityRequestId);
}

function saveResponse() {
    var securityRequestId = document.getElementById('hdnSecurityRequestId').value;
    var ddlResponseTypes = document.getElementById('ddlResponseTypes').value;

    var ddlPostedTo = document.getElementById('ddlPostedTo').value;
    var txtThirdPartyName = document.getElementById('txtThirdPartyName').value;
    var txtThirdPartyAddress = document.getElementById('txtThirdPartyAddress').value;

    if (ddlPostedTo == '-1') {
        alert('Please select an option from the Post To drop down list');
        return false;
    }

    if (ddlPostedTo == '2' && (txtThirdPartyName == '' || txtThirdPartyAddress == '')) {
        alert('Please enter both Third Party Name and Address');
        return false;
    }

    cbResponsePanel.Callback(securityRequestId, ddlResponseTypes, ddlPostedTo, txtThirdPartyName, txtThirdPartyAddress);
    dResponse.Close();
}

function IsRespondeeResponseTabValid() {
    var errMsg = '';

    try {
        var ddlResponseTypes = document.getElementById('ddlResponseTypes').options[document.getElementById('ddlResponseTypes').selectedIndex].value;
        var txtArticleNumber = document.getElementById('txtArticleNumber').value;

        //if (ddlResponseTypes == '-1') {
        //    errMsg += '<li>Please select a Respondee Response from the drop down list</li>';
        //}

        //if (txtArticleNumber == '') {
        //    errMsg += '<li>Please select a Respondee Response from the drop down list</li>';
        //}

    }
    catch (err) {
        errMsg += 'RespondeeTab.js : IsRespondeeDetailsTabValid :' + err.description;
    }

    return errMsg;
}