var SearchSecurityRequestsFN = 'SearchSecurityRequests.js';

function HideAll() {
    document.getElementById('divMyRequests').style.display = 'none';
    document.getElementById('divSearch').style.display = 'none';
}

function ShowMyRequestsTab() {
    HideAll();
    document.getElementById('divMyRequests').style.display = 'block';
}

function ShowSearchTab() {
    HideAll();
    document.getElementById('divSearch').style.display = 'block';
}

function FindClick() {
    try {
        var securityRequestId = document.getElementById('txtSecurityRequestId').value;
        var securityId = document.getElementById('txtSecurityId').value;
        var accountNo = document.getElementById('txtAccountNumber').value;
        var memberNo = document.getElementById('txtMemberNumber').value;

        var createDate = DSWC_GetDate('ctl00_MainContent_SearchForm_dtsCreatedFrom');
        if (createDate == '01/01/2013')
            createDate = '';

        var ddlStatus = document.getElementById("ddlStatus");
        var statusId = ddlStatus.options[ddlStatus.selectedIndex].value;
        var statusName = ddlStatus.options[ddlStatus.selectedIndex].text;
        if (statusId == -1)
            statusName = '';

        var ddlRequestType = document.getElementById("ddlRequestType");
        var requestTypeId = ddlRequestType.options[ddlRequestType.selectedIndex].value;
        var requestTypeName = ddlRequestType.options[ddlRequestType.selectedIndex].text;
        if (requestTypeId == -1)
            requestTypeName = '';
        
        var ddlAlert = document.getElementById("ddlAlertType");
        var alertId = ddlAlert.options[ddlAlert.selectedIndex].value;
        var alertName = ddlAlert.options[ddlAlert.selectedIndex].text;
        if (alertId == -1)
            alertName = '';

        //Validation 

        if (securityRequestId == '' && securityId == '' && accountNo == '' && memberNo == '' &&
            createDate == '' && statusId == '-1' && securityRequestId == '-1' && alertId == '-1') {
            alert('Some parameters for search must be entered.');
            return false;
        }


        var re = new RegExp('^([0-9])+$');
        if (securityRequestId != '' && !securityRequestId.match(re)) {
            alert('Data format in Request Id field is invalid. Please use numerical data.');
            return false;
        }

        if (accountNo != '' && (accountNo.length != 9 || !accountNo.match(re))) {
            alert('Data format in Account No field is invalid. Please use a 10 digit number.');
            return false;
        }

        if (memberNo != '' && (memberNo.length != 8 || !memberNo.match(re))) {
            alert('Data format in Member No is invalid. Please use an 8 digit number.');
            return false;
        }

        var callback = eval('ctl00_MainContent_cbSearch');
        callback.Callback(securityRequestId, securityId, accountNo, memberNo, createDate, statusName, requestTypeName, alertName);

    } catch (err) {
        alert(SearchSecurityRequestsFN + ' : FindClick :' + err.description);
        return false;
    }
}

function PressEnter() {
    try {
        if (window.event.keyCode == 13) {
            event.returnValue = false;
            event.cancel = true;
            document.getElementById('btnFind').click();
        }
    } catch (err) {
        alert(SearchSecurityRequestsFN + ' : PressEnter :' + err.description);
        return false;
    }
}

function showAlerts(securityRequestId) {
    var callback = eval('ctl00_MainContent_gMyRequests_cbPopupAlerts');
    callback.Callback(securityRequestId);
    dPopupAlerts.set_alignment('MiddleCentre');
    dPopupAlerts.Show();
}
