import { altcoinIndex } from "./altcoinIndex"
import { bybit } from "./bybit"
import { trader } from "./trader"
import { pricesCalculator } from "./pricesCalculator"
import { settings as settingsProvider, Settings } from "./settings"
import { telegram } from "./telegram"

async function printAltcoins(settings: Settings) {
    const altcoins = await altcoinIndex.getAltcoins(settings.altcoinsCheckDate, settings.altcoinsCount)

    console.log("*****")
    altcoins.forEach(altcoin => console.log(altcoin.symbol))
}

async function checkHistory(settings: Settings) {
    const altcoins = await altcoinIndex.getAltcoins(settings.altcoinsCheckDate, settings.altcoinsCount)
    const profits = await pricesCalculator.calculateProfits(altcoins, settings.checkHistoryStartDate, settings.checkHistoryEndDate)

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

async function buy(settings: Settings) {
    const altcoins = await altcoinIndex.getAltcoins(settings.altcoinsCheckDate, settings.altcoinsCount)
    await trader.buy(altcoins, settings.buyBudget, settings.buyMargin, settings.buyIsTrade)
}

async function sell() {
    const assets = await trader.getAssets()
    await trader.sell(assets)
}

async function trackPrice(settings: Settings) {
    const altcoins = settings.trackPriceType === "index"
        ? await altcoinIndex.getAltcoins(settings.altcoinsCheckDate, settings.altcoinsCount)
        : await trader.getAssets()

    const innerTrackPrice = async () => {
        try {
            const profits = await pricesCalculator
                .calculateProfits(altcoins, settings.trackPriceStartDate, new Date().getTime())

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
        case "printAltcoins": return await printAltcoins(settings)
        case "checkHistory": return await checkHistory(settings)
        case "buy": return await buy(settings)
        case "sell": return await sell()
        case "trackPrice": return await trackPrice(settings)
    }
}

main()
