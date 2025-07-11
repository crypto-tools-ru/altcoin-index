import Enumerable from "linq";
import { bybit, Symbol } from "./bybit";

interface Profit {
    altcoin: Symbol,
    profit: number,
    maxPriceFall: number,
}

interface Profits {
    profits: Profit[],
    profit: number,
    maxPriceFall: number,
}

async function calculateProfits(altcoins: Symbol[], start: number, end: number): Promise<Profits> {
    console.log(new Date(), "Start calculate profits")

    let profits: Profit[] = []

    for (let i = 0; i < altcoins.length; i++) {
        const altcoin = altcoins[i]

        const candles = await bybit.getCandles(altcoin.symbol, "D", start, end)

        const buyPrice = candles[candles.length - 1].close
        const sellPrice = candles[0].close
        const minPrice = Enumerable.from(candles).min(x => x.close)

        const profit = round(
            (sellPrice - buyPrice) / buyPrice * 100,
        )
        const maxPriceFall = round(
            (minPrice - buyPrice) / buyPrice * 100,
        )

        profits.push({ altcoin, profit, maxPriceFall })
    }

    profits = Enumerable.from(profits).orderByDescending(x => x.profit).toArray()
    const profit = round(
        Enumerable.from(profits).average(x => x.profit)
    )
    const maxPriceFall = round(
        Enumerable.from(profits).average(x => x.maxPriceFall)
    )

    return { profits, profit, maxPriceFall }
}

function round(value: number): number {
    return parseFloat(value.toFixed(2))
}

export const pricesCalculator = {
    calculateProfits,
}