function showReducePopup()
{
    dReduceRedemption.Show();
    cbReducePopup.Callback();
    return false;
}

function saveReductionAmount() {
    var ddlLoanAccounts = document.getElementById('ddlLoanAccounts');
    var txtReductionAmount = document.getElementById('txtReductionAmount').value;

    if (ddlLoanAccounts.options[ddlLoanAccounts.selectedIndex].value == '-1') {
        alert('Please select a Loan Account to reduce');
        return false;
    }

    var re = new RegExp('^([0-9])+(\\.)?[0-9]{0,2}$');
    if (!txtReductionAmount.match(re)) {
        alert("Reduction Amount is not in valid format! Enter in 00.00 format.");
        return false;
    }

    cbRedemptionTab.Callback('REDUCE', ddlLoanAccounts.options[ddlLoanAccounts.selectedIndex].value, txtReductionAmount);

    dReduceRedemption.Close();
}

function showCalcPopup() {
    document.getElementById("txtResidualPercentage").value = "80";
    document.getElementById("txtLendingSecurityAmount").value = document.getElementById("hdnTotalLoanBalance").value;
    dCalculateRedemption.Show();
    //cbCalculateRedemption.Callback();
    return false;
}
function toggleCalcMethod(ctrl)
{
    if (ctrl.id == "optResidualPercentage") {
        document.getElementById("txtLendingSecurityAmount").disabled = true;
        document.getElementById("txtResidualPercentage").disabled = false;
    }
    else {
        document.getElementById("txtResidualPercentage").disabled = true;
        document.getElementById("txtLendingSecurityAmount").disabled = false;
    }
}

function saveCalculationAmount() {
    var txtLendingSecurityAmount = document.getElementById('txtLendingSecurityAmount').value;
    var txtResidualPercentage = document.getElementById('txtResidualPercentage').value;

    var method = '';
    var amount = 0;

    var re = new RegExp('^([0-9])+(\\.)?[0-9]{0,2}$');
    if (document.getElementById('txtLendingSecurityAmount').disabled == false) {
        method = "Residual Lending Security Value";
        if (!txtLendingSecurityAmount.match(re)) {
            alert("Residual Lending Security Value amount is not in valid format! Enter in 00.00 format.");
            return false;
        }
        amount = txtLendingSecurityAmount;
    }
    if (document.getElementById('txtResidualPercentage').disabled == false) {
        method = "Residual %";
        if (!txtResidualPercentage.match(re) || txtResidualPercentage > 100) {
            alert("Residual % amount is not in valid format! Enter in 00.00 format and must not exceed 100.");
            return false;
        }
        amount = txtResidualPercentage;
    }

    cbRedemptionTab.Callback('CALC', method, amount);

    dCalculateRedemption.Close();

    return false;
}