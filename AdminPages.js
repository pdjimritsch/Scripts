// ================ Financial Institution ================ //
function editFinancialInstitution(id) {
    cbFinancialInstitutionPopup.Callback(id);
}

function cbFinancialInstitutionPopup_onCallbackComplete(sender, args) {
    dPopupAddFinancialInstitution.Show();
}

function showFinancialInstitutionPopup() {
    var id = document.getElementById('hdnFinancialInstitutionId').value = '';
    var name = document.getElementById('txtName').value = '';
    var isActive = document.getElementById('chkIsActive').checked = false;
    var addressLine1 = document.getElementById('txtAddressLine1').value = '';
    var addressLine2 = document.getElementById('txtAddressLine2').value = '';
    var suburb = document.getElementById('txtSuburb').value = '';
    var postcode = document.getElementById('txtPostcode').value = '';
    var phoneNumber = document.getElementById('txtPhoneNumber').value = '';
    var faxNumber = document.getElementById('txtFaxNumber').value = '';
    var email = document.getElementById('txtEmail').value = '';
    var state = document.getElementById('ddlState').selectedIndex = 0;
    var dxNumber = document.getElementById('txtDXNumber').value = '';
    
    dPopupAddFinancialInstitution.Show();
}

function saveFinancialInstitution() {
    var id = document.getElementById('hdnFinancialInstitutionId').value;
    var name = document.getElementById('txtName').value;
    var isActive = document.getElementById('chkIsActive').checked;
    var addressLine1 = document.getElementById('txtAddressLine1').value;
    var addressLine2 = document.getElementById('txtAddressLine2').value;
    var suburb = document.getElementById('txtSuburb').value;
    var postcode = document.getElementById('txtPostcode').value;
    var phoneNumber = document.getElementById('txtPhoneNumber').value;
    var faxNumber = document.getElementById('txtFaxNumber').value;
    var email = document.getElementById('txtEmail').value;
    var state = document.getElementById('ddlState').options[document.getElementById('ddlState').selectedIndex].value;
    var dxNumber = document.getElementById('txtDXNumber').value;

    var errMsg = "There was an error saving the form:\n";
    var isErr = false;

    var re = new RegExp('^([0-9])+$');

    if (name == '') {
        errMsg += ' - Name is required\n';
        isErr = true;
    }

    if (addressLine1 == '') {
        errMsg += ' - Address Line 1 is required\n';
        isErr = true;
    }

    if (suburb == '') {
        errMsg += ' - Suburb is required\n';
        isErr = true;
    }

    if (state == '-1') {
        errMsg += ' - State is required\n';
        isErr = true;
    }

    if (!postcode.match(re) || postcode.length > 4 || postcode.length < 4) {
        errMsg += ' - Postcode format incorrect. Please enter a 4 digit number only';
        isErr = true;
    }

    if (isErr) {
        alert(errMsg);
    }
    else {
        cbActionFinancialInstitution.Callback(id, name, isActive, addressLine1, addressLine2, suburb, state, postcode, phoneNumber, faxNumber, email, dxNumber);
        dPopupAddFinancialInstitution.Close();
    }

}

// ================ NpbsRepresentative ================ //
function editNpbsRepresentative(id) {
    cbNpbsRepresentativePopup.Callback(id);
}

function cbNpbsRepresentativePopup_onCallbackComplete(sender, args) {
    dPopupAddNpbsRepresentative.Show();
}

function showNpbsRepresentativePopup() {
    var id = document.getElementById('hdnNpbsRepresentativeId').value = '';
    var name = document.getElementById('txtName').value = '';
    var isActive = document.getElementById('chkIsActive').checked = false;
    var addressLine1 = document.getElementById('txtAddressLine1').value = '';
    var addressLine2 = document.getElementById('txtAddressLine2').value = '';
    var suburb = document.getElementById('txtSuburb').value = '';
    var postcode = document.getElementById('txtPostcode').value = '';
    var phoneNumber = document.getElementById('txtPhoneNumber').value = '';
    var faxNumber = document.getElementById('txtFaxNumber').value = '';
    var email = document.getElementById('txtEmail').value = '';
    var state = document.getElementById('ddlState').selectedIndex = 0;
    var dxNumber = document.getElementById('txtDXNumber').value = '';

    dPopupAddNpbsRepresentative.Show();
}

