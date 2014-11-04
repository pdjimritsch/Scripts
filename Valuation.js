var ValuationScriptFileName = 'Valuation.js';

var ValuationScriptReferenceId = 'ctl00_MainContent_Valuation_';

var ValuationServerReferenceId = 'MainContent_Valuation_';

function ShowValuationDialog(linkedSecurityId) {
    document.getElementById('ddlValuationMethod').selectedIndex = 0;
    document.getElementById('ddlValuerName').selectedIndex = 0;
    document.getElementById('txtValuationAmount').value = '';
    document.getElementById('ddlValuationFee').selectedIndex = 0;

    document.getElementById('hdnLinkedSecurityId').value = linkedSecurityId;

    var callback = eval('ctl00_MainContent_Valuation_cbdlgValuation');
    callback.Callback(linkedSecurityId);

    dlgValuation.Show();
}

function saveValuation() {
    var linkedSecurityId = document.getElementById('hdnLinkedSecurityId').value;

    var valuationMethodHOSTCode = document.getElementById('ddlValuationMethod').options[document.getElementById('ddlValuationMethod').selectedIndex].value;
    var valuationMethodName = document.getElementById('ddlValuationMethod').options[document.getElementById('ddlValuationMethod').selectedIndex].text;
    if (valuationMethodHOSTCode == '-1') {
        alert("Please select a valuation method");
        return false;
    }

    var valuationAmount = document.getElementById('txtValuationAmount').value;
    var re = new RegExp('^([0-9])+(\\.)?[0-9]{0,2}$');
    if (!valuationAmount.match(re)) {
        alert("Amount is not in valid format! Enter in 00.00 format.");
        return false;
    }

    var valuerName = document.getElementById('ddlValuerName').options[document.getElementById('ddlValuerName').selectedIndex].value;
    if (valuerName == '-1') {
        alert("Please select a valuer name");
        return false;
    }

    var valuationFee = document.getElementById('ddlValuationFee').options[document.getElementById('ddlValuationFee').selectedIndex].value;
    if (valuationFee == '-1') {
        alert("Please select a valuation fee");
        return false;
    }
    var valuationDate = DSWC_GetDate('ctl00_MainContent_Valuation_dtsValuationDate');

    cbValuationTab.Callback('SAVE', linkedSecurityId, valuationMethodHOSTCode, valuationMethodName, valuationAmount,  valuationDate, valuerName, valuationFee);

    dlgValuation.Close();
}
///*
//*   Events
//*/

///*
//*  Initializes the valuation user control appearance according to the business rules
//*/
//function OnInitializeValuation() {

//    var attributes = getSecurityRequestAttributesForValuation();

//    if (typeof (initializeAppearanceForValuation) == 'function') {

//        initializeAppearanceForValuation(attributes);
//    }

//    if (typeof (ApplyBusinessRulesForLinkedSecurity) == 'function') {

//        ApplyBusinessRulesForLinkedSecurity(attributes);
//    }

//}

///*
//*   Accepts and validates the entered free-form valuation related information
//*   entered within the Component Art popup dialog
//*/
//function OnAcceptValuation(button) {

//    var response = {};

//    response.validationErrors = '';

//    var attributes = getSecurityRequestAttributesForValuation();

//    if (typeof (validateContentsForValuation) == 'function') {

//        // validates the free-form data entry contents for the linked security component.

//        response = validateContentsForValuation(attributes, response);
//    }

//    if (response.validationErrors.length == 0) {

//        if (typeof (SaveValuationDetails) == 'function') {

//            SaveValuationDetails(attributes, response);
//        }
//    }

//    /*
//    *   Closes the Component Art popup dialog.
//    */
//    OnCancelValuation(button);

//    return false;
//}

///*
//*   Closes the Component Art popup dialog.
//*/
//function OnCancelValuation(button) {

//    var dlg = dlgValuation;

//    dlg = ((dlg === undefined) || (dlg == null)) ? getValuationControl('dlgValuation') : dlg;

//    try {

//        dlg.Close();

//    } catch (err) {

//    }

//    return false;
//}

