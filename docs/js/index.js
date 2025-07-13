async function showIndex() {
    document.getElementById("altcoin-index-result").innerHTML = ""

    const settings = getSettings()

    document.getElementById("altcoin-index-loader-status").innerText = "Построение индекса..."
    const altcoins = await getAltcoins(settings.altcoinsCheckDate, settings.altcoinsCount)

    document.getElementById("altcoin-index-loader-status").innerText = "Рассчет профита..."
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

    let html = ""

    html += `<b>Total profit:</b> ${profits.profit}%, max price fall: ${profits.maxPriceFall}%<br/>`
    profits.profits.forEach(x => html += `<br/>${x.altcoin.symbol} - profit: ${x.profit}%, max price fall: ${x.maxPriceFall}%`)

    document.getElementById("altcoin-index-result").innerHTML = html
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
