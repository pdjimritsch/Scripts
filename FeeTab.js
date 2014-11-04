// show add fee dialog
function showAddFeePopup(isUpFrontFee) {
    var hdnIsUpFrontFee = document.getElementById("hdnIsUpFrontFee");
    hdnIsUpFrontFee.value = isUpFrontFee;

    // reset popup elements
    var ddlFeeTypes = document.getElementById("ddlFeeTypes");
    ddlFeeTypes.selectedIndex = 0;
    document.getElementById('txtAmount').value = "";
    document.getElementById('chkIsWaived').checked = false;

    dPopupAddFee.Show();

    return false;
}

// pre-populate amount from Host dropdownlist
function populateAmountFromHostDropdownlist() {
    var ddlFeeTypes = document.getElementById("ddlFeeTypes");
    var feeId = ddlFeeTypes.options[ddlFeeTypes.selectedIndex].value;
    var amount = document.getElementById('txtAmount').value;

    if (feeId == -1) {
        alert("Please select a Fee");
        document.getElementById('txtAmount').value = "";
        return false;
    }

    cbAmount.Callback(feeId);
}

// Fee Action
function addFee() {
    var ddlFeeTypes = document.getElementById("ddlFeeTypes");
    var hdnIsUpFrontFee = document.getElementById("hdnIsUpFrontFee");

    var feeId = ddlFeeTypes.options[ddlFeeTypes.selectedIndex].value;
    var feeName = ddlFeeTypes.options[ddlFeeTypes.selectedIndex].text;
    if (feeId == -1) {
        alert("Please select a Fee");
        return false;
    }

    var amount = document.getElementById('txtAmount').value;
    var isWaived = document.getElementById('chkIsWaived').checked;

    var re = new RegExp('^([0-9])+(\\.)?[0-9]{0,2}$');
    if (!amount.match(re)) {
        alert("Amount is not in valid format! Enter in 00.00 format.");
        return false;
    }


    cbActionFee.Callback("ADD", feeId, feeName, amount, hdnIsUpFrontFee.value, isWaived);

    dPopupAddFee.Close();
}

function deleteFee(feeId, isUpFrontFee) {
    var confirmDelete = confirm("Are you sure you wish to delete this fee?");

    if (confirmDelete) {
        var hdnIsUpFrontFee = document.getElementById("hdnIsUpFrontFee");
        cbActionFee.Callback("DELETE", feeId, isUpFrontFee);
    }
}