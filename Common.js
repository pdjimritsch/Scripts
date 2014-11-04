
// =========================== Error Message Dialog ================= //
function OpenSaveErrorDialog(errorMess) {
    try {
        var errDiv = document.getElementById('divSaveErrors');
        errDiv.innerHTML = errorMess;
        //dSaveErrors.set_content('<table width=500px><tr><td style=\"font-size:10px;color:red;\">' + errorMess + '</td></tr></table>');
        if (!dSaveErrors.get_isShowing()) {
            dSaveErrors.set_x(null);
            dSaveErrors.set_y(null);
            dSaveErrors.set_alignment('MiddleCentre');
            dSaveErrors.Show();
        }
    } catch (err) {
        alert(DetailsScriptFileName + ' : OpenSaveErrorDialog :' + err.description);
        return false;
    }
}

// ============== Generic JS Alert Validation Messages ============= //
function alertValidationMessage(message) {
    alert(message);
}

/*
*   Tests whether the function parameter can be represented as a number.
*/
function isNumber(n) {

    if ((n === undefined) || (n == null)) {
        return false;
    }

    if (n instanceof Array) {
        return false;
    }

    return (n - parseFloat(n) >= 0);
}

/*
*   Prevents event cascading into parent elements.
*/
function stopEventBubbling(evt) {

    if ((evt === undefined) || (evt == null)) {

        return false;
    }

    if (typeof (evt.stopPropagation) == 'function') {
        evt.stopPropagation();
    }

    if (typeof (evt.preventDefault) == 'function') {
        evt.preventDefault();
    }

    return false;
}