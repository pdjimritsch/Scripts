var RedemptionScriptFileName = 'Redemption.js';

var RedemptionScriptReferenceId = 'ctl00_MainContent_Redemption_';

var RedemptionServerReferenceId = 'MainContent_Redemption_';

/*
*   Events
*/

/*
*  Initializes the redemption user control appearance according to the business rules.
*/
function OnInitializeRedemption() {

    if (typeof (initializeRedemption) == 'function') {

        initializeRedemption();
    }

    if (typeof (applyRedemptionBusinessRules) == 'function') {

        applyRedemptionBusinessRules();
    }

    if (typeof (registerRedemptionEventHandlers) == 'function') {

        registerRedemptionEventHandlers();
    }
    
    if (typeof (verifyMinimumSettlementAmount) == 'function') {

        verifyMinimumSettlementAmount();
    }
}

/*
*   Accepts the provided information for the reduction within redemption
*   from the popup ComponentArt dialog
*/
function OnAcceptCalculateRedemption(button) {

    var errors = '';

    var alertMessage = 'The previous applied Loan Account Reductions will be removed for the Security Request.';

    alertMessage += '<br/><br/>';

    alertMessage += 'Do you wish to continue with the Calculuate Residual Lending Security';

    var response = confirm(alertMessage);

    if (response == true) {

        if (typeof (SaveRecalulateForRedemption) == 'function') {

            errors = SaveRecalulateForRedemption();
        }

    }

    if (errors.length == 0) {

        return OnCancelCalculateRedemption(null);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Closes the popup ComponentArt dialog for the reduction within redemption.
*/
function OnCancelCalculateRedemption(button) {

    var dlg = dlgCalculateRedemption;

    dlg = ((dlg === undefined) || (dlg == null)) ? getRedemptionControl('dlgCalculateRedemption') : dlg;

    try {

        dlg.Close();

    } catch (err) {

        alert(RedemptionScriptFileName + '. Control: Cancel Button for Calc Redemptions. Event: Click. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Accepts the provided information for the reduction within redemption
*   from the popup ComponentArt dialog
*/
function OnAcceptReductionRedemption(button) {

    var response = '';

    if (typeof (SaveReductionForRedemption) == 'function') {

        response = SaveReductionForRedemption();
    }

    if (response.length == 0) {

        return OnCancelReductionRedemption(null);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Closes the popup ComponentArt dialog for the reduction within redemption.
*/
function OnCancelReductionRedemption(button) {

    var dlg = dlgReduceRedemption;

    dlg = ((dlg === undefined) || (dlg == null)) ? getRedemptionControl('dlgCalculateRedemption') : dlg;

    try {

        dlg.Close();

    } catch (err) {

        alert(RedemptionScriptFileName + '. Control: Cancel Button for Calc Redemptions. Event: Click. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Recalculates redemption.
*/
function OnCalculateRedemption() {

    var alertMessage = 'The previous applied Loan Account Reductions will be removed for the Security Request.';

    alertMessage += '\n\n';

    alertMessage += 'Do you wish to continue with the Calculuate Residual Lending Security';

    var response = confirm(alertMessage);

    if (response == true) {

        var caption = 'Calculate Residual Lending Security';

        var dlg = initializeCalculateRedemptionDialog(caption);

        if ((dlg === undefined) || (dlg == null) || (dlg.window === undefined) || (dlg.window == null) || (dlg.canDisplay == false)) {

            if (typeof (stopEventBubbling) == 'function') {

                stopEventBubbling(window.event);
            }

            return false;
        }

        try {

            dlg.window.show();

        } catch (err) {

            alert(RedemptionScriptFileName + '. Control: Calc Button. Event: Click. Error: ' + err.description);
        }

    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Instigates a redemption reduction.
*/
function OnReduceRedemption() {

    var caption = 'Loan Account Reduction';

    var dlg = initializeReductionRedemptionDialog(caption);

    if ((dlg === undefined) || (dlg == null) || (dlg.window === undefined) || (dlg.window == null) || (dlg.canDisplay == false)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    try {

        dlg.window.show();

    } catch (err) {

        alert(RedemptionScriptFileName + '. Control: Reduce Button. Event: Click. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*
*/
function OnSelectCalculateRedemptionOption(option) {

    if ((option === undefined) || (option == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    var txtResidualPercentage = getRedemptionControl('txtResidualPercentage');

    var txtLendingSecurityAmount = getRedemptionControl('txtLendingSecurityAmount');

    if ((txtResidualPercentage === undefined) || (txtResidualPercentage == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    if ((txtLendingSecurityAmount === undefined) || (txtLendingSecurityAmount == null)) {

        if (typeof (stopEventBubbling) == 'function') {

            stopEventBubbling(window.event);
        }

        return false;
    }

    if (option.checked == true) {

        if (option.id == 'optResidualPercentage') {

            txtResidualPercentage.readonly = '';
            txtResidualPercentage.disabled = '';
            txtResidualPercentage.style.backgroundColor = 'white';

            txtLendingSecurityAmount.readonly = 'readonly';
            txtLendingSecurityAmount.disabled = 'disabled';
            txtLendingSecurityAmount.style.backgroundColor = 'gray';

        } else if (option.id == 'optLendingSecurity')  {

            txtResidualPercentage.readonly = 'readonly';
            txtResidualPercentage.disabled = 'disabled';
            txtResidualPercentage.style.backgroundColor = 'gray';

            txtLendingSecurityAmount.readonly = '';
            txtLendingSecurityAmount.disabled = '';
            txtLendingSecurityAmount.style.backgroundColor = 'white';
        }
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Initializes the ComponentArt pop up dialog for the calculate redemption dialog.
*/
function OnShowCalculateRedemptionDialog(dlg) {

    try {

        var hidden = getRedemptionControl('redemptionSecurityRequestId');

        var securityRequestId = ((hidden === undefined) || (hidden === null)) ? null : hidden.value.trim();

        var callerId = getRedemptionControl('cbdlgCalculateRedemption');

        var caller = eval(callerId);

        if (((caller === undefined) || (caller == null)) && ((dlg !== undefined) && (dlg != null))) {

            caller = eval(dlg.id);
        }

        if ((caller !== undefined) && (caller != null)) {

            if (typeof (caller.Callback) == 'function') {

                caller.Callback(securityRequestId == null ? '' : securityRequestId);

            } else if ((caller.control !== undefined) && (caller.control != null) && (typeof (caller.control.Callback) == 'function')) {

                caller.control.Callback(securityRequestId == null ? '' : securityRequestId);
            }
        }

    } catch (err) {

        alert(RedemptionScriptFileName + '. Dialog: Calculate Residual Lending Security. Event: Show. Error: ' + err.description);
    }

    if (typeof (stopEventBubbling) == 'function') {

        stopEventBubbling(window.event);
    }

    return false;
}

/*
*   Initializes the ComponentArt pop up dialog for the reduction redemption dialog.
*/
function OnShowReductionRedemptionDialog(dlg) {

    try {

        var hidden = getRedemptionControl('redemptionSecurityRequestId');

        var securityRequestId = ((hidden === undefined) || (hidden === null)) ? null : hidden.value.trim();

        var callerId = getRedemptionControl('cbdlgReduceRedemption');

        var caller = eval(callerId);

        if (((caller === undefined) || (caller == null)) && ((dlg !== undefined) && (dlg != null))) {

            caller = eval(dlg.id);
        }

        if ((caller !== undefined) && (caller != null)) {

            var divStatusbar = getRedemptionControl('divLoanAccountStatus');

            if ((divStatusbar !== undefined) && (divStatusbar != null)) {

                divStatusbar.style.display = 'block';

                var statusbar = getRedemptionControl('LoanAccountStatus');

                if ((statusbar !== undefined) && (statusbar != null)) {

                    statusbar.innerText = 'Loading accounts...';
                }

            }

            if (typeof (caller.Callback) == 'function') {

                caller.Callback(securityRequestId == null ? '' : securityRequestId);

            } else if ((caller.control !== undefined) && (caller.control != null) && (typeof (caller.control.Callback) == 'function')) {

                caller.control.Callback(securityRequestId == null ? '' : securityRequestId);
            }

        }

    } catch (err) {

        alert(RedemptionScriptFileName + '. Dialog: Reduce Loan Account. Event: Show. Error: ' + err.description);
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
*   Applies a border around the label (span) control.
*/
function applyBorder(id) {

    if ((id === undefined) || (id == null)) {

        return;
    }

    var ctrl = getRedemptionControl(id);

    if ((ctrl === undefined) || (ctrl == null)) {

        return;
    }

    ctrl.style.border = '2px solid black;';
    ctrl.style.position = 'relative';
}

/*
*  Applies the business rules for the security request redemptions
*/
function applyRedemptionBusinessRules() {

    var attributes = getSecurityRequestAttributesForRedemption();

    if ((attributes === undefined) || (attributes == null)) {

        return;
    }

    var disabledMode = false;

    if (attributes.currentEmployeeNo == attributes.securityRequestOwner) {

        if ((attributes.stage == 'Supervisor Approval') || (attributes.stage == 'Closed')) {

            disabledMode = true;

        } else if (attributes.stage == 'Settlement Booking') {

            if (attributes.status == 'Settlement Booked') {

                disabledMode = false;

            } else {

                disabledMode = true;

            }

        } else if (attributes.securityRequestType == 'Consent') {

            disabledMode = true;

        } else {

            disabledMode = true;

        }

    } else {

        disabledMode = true;
    }

    if ((typeof (SetRedemptionControlAsDisabled) == 'function') && (typeof (getRedemptionControl) == 'function')) {

        SetRedemptionControlAsDisabled(getRedemptionControl('btnRedemptionCalculate'), disabledMode);

        SetRedemptionControlAsDisabled(getRedemptionControl('btnRedemptionReduce'), disabledMode);
    }
}

/*
*   Gets the reference to the HTML element by element ID.
*/
function getRedemptionControl(id) {

    var ctrl = null;

    if ((id === undefined) || (id == null)) {

        return ctrl;
    }

    ctrl = document.getElementById(getRedemptionServerControlId(id));

    ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getRedemptionControlId(id)) : ctrl;

    ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

    return ctrl;
}

/*
*  Gets the control identity with repsect to the enclosing web page.
*/
function getRedemptionControlId(partialId) {

    return RedemptionScriptReferenceId + partialId;
}

/*
*  Gets the control identity with respect to the enclosing web page.
*/
function getRedemptionServerControlId(partialId) {

    return RedemptionServerReferenceId + partialId;
}

/*
*   Gets the registered attributes of the security request.
*/
function getSecurityRequestAttributesForRedemption() {

    var attributes = {};

    var ctrl = null;

    ctrl = getRedemptionControl('redemptionSecurityRequestStage');

    attributes.stage = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRedemptionControl('redemptionSecurityRequestStatus');

    attributes.status = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRedemptionControl('redemptionCurrentEmployeeNo');

    attributes.currentEmployeeNo = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRedemptionControl('redemptionSecurityRequestOwner');

    attributes.securityRequestOwner = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRedemptionControl('redemptionSecurityRequestId');

    attributes.securityRequestId = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRedemptionControl('redemptionSecurityRequestType');

    attributes.securityRequestType = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    ctrl = getRedemptionControl('redemptionSecurityRequestSubType');

    attributes.securityRequestSubType = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

    return attributes;
}

/*
*   Creates a compatible Javascript object that correlates to the Redemption display settings
*/
function getRedemptionSettings() {

    /*
    *   Create a javascript redemption object.
    */
    var redemption = {}

    var attributes = getSecurityRequestAttributesForRedemption();

    return redemption;
}

/*
*   Initializes the appearance of the ComponentArt popup dialog
*   for the Calcuate Residual Lending Security.
*
*   The function returns a reference to the specific dialog.
*/
function initializeCalculateRedemptionDialog(caption) {

    var dlg = {};

    dlg.caption = ((caption === undefined) || (caption == null)) ? '' : caption.toString().trim();
    dlg.canDisplay = false;

    var spn = getRedemptionControl('spnCalculateRedemption');

    if ((spn !== undefined) && (spn != null)) {

        spn.innerText = dlg.caption;
    }

    try {

        if ((dlgCalculateRedemption !== undefined) && (dlgCalculateRedemption != null)) {

            dlg.window = dlgCalculateRedemption;
            dlg.canDisplay = true;

        } else {

            dlg.window = eval(getRedemptionControl('dlgCalculateRedemption'));
            dlg.canDisplay = ((dlg.window !== undefined) && (dlg.window != null));

        }

    } catch (err) {

        dlg.window = eval(getRedemptionControl('dlgCalculateRedemption'));
        dlg.canDisplay = ((dlg.window !== undefined) && (dlg.window != null));
    }

    return dlg;
}

/*
*   Initializes the appearance of the ComponentArt popup dialog
*   for the Loan Account Reduction.
*
*   The function returns a reference to the specific dialog.
*/
function initializeReductionRedemptionDialog(caption) {

    var dlg = {};

    dlg.caption = ((caption === undefined) || (caption == null)) ? '' : caption.toString().trim();
    dlg.canDisplay = false;

    var spn = getRedemptionControl('spnReduceRedmption');

    if ((spn !== undefined) && (spn != null)) {

        spn.innerText = dlg.caption;
    }

    try {

        if ((dlgReduceRedemption !== undefined) && (dlgReduceRedemption != null)) {

            dlg.window = dlgReduceRedemption;
            dlg.canDisplay = true;

        } else {

            dlg.window = eval(getRedemptionControl('dlgReduceRedemption'));
            dlg.canDisplay = ((dlg.window !== undefined) && (dlg.window != null));
        }

    } catch (err) {

        dlg.window = eval(getRedemptionControl('dlgReduceRedemption'));
        dlg.canDisplay = ((dlg.window !== undefined) && (dlg.window != null));
    }

    return dlg;
}

/*
*   Applies a in-line border around labels.
*/
function initializeRedemption() {

    applyBorder('lblTotalSecurityValuation');

    applyBorder('lblPostReleaseValue');

    applyBorder('lblTotalFeesAmount');

    applyBorder('lblResidualPercent');

    applyBorder('lblTotalLoanBalance');

    applyBorder('lblResidualLendingSecurityValue');

    applyBorder('lblMinimumSettlementAmount');
}

/*
*   Registers the event handlers for the specific controls
*   within ComponentArt popup dialog.
*/
function registerRedemptionEventHandlers() {

    // Calculate Residual Lending Security ComponentArt Dialog

    var ctrl = null;

    ctrl = getRedemptionControl('txtResidualPercentage');
    if ((ctrl !== undefined) && (ctrl != null)) {

        ctrl.onkeypress = function () {

            var txtBox = getRedemptionControl('txtLendingSecurityAmount');

            if (this.value.length > 0) {

                if ((txtBox !== undefined) && (txtBox != null)) {

                    txtBox.value = '';
                    txtBox.readonly = true;
                }

            } else {

                txtBox.readonly = false;

            }
        };
    }

    ctrl = getRedemptionControl('txtLendingSecurityAmount');
    if ((ctrl !== undefined) && (ctrl != null)) {

        ctrl.onkeypress = function () {

            var txtBox = getRedemptionControl('txtResidualPercentage');

            if (this.value.length > 0) {

                if ((txtBox !== undefined) && (txtBox != null)) {

                    txtBox.value = '';
                    txtBox.readonly = true;
                }

            } else {

                txtBox.readonly = false;

            }
        };
    }

    /*
    var options = document.getElementsByName('optCalculateRedemptionGroup');

    if ((options !== undefined) && (options != null) && (options.length > 0)) {

        for (var index = 0; index < options.length; ++index) {

            options[index].onclick = function () { OnSelectCalculateRedemptionOption(this); };
            options[index].click = function () { OnSelectCalculateRedemptionOption(this); };
        }
    }
    */
}

/*
*   Applies the provided residual lending security attributes for the security request.
*/
function SaveRecalulateForRedemption() {

    var errors = '';

    var attributes = getSecurityRequestAttributesForRedemption();

    var txtResidualPercentage = getRedemptionControl('txtResidualPercentage');

    var txtLendingSecurityAmount = getRedemptionControl('txtLendingSecurityAmount');

    if ((attributes.securityRequestId === undefined) || (attributes.securityRequestId == null)) {

        errors = 'The redemption security request identity was not provided.';

        return errors;
    }

    var residualPercentage = -1;

    var lendingSecurityAmount = -1;

    if ((txtResidualPercentage !== undefined) && (txtResidualPercentage != null) && (txtResidualPercentage.value.trim().length > 0)) {

        residualPercentage = window.parseFloat(txtResidualPercentage.value.trim());
    }

    if ((txtLendingSecurityAmount !== undefined) && (txtLendingSecurityAmount != null) && (txtLendingSecurityAmount.value.trim().length > 0)) {

        lendingSecurityAmount = window.parseFloat(txtLendingSecurityAmount.value.trim());
    }

    var txtPostReleaseValue = getRedemptionControl('txtPostReleaseValue');

    if ((txtPostReleaseValue === undefined) || (txtPostReleaseValue == null)) {

        errors = 'The reference to the post release value textbox could not be resolved.';

        return errors;
    }

    var postReleaseValue = window.parseFloat(txtPostReleaseValue.value.trim());

    if ((lendingSecurityAmount == -1) && ((residualPercentage < 0) || (residualPercentage > 100))) {

        errors = 'The Residual Lending Security percentage must be between 0 and 100.';

        alert(errors);

        return errors;
    }

    if ((residualPercentage == -1) && ((lendingSecurityAmount < 0) || (lendingSecurityAmount > postReleaseValue))) {

        errors = 'The Residual Lending Security amount must be a postive value and must not be larger than the Post Release amount.';

        alert(errors);

        return;

    }

    /*
    *   Create a javascript redemption object.
    */
    var redemption = {}

    redemption.lendingSecurityAmount = lendingSecurityAmount;
    redemption.loanAccount = '';
    redemption.postReleaseValue = postReleaseValue;
    redemption.reductionAmount = -1;
    redemption.residualPercentage = residualPercentage;
    redemption.securityRequestId = window.parseInt(attributes.securityRequestId.trim());

    var request = JSON.stringify(redemption);

    /*
    *  Save the end-user request to update the security request totals 
    *  by posting the redemption object to the ComponentArt AJAX script method
    */
    if ((typeof (SaveRedemptionRecalculation) == 'function') && (request.length > 0)) {

        errors = SaveRedemptionRecalculation(request);

        if ((errors !== undefined) && (errors != null) && (typeof (errors) == 'string')) {

            errors = errors.trim();
        }

        if (errors.length > 0) {

            errors = 'Activity: Calculate Residual Lending Security. Error: ' + errors.trim();

            alert(errors);

        } else {

            // Refresh the linked acccount redemptions within the UI.

            if (typeof (updateRedemptionDisplay) == 'function') {

                updateRedemptionDisplay();
            }
        }
    }

    return errors;
}

/*
*   Applies the provided residual lending security attributes for the security request.
*/
function SaveReductionForRedemption() {

    var response = '';

    var attributes = getSecurityRequestAttributesForRedemption();

    var ddlLoanAccounts = getRedemptionControl('ddlLoanAccounts');

    var txtReductionAmount = getRedemptionControl('txtReductionAmount');

    if ((ddlLoanAccounts === undefined) || (ddlLoanAccounts == null)) {

        response = RedemptionScriptFileName + '. Control: Loan Account drop down list. Event: Click. Error: Cannot access the drop down list.';

        alert(response);

        return;
    }

    if ((txtReductionAmount === undefined) || (txtReductionAmount == null)) {

        response = RedemptionScriptFileName + '. Control: Reduction Amount text box. Event: Click. Error: Cannot access the text box.';

        alert(response);

        return;
    }

    var loanAccount = ddlLoanAccounts.options[ddlLoanAccounts.options.selectedIndex].text;

    if ((loanAccount == null) || (loanAccount.length == 0) || (loanAccount == 'Please select')) {

        response = RedemptionScriptFileName + '. Control: Loan Account drop down list. Event: Click. Error: Please select a loan account .';

        alert(response);

        return;
    }

    if ((txtReductionAmount.value == null) || (txtReductionAmount.value.trim().length == 0)) {

        response = RedemptionScriptFileName + '. Control: Reduction Amount text box. Event: Click. Error: Please provide a reduction amount.';

        alert(response);

        return;
    }

    var reductionAmount = window.parseFloat(txtReductionAmount.value.trim());

    /*
    *   Create a javascript redemption object.
    */
    var redemption = {}

    redemption.lendingSecurityAmount = 0.0;
    redemption.loanAccount = loanAccount.trim();
    redemption.postReleaseValue = 0.0;
    redemption.reductionAmount = reductionAmount;
    redemption.residualPercentage = 0.0;
    redemption.securityRequestId = window.parseInt(attributes.securityRequestId.trim());

    var request = JSON.stringify(redemption);

    /*
    *  Save the end-user request to update the security request totals 
    *  by posting the redemption object to the ComponentArt AJAX script method
    */
    if ((typeof (SaveRedemptionRecalculation) == 'function') && (request.length > 0)) {

        var errors = SaveRedemptionRecalculation(request);

        if ((errors !== undefined) && (errors != null) && (typeof (errors) == 'string')) {

            errors = errors.trim();
        }

        if (errors.length > 0) {

            response = 'Activity: Loan Account Reduction. Error: ' + errors;

            alert(response);

        } else {

            // Refresh the linked acccount redemptions within the UI.

            if (typeof (updateRedemptionDisplay) == 'function') {

                updateRedemptionDisplay();
            }
        }
    }

    return response;
}

/*
*   Assigns the disabled attribute to the redemption control.
*/
function SetRedemptionControlAsDisabled(ctrl, disabled) {

    if ((ctrl === undefined) || (ctrl == null)) {

        return;
    }

    var enabled = ((disabled === undefined) || (disabled == null)) ? false : (disabled == false);

    ctrl.disabled = (enabled == false);
}

/*
*   Assigns the read-write mode to the redemption control.
*/
function SetRedemptionControlAsReadOnly(ctrl, readonly) {

    if ((ctrl === undefined) || (ctrl == null)) {

        return;
    }

    var writable = ((readonly === undefined) || (readonly == null)) ? false : (readonly == false);

    var isInternetExplorer11OrAbove = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));

    if (ctrl.tagName.toLowerCase() == 'input') {

        if (ctrl.type.toLowerCase() == 'text') {

            ctrl.readonly = (writable == false);
            ctrl.disabled = (writable == false);

            if (writable == false) {

                ctrl.style.backgroundColor = 'gray';
                ctrl.onkeypress = function () {

                    if (typeof (stopEventBubbling) == 'function') {

                        stopEventBubbling(window.event);
                    }

                    return false;
                }

            } else {

                ctrl.style.backgroundColor = 'white';

                if (isInternetExplorer11OrAbove == false) {

                    if ((typeof (ctrl.hasAttribute) == 'function') && (ctrl.hasAttribute('onkeypress') == true)) {
                        if (typeof (ctrl.detachEvent) == 'function') {
                            ctrl.detachEvent('onkeypress', function () {

                                if (typeof (stopEventBubbling) == 'function') {

                                    stopEventBubbling(window.event);
                                }

                                return false;
                            });
                        }
                    }

                } else {

                    if ((typeof (ctrl.getAttribute) == 'function') && (ctrl.getAttribute('onkeypress') != null)) {
                        if (typeof (ctrl.removeEventListener) == 'function') {
                            ctrl.removeEventListener('onkeypress', function () {

                                if (typeof (stopEventBubbling) == 'function') {

                                    stopEventBubbling(window.event);
                                }

                                return false;
                            });
                        }
                    }

                }
            }
        }

    } else if (ctrl.tagName.toLowerCase() == 'select') {

        ctrl.disabled = (writable == false);

        if (writable == false) {

            ctrl.style.backgroundColor = 'gray';
            ctrl.onchange = function () {

                if (typeof (stopEventBubbling) == 'function') {

                    stopEventBubbling(window.event);
                }

                return false;
            }

        } else {

            ctrl.style.backgroundColor = 'white';

            if (isInternetExplorer11OrAbove == false) {

                if ((typeof (ctrl.hasAttribute) == 'function') && (ctrl.hasAttribute('onchange') == true)) {
                    if (typeof (ctrl.detachEvent) == 'function') {
                        ctrl.detachEvent('onchange', function () {

                            if (typeof (stopEventBubbling) == 'function') {

                                stopEventBubbling(window.event);
                            }

                            return false;
                        });
                    }
                }

            } else {

                if ((typeof (ctrl.getAttribute) == 'function') && (ctrl.getAttribute('onchange') != null)) {
                    if (typeof (ctrl.removeEventListener) == 'function') {
                        ctrl.removeEventListener('onchange', function () {

                            if (typeof (stopEventBubbling) == 'function') {

                                stopEventBubbling(window.event);
                            }

                            return false;
                        });
                    }
                }

            }

        }
    }
}

/*
*   Saves the contents for the grid view to the data warehouse.
*/
function SaveRedemptionTab() {

    var response = '';

    var attributes = getSecurityRequestAttributesForRedemption();

    if (attributes.currentEmployeeNo == attributes.securityRequestOwner) {

        if ((attributes.stage == 'Settlement Booking') && (attributes.status == 'Settlement Booked')) {

            if (typeof (updateRedemptionDisplay) == 'function') {

                updateRedemptionDisplay();
            }

        }
    }

    return response;
}

/*
*   Updates (refreshes) the redemption display region.
*/
function updateRedemptionDisplay() {

    var doRedemptionUpdate = (typeof (__doPostBack) == 'function') ? true : false;

    var redemptionUpdater = getRedemptionControl('pnlRedemptionUpdater');

    if (doRedemptionUpdate == true) {

        doRedemptionUpdate = ((redemptionUpdater === undefined) || (redemptionUpdater == null)) ? false : (redemptionUpdater.id.length == 0) ? false : true;
    }

    if (doRedemptionUpdate == true) {

        try {

            __doPostBack(redemptionUpdater.id, ''); // perform partial postback within the <Redemptions> display region.

        } catch (err) {

        }
    }
}

/*
*  Provides a warning to the end-user if the minimum settlement amount
*  that was cached by the local SecurityRequests database has been altered
*  on the HOST system.
*/
function verifyMinimumSettlementAmount() {

    var attributes = getSecurityRequestAttributesForRedemption();

    if ((attributes.stage == 'Settlement Booking') && (attributes.status == 'Settlement Booked') /* View is presented in a updatable mode. */) {

        if (attributes.currentEmployeeNo == attributes.securityRequestOwner /* Must be current security request owner */) {

            var hidden = getRedemptionControl('redemptionMinimumSettlementAmount');

            var localSettlementAmount = ((hidden === undefined) || (hidden == null)) ? null : window.parseFloat(hidden.value);

            var lbl = getRedemptionControl('lblMinimumSettlementAmount');

            if (typeof (GetSecurityRequestTotals) == 'function') {

                if ((localSettlementAmount != null) && (attributes.securityRequestId.length > 0)) {

                    var response = GetSecurityRequestTotals(attributes.securityRequestId);

                    if ((response != null) && (response.length > 0)) {

                        var component = JSON.parse(response); // security request total component

                        if ((component.MinimumSettlementAmount != undefined) && (component.MinimumSettlementAmount != null)) {

                            if (localSettlementAmount != component.MinimumSettlementAmount) {

                                alert('The minimum settlement amount has been changed from the HOST.');
                            }
                        }
                    }
                }

            }

        }

    }

}
