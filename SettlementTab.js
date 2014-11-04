var SettlementTabFN = 'SettlementTab.js';

var settlementDate;
var settlementDateTime;
var ddlValuerRegion;
var valuerRegion;
var ddlNpbsRepresentative;
var npbsRepresentative;

function SetSettlementTabControlValues() {
    settlementDate = DSWC_GetDate('ctl00_MainContent_Settlement_dtsSettlementDate');

    ddlIsInternalSettlement = document.getElementById('ddlIsInternalSettlement');
    isInternalSettlement = ddlIsInternalSettlement.options[ddlIsInternalSettlement.selectedIndex].value;

    ddlNpbsRepresentative = document.getElementById('ddlNpbsRepresentative');
    npbsRepresentative = ddlNpbsRepresentative.options[ddlNpbsRepresentative.selectedIndex].value;

}

function IsSettlementTabValid() {
    var errMsg = '';

    try {
        SetSettlementTabControlValues();
        
        //Set 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth(); 
        var yyyy = today.getFullYear();

        var selectedDateArray = settlementDate.split('/');

        var dtToday = new Date(yyyy, mm, dd);
        var dtSettlementDate = new Date(selectedDateArray[2], selectedDateArray[1] - 1, selectedDateArray[0]);

        if (Math.ceil((dtSettlementDate.getTime() - dtToday.getTime()) / (one_day)) < 0)
        {
            errMsg += '<li>Past dates cannot be selected</li>';
        }

        if (PickTime1.GetTime() == '-1') {
            errMsg += '<li>Please select an Hour, Minute and AM/PM from the Time dropdowns</li>';
        }

        if (isInternalSettlement == '-1')
        {
            errMsg += "<li>Please choose an 'Is Settlement In-House' option</li>";
        }

        if (npbsRepresentative == '-1' && isInternalSettlement == 'false')
        {
            errMsg += "<li>Please choose an 'NPBS Representative' option</li>";
        }

    }
    catch (err)
    {
        errMsg += 'SettlementTab.js : validateSettlementTab :' + err.description;
    }

    return errMsg;
}

function SaveSettlementDetailsTab() {
    // if SecurityRequestType Stage is in "Create/Edit" Stage do not save do not validate
    if (document.getElementById('hdnSecurityRequestStatusId').value != 11 || document.getElementById('hdnSecurityRequestTypeId').value != 1) return '';

    // validate
    var isValid = IsSettlementTabValid();
    
    // save
    if (isValid == '') {
        try {
            settlementDateTime = settlementDate + ' ' + PickTime1.GetTime();
            var stageId = document.getElementById('hdnSecurityRequestStageId').value;
            var statusId = document.getElementById('hdnSecurityRequestStatusId').value;
        
            var result = CallbackSaveSettlementTab(SecurityRequestId, stageId, statusId, settlementDateTime, isInternalSettlement, npbsRepresentative);

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