///*
//*   Displays the ComponentArt popup dialog.
//*/
//function OnShowValuation(dlg) {

//    try {

//        var ctrl = document.getElementById('valuationSecurityRequestId');

//        var securityRequestId = ((ctrl === undefined) || (ctrl === null)) ? null : ctrl.value;

//        var hidden = document.getElementById(getValuationServerControlId('valuationLinkedSecurityId'));

//        hidden = ((hidden === undefined) || (hidden == null)) ? document.getElementById('valuationLinkedSecurityId') : hidden;

//        var selection = ((hidden === undefined) || (hidden == null)) ? '' : hidden.value;

//        var callerId = getValuationControlId('cbdlgValuation');

//        var caller = eval(callerId);

//        if ((caller !== undefined) && (caller != null)) {

//            if (typeof (caller.Callback) == 'function') {

//                caller.Callback(selection, securityRequestId);

//            } else if ((caller.control !== undefined) && (caller.control != null) && (typeof (caller.control.Callback) == 'function')) {

//                caller.control.Callback(selection, securityRequestId);
//            }
//        }

//    } catch (err) {

//        alert(ValuationScriptFileName + '. Control: dlgValuation. Event: Show. Error: ' + err.description);
//    }

//}

///*
//*   Displays the valuation popup dialog. Invoked from the associated grid view hyperlink.
//*/
//function ShowLinkedSecurity(linkedSecurityId) {

//    ShowValuationDialog(linkedSecurityId);
//}

///*
//*  Functions
//*/

//function ApplyAsReadOnly(readonly) {

//    var updatable = ((readonly === undefined) || (readonly == null)) ? false : (new Boolean(readonly) == false);

//    SetReadOnlyForValuation(getValuationControl('txtValuationMethod'), updatable);

//    SetReadOnlyForValuation(getValuationControl('txtValuationAmount'), updatable);

//    SetReadOnlyForValuation(getValuationControl('dtsValuationDate'), updatable);

//    SetReadOnlyForValuation(getValuationControl('ddlValuerName'), updatable);

//    SetReadOnlyForValuation(getValuationControl('ddlValuationFee'), updatable);

//    SetReadOnlyForValuation(getValuationControl('AcceptValuation'), updatable);
//}


///*
//*  Initializes the linked security valuation user control appearance according to the business rules
//*/
//function ApplyBusinessRulesForLinkedSecurity(attributes) {

//    if ((attributes === undefined) || (attributes == null)) {

//        return;
//    }

//    if ((attributes.stage === undefined) || (attributes.stage == null)) {

//        // Assigns readonly attributes to all components within the Component Art popup dialog

//        if (typeof (ApplyAsReadOnly) == 'function') {

//            ApplyAsReadOnly(true);
//        }

//    } else if (attributes.stage == 'Create / Edit') {

//        // Assigns read-write mode attributes to all components within the Component Art popup dialog

//        if (typeof (ApplyAsReadOnly) == 'function') {

//            ApplyAsReadOnly(false);
//        }

//    } else {

//        // Assigns readonly attributes to all components within the Component Art popup dialog

//        if (typeof (ApplyAsReadOnly) == 'function') {

//            ApplyAsReadOnly(true);
//        }

//    }

//}


///*
//*   Gets the registered attributes of the security request.
//*/
//function getSecurityRequestAttributesForValuation() {

//    var attributes = {};

//    var ctrl = null;

//    ctrl = getValuationControl('valuationSecurityRequestStage');

//    attributes.stage = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

//    ctrl = getValuationControl('valuationSecurityRequestStatus');

//    attributes.status = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

//    ctrl = getValuationControl('valuationCurrentEmployeeNo');

//    attributes.currentEmployeeNo = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

//    ctrl = getValuationControl('valuationSecurityRequestOwner');

//    attributes.securityRequestOwner = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

//    ctrl = getValuationControl('valuationSecurityRequestId');

//    attributes.securityRequestId = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

//    ctrl = getValuationControl('valuationLinkedSecurityId');

//    attributes.linkedSecurityId = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

//    ctrl = getValuationControl('valuationValuerId');

