var CreateSecurityRequestFN = 'CreateSecurityRequest.js';

function SecurityTypeChange(ddl) {
    try {
        var ddlRequestType = document.getElementById("ddlRequestType");
        var requestTypeId = ddlRequestType.options[ddlRequestType.selectedIndex].value;

        var callback = eval('ctl00_MainContent_cbRequestSubtype');
        callback.Callback(requestTypeId);

    } catch (err) {
        alert(CreateSecurityRequest + ' : RequestTypeChange :' + err.description);
        return false;
    }
}

function SubmitForm()
{
    try {
        var ddlRequestType = document.getElementById("ddlRequestType");
        var requestTypeId = ddlRequestType.options[ddlRequestType.selectedIndex].value;

        var ddlRequestSubtype = document.getElementById("ddlRequestSubtype");
        var requestSubtypeId = ddlRequestSubtype.options[ddlRequestSubtype.selectedIndex].value;

        var accountNo = document.getElementById("txtAccountNo").value;

        // Validation
        if (requestTypeId == -1)
        {
            alert('Please select a Request Type.');
            return false;
        }

        if (requestSubtypeId == -1) {
            alert('Please select a Request SubType.');
            return false;
        }

        var re = new RegExp('^([0-9])+$');
        if (accountNo == '' || accountNo.length != 9 || !accountNo.match(re)) {
            alert('Data format in Account No field is invalid. Please use a 9 digit number.');
            return false;
        }
        

        document.getElementById("btnCreate").disabled = true;

        var callback = eval('ctl00_MainContent_cbCreateSecurityRequest');
        callback.Callback(requestTypeId, requestSubtypeId, accountNo);

    } catch (e) {

        alert(e);
        return false;
    }

    return false;
}

function callbackComplete(sender, args)
{
    document.getElementById("btnCreate").disabled = false;
}

function PressEnter() {
    try {
        if (window.event.keyCode == 13) {
            event.returnValue = false;
            event.cancel = true;
            document.getElementById('btnCreate').click();
        }
    } catch (err) {
        alert(CreateSecurityRequestFN + ' : PressEnter :' + err.description);
        return false;
    }
}
