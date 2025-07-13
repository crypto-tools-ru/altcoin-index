async function showIndex() {
    const settings = getSettings()

    const altcoins = await getAltcoins(settings.altcoinsCheckDate, settings.altcoinsCount)
    const profits = await calculateProfits(altcoins, settings.checkHistoryStartDate, settings.checkHistoryEndDate)

    console.log("*****")
    profits.profits.forEach(x => console.log(
        x.altcoin.symbol, "-",
        "profit:", x.profit, "%,",
        "max price fall", x.maxPriceFall, "%"
    ))

    console.log("*****")
    console.log(
        "Total profit:", profits.profit, "%,",
        "max price fall:", profits.maxPriceFall, "%"
    )
}

async function altcoinIndex(id) {
    try {
        document.getElementById("show-altcoin-index").setAttribute("disabled", "")
        document.getElementById("altcoin-index-loader").style.display = "block"

        await showIndex()
    } catch (ex) {
        console.error(ex)
    }

    document.getElementById("show-altcoin-index").removeAttribute("disabled")
    document.getElementById("altcoin-index-loader").style.display = "none"
}