//    attributes.valuerId = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

//    ctrl = getValuationControl('valuationValuerId');

//    attributes.valuationFeeId = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value;

//    return attributes;
//}

///*
//*   Gets the reference to the HTML element by element ID.
//*/
//function getValuationControl(id) {

//    var ctrl = null;

//    if ((id === undefined) || (id == null)) {

//        return ctrl;
//    }

//    ctrl = document.getElementById(getValuationServerControlId(id));

//    ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(getValuationControlId(id)) : ctrl;

//    ctrl = ((ctrl === undefined) || (ctrl == null)) ? document.getElementById(id) : ctrl;

//    return ctrl;
//}

///*
//*  Gets the control identity with repsect to the enclosing web page.
//*/
//function getValuationControlId(partialId) {

//    return ValuationScriptReferenceId + partialId;
//}

///*
//*  Gets the control identity with respect to the enclosing web page.
//*/
//function getValuationServerControlId(partialId) {

//    return ValuationServerReferenceId + partialId;
//}


///*
//*   Initializes the ComponentArt popup dialog HTML element content.
//*/
//function initializeAppearanceForValuation(attributes) {

//    if ((attributes === undefined) || (attributes == null)) {

//        return;
//    }

//    var selector = null;

//    /*
//    *   Get the reference to the drop down list for the valuer name.
//    */

//    selector = getValuationControl('ddlValuerName');
//    selector = ((selector === undefined) || (selector == null)) ? document.getElementById('ddlValuerName') : selector;

//    if (typeof (SetValuerName) == 'function') {

//        SetValuerName(attributes, selector);
//    }


//    /*
//    *   Get the reference to the drop down list for the linked security valuation fee.
//    */

//    selector = getValuationControl('ddlValuationFee');
//    selector = ((selector === undefined) || (selector == null)) ? document.getElementById('ddlValuationFee') : selector;

//    if (typeof (SetValuationFee) == 'function') {

//        SetValuationFee(attributes, selector);
//    }
//}

///*
//*  Initializes the appearance of the popup ComponentArt dialog
//*/
//function initializeDialogForValuation(caption) {

//    var dlg = {};

//    dlg.caption = caption;

//    var spn = getValuationControl('spnValuation');

//    if (spn != null) {
//        spn.innerText = caption;
//        dlg.caption = caption;
//    }

//    try {

//        dlg.window = dlgValuation;
//        dlg.canDisplay = true;

//    } catch (err) {

//        dlg.window = eval(getValuationControl('dlgValuation'));
//        dlg.canDisplay = ((dlg.window !== undefined) && (dlg.window != null));

//    }

//    return dlg;
//}

///*
//*   Transforms the validated response into the corresponding linked security 
//*   valuation and saves the transformed reponse within the SecurityRequests database.
//*/
//function SaveValuationDetails(attributes, response) {

//    if ((response === undefined) || (response == null)) {

//        return;
//    }

//    if ((response.validationErrors === undefined) || (response.validationErrors == null)) {

//        return;
//    }

//    if (response.validationErrors.length > 0) {

//        return;
//    }

//    if (typeof (SaveClientValuationDetails) == 'function') {

//        var contents = JSON.stringify(response);

//        /*
//        *   AJAX method that saves the client valuation details
//        */
//        SaveClientValuationDetails(attributes.securityRequestId, contents);
//    }
//}

///*
//*   Assigns the read-write mode attribute to the HTML element.
//*/
//function SetReadOnlyForValuation(ctrl, updatable) {

//    if ((ctrl === undefined) || (ctrl == null)) {

//        return;
//    }

//    var readonly = ((updatable === undefined) || (updatable == null)) ? true : (new Boolean(updatable) == false);

//    if ((ctrl.tagName.toLowerCase() == 'input') && (ctrl.type == 'text')) {

//        ctrl.readOnly = readonly;

//    } else if ((ctrl.tagName.toLowerCase() == 'input') && (ctrl.type == 'button')) {

//        ctrl.disabled = readonly;

//    } else if (ctrl.tagName.toLowerCase() == 'button') {

