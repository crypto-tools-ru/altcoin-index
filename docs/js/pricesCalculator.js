async function calculateProfits(altcoins, start, end) {
    console.log(new Date(), "Start calculate profits")

    let profits = []

    for (let i = 0; i < altcoins.length; i++) {
        const altcoin = altcoins[i]

        const candles = await getCandles(altcoin.symbol, "D", start, end)

        const buyPrice = candles[candles.length - 1].close
        const sellPrice = candles[0].close
        const minPrice = min(candles, x => x.close)

        const profit = round(
            (sellPrice - buyPrice) / buyPrice * 100,
        )
        const maxPriceFall = round(
            (minPrice - buyPrice) / buyPrice * 100,
        )

        profits.push({ altcoin, profit, maxPriceFall })
    }

    orderByDescending(profits, x => x.profit)
    const profit = round(
        average(profits, x => x.profit)
    )
    const maxPriceFall = round(
        average(profits, x => x.maxPriceFall)
    )

    return { profits, profit, maxPriceFall }
}

function round(value) {
    return parseFloat(value.toFixed(2))
}