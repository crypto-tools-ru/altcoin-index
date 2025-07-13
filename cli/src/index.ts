import { altcoinIndex } from "./altcoinIndex"
import { bybit } from "./bybit"
import { trader } from "./trader"
import { pricesCalculator } from "./pricesCalculator"
import { settings as settingsProvider, Settings } from "./settings"
import { telegram } from "./telegram"

async function buildIndex(settings: Settings) {
    if (altcoinIndex.tryRead()) {
        console.error("Altcoin index already exists. Delete index before build")
        return
    }

    const altcoins = await altcoinIndex.build(settings.altcoinsCheckDate, settings.altcoinsCount)
    altcoinIndex.save(altcoins)

    console.log("*****")
    altcoins.forEach(altcoin => console.log(altcoin.symbol))
}

async function buy(settings: Settings) {
    const altcoins = altcoinIndex.tryRead()
    if (!altcoins) {
        console.error("Altcoin index not found. Build index before buy")
        return
    }

    await trader.buy(altcoins, settings.buyBudget, settings.buyMargin, settings.buyIsTrade)
}

async function sell() {
    const assets = await trader.getAssets()
    await trader.sell(assets)
}

async function trackPrice(settings: Settings) {
    const altcoins = altcoinIndex.tryRead()
    if (!altcoins) {
        console.error("Altcoin index not found. Build index before track price")
        return
    }

    const innerTrackPrice = async () => {
        try {
            const profits = await pricesCalculator
                .calculateProfits(altcoins, settings.trackPriceStartDate, new Date().getTime())

            console.log("*****")
            profits.profits.forEach(x => console.log(x.altcoin.symbol, "-", "profit:", x.profit, "%,"))

            console.log("*****")
            console.log("Total profit:", profits.profit, "%,", "max price fall:")

            await telegram.sendMessage(`Current profit ${profits.profit}%`)
        } catch (ex) {
            console.error(ex)
        }
    }

    const intervalMs = settings.trackPriceIntervalHours * 60 * 60 * 1000
    setInterval(() => innerTrackPrice(), intervalMs)
    await innerTrackPrice()
}

async function main() {
    const settings = settingsProvider.get()
    bybit.init(settings)
    telegram.init(settings)

    console.log(new Date(), "Start work", settings.strategy)

    switch (settings.strategy) {
        case "buildIndex": return await buildIndex(settings)
        case "buy": return await buy(settings)
        case "sell": return await sell()
        case "trackPrice": return await trackPrice(settings)
    }
}

main()
