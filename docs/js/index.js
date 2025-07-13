function showChart(items) { // format: { time: '2019-04-11', value: 80.01 }
    const chart = LightweightCharts.createChart(document.getElementById("altcoin-index-chart"), { height: 500 })
    const lineSeries = chart.addSeries(LightweightCharts.LineSeries)
    lineSeries.setData(items)
}

function showAltcoins(profits, profit) {
    let html = `
        <table class="table">
            <thead>
                <tr>
                <th>Криптовалюта</th>
                <th>Профит</th>
                </tr>
            </thead>
            <tbody>
    `

    profits.forEach(x => html += `
        <tr>
            <td>${x.symbol}</th>
            <td>${x.profit}%</td>
        </tr>
    `)

    html += `
        <tr>
            <th>Общий профит</th>
            <th>${profit}%</td>
        </tr>
    `

    html += `
            </tbody>
        </table>
    `
    setHtml("altcoin-index-result", html)
}

async function showIndex() {
    setHtml("altcoin-index-chart", "")
    setHtml("altcoin-index-result", "")

    const settings = getSettings()

    setText("altcoin-index-loader-status", "Построение индекса...")
    const altcoins = await getAltcoins(settings.altcoinsCheckDate, settings.altcoinsCount)

    setText("altcoin-index-loader-status", "Рассчет профита...")
    const result = await calculateProfits(altcoins, settings.checkHistoryStartDate, settings.checkHistoryEndDate)

    showChart(result.series)
    showAltcoins(result.profits, result.profit)
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
