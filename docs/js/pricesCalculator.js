async function calculateProfits(altcoins, start, end) {
    console.log(new Date(), "Start calculate profits")

    let profits = []
    for (let i = 0; i < altcoins.length; i++) {
        const symbol = altcoins[i].symbol
        const candles = await getCandles(symbol, "D", start, end)

        const buyPrice = candles[candles.length - 1].close
        const sellPrice = candles[0].close
        const profit = round((sellPrice - buyPrice) / buyPrice * 100)

        const series = []
        candles.reverse().forEach(candle => {
            const time = formatDate(candle.date)
            const value = round((candle.close - buyPrice) / buyPrice * 100)

            series.push({ time, value })
        })

        profits.push({ symbol, profit, series })
    }

    orderByDescending(profits, x => x.profit)

    const series = []
    profits[0].series.forEach(x => {
        const time = x.time
        const value = average(profits, x => x.series.find(x => x.time === time)?.value || 0)

        series.push({ time, value })
    })

    const profit = round(average(profits, x => x.profit))

    return { profits, profit, series }
}

function round(value) {
    return parseFloat(value.toFixed(2))
}

function formatDate(time) {
    const date = new Date(time)
    const format = (value) => {
        return value < 10 ? `0${value}` : value.toString()
    }

    return `${format(date.getFullYear())}-${format(date.getMonth() + 1)}-${format(date.getDate())}`
}