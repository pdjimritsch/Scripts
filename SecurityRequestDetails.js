
/*
*   Initializes the appearance of user controls within the web page.
*/
window.onload = function () {

    InitializeTabAppearance();

    SetAsDefaultTab();
}

/*
*   Initializes the appearance of the tab pages.
*/
function InitializeTabAppearance() {

    if (typeof (OnInitializeActionMenu) === 'function') {

        OnInitializeActionMenu();
    }

    if (typeof (OnInitializeDetailsPage) === 'function') {

        OnInitializeDetailsPage();
    }

    /*
    if (typeof (OnInitializeRespondee) === 'function') {

        OnInitializeRespondee();
    }

    if (typeof (OnInitializeValuation) === 'function') {

        OnInitializeValuation();
    }

    if (typeof (OnInitializeRedemption) === 'function') {

        OnInitializeRedemption();
    }
    */

}

/*
*   Highlights the previously selected or the default tab page.
*/
function SetAsDefaultTab() {

    if ((window.sessionStorage !== undefined) && (window.sessionStorage != null)) {

        if (window.sessionStorage.getItem('tabSelected') == 'Details') {

            if (typeof (ShowDetailsTab) == 'function') {

                ShowDetailsTab();
            }
        } else if (window.sessionStorage.getItem('tabSelected') == 'Respondee') {

            if (typeof (ShowRespondeeTab) == 'function') {

                ShowRespondeeTab();
            }

        } else if (window.sessionStorage.getItem('tabSelected') == 'Fees') {

            if (typeof (ShowFeesTab) == 'function') {

                ShowFeesTab();
            }

        } else if (window.sessionStorage.getItem('tabSelected') == 'Account') {

            if (typeof (ShowAccountTab) == 'function') {

                ShowAccountTab();
            }

        } else if (window.sessionStorage.getItem('tabSelected') == 'Valuation') {

            if (typeof (ShowValuationTab) == 'function') {

                ShowValuationTab();
            }

        } else if (window.sessionStorage.getItem('tabSelected') == 'Redemption') {

            if (typeof (ShowRedemptionTab) == 'function') {

                ShowRedemptionTab();
            }

        } else if (window.sessionStorage.getItem('tabSelected') == 'Settlement') {

            if (typeof (ShowSettlementTab) == 'function') {

                ShowSettlementTab();
            }

        } else if (window.sessionStorage.getItem('tabSelected') == 'DocumentGeneration') {

            if (typeof (ShowDocumentGenerationTab) == 'function') {

                ShowDocumentGenerationTab();
            }

        } else if (window.sessionStorage.getItem('tabSelected') == 'History') {

            if (typeof (ShowHistoryTab) == 'function') {

                ShowHistoryTab();
            }

        } else if (window.sessionStorage.getItem('tabSelected') == 'Notes') {

            if (typeof (ShowNotesTab) == 'function') {

                ShowNotesTab();
            }

        }

    }
}