function showChart(items) { // { time: '2019-04-11', value: 80.01 }
    const chart = LightweightCharts.createChart(document.getElementById("altcoin-index-chart"), { height: 500 })
    const lineSeries = chart.addSeries(LightweightCharts.LineSeries)
    lineSeries.setData(items)
}

async function showIndex() {
    setHtml("altcoin-index-result", "")
    setHtml("altcoin-index-chart", "")

    const settings = getSettings()

    setText("altcoin-index-loader-status", "Построение индекса...")
    const altcoins = await getAltcoins(settings.altcoinsCheckDate, settings.altcoinsCount)

    setText("altcoin-index-loader-status", "Рассчет профита...")
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

    setHtml("altcoin-index-result", html)
    showChart(profits.series)
}

async function altcoinIndex() {
    try {
        setAttribute("show-altcoin-index", "disabled", "")
        setStyle("altcoin-index-loader", "display", "block")

        await showIndex()
    } catch (ex) {
        console.error(ex)
    }

    removeAttribute("show-altcoin-index", "disabled")
    setStyle("altcoin-index-loader", "display", "none")
}
