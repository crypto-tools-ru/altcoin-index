async function showIndex(id) {
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

function altcoinIndex(id) {
    showForm(id, showIndex)
}