//        ctrl.disabled = readonly;

//    } else if (ctrl.tagName.toLowerCase() == 'select') {

//        ctrl.disabled = readonly;
//    }

//}


///*
//*   Displays the current linked security valuation fee name within the associated drop down list.
//*/
//function SetValuationFee(attributes, selector) {

//    if ((selector !== undefined) && (selector != null) && (selector.options.length > 1)) {

//        if ((attributes.valuationFeeId !== undefined) && (attributes.valuationFeeId != null) && (attributes.valuationFeeId.length > 0)) {

//            var pos = 0;

//            for (; pos < selector.options.length; ++pos ) {

//                if (selector.options[pos].value == attributes.valuationFeeId) {

//                    break;
//                }

//            }

//            if (pos < selector.options.length) {

//                selector.selectedIndex = pos;
//                selector.options.selectedIndex = pos;
//            }
//        }

//    }

//}

///*
//*   Displays the current linked security valuer name within the associated drop down list.
//*/
//function SetValuerName(attributes, selector) {

//    if ((selector !== undefined) && (selector != null) && (selector.options.length > 1)) {

//        if ((attributes.valuerId !== undefined) && (attributes.valuerId != null) && (attributes.valuerId.length > 0)) {

//            var pos = 0;

//            for (; pos < selector.options.length; ++pos ) {

//                if (selector.options[pos].value == attributes.valuerId) {

//                    break;
//                }

//            }

//            if (pos < selector.options.length) {

//                selector.selectedIndex = pos;
//                selector.options.selectedIndex = pos;
//            }
//        }

//    }

//}

///*
//*  Displays the Component Art popup dialog for the linked security valuation.
//*/
//function ShowValuationDialog(linkedSecurityId) {

//    var caption = 'Linked Security Valuation';

//    var dlg = initializeDialogForValuation(caption);

//    if ((dlg != null) && (dlg.window !== undefined) && (dlg.window != null)) {

//        if (dlg.canDisplay == true) {

//            try {

//                var hidden = getValuationControl('valuationLinkedSecurityId');

//                if ((hidden !== undefined) && (hidden != null)) {

//                    hidden.value = linkedSecurityId;

//                }

//                dlg.window.Show();

//            } catch (err) {

//                alert(ValuationScriptFileName + '. Control: gridLinkedSecurities. Event: Click. Error: ' + err.description);
//            }
//        }

//    }

//}


///*
//*   Validates the linked security free-form data entry contents
//*   within the ComponentArt popup dialog.
//*/
//function validateContentsForValuation(attributes, response) {

//    if ((response === undefined) || (response == null)) {

//        response = {};
//    }

//    response.validationErrors = '';

//    response.linkedSecurityId = window.parseInt(attributes.linkedSecurityId);

//    // highlight the fields that violate the business rules.

//    var ctrl = null;

//    var selector = null;

//    ctrl = getValuationControl('txtValuationMethod');

//    response.valuationMethod = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value.trim();

//    if ((ctrl !== undefined) && (ctrl != null)) {

//        if (ctrl.value.trim().length == 0) {

//            ctrl.style.borderWidth = '3px';
//            ctrl.style.borderColor = 'red';
//            ctrl.title = 'Valuations.<br/>Please provide a valuation method name.';

//            if (response.validationErrors.length == 0) {

//                response.validationErrors = '<li>Valuations.<br/>Please provide a valuation method name.</li>';

//            } else  {

//                response.validationErrors += '<br/><li>Valuations.<br/>Please provide a valuation method name.</li>';
//            }
//        }

//        ctrl.onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };

//    } else {

//        if (response.validationErrors.length == 0) {

//            response.validationErrors = '<li>Valuations.<br/>Please provide a valuation method name.</li>';

//        } else  {

//            response.validationErrors += '<br/><li>Valuations.<br/>Please provide a valuation method name.</li>';
//        }
//    }

//    ctrl = getValuationControl('txtValuationAmount');

//    response.valuationAmount = ((ctrl === undefined) || (ctrl == null)) ? '' : ctrl.value.trim();

//    if ((ctrl !== undefined) && (ctrl != null)) {

