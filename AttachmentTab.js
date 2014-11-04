// show add attachment dialog
function showAddAttachmentPopup() {
    // reset popup elements
    var ddlAttachmentTypes = document.getElementById("ddlAttachmentTypes");
    ddlAttachmentTypes.selectedIndex = 0;
    document.getElementById('txtName').value = "";

    dPopupAddAttachment.Show();

    return false;
}

function showUploadAttachmentDialog() {
    dPopupUploadAttachment.Show();
}


function downloadAttachment(id) {
    window.open("DownloadFile.aspx?type=attachment&id=" + id);
}