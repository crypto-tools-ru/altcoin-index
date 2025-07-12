const weekMs = 7 * 24 * 60 * 60 * 1000

async function getAltcoins(start, altcoinsCount) {
    console.log(new Date(), "Start load altcoins")

    const altcoins = []

    const symbols = (await getSymbols()).filter(x => x.symbol !== "BTCUSDT")
    orderByDescending(symbols, x => x.turnover24h)

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i]

        const candles = await getCandles(symbol.symbol, "D", start, start + weekMs)
        if (!candles.length) {
            continue
        }

        altcoins.push(symbol)
        if (altcoins.length >= altcoinsCount) {
            break
        }
    }

    return altcoins
}