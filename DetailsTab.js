
// LinkedAccount Actions
function showLinkedAccountMembers(linkedAccountId) {
    var callback = eval('ctl00_MainContent_Details_cbPopupLinkedAccount');
    callback.Callback(linkedAccountId);
    dPopupLinkedAccount.set_alignment('MiddleCentre');
    dPopupLinkedAccount.Show();
}

function confirmLinkedAccountBeingPaidOut(linkedAccountId, linkedAccountNo, action) {
    var isBeingPaidOut = action == "PAID" ? true : false;

    var release = false;
    if (isBeingPaidOut) {
        release = confirm("Are you sure you want to set Account No. " + linkedAccountNo + ' to "Paid Out"');
    } else {
        release = confirm("Are you sure you want to set Account No. " + linkedAccountNo + ' to "UnPaid Out"');
    }

    if (release) {
        var callback = eval('ctl00_MainContent_Details_cbActionLinkedAccount');
        callback.Callback(linkedAccountId, isBeingPaidOut);
    }
}

// LinkedSecurity Actions
function showLinkedSecurity(id) {
    var callback = eval('ctl00_MainContent_Details_cbPopupLinkedSecurity');
    callback.Callback(id);
    dPopupLinkedSecurity.set_alignment('MiddleCentre');
    dPopupLinkedSecurity.Show();
}

function confirmLinkedSecurityBeingReleased(linkedSecurityId, linkedSecurityNo, action) {
    var isBeingReleased = action == "RELEASE" ? true : false;

    var release = false;
    if (isBeingReleased) {
        release = confirm("Are you sure you want to Release Security No. " + linkedSecurityNo);
    } else {
        release = confirm("Are you sure you want to UnRelease Security No. " + linkedSecurityNo);
    }

    if (release) {
        var callback = eval('ctl00_MainContent_Details_cbActionLinkedSecurity');
        callback.Callback(linkedSecurityId, isBeingReleased);
        refreshValuationTab();
    }
}

// save method for manual linked security
var txtCaveatNumber;
var caveatNumber;
var txtTitleReference;
var titleReference;
var txtSecurityHolders;
var securityHolders;

function SaveDetailsTab() {
    // if SecurityRequestType Stage is not in "Create/Edit" Stage do not save do not validate
    if (document.getElementById('hdnSecurityRequestStageId').value != 1 || document.getElementById("txtCaveatNumber") == null) return '';

    // validate
    var isValid = IsDetailsTabValid();

    // save
    if (isValid == '') {
        try {
            var stageId = document.getElementById('hdnSecurityRequestStageId').value;
            var statusId = document.getElementById('hdnSecurityRequestStatusId').value;

            var result = CallbackSaveDetailsTab(SecurityRequestId, stageId, statusId, caveatNumber, titleReference, securityHolders);

            if (result.indexOf('##ERROR##') == 0) {
                return result.replace('##ERROR##', '');
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


function IsDetailsTabValid() {
    var errMsg = '';

    try {
        SetDetailsTabControlValues();

        if (caveatNumber == '' && titleReference == '' && securityHolders == '') {
            errMsg += "<li>For linked security, all fields must be completed</li>";
        }

    }
    catch (err) {
        errMsg += 'DetailsTab.js : IsDetailsTabValid :' + err.description;
    }

    return errMsg;
}

function SetDetailsTabControlValues() {
    txtCaveatNumber = document.getElementById("txtCaveatNumber");
    if (txtCaveatNumber != null) {
        caveatNumber = txtCaveatNumber.value;
    }
    if (txtTitleReference != null) {
        txtTitleReference = document.getElementById("txtTitleReference");
    }
    titleReference = txtTitleReference.value;
    if (titleReference != null) {
        txtSecurityHolders = document.getElementById("txtSecurityHolders");
    }
    securityHolders = txtSecurityHolders.value;
    if (securityHolders != null) {

    }
}

function confirmRefreshHostData() {
    if (confirm("Refresh HOST Data?")) {
        dRefreshHostData.Show();
        return true;
    }
    return false;
}