function getSettings() {
    return {
        altcoinsCount: parseInt(document.getElementById("altcoinsCount").value),
        altcoinsCheckDate: Date.parse(document.getElementById("altcoinsCheckDate").value),
        checkHistoryStartDate: Date.parse(document.getElementById("checkHistoryStartDate").value),
        checkHistoryEndDate: Date.parse(document.getElementById("checkHistoryEndDate").value),
    }
}