//        if (ctrl.value.trim().length == 0) {

//            ctrl.style.borderWidth = '3px';
//            ctrl.style.borderColor = 'red';
//            ctrl.title = 'Valuations.<br/>Please provide a valuation amount.';

//            if (response.validationErrors.length == 0) {

//                response.validationErrors = '<li>Valuations.<br/>Please provide a valuation amount.</li>';

//            } else  {

//                response.validationErrors += '<br/><li>Valuations.<br/>Please provide a valuation amount.</li>';
//            }
//        }
//        else {

//            try {

//                var amount = new Number(response.valuationAmount.replace(/[^0-9\.]+/g, ''));

//                response.valuationAmount = window.parseFloat(amount.toFixed(2));

//            } catch (err) {

//                response.valuationAmount = window.parseFloat('0.00');
//            }

//        }

//        ctrl.onkeypress = function () { this.style.borderColor = ''; this.style.borderWidth = '1px'; };
        
//    } else {

//        if (response.validationErrors.length == 0) {

//            response.validationErrors = '<li>Valuations.<br/>Please provide a valuation amount.</li>';

//        } else  {

//            response.validationErrors += '<br/><li>Valuations.<br/>Please provide a valuation amount.</li>';
//        }

//    }

//    selector = getValuationControl('ddlValuerName');

//    response.valuerId = ((selector !== undefined) && (selector != null)) ? selector.options[selector.options.selectedIndex].value : '';

//    if ((selector != undefined) || (selector != null)) {

//        if ((response.valuerId.length == 0) || (response.valuerId == '-1')) {

//            selector.style.borderColor = 'red';
//            selector.style.borderWidth = '3px';

//            if (response.validationErrors.length == 0) {

//                response.validationErrors = '<li>Valuations.<br/>Please select a valuer name from the drop down list.</li>';

//            } else  {

//                response.validationErrors += '<br/><li>Valuations.<br/>Please select a valuer name from the drop down list.</li>';
//            }

//            response.valuerId = -1;
//        }
//        else {

//            response.valuerId = window.parseInt(response.valuerId.trim());
//        }

//        selector.onchange = function() { this.style.borderColor = ''; this.style.borderWidth = '1px'; };

//    } else {

//        if (response.validationErrors.length == 0) {

//            response.validationErrors = '<li>Valuations.<br/>Please select a valuer name from the drop down list.</li>';

//        } else  {

//            response.validationErrors += '<br/><li>Valuations.<br/>Please select a valuer name from the drop down list.</li>';
//        }

//        response.valuerId = -1;
//    }

//    selector = getValuationControl('ddlValuationFee');

//    response.valuationFeeName = ((selector !== undefined) && (selector != null)) ? selector.options[selector.options.selectedIndex].text.trim() : '';

//    if ((selector != undefined) || (selector != null)) {

//        if ((response.valuationFeeName.length == 0) || (response.valuationFeeName == 'Please select')) {

//            selector.style.borderColor = 'red';
//            selector.style.borderWidth = '3px';

//            if (response.validationErrors.length == 0) {

//                response.validationErrors = '<li>Valuations.<br/>Please select a valuation fee from the drop down list.</li>';

//            } else {

//                response.validationErrors += '<br/><li>Valuations.<br/>Please select a valuation fee from the drop down list.</li>';
//            }

//            response.valuationFeeId = -1;

//        } else {

//            response.valuationFeeId = ((selector !== undefined) && (selector != null)) ? selector.options[selector.options.selectedIndex].value.trim() : '';

//            response.valuationFeeId = window.parseInt(response.valuationFeeId);
//        }

//        selector.onchange = function() { this.style.borderColor = ''; this.style.borderWidth = '1px'; };

//    } else {

//        if (response.validationErrors.length == 0) {

//            response.validationErrors = '<li>Valuations.<br/>Please select a valuation fee from the drop down list.</li>';

//        } else  {

//            response.validationErrors += '<br/><li>Valuations.<br/>Please select a valuation fee from the drop down list.</li>';
//        }

//    }

//    return response;
//}