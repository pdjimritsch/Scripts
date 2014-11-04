var AccountTabFN = 'AccountTab.js';
var AccountTabSecurityRequestCurrentLVR;
var accountCallbackParams = "";

function validateCurrentLvr(ctrl)
{
    txtCurrentLVR = document.getElementById('txtCurrentLVR');
    currentLVR = ctrl.value;

    var re = new RegExp('^([0-9])+$');
    var errMsg = '';

    if (!currentLVR.match(re) || currentLVR.length > 2 || currentLVR.length <= 0) {
        errMsg += '<li>Data format in Current LVR field is invalid. Please use 1 or 2 digit number</li>';
    }

    return errMsg;
}

function validateAccountTabNumericField(e) {
    var a = [];
    var k = e.which;

    for (i = 48; i < 58; i++)
        a.push(i);

    if (!(a.indexOf(k) >= 0))
        e.preventDefault();
}

function IsAccountTabValid() {
    var errMsg = '';

    try {

        var isValid = true;

        // ensure all fields are completed
        var invalidValue = false;
        for (i = 0; i < accountControlsToValidate.length; i++) {
            if (accountControlTypesToValidate[i] == 'list') {
                var list = document.getElementById(accountControlsToValidate[i]);
                if (list.options[list.selectedIndex].value == "-1") {
                    invalidValue = true;
                }
            }
            if (accountControlTypesToValidate[i] == 'text') {
                var text = document.getElementById(accountControlsToValidate[i]);
                if (text.value == "") {
                    invalidValue = true;
                }
                if (validateCurrentLvr(text) != "") {
                    invalidValue = true;
                    errMsg += validateCurrentLvr(text);
                }
            }
        }
        if (invalidValue) {
            isValid = false;
            errMsg += '<li>All fields on the Account Tab are required</li>';
        }

        // check is Deed of Priority if required, input fields are complete
        var txtA = document.getElementById('txtA');
        var isTxtADisabled = false;
        var amountA = 0;
        if (txtA != null) {
            if (txtA.disabled) {
                isTxtADisabled = true;
            }
            if (txtA.value == '') {
                isValid = false;
                errMsg += '<li>Please enter the Existing Loan/s Balance</li>';
            }
            else {
                var amountA = txtA.value;
            }
        }
        var txtB = document.getElementById('txtB');
        var amountB = 0;
        if (txtB != null) {
            if (txtB.value == '') {
                isValid = false;
                errMsg += '<li>Please enter the New Lending Amount</li>';
            }
            else {
                var amountB = txtB.value;
            }
        }
        var txtC = document.getElementById('txtC');
        var amountC = 0;
        if (txtC != null) {
            if (txtC.value == '') {
                amountC = 0;
            }
            else {
                amountC = txtC.value;
            }
        }

        // If the total of Existing Loan/s and New Lending amount is greater than the existing Deed amount display alert
        if (!isTxtADisabled && (parseInt(amountA) + parseInt(amountB)) > amountC) {
            alert('Complete a new Deed of Priority for $' + (parseInt(amountA) + parseInt(amountB)));
        }
    }
    catch (err) {
        errMsg += 'AccountTab.js : validateAccountTab :' + err.description;
    }

    return errMsg;
}

function AccountTabShowWarning(ddl, choice, flowon) {
    if (ddl.options[ddl.selectedIndex].value == choice) {
        if (flowon.indexOf('EMAIL') >= 0) {
            var emailType = flowon.substr(6, flowon.length - 1);
            ShowEmailPopup(emailType);
        }
        else {
            switch (flowon) {
                case 'A':
                    alert('If the account is in arrears consent cannot be provided until the account is in order. Refer this to your Supervisor.');
                    break;
                case 'B':
                    alert('Refer this matter to Credit Analysis.');
                    break;
                case 'DEED':
                    AccountTabShowDeedOfPriority(ddl, choice);
                    break;
            }
        }
    }
    else {
        if (flowon == 'DEED') {
            AccountTabShowDeedOfPriority(ddl, 'No');
        }
    }
}

function ShowEmailPopup(emailType) {
    document.getElementById("hdnAccountEmailType").value = emailType;
    dlgAccountEmailServiceProvider.Show();
}

function SendAccountEmail() {
    var emailType = document.getElementById("hdnAccountEmailType").value;
    var body = document.getElementById("txtAccountEmailComments").value;

    var result = CallbackSendAccountTabEmail(emailType, body);

    if (result.indexOf("#ERROR#") >= 0) {
        alert(result.substr(7));
    }
    else {
        alert("Email successfully sent");
    }

    dlgAccountEmailServiceProvider.Close();
}

function AccountTabShowDeedOfPriority(ddl, choice) {
    // get reference to current table cell and add div
    var cell = ddl.parentElement;

    var div = CreateDeedOfPriorityInputsDiv(ddl, true);

    if (choice == 'No') {
        div.innerHTML = '';
        return;
    }

    alert('If this loan has an existing second mortgage the additional loan and existing loan/s balance including IN Advance amounts cannot exceed the existing Deed of Priority amount.');
}

function AccountTabShowFinancialInstitution(ddl) {
    // get reference to current table cell and add div
    var cell = ddl.parentElement;

    var div = CreateFinancialInstitutionDiv(ddl);
}

