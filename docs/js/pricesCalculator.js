async function calculateProfits(altcoins, start, end) {
    console.log(new Date(), "Start calculate profits")

    let profits = []

    for (let i = 0; i < altcoins.length; i++) {
        const altcoin = altcoins[i]

        const candles = await getCandles(altcoin.symbol, "D", start, end)

        const buyPrice = candles[candles.length - 1].close
        const sellPrice = candles[0].close
        const minPrice = min(candles, x => x.close)

        const profit = round((sellPrice - buyPrice) / buyPrice * 100)
        const maxPriceFall = round((minPrice - buyPrice) / buyPrice * 100)

        const series = []
        for (let y = candles.length - 1; y >= 0; y--) {
            const candle = candles[y]
            const value = round((candle.close - buyPrice) / buyPrice * 100)
            const time = formatDate(candle.date)

            series.push({ time, value })
        }

        profits.push({ altcoin, profit, maxPriceFall, series })
    }

    orderByDescending(profits, x => x.profit)
    const profit = round(average(profits, x => x.profit))
    const maxPriceFall = round(average(profits, x => x.maxPriceFall))

    const times = profits[0].series
    const series = []
    for (let i = 0; i < times.length; i++) {
        const time = times[i].time

        const values = []
        for (let y = 0; y < profits.length; y++) {
            const value = profits[y].series.find(x => x.time === time)?.value || 0
            values.push(value)
        }

        series.push({ time, value: average(values, x => x) })

    }

    return { profits, profit, maxPriceFall, series }
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