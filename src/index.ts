import { altcoinIndex } from "./altcoinIndex"
import { bybit } from "./bybit"
import { pricesCalculator } from "./pricesCalculator"
import { settings as settingsProvider, Settings } from "./settings"
import { telegram } from "./telegram"

require("dotenv").config()

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

}

async function sell(settings: Settings) {

}

async function trackPrice(settings: Settings) {
    const altcoins = await altcoinIndex.getAltcoins(settings.altcoinsCheckDate, settings.altcoinsCount)

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
        case "sell": return await sell(settings)
        case "trackPrice": return await trackPrice(settings)
    }
}

main()
