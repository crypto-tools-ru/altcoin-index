async function calculateProfits(altcoins, start, end) {
    console.log(new Date(), "Start calculate profits")

    let profits = []

    for (let i = 0; i < altcoins.length; i++) {
        const symbol = altcoins[i].symbol

        const candles = await getCandles(symbol, "D", start, end)

        const buyPrice = candles[candles.length - 1].close
        const series = []

        for (let y = candles.length - 1; y >= 0; y--) {
            const candle = candles[y]
            const value = round((candle.close - buyPrice) / buyPrice * 100)
            const time = formatDate(candle.date)

            series.push({ time, value })
        }

        profits.push({ symbol, series })
    }

    const times = profits[0].series
    const series = []

    for (let i = 0; i < times.length; i++) {
        const time = times[i].time

        const values = []
        for (let y = 0; y < profits.length; y++) {
            const value = profits[y].series.find(x => x.time === time)?.value || 0
            values.push(value)
        }

        const value = average(values, x => x)
        series.push({ time, value })
    }

    return { profits, series }
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