function saveNpbsRepresentative() {
    var id = document.getElementById('hdnNpbsRepresentativeId').value;
    var name = document.getElementById('txtName').value;
    var isActive = document.getElementById('chkIsActive').checked;
    var addressLine1 = document.getElementById('txtAddressLine1').value;
    var addressLine2 = document.getElementById('txtAddressLine2').value;
    var suburb = document.getElementById('txtSuburb').value;
    var postcode = document.getElementById('txtPostcode').value;
    var phoneNumber = document.getElementById('txtPhoneNumber').value;
    var faxNumber = document.getElementById('txtFaxNumber').value;
    var email = document.getElementById('txtEmail').value;
    var state = document.getElementById('ddlState').options[document.getElementById('ddlState').selectedIndex].value;
    var dxNumber = document.getElementById('txtDXNumber').value;

    var errMsg = "There was an error saving the form:\n";
    var isErr = false;

    var re = new RegExp('^([0-9])+$');

    if (name == '') {
        errMsg += ' - Name is required\n';
        isErr = true;
    }

    if (addressLine1 == '') {
        errMsg += ' - Address Line 1 is required\n';
        isErr = true;
    }

    if (suburb == '') {
        errMsg += ' - Suburb is required\n';
        isErr = true;
    }

    if (state == '-1') {
        errMsg += ' - State is required\n';
        isErr = true;
    }

    if (!postcode.match(re) || postcode.length > 4 || postcode.length < 4) {
        errMsg += ' - Postcode format incorrect. Please enter a 4 digit number only';
        isErr = true;
    }

    if (isErr) {
        alert(errMsg);
    }
    else {
        cbActionNpbsRepresentative.Callback(id, name, isActive, addressLine1, addressLine2, suburb, state, postcode, phoneNumber, faxNumber, email, dxNumber);
        dPopupAddNpbsRepresentative.Close();
    }
}

// ================ Solicitor ================ //
function editSolicitor(id) {
    cbSolicitorPopup.Callback(id);
}

function cbSolicitorPopup_onCallbackComplete(sender, args) {
    dPopupAddSolicitor.Show();
}

function showSolicitorPopup() {
    var id = document.getElementById('hdnSolicitorId').value = '';
    var name = document.getElementById('txtName').value = '';
    var isActive = document.getElementById('chkIsActive').checked = false;
    var addressLine1 = document.getElementById('txtAddressLine1').value = '';
    var addressLine2 = document.getElementById('txtAddressLine2').value = '';
    var suburb = document.getElementById('txtSuburb').value = '';
    var postcode = document.getElementById('txtPostcode').value = '';
    var phoneNumber = document.getElementById('txtPhoneNumber').value = '';
    var faxNumber = document.getElementById('txtFaxNumber').value = '';
    var email = document.getElementById('txtEmail').value = '';
    var state = document.getElementById('ddlState').selectedIndex = 0;
    var dxNumber = document.getElementById('txtDXNumber').value = '';

    dPopupAddSolicitor.Show();
}

function saveSolicitor() {
    var id = document.getElementById('hdnSolicitorId').value;
    var name = document.getElementById('txtName').value;
    var isActive = document.getElementById('chkIsActive').checked;
    var addressLine1 = document.getElementById('txtAddressLine1').value;
    var addressLine2 = document.getElementById('txtAddressLine2').value;
    var suburb = document.getElementById('txtSuburb').value;
    var postcode = document.getElementById('txtPostcode').value;
    var phoneNumber = document.getElementById('txtPhoneNumber').value;
    var faxNumber = document.getElementById('txtFaxNumber').value;
    var email = document.getElementById('txtEmail').value;
    var state = document.getElementById('ddlState').options[document.getElementById('ddlState').selectedIndex].value;
    var dxNumber = document.getElementById('txtDXNumber').value;

    var errMsg = "There was an error saving the form:\n";
    var isErr = false;

    var re = new RegExp('^([0-9])+$');

    if (name == '') {
        errMsg += ' - Name is required\n';
        isErr = true;
    }

    if (addressLine1 == '') {
        errMsg += ' - Address Line 1 is required\n';
        isErr = true;
    }

    if (suburb == '') {
        errMsg += ' - Suburb is required\n';
        isErr = true;
    }

    if (state == '-1') {
        errMsg += ' - State is required\n';
        isErr = true;
    }

    if (!postcode.match(re) || postcode.length > 4 || postcode.length < 4) {
        errMsg += ' - Postcode format incorrect. Please enter a 4 digit number only';
        isErr = true;
    }

    if (isErr) {
        alert(errMsg);
    }
    else {
        cbActionSolicitor.Callback(id, name, isActive, addressLine1, addressLine2, suburb, state, postcode, phoneNumber, faxNumber, email, dxNumber);
        dPopupAddSolicitor.Close();
    }

}
