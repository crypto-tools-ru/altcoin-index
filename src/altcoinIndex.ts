import Enumerable from "linq"
import { bybit, Symbol } from "./bybit"

const weekMs = 7 * 24 * 60 * 60 * 1000

async function getAltcoins(start: number, altcoinsCount: number): Promise<Symbol[]> {
    console.log(new Date(), "Start load altcoins")

    const altcoins: Symbol[] = []

    const symbols = Enumerable.from(await bybit.getSymbols())
        .where(x => x.symbol !== "BTCUSDT")
        .orderByDescending(x => x.turnover24h)
        .toArray()

    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i]

        const candles = await bybit.getCandles(symbol.symbol, "D", start, start + weekMs)
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

export const altcoinIndex = {
    getAltcoins,
}