function CreateFinancialInstitutionDiv(ddl) {
    // create/access details div
    var div;
    var divId = "divAccountTabFinancialInstitutionDetails";
    if (document.getElementById(divId) != null) {
        div = document.getElementById(divId)
    }
    else {
        // create new details div
        var div = document.createElement('div');
        div.id = divId;
    }

    // callback to get Financial Institions Name, Address, and Phone to add to div
    var response = CallbackGetFinancialInstitution(ddl.options[ddl.selectedIndex].value);
    if (response != null) {

        var entity = JSON.parse(response);

        if (entity !== null) {
            if (entity.Name != null) {
                div.innerHTML = entity.Name + "<br />" +
                    entity.AddressLine1 + "<br />" +
                    entity.AddressLine2 + "<br />" +
                    entity.Suburb + "<br />" +
                    entity.State + "<br />" +
                    entity.Postcode + "<br />" +
                    entity.PhoneNumber;
            }
            else {
                div.innerHTML = '';
            }
        }

        ddl.parentElement.appendChild(div);

        return div;
    }
}

function CreateDeedOfPriorityInputsDiv(ddl, enabled) {
    // create/access details div
    var div;
    var divId = "divAccountTabDeedOfPriorityDetails";
    if (document.getElementById(divId) != null) {
        div = document.getElementById(divId);
        div.innerHTML = '';
    }
    else {
        // create new details div
        var div = document.createElement('div');
        div.id = divId;
    }

    // add style
    div.style.fontSize = '10px';

    // create input fields for loan amount details
    var divA = document.createElement('div');
    var divB = document.createElement('div');
    var divC = document.createElement('div');

    // A
    var brA = document.createElement('br');
    var divALabel = document.createElement('div');
    var divAField = document.createElement('div');
    var txtA = document.createElement('input');

    txtA.disabled = !enabled;
    txtA.id = 'txtA';
    txtA.onkeypress = validateAccountTabNumericField;
    brA.style.clear = 'both';
    divALabel.innerHTML = "Existing Loan/s Balance <br />(Including In Advance Amounts)";
    divALabel.style.cssFloat = 'left';
    divALabel.style.width = '180px';
    divAField.style.cssFloat = 'left';
    divAField.appendChild(txtA);
    divA.appendChild(divALabel);
    divA.appendChild(divAField);
    divA.appendChild(brA);

    // B
    var brB = document.createElement('br');
    var divBLabel = document.createElement('div');
    var divBField = document.createElement('div');
    var txtB = document.createElement('input');

    txtB.disabled = !enabled;
    txtB.id = 'txtB';
    txtB.onkeypress = validateAccountTabNumericField;
    brB.style.clear = 'both';
    divBLabel.innerHTML = "New Lending Amount";
    divBLabel.style.cssFloat = 'left';
    divBLabel.style.width = '180px';
    divBField.style.cssFloat = 'left';
    divBField.appendChild(txtB);
    divB.appendChild(divBLabel);
    divB.appendChild(divBField);
    divB.appendChild(brB);

    // C
    var brC = document.createElement('br');
    var divCLabel = document.createElement('div');
    var divCField = document.createElement('div');
    var txtC = document.createElement('input');

    txtC.disabled = !enabled;
    txtC.id = 'txtC';
    txtC.onkeypress = validateAccountTabNumericField;
    brC.style.clear = 'both';
    divCLabel.innerHTML = "Existing Deed of Priority Amount";
    divCLabel.style.cssFloat = 'left';
    divCLabel.style.width = '180px';
    divCField.style.cssFloat = 'left';
    divCField.appendChild(txtC);
    divC.appendChild(divCLabel);
    divC.appendChild(divCField);
    divC.appendChild(brC);

    // append input fields into div
    div.appendChild(divA);
    div.appendChild(divB);
    div.appendChild(divC);

    ddl.parentElement.appendChild(div);

    return div;
}


function PopulateAccountTabDeedOfPriorityAmounts(a, b, c) {
    var txtA = document.getElementById('txtA');
    if (txtA != null) {
        txtA.value = a;
    }
    var txtB = document.getElementById('txtB');
    if (txtB != null) {
        txtB.value = b;
    }
    var txtC = document.getElementById('txtC');
    if (txtC != null) {
        txtC.value = c;
    }

}


function SaveAccountTab() {
    // if SecurityRequestType is not a "Consent" do not save do not validate
    if (document.getElementById('hdnSecurityRequestTypeId').value != 2 || document.getElementById('hdnSecurityRequestStageId').value != 1) return '';

    // validate
    var isValid = IsAccountTabValid();

    // save
    if (isValid == '') {
        try {

            // build name=value pair string to send through callback
            for (i = 0; i < accountControlsToValidate.length; i++) {
                if (accountControlTypesToValidate[i] == 'list') {
                    var list = document.getElementById(accountControlsToValidate[i]);
                    accountCallbackParams += accountControlsToValidate[i] + "=" + list.options[list.selectedIndex].value + "&";
                }
                if (accountControlTypesToValidate[i] == 'text') {
                    var text = document.getElementById(accountControlsToValidate[i]);
                    accountCallbackParams += accountControlsToValidate[i] + "=" + text.value + "&";
                }
            }

            // check is Deed of Priority if required, input fields are complete and append to name=value string
            var txtA = document.getElementById('txtA');
            if (txtA != null) {
                accountCallbackParams += "AmountA=" + txtA.value + "&";
            }
            var txtB = document.getElementById('txtB');
            if (txtB != null) {
                accountCallbackParams += "AmountB=" + txtB.value + "&";
            }
            var txtC = document.getElementById('txtC');
            if (txtC != null) {
                accountCallbackParams += "AmountC=" + txtC.value + "&";
            }

            accountCallbackParams = accountCallbackParams.substr(0, accountCallbackParams.lastIndexOf('&'));

            var result = CallbackSaveAccountTab(document.getElementById('hdnSecurityRequestId').value, accountCallbackParams